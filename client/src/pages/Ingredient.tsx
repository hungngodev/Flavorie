import { DeleteIcon } from '@chakra-ui/icons';
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
import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Cart } from '../assets/animations';
import { Hero, IngredientCard } from '../components';

type CartData = {
  cart: {
    id: string;
    name: string;
    image: string;
    category: string;
    quantity: number;
  }[];
};
function Ingredient() {
  const { control, handleSubmit } = useForm<CartData>({
    defaultValues: {
      cart: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cart',
  });
  const cartRef = React.useRef<LottieRefCurrentProps>(null);

  const onSubmit = (data: CartData) => console.log('data', data);
  return (
    <Flex width={'100%'} height="100%" direction={'column'} gap={4} justifyContent={'center'} alignItems={'center'}>
      <Hero title="" boldTitle="Market" />
      <HStack spacing={20} overflowX={'auto'} width={'90%'} height={'fit'} marginBottom={'1vh'}>
        {mockData.map((category, index) => (
          <VStack flexShrink={0}>
            <Button variant={'link'} colorScheme={categoryColor[category.categoryName as keyof typeof categoryColor]}>
              <Heading as="h1" size="4xl" noOfLines={1} fontSize={'2rem'}>
                {category.categoryName}
              </Heading>
            </Button>
            <VStack
              key={index}
              spacing={4}
              overflowY={'auto'}
              overflowX={'hidden'}
              flexShrink={0}
              height={'53vh'}
              minWidth={'16vh'}
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
                    append({
                      id: result.ingredients[0].id,
                      name: result.ingredients[0].name,
                      image: result.ingredients[0].image,
                      category: result.ingredients[0].category,
                      quantity: 1,
                    });
                    cartRef.current?.playSegments([150, 185]);
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
            cartRef.current?.playSegments([0, 135]);
          }}
        >
          <Lottie animationData={Cart} style={{ height: 100 }} loop={false} autoPlay={false} lottieRef={cartRef} />
        </button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HStack
            spacing={8}
            overflowX={'auto'}
            overflowY={'hidden'}
            width={'60vw'}
            height={'full'}
            justifyContent={'start'}
          >
            {fields.map((item, index) => {
              return (
                <HStack spacing={4} key={index} minWidth={'3rem'} flexShrink={0}>
                  <Image src={item.image} alt={item.name} height={'10vh'} width={'10vh'} rounded={'xl'} />
                  <Flex direction={'column'} justifyContent={'center'} gap={2} width={'5vw'}>
                    <Controller
                      render={({ field: { ref, ...restField } }) => (
                        <HStack spacing={4}>
                          <NumberInput allowMouseWheel {...restField} max={50}>
                            <NumberInputField ref={ref} name={restField.name} />
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
      </Flex>
    </Flex>
  );
}

export default Ingredient;

const categoryColor = {
  Meat: 'red',
  Vegetables: 'green',
  Fruits: 'yellow',
  Dairy: 'blue',
  Grains: 'purple',
  Spices: 'orange',
};

const mockData = [
  {
    categoryName: 'Meat',
    numberOfQueryKeys: 2,
    totalNumberOfIngredients: 5,
    results: [
      {
        queryKey: 'Beef',
        ingredients: [
          {
            id: '1',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '2',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      // More results...
    ],
  },
  {
    categoryName: 'Vegetables',
    numberOfQueryKeys: 2,
    totalNumberOfIngredients: 5,
    results: [
      {
        queryKey: 'Beef',
        ingredients: [
          {
            id: '1',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '2',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      // More results...
    ],
  },
  {
    categoryName: 'Fruits',
    numberOfQueryKeys: 2,
    totalNumberOfIngredients: 5,
    results: [
      {
        queryKey: 'Beef',
        ingredients: [
          {
            id: '1',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '2',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      // More results...
    ],
  },
  {
    categoryName: 'Dairy',
    numberOfQueryKeys: 2,
    totalNumberOfIngredients: 5,
    results: [
      {
        queryKey: 'Beef',
        ingredients: [
          {
            id: '1',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '2',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      // More results...
    ],
  },
  {
    categoryName: 'Grains',
    numberOfQueryKeys: 2,
    totalNumberOfIngredients: 5,
    results: [
      {
        queryKey: 'Beef',
        ingredients: [
          {
            id: '1',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '2',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      // More results...
    ],
  },
  {
    categoryName: 'Spices',
    numberOfQueryKeys: 2,
    totalNumberOfIngredients: 5,
    results: [
      {
        queryKey: 'Beef',
        ingredients: [
          {
            id: '1',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '2',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      // More results...
    ],
  },
  {
    categoryName: 'Meat',
    numberOfQueryKeys: 2,
    totalNumberOfIngredients: 5,
    results: [
      {
        queryKey: 'Beef',
        ingredients: [
          {
            id: '1',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '2',
            name: 'Beef',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      {
        queryKey: 'Chicken',
        ingredients: [
          {
            id: '3',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
          {
            id: '4',
            name: 'Chicken',
            image: 'https://source.unsplash.com/random',
            category: 'Meat',
          },
        ],
      },
      // More results...
    ],
  },

  {
    categoryName: 'Vegetables',
    numberOfQueryKeys: 1,
    totalNumberOfIngredients: 3,
    results: [
      {
        queryKey: 'Carrot',
        ingredients: [
          {
            id: '5',
            name: 'Carrot',
            image: 'https://source.unsplash.com/random',
            category: 'Vegetables',
          },
          {
            id: '6',
            name: 'Carrot',
            image: 'https://example.com/carrot2.jpg',
            category: 'Vegetables',
          },
        ],
      },
      {
        queryKey: 'Carrot',
        ingredients: [
          {
            id: '5',
            name: 'Carrot',
            image: 'https://source.unsplash.com/random',
            category: 'Vegetables',
          },
          {
            id: '6',
            name: 'Carrot',
            image: 'https://example.com/carrot2.jpg',
            category: 'Vegetables',
          },
        ],
      },
      {
        queryKey: 'Carrot',
        ingredients: [
          {
            id: '5',
            name: 'Carrot',
            image: 'https://source.unsplash.com/random',
            category: 'Vegetables',
          },
          {
            id: '6',
            name: 'Carrot',
            image: 'https://example.com/carrot2.jpg',
            category: 'Vegetables',
          },
        ],
      },
      {
        queryKey: 'Carrot',
        ingredients: [
          {
            id: '5',
            name: 'Carrot',
            image: 'https://source.unsplash.com/random',
            category: 'Vegetables',
          },
          {
            id: '6',
            name: 'Carrot',
            image: 'https://example.com/carrot2.jpg',
            category: 'Vegetables',
          },
        ],
      },
      // More results...
    ],
  },
  // More categories...
];
