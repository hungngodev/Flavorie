import { Box, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { waveform } from 'ldrs';
import { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaShoppingCart } from 'react-icons/fa';
import { Params, useParams } from 'react-router-dom';
import { Cart, CategorySidebar, IngredientsMain } from '../components';
import { Nutrition } from '../components/ingredients/NutritionCard';
import { useAuth } from '../hooks';
import customFetch from '../utils/customFetch';
import Lottie from 'lottie-react';
import theme from '../style/theme';
import React from 'react';
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

const cartQuery = {
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
  console.log(cartData);
  const fridgeWidth = '500';
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
  const [hidden, setHidden] = useState(!isOpen);
  const [expanded, setExpanded] = useState(false);
  const lottieCartRef = useRef<LottieRefCurrentProps>(null);
  const auth = useAuth();

  const { control, handleSubmit, watch, setValue } = useForm<CartData>({
    defaultValues: {
      cart: [],
    },
  });
  useEffect(() => {
    if (cartStatus === 'success') {
      setValue(
        'cart',
        cartData.data.cart.map((item: { cart: { _id: string; name: string; image: string }; quantity: string }) => {
          return {
            id: item.cart._id,
            name: item.cart.name,
            image: item.cart.image,
            quantity: item.quantity,
          };
        }),
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
  useEffect(() => {
    if (auth.currentUser.status === 'authenticated') {
      console.log('submitting');
      onSubmit();
    }
  });

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
              top="3"
              right="3"
              zIndex={10}
              isRound={true}
              variant="solid"
              bg={theme.colors.palette_indigo}
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
                      <l-waveform size="100" stroke="3.5" speed="1" color="black"></l-waveform>
                  ) : (
                      // <Lottie animationData={Ingredient} loop={true} style={{ height: 600 }} />
                      <IngredientsMain data={ingredientData} addFunction={addFunction} />
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
              <Cart
                  fields={fields}
                  removeFunction={remove}
                  onSubmit={onSubmit}
                  control={control}
                  lottieCartRef={lottieCartRef}
              />
          </motion.div>
      </Box>
  );
}
