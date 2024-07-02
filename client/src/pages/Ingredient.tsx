import { Box, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { waveform } from 'ldrs';
import { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaShoppingCart } from 'react-icons/fa';
import { Params, useParams } from 'react-router-dom';
import { Cart, CategorySidebar, IngredientsMain, LeftOver, TypeWriter } from '../components';
import { Nutrition } from '../components/ingredients/NutritionCard';
import theme from '../style/theme';
import customFetch from '../utils/customFetch';
import Lottie from 'lottie-react';
import theme from '../style/theme';
import { extendTheme } from '@chakra-ui/react';

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
    async ({ params }: { params: Params }) => {
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
    const queryClient = useQueryClient();

    const { control, handleSubmit, watch, setValue } = useForm<CartData>({
        defaultValues: {
            cart: useMemo(
                () =>
                    cartStatus === 'success'
                        ? cartData.data.cart.map(
                              (item: { cart: { _id: string; name: string; image: string }; quantity: string }) => {
                                  return {
                                      id: item.cart._id,
                                      name: item.cart.name,
                                      image: item.cart.image,
                                      quantity: item.quantity,
                                  };
                              },
                          )
                        : [],
                [cartData, cartStatus],
            ),
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
    }, [cartData, cartStatus]);
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'cart',
    });

    useEffect(() => {
        console.log(fields);
    }, [fields]);

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
    useEffect(() => {
        console.log(cartStatus);
    }, [cartStatus]);

    const onSubmit = (operation: string) => {
        handleSubmit(async (data: CartData) => {
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
                    transfer: operation === 'transfer',
                },
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                },
            );
            if (operation === 'transfer') {
                await queryClient.invalidateQueries({
                    queryKey: ['leftOver'],
                });
                await queryClient.ensureQueryData(leftOverQuery);
            }
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
    const propTabs = [
        {
            title: 'Cart',
            value: 'cart',
        },
        {
            title: 'Left Over',
            value: 'leftOver',
        },
    ];

    const [active, setActive] = useState(propTabs[0]);
    const [tabs, setTabs] = useState(propTabs);

    const moveSelectedTabToTop = (idx: number) => {
        const newTabs = [...propTabs];
        const selectedTab = newTabs.splice(idx, 1);
        newTabs.unshift(selectedTab[0]);
        setTabs(newTabs);
        setActive(newTabs[0]);
    };

    const [hovering, setHovering] = useState(false);

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
                color="white"
                aria-label="Done"
                fontSize="20px"
                _hover={{ bg: theme.colors.palette_lavender }}
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
                        <>
                            <l-waveform size="100" stroke="3.5" speed="1" color="black"></l-waveform>
                            <TypeWriter words={moreCookingJokes} duration={5000} />
                        </>
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
                transition={{ duration: 0.5 }}
                style={{
                    whiteSpace: 'nowrap',
                    height: '100%',
                }}
            >
                <div
                    className={`no-visible-scrollbar relative 
          mt-2 flex w-full max-w-full
           flex-row items-center justify-start
            overflow-auto [perspective:1000px] sm:overflow-visible`}
                >
                    {propTabs.map((tab, idx) => (
                        <button
                            key={tab.title}
                            onClick={() => {
                                moveSelectedTabToTop(idx);
                            }}
                            onMouseEnter={() => {
                                console.log('hover');
                                setHovering(true);
                            }}
                            onMouseLeave={() => setHovering(false)}
                            className="relative rounded-full px-4 py-2"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {active.value === tab.value && (
                                <motion.div
                                    layoutId="clickedbutton"
                                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                                    className="absolute inset-0 rounded-full bg-gray-200 dark:bg-zinc-800"
                                />
                            )}

                            <span className="relative block text-black dark:text-white">{tab.title}</span>
                        </button>
                    ))}
                </div>
                <div className="relative h-full w-full">
                    <AnimatePresence>
                        {tabs.map((tab, idx) => (
                            <motion.div
                                exit={{ y: 40, opacity: 0 }}
                                initial={{ y: 40, opacity: 0 }}
                                transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                                key={tab.value}
                                layoutId={tab.value}
                                style={{
                                    scale: 1 - idx * 0.05,
                                    left: hovering ? idx * -20 : 0,
                                    zIndex: -idx + 100,
                                    opacity: 1 - idx * 0.3,
                                }}
                                animate={{
                                    y: tab.value === tabs[0].value ? [0, 40, 0] : 0,
                                    opacity: 1,
                                }}
                                className={'absolute left-0 top-0 h-full w-full'}
                            >
                                {isOpen &&
                                    (tab.value === 'cart' ? (
                                        <Cart
                                            fields={fields}
                                            removeFunction={remove}
                                            onSubmit={onSubmit}
                                            control={control}
                                            lottieCartRef={lottieCartRef}
                                            height="50vh"
                                        />
                                    ) : (
                                        <LeftOver height="50vh" />
                                    ))}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </Box>
    );
}

const moreCookingJokes: string[] = [
    'Why did the banana go to the doctor? Because it wasn’t peeling well.',
    'What kind of vegetable is angry? A steamed carrot.',
    'What did the grape do when it got stepped on? Nothing but let out a little wine!',
    'Why did the orange stop? Because it ran out of juice.',
    'What do you call a fake noodle? An impasta.',
    'Why did the baker go to therapy? He kneaded it.',
    'What do you call a sad strawberry? A blueberry.',
    "Why did the mushroom go to the party alone? Because he's a fungi.",
    'How do you make a lemon drop? Just let it fall.',
];
