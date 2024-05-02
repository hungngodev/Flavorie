import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from '@chakra-ui/react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useRef } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Cart } from '../assets/animations';
import { Hero, IngredientCard, OuterLayer } from '../components';

type CartData = {
  cart: {
    id: string;
    name: string;
    image: string;
    category: string;
    quantity: string;
  }[];
};

function Ingredient() {
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
  const lottieCartRef = useRef<LottieRefCurrentProps>(null);
  const scrollCartRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 'left' | 'right', distance: number) {
    if (scrollCartRef.current) {
      if (direction === 'left') scrollCartRef.current.scrollLeft -= distance;
      else scrollCartRef.current.scrollLeft += distance;
    }
  }
  const onSubmit = (data: CartData) => console.log('data', data);
  return (
    <OuterLayer width="300">
      <Flex width="100%" height="100%" direction={'column'} gap={4} justifyContent={'center'} alignItems={'center'}>
        <Hero title="" boldTitle="Market" />
        <HStack spacing={20} overflowX={'auto'} width={'90%'} height={'fit'} marginBottom={'1vh'}>
          {mockData.map((category, index) => (
            <VStack flexShrink={0} key={index}>
              <Button variant={'link'} colorScheme={categoryColor[category.categoryName as keyof typeof categoryColor]}>
                <Heading as="h1" size="4xl" noOfLines={1} fontSize={'2rem'}>
                  {category.categoryName}
                </Heading>
              </Button>
              <VStack
                spacing={4}
                overflowY={'auto'}
                overflowX={'hidden'}
                flexShrink={0}
                height={'53vh'}
                className="no-scroll-bar snap-y"
              >
                {category.results.map((result, index) => (
                  <IngredientCard
                    key={result.ingredients[0].id + index}
                    imgLink={result.ingredients[0].image}
                    title={result.ingredients[0].name}
                    category={result.ingredients[0].category}
                    height="12vh"
                    onClick={() => {
                      if (currentCart.some((item) => item.id === result.ingredients[0].id)) {
                        const index = currentCart.findIndex((item) => item.id === result.ingredients[0].id);
                        const currentQuantity = parseInt(currentCart[index].quantity);
                        setValue(`cart.${index}.quantity`, (currentQuantity + 1).toString());
                      } else
                        append({
                          id: result.ingredients[0].id,
                          name: result.ingredients[0].name,
                          image: result.ingredients[0].image,
                          category: result.ingredients[0].category,
                          quantity: '1',
                        });

                      lottieCartRef.current?.playSegments([150, 185]);
                    }}
                  />
                ))}
              </VStack>
            </VStack>
          ))}
        </HStack>
        <Flex
          alignItems={'center'}
          width={'80%'}
          height={'14vh'}
          gap={10}
          border="2px solid"
          borderColor="black"
          rounded={'xl'}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)();
              lottieCartRef.current?.playSegments([0, 135]);
            }}
          >
            <Lottie
              animationData={Cart}
              style={{ height: 100 }}
              loop={false}
              autoPlay={false}
              lottieRef={lottieCartRef}
            />
          </button>
          <IconButton
            icon={<ChevronLeftIcon />}
            aria-label="left"
            onClick={() => scroll('left', 100)}
            variant="solid"
            colorScheme="blue"
            size="xs"
            height="50%"
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <HStack
              spacing={8}
              overflowX={'auto'}
              overflowY={'hidden'}
              width={'100%'}
              height={'full'}
              justifyContent={'start'}
              ref={scrollCartRef}
            >
              {fields.map((item, index) => {
                return (
                  <HStack spacing={4} key={index} minWidth={'3rem'} flexShrink={0}>
                    <Image src={item.image} alt={item.name} height={'10vh'} width={'10vh'} rounded={'xl'} />
                    <Flex direction={'column'} justifyContent={'center'} gap={2} width={'5vw'}>
                      <Controller
                        render={({ field: { ref, ...restField } }) => (
                          <HStack spacing={4}>
                            <NumberInput
                              allowMouseWheel
                              {...restField}
                              min={0}
                              max={50}
                              format={(n) => (typeof n === 'string' ? parseInt(n) : n)}
                              inputMode={'numeric'}
                            >
                              <NumberInputField ref={ref} name={restField.name} type="number" />
                              <NumberInputStepper flexDir={'row'}>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </HStack>
                        )}
                        name={`cart.${index}.quantity`}
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: 'Price is required',
                          },
                        }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="delete"
                        colorScheme="pink"
                        size="xs"
                        variant="solid"
                        onClick={() => remove(index)}
                      />
                    </Flex>
                  </HStack>
                );
              })}
            </HStack>
          </form>
          <IconButton
            icon={<ChevronRightIcon />}
            aria-label="right"
            onClick={() => scroll('right', 100)}
            variant="solid"
            colorScheme="blue"
            size="xs"
            height="50%"
          />
        </Flex>
      </Flex>
    </OuterLayer>
  );
}

export default Ingredient;

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

interface Ingredient {
  id: string;
  name: string;
  image: string;
  category: string;
}

interface Result {
  queryKey: string;
  ingredients: Ingredient[];
}

interface Category {
  categoryName: string;
  numberOfQueryKeys: number;
  totalNumberOfIngredients: number;
  results: Result[];
}

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
