import { Box, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaShoppingCart } from 'react-icons/fa';
import { Outlet, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Cart, CategorySidebar, LeftOver } from '../components/index.ts';
import { Nutrition } from '../components/ingredients/NutritionCard.tsx';
import { useAuth } from '../hooks';
import socket from '../socket/socketio.tsx';
import theme from '../style/theme.tsx';
import customFetch from '../utils/customFetch.ts';

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

export const loader = (queryClient: QueryClient) => async () => {
    queryClient.ensureQueryData(cartQuery);
    queryClient.ensureQueryData(leftOverQuery);
    return {};
};

export type OutletIngredientType = {
    addFunction: (ingredient: Ingredient) => void;
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

    const { data: cartData, status: cartStatus } = useQuery(cartQuery);
    const { data: leftOverData, status: leftOverStatus } = useQuery(leftOverQuery);
    const queryClient = useQueryClient();
    const fridgeWidth = '500';
    const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
    const [hidden, setHidden] = useState(!isOpen);
    const [expanded, setExpanded] = useState(false);
    const lottieCartRef = useRef<LottieRefCurrentProps>(null);
    const auth = useAuth();

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
        if (auth.currentUser.status === 'unauthenticated') {
            toast.error('Please log in or sign up to add ingredients to your cart');
            return;
        }
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

    const onSubmit = (operation: string) => {
        if (auth.currentUser.status === 'unauthenticated') {
            toast.error('Please log in or sign up to save');
            return;
        }
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
            if (operation === 'send') {
                socket.emit('sendToInstacart', results);
                toast.success('Your cart has been sent to Instacart');
            }
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
                await queryClient.invalidateQueries({ queryKey: ['leftOver'] });
                toast.success('Your cart has been transferred to left over');
            }
            if (operation === 'add') {
                toast.success('Your cart has been saved');
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
        handleSubmit2(async (data: leftOverData) => {
            const results = data.leftOver.map((item) => {
                return {
                    itemId: item.id,
                    quantity: parseInt(item.quantity),
                    unit: 'unit',
                    userId: '',
                    type: 'leftOver',
                };
            });
            await customFetch.patch(
                '/user/leftOver',
                {
                    leftOver: results.length > 0 ? results : [],
                },
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                },
            );
            await queryClient.invalidateQueries({
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
                    <Outlet context={{ addFunction } satisfies OutletIngredientType} />
                </Flex>
            </div>
            <motion.div
                {...(getDisclosureProps() as Partial<MotionProps>)}
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
            gap-2 overflow-auto [perspective:1000px] sm:overflow-visible`}
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
                            className=" relative mt-4 rounded-full bg-indigo-300 px-4 py-2 text-white"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {active.value === tab.value && (
                                <motion.div
                                    layoutId="clickedbutton"
                                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                                    className="absolute inset-0 rounded-full bg-indigo-500 px-4 py-2 text-white"
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
                                    zIndex: -idx,
                                    opacity: 1 - idx * 0.3,
                                }}
                                animate={{
                                    y: tab.value === tabs[0].value ? [0, 40, 0] : 0,
                                    opacity: 1,
                                }}
                                className={'absolute left-0 top-0 h-full w-full'}
                            >
                                {isOpen &&
                                    (auth.currentUser.status === 'unauthenticated' ? (
                                        <div className="flex h-full w-full flex-col items-center justify-center">
                                            <h1 className="text-2xl font-bold">Please log in or sign up</h1>
                                            <h1 className="text-2xl font-bold">to view your cart and left over</h1>
                                        </div>
                                    ) : tab.value === 'cart' ? (
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
