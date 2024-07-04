import { Box, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { waveform } from 'ldrs';
import { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaShoppingCart } from 'react-icons/fa';
import { Params, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Cart, CategorySidebar, IngredientsMain, LeftOver, TypeWriter } from '../components';
import { Nutrition } from '../components/ingredients/NutritionCard';
import socket from '../socket/socketio.tsx';
import theme from '../style/theme';
import customFetch from '../utils/customFetch';
import Lottie from 'lottie-react';
import { extendTheme } from '@chakra-ui/react';

waveform.register();

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
export type UserItem = {
    id: string;
    name: string;
    image: string;
    quantity: string;
};
export type CartData = {
    cart: UserItem[];
};

export type leftOverData = {
    leftOver: UserItem[];
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
    color?: string;
};

export default function Ingredient() {
    let { category: currentCategory } = useParams<{ category: string }>();
    currentCategory = currentCategory === undefined ? '/' : currentCategory;

    const { data: queryData, status } = useQuery(allIngredientsQuery(currentCategory));
    // const queryData = mockData;
    const ingredientData = queryData?.data.category[0];
    const { data: cartData, status: cartStatus } = useQuery(cartQuery);
    const { data: leftOverData, status: leftOverStatus } = useQuery(leftOverQuery);
    const queryClient = useQueryClient();

    const fridgeWidth = '500';
    const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
    const [hidden, setHidden] = useState(!isOpen);
    const [expanded, setExpanded] = useState(false);
    const lottieCartRef = useRef<LottieRefCurrentProps>(null);

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
            const results =
                operation === 'deleteAll'
                    ? []
                    : data.cart.map((item) => {
                          return {
                              itemId: item.id,
                              quantity: parseInt(item.quantity),
                              unit: 'unit',
                              userId: '',
                              type: 'cart',
                          };
                      });
            await customFetch.patch(
                '/user/cart',
                {
                    cart: results,
                    transfer: operation === 'transfer' || operation === 'send' ? true : false,
                },
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                },
            );
            if (operation === 'transfer' || operation === 'send') {
                await queryClient.invalidateQueries({
                    queryKey: ['leftOver'],
                });
                await queryClient.ensureQueryData(leftOverQuery);
            }
            if (operation === 'send') {
                socket.emit('sendToInstacart', results);
                toast.success('Your cart has been sent to Instacart');
            }
            queryClient.invalidateQueries({
                queryKey: ['cart'],
            });
        })();
    };

    const {
        control: control2,
        handleSubmit: handleSubmit2,
        setValue: setValue2,
    } = useForm<leftOverData>({
        defaultValues: {
            leftOver: useMemo(
                () =>
                    leftOverStatus === 'success'
                        ? leftOverData.data.leftOver.map(
                              (item: { leftOver: { _id: string; name: string; image: string }; quantity: string }) => {
                                  return {
                                      id: item.leftOver._id,
                                      name: item.leftOver.name,
                                      image: item.leftOver.image,
                                      quantity: item.quantity,
                                  };
                              },
                          )
                        : [],
                [leftOverData, leftOverStatus],
            ),
        },
    });
    useEffect(() => {
        console.log(leftOverData);
        if (leftOverStatus === 'success') {
            setValue2(
                'leftOver',
                leftOverData.data.leftOver.map(
                    (item: { leftOver: { _id: string; name: string; image: string }; quantity: string }) => {
                        return {
                            id: item.leftOver._id,
                            name: item.leftOver.name,
                            image: item.leftOver.image,
                            quantity: item.quantity,
                        };
                    },
                ),
            );
        }
    }, [leftOverData, leftOverStatus, setValue2]);
    const { fields: field2, remove: remove2 } = useFieldArray({
        control: control2,
        name: 'leftOver',
    });

    const onSubmit2 = () => {
        handleSubmit2((data: leftOverData) => {
            console.log(data);
            const results = data.leftOver.map((item) => {
                return {
                    itemId: item.id,
                    quantity: parseInt(item.quantity),
                    unit: 'unit',
                    userId: '',
                    type: 'leftOver',
                };
            });
            console.log(results);
            customFetch.patch(
                '/user/leftOver',
                {
                    leftOver: results.length > 0 ? results : [],
                },
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                },
            );
            queryClient.invalidateQueries({
                queryKey: ['leftOver'],
            });
        })();
    };
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
                mr="3"
                mt="5"
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
            overflow-auto [perspective:1000px] sm:overflow-visible gap-2`}
                >
                    {propTabs.map((tab, idx) => (
                        <button
                            key={tab.title}
                            onClick={() => {
                                moveSelectedTabToTop(idx);
                            }}
                            onMouseEnter={() => {
                                active.value !== tab.value && setHovering(true);
                            }}
                            onMouseLeave={() => setHovering(false)}
                            className=" relative rounded-full bg-indigo-300 mt-4 px-4 py-2 text-white"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {active.value === tab.value && (
                                <motion.div
                                    layoutId="clickedbutton"
                                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                                    className="absolute inset-0 rounded-full bg-indigo-500 px-4 py-3 text-white"
                                />
                            )}

                            <span className="relative block text-white dark:text-white">{tab.title}</span>
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
                                    left: hovering ? idx * -50 : 0,
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
                                        <LeftOver
                                            removeItem={remove2}
                                            fields={field2}
                                            onSubmit={onSubmit2}
                                            control={control2}
                                            height="50vh"
                                        />
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
