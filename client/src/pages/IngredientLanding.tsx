import { Grid, GridItem, Image } from '@chakra-ui/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { LottieRefCurrentProps } from 'lottie-react';
import { useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Cart, LeftOver, Tabs } from '../components';
import customFetch from '../utils/customFetch';
import { CartData, cartQuery } from './Ingredient';

const leftOverQuery = {
    queryKey: ['leftOver'],
    queryFn: async () => {
        const data = await customFetch.get('/user/leftOver');
        return data;
    },
};
export const loader = (queryClient: QueryClient) => () => {
    queryClient.ensureQueryData(cartQuery);
    queryClient.ensureQueryData(leftOverQuery);
    return null;
};

export default function IngredientLanding() {
    const { data: cartData } = useQuery(cartQuery);
    const { control, handleSubmit } = useForm<CartData>({
        defaultValues: {
            cart: cartData
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
        },
    });

    const { fields, remove } = useFieldArray({
        control,
        name: 'cart',
    });
    const onSubmit = () => {
        handleSubmit((data: CartData) => {
            console.log(data);
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
        })();
    };
    const lottieCartRef = useRef<LottieRefCurrentProps>(null);

    const tabs = [
        {
            title: 'Cart',
            value: 'cart',
            content: (
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
                    <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
                        <GridItem colSpan={1}>
                            <div>Your Left Over</div>
                            <LeftOver height="20vh" />
                        </GridItem>
                        <GridItem colSpan={1}>
                            <div>Your Cart</div>
                            <Cart
                                fields={fields}
                                removeFunction={remove}
                                onSubmit={onSubmit}
                                control={control}
                                lottieCartRef={lottieCartRef}
                                height="20vh"
                            />
                        </GridItem>
                    </Grid>
                </div>
            ),
        },
        {
            title: 'Browse',
            value: 'browse',
            content: (
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
                    <p>Browse tab</p>
                    <Browse />
                </div>
            ),
        },
        {
            title: 'Your Fridge',
            value: 'fridge',
            content: (
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
                    <p>Playground tab</p>
                    <DummyContent />
                </div>
            ),
        },
    ];

    return (
        <div className="b relative mx-auto mt-5 flex h-[65vh] w-full max-w-7xl flex-col items-start  justify-start [perspective:1000px]">
            <Tabs tabs={tabs} />
        </div>
    );
}

const DummyContent = () => {
    return (
        <Image
            src="/linear.webp"
            alt="dummy image"
            width="1000"
            height="1000"
            className="absolute inset-x-0 -bottom-10  mx-auto h-[60%] w-[90%] rounded-xl object-cover object-left-top md:h-[90%]"
        />
    );
};

function Browse() {
    return (
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
            <GridItem colSpan={1}>
                <Link to="/ingredients/meat">
                    <button className="relative p-[3px]">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500" />
                        <div className="group relative  rounded-[6px] bg-black  px-8 py-2 text-white transition duration-200 hover:bg-transparent">
                            Browse by Nutrition
                        </div>
                    </button>
                </Link>
            </GridItem>
            <GridItem colSpan={1}>
                <Link to="/ingredients/vegetable">
                    <button className="relative p-[3px]">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500" />
                        <div className="group relative  rounded-[6px] bg-black  px-8 py-2 text-white transition duration-200 hover:bg-transparent">
                            Walkthrough Our Supermarket
                        </div>
                    </button>
                </Link>
            </GridItem>
        </Grid>
    );
}
