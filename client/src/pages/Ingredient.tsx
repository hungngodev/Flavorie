import { Box, Flex, Grid, GridItem, HStack, Heading, IconButton, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { Pagination } from '@nextui-org/pagination';
import { Select, SelectItem } from '@nextui-org/select';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { waveform } from 'ldrs';
import { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaShoppingCart } from 'react-icons/fa';
import { Params, useLoaderData, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Cart, CategorySidebar, IngredientCard, IngredientsMain, LeftOver, TypeWriter } from '../components';
import IngredientLine from '../components/ingredients/IngredientLine.tsx';
import { Nutrition } from '../components/ingredients/NutritionCard';
import { SearchBar } from '../components/ingredients/SearchBar';
import socket from '../socket/socketio.tsx';
import theme from '../style/theme';
import customFetch from '../utils/customFetch';
// import { PaginationTable } from 'table-pagination-chakra-ui';

waveform.register();

const allIngredientsQuery = (category: string) => {
    return {
        queryKey: ['ingredients', category],
        queryFn: async () => {
            if (category === '/') {
                return null;
            }
            const data = await customFetch('/ingredient', {
                params: {
                    category: category,
                },
            });
            return data;
        },
    };
};

const searchIngredientQuery = (queries: { [key: string]: string }) => {
    const search = queries.search;
    return {
        queryKey: search ? ['ingredients', search] : ['ingredients'],
        queryFn: async () => {
            const data = await customFetch('/ingredient/search', {
                params: {
                    search: search,
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
    async ({ params, request }: { params: Params; request: Request }) => {
        const queries: { [key: string]: string } = Object.fromEntries(new URL(request.url).searchParams.entries());
        queryClient.ensureQueryData(allIngredientsQuery(params.category ?? '/'));
        queryClient.ensureQueryData(searchIngredientQuery(queries));
        queryClient.ensureQueryData(cartQuery);
        queryClient.ensureQueryData(leftOverQuery);
        return queries;
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
    const queries = useLoaderData();
    const currentSearchQuery = (queries as { [key: string]: string }).search;
    let { category: currentCategory } = useParams<{ category: string }>();
    currentCategory = currentCategory === undefined ? '/' : currentCategory;

    const { data: queryData, status } = useQuery(allIngredientsQuery(currentCategory));
    const { data: searchData, status: searchStatus } = useQuery(
        searchIngredientQuery(queries as { [key: string]: string }),
    );
    const [mealChoice, setMealChoice] = useState(0);
    const [page, setPage] = useState(1);
    const size = currentSearchQuery && currentSearchQuery !== '' ? 20 : 15;
    console.log(searchData);
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
            if (operation === 'send') {
                socket.emit('sendToInstacart', results);
                toast.success('Your cart has been sent to Instacart');
            }
            if (operation === 'transfer' || operation === 'send') {
                await queryClient.invalidateQueries({
                    queryKey: ['leftOver'],
                });
                await queryClient.ensureQueryData(leftOverQuery);
            }
            queryClient.invalidateQueries({
                queryKey: ['cart'],
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
        handleSubmit2((data: leftOverData) => {
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
                        <VStack width={'full'} height={'full'} justifyContent={'start'} alignItems={'center'}>
                            <Heading mt="4" mb="4" fontSize="60" fontWeight="bold" color={theme.colors.palette_purple}>
                                {`Lets Find Some Ingredients`.toUpperCase()}
                            </Heading>
                            <SearchBar autoCompleteLink="/ingredient/autocomplete" />
                            <Heading mt="4" mb="4" fontSize="30" fontWeight="bold" color={theme.colors.palette_purple}>
                                {currentSearchQuery && currentSearchQuery !== ''
                                    ? `Search Results for "${currentSearchQuery}"`.toUpperCase()
                                    : page === 1 && 'EXPLORE WHAT WE HAVE'}
                            </Heading>
                            {searchStatus === 'pending' ? (
                                <VStack width="full" height={'full'} justifyContent={'center'} alignItems={'center'}>
                                    <l-waveform size="100" stroke="3.5" speed="1" color="black"></l-waveform>
                                    <TypeWriter words={moreCookingJokes} duration={5000} />
                                </VStack>
                            ) : (
                                <VStack spacing={0} width={'95%'} height={'150%'} justifyContent={'start'}>
                                    {page === 1 &&
                                        searchData?.data.result.length > 0 &&
                                        !(currentSearchQuery && currentSearchQuery !== '') && (
                                            <VStack width={'100%'} height={'100%'} alignItems={'start'}>
                                                <Select
                                                    items={searchData?.data.result.map(
                                                        (currentLiked: any, index: number) => ({
                                                            key: index,
                                                            label: currentLiked.meal.title,
                                                        }),
                                                    )}
                                                    variant="bordered"
                                                    label="Select a meal"
                                                    className="w-5/6"
                                                    selectedKeys={[mealChoice]}
                                                    onChange={(e) => setMealChoice(parseInt(e.target.value))}
                                                >
                                                    {(meal: { key: string; label: string }) => (
                                                        <SelectItem
                                                            className="w-full rounded-none bg-white"
                                                            key={meal.key}
                                                        >
                                                            {meal.label}
                                                        </SelectItem>
                                                    )}
                                                </Select>

                                                <HStack justifyContent={'start'} width="full">
                                                    <IngredientLine
                                                        index={0}
                                                        addFunction={addFunction}
                                                        subCategory={{
                                                            queryKey:
                                                                'Missing Ingredients for ' +
                                                                searchData?.data.result[mealChoice].meal.title,
                                                            ingredients:
                                                                searchData?.data.result[mealChoice].missingIngredients,
                                                        }}
                                                    />
                                                </HStack>
                                            </VStack>
                                        )}
                                    <Heading mb="4" fontSize="30" fontWeight="bold" color={theme.colors.palette_purple}>
                                        Try out some ingredients
                                    </Heading>
                                    <Grid
                                        width={'100%'}
                                        height={'100%'}
                                        templateColumns={'repeat(5,1fr)'}
                                        templateRows={
                                            currentSearchQuery && currentSearchQuery !== ''
                                                ? 'repeat(4,1fr)'
                                                : 'repeat(3,1fr)'
                                        }
                                        mb="2"
                                    >
                                        {searchData?.data.ingredients
                                            .slice((page - 1) * size, page * size)
                                            .map((ingredient: Ingredient, index: number) => (
                                                <GridItem
                                                    colSpan={1}
                                                    rowSpan={1}
                                                    key={ingredient.id + index + Math.random() * 1000000}
                                                >
                                                    <IngredientCard
                                                        id={ingredient.id}
                                                        imgLink={ingredient.image}
                                                        title={ingredient.name}
                                                        category={ingredient.category}
                                                        height="7vw"
                                                        width="12vw"
                                                        onClick={() => {
                                                            addFunction(ingredient);
                                                        }}
                                                        amount={ingredient.amount}
                                                        unitShort={ingredient.unitShort}
                                                        nutrition={ingredient.nutrition}
                                                    />
                                                </GridItem>
                                            ))}
                                    </Grid>
                                    <div className="flex h-[100px] items-center gap-10">
                                        <Pagination
                                            showControls
                                            onChange={(page) => setPage(page)}
                                            total={Math.ceil(searchData?.data.numberOfIngredients / size)}
                                            color="primary"
                                            initialPage={page}
                                            space-y-10
                                        />
                                    </div>

                                    <Text color="gray.600" fontSize={'1.3rem'} mt="6">
                                        {searchData?.data.numberOfIngredients} Ingredients
                                    </Text>
                                </VStack>
                            )}
                        </VStack>
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
