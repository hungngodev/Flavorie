import { Box, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { waveform } from 'ldrs';
import { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaShoppingCart } from 'react-icons/fa';
import { Params, useParams } from 'react-router-dom';
import { Cart, CategorySidebar, IngredientsMain, LeftOver, Tabs } from '../components';
import { Nutrition } from '../components/ingredients/NutritionCard';
import { useAuth } from '../hooks';
import customFetch from '../utils/customFetch';
// import { PaginationTable } from 'table-pagination-chakra-ui';

waveform.register();

// Default values shown

const allIngredientsQuery = (category: string) => {
    return {
        queryKey: ['ingredients', category],
        queryFn: async () => {
            const data = await customFetch('/ingredient', {
                params: {
                    category: category,
                },
            });
            return data;
        },
    };
};
const leftOverQuery = {
    queryKey: ['leftOver'],
    queryFn: async () => {
        const data = await customFetch.get('/user/leftOver');
        return data;
    },
};
export const cartQuery = {
    queryKey: ['cart'],
    queryFn: async () => {
        const data = await customFetch.get('/user/cart');
        return data;
    },
};

export const loader =
    (queryClient: QueryClient) =>
    ({ params }: { params: Params }) => {
        queryClient.ensureQueryData(allIngredientsQuery(params.category ?? ''));
        queryClient.ensureQueryData(cartQuery);
        queryClient.ensureQueryData(leftOverQuery);
        return null;
    };

export type CartData = {
    cart: {
        id: string;
        name: string;
        image: string;
        quantity: string;
    }[];
};

export type Ingredient = {
    id: string;
    name: string;
    image: string;
    category: string;
    amount: number;
    unitShort: string;
    nutrition: Nutrition;
};

export type SubCategory = {
    queryKey: string;
    ingredients: Ingredient[];
};

export type Category = {
    categoryName: string;
    numberOfQueryKeys: number;
    totalNumberOfIngredients: number;
    results: SubCategory[];
    color: string;
};

export default function Ingredient() {
    let { category: currentCategory } = useParams<{ category: string }>();
    currentCategory = currentCategory === undefined ? '/' : currentCategory;
    const { data: queryData, status } = useQuery(allIngredientsQuery(currentCategory));
    const ingredientData = queryData?.data.category[0];
    const { data: cartData, status: cartStatus } = useQuery(cartQuery);
    const fridgeWidth = '500';
    const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
    const [hidden, setHidden] = useState(!isOpen);
    const [expanded, setExpanded] = useState(false);
    const lottieCartRef = useRef<LottieRefCurrentProps>(null);
    const auth = useAuth();
    const queryClient = useQueryClient();

    const { control, handleSubmit, watch, setValue } = useForm<CartData>({
        defaultValues: {
            cart: [],
        },
    });
    useEffect(() => {
        if (cartStatus === 'success') {
            console.log(cartData);
            setValue(
                'cart',
                cartData.data.cart.map(
                    (item: { cart: { _id: string; name: string; image: string }; quantity: string }) => {
                        return {
                            id: item.cart._id,
                            name: item.cart.name,
                            image: item.cart.image,
                            quantity: item.quantity,
                        };
                    },
                ),
            );
        }
    }, [cartData, cartStatus, setValue]);
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'cart',
    });

    const currentCart = watch('cart');
    const addFunction = (ingredientData: Ingredient) => {
        if (currentCart.some((item) => item.id === ingredientData.id)) {
            const index = currentCart.findIndex((item) => item.id === ingredientData.id);
            const currentQuantity = parseInt(currentCart[index].quantity);
            setValue(`cart.${index}.quantity`, (currentQuantity + 1).toString());
        } else
            append({
                id: ingredientData.id,
                name: ingredientData.name,
                image: ingredientData.image,
                quantity: '1',
            });
        lottieCartRef.current?.playSegments([150, 185]);
    };
    const onSubmit = () => {
        if (auth.currentUser.status !== 'authenticated') return;
        handleSubmit((data: CartData) => {
            const results = data.cart.map((item) => {
                return {
                    itemId: item.id,
                    quantity: parseInt(item.quantity),
                    unit: 'unit',
                    userId: '',
                    type: 'cart',
                };
            });
            customFetch.patch(
                '/user/cart',
                {
                    cart: results,
                },
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                },
            );
            queryClient.invalidateQueries({
                queryKey: ['cart'],
            });
        })();
    };

    // useEffect(() => {
    //     if (auth.currentUser.status === 'authenticated') {
    //         onSubmit();
    //     }
    // });
    return (
        <Box
            position="relative"
            overflow={'hidden'}
            className="no-scroll-bar"
            display={'flex'}
            width={'100%'}
            height={'100%'}
        >
            <IconButton
                position="absolute"
                top="0"
                right="0"
                zIndex={10}
                isRound={true}
                variant="solid"
                colorScheme="teal"
                aria-label="Done"
                fontSize="20px"
                {...getButtonProps()}
                icon={<FaShoppingCart />}
            />

            <CategorySidebar
                currentCategory={currentCategory}
                expanded={expanded}
                setExpanded={() => setExpanded((cur) => !cur)}
            />
            <div className="relative z-0 h-full w-full overflow-auto transition-all">
                <Flex width="100%" height="100%" direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    {status === 'pending' ? (
                        <l-waveform size="100" stroke="3.5" speed="1" color="black"></l-waveform>
                    ) : currentCategory !== '/' ? (
                        <IngredientsMain data={ingredientData} addFunction={addFunction} />
                    ) : (
                        <div>Category not found</div>
                    )}
                </Flex>
            </div>
            <motion.div
                {...getDisclosureProps()}
                hidden={hidden}
                initial={false}
                onAnimationStart={() => {
                    setHidden(false);
                }}
                onAnimationComplete={() => {
                    setHidden(!isOpen);
                }}
                animate={{ width: isOpen ? parseInt(fridgeWidth) : 0 }}
                style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    height: '100%',
                }}
            >
                <Tabs
                    tabs={[
                        {
                            title: 'Cart',
                            value: 'cart',
                            content: (
                                <div className="relative flex h-[90%] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br  from-purple-700 to-violet-900 font-bold">
                                    <Cart
                                        fields={fields}
                                        removeFunction={remove}
                                        onSubmit={onSubmit}
                                        control={control}
                                        lottieCartRef={lottieCartRef}
                                        height="65vh"
                                    />
                                </div>
                            ),
                        },
                        {
                            title: 'Fridge',
                            value: 'fridge',
                            content: (
                                <div className="relative flex h-[90%] w-full items-center justify-center  overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 font-bold">
                                    <LeftOver height="65vh" />
                                </div>
                            ),
                        },
                    ]}
                />
                <Cart
                    fields={fields}
                    removeFunction={remove}
                    onSubmit={onSubmit}
                    control={control}
                    lottieCartRef={lottieCartRef}
                    height="65vh"
                />
            </motion.div>
        </Box>
    );
}
