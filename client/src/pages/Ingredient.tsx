import { Box, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { QueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { LottieRefCurrentProps } from 'lottie-react';
import { Calendar, Flag, Home, Layers, LayoutDashboard, Refrigerator, StickyNote } from 'lucide-react';
import { useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Cart, CategorySidebar, IngredientsMain } from '../components';
import customFetch from '../utils/customFetch';

const allIngredientsQuery = () => {
  return {
    queryKey: ['ingredients'],
    queryFn: async () => {
      const data = await customFetch('/ingredients');
      return data;
    },
  };
};
export const loader = (queryClient: QueryClient) => async () => {
  await queryClient.prefetchQuery(allIngredientsQuery());
  return {};
};

export type CartData = {
  cart: {
    id: string;
    name: string;
    image: string;
    category: string;
    quantity: string;
  }[];
};

export type Ingredient = {
  id: string;
  name: string;
  image: string;
  category: string;
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

export type IngredientData = Category[];

export default function OuterLayer() {
  const { category } = useParams<{ category: string }>();
  const categories = [
    {
      index: 1,
      icon: <Home size={20} />,
      text: 'Meats',
      alert: true,
      active: category === 'meat',
      link: '/ingredients/meat',
    },
    {
      index: 2,
      icon: <LayoutDashboard size={20} />,
      text: 'Vegetables',
      active: category === 'vegetable',
      link: '/ingredients/vegetable',
    },
    {
      index: 3,
      icon: <Flag size={20} />,
      text: 'Dairy',
      active: category === 'dairy',
      link: '/ingredients/dairy',
    },
    {
      index: 4,
      icon: <Flag size={20} />,
      text: 'Sauce',
      active: category === 'sauce',
      link: '/ingredients/sauce',
    },
    {
      index: 5,
      icon: <Flag size={20} />,
      text: 'Grain',
      active: category === 'grain',
      link: '/ingredients/grain',
    },
    {
      index: 6,
      icon: <StickyNote size={20} />,
      text: 'Fruits',
      alert: true,
      active: category === 'fruit',
      link: '/ingredients/fruit',
    },
    {
      index: 7,
      icon: <Calendar size={20} />,
      text: 'Nuts',
      active: category === 'nut',
      link: '/ingredients/nut',
    },
    {
      index: 8,
      icon: <Flag size={20} />,
      text: 'Egg',
      active: category === 'egg',
      link: '/ingredients/egg',
    },
    {
      index: 9,
      icon: <Flag size={20} />,
      text: 'Seafoods',
      active: category === 'seafood',
      link: '/ingredients/seafood',
    },
    {
      index: 10,
      icon: <Flag size={20} />,
      text: 'Powders',
      active: category === 'powder',
      link: '/ingredients/powder',
    },
    {
      index: 11,
      icon: <Layers size={20} />,
      text: 'Spices',
      active: category === 'spice',
      link: '/ingredients/spice',
    },
    {
      index: 12,
      icon: <Flag size={20} />,
      text: 'Sweets',
      active: category === 'sweet',
      link: '/ingredients/sweet',
    },
  ];
  const ingredientData = customFetch('/ingredients');
  console.log('ingredientData', ingredientData);
  const fridgeWidth = '300';
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
  const [hidden, setHidden] = useState(!isOpen);
  const [expanded, setExpanded] = useState(false);
  const { control, handleSubmit, watch, setValue } = useForm<CartData>({
    defaultValues: {
      cart: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cart',
  });
  const currentCart = watch('cart');
  const addFunction = (ingredientData: SubCategory) => {
    if (currentCart.some((item) => item.id === ingredientData.ingredients[0].id)) {
      const index = currentCart.findIndex((item) => item.id === ingredientData.ingredients[0].id);
      const currentQuantity = parseInt(currentCart[index].quantity);
      setValue(`cart.${index}.quantity`, (currentQuantity + 1).toString());
    } else
      append({
        id: ingredientData.ingredients[0].id,
        name: ingredientData.ingredients[0].name,
        image: ingredientData.ingredients[0].image,
        category: ingredientData.ingredients[0].category,
        quantity: '1',
      });
    lottieCartRef.current?.playSegments([150, 185]);
  };
  const removeFunction = (index: number) => {
    remove(index);
  };
  const onSubmit = () => {
    handleSubmit((data: CartData) => console.log('data', data))();
  };
  const lottieCartRef = useRef<LottieRefCurrentProps>(null);
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
        icon={<Refrigerator />}
      />

      <CategorySidebar categories={categories} expanded={expanded} setExpanded={() => setExpanded((cur) => !cur)} />
      <div className="relative z-0 h-full w-full overflow-auto transition-all">
        <Flex width="100%" height="100%" direction={'column'} gap={4} justifyContent={'center'} alignItems={'center'}>
          <IngredientsMain data={mockData} addFunction={addFunction} />
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
          removeFunction={removeFunction}
          onSubmit={onSubmit}
          control={control}
          lottieCartRef={lottieCartRef}
        />
      </motion.div>
    </Box>
  );
}

const categoryColor = {
  Category1: 'red',
  Category2: 'blue',
  Category3: 'green',
  Category4: 'yellow',
  Category5: 'orange',
  Category6: 'purple',
  Category7: 'pink',
  Category8: 'cyan',
  Category9: 'teal',
  Category10: 'gray',
  Category11: 'black',
};

function generateMockData(
  numCategories: number,
  numQueriesPerCategory: number,
  numIngredientsPerQuery: number,
): Category[] {
  const mockData: Category[] = [];

  for (let i = 1; i <= numCategories; i++) {
    const category: Category = {
      categoryName: `Category${i}`,
      numberOfQueryKeys: numQueriesPerCategory,
      totalNumberOfIngredients: numQueriesPerCategory * numIngredientsPerQuery,
      results: [],
      color: categoryColor[`Category${i}` as keyof typeof categoryColor],
    };

    for (let j = 1; j <= numQueriesPerCategory; j++) {
      const queryKey = `Query ${j}`;
      const ingredients: Ingredient[] = [];

      for (let k = 1; k <= numIngredientsPerQuery; k++) {
        const ingredient: Ingredient = {
          id: `${(j - 1) * numIngredientsPerQuery + k + i} `,
          name: `Ingredient ${(j - 1) * numIngredientsPerQuery + k}`,
          image: `https://source.unsplash.com/random/${Math.random()}`,
          category: `Category ${i}`,
        };
        ingredients.push(ingredient);
      }

      category.results.push({ queryKey, ingredients });
    }

    mockData.push(category);
  }

  return mockData;
}

const mockData: Category[] = generateMockData(10, 10, 10);
