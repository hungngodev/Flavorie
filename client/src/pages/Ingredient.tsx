import { DeleteIcon } from '@chakra-ui/icons';
import {
  Flex,
  HStack,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from '@chakra-ui/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
  const onSubmit = (data: CartData) => console.log('data', data);
  return (
    <Flex width={'100%'} height="100%" direction={'column'} justifyContent={'center'} alignItems={'center'}>
      <Hero title="" boldTitle="Market" />
      <HStack spacing={10} overflowX={'auto'} overflowY={'hidden'} width={'90%'} height={'25rem'}>
        {mockData.map((category) => (
          <VStack
            spacing={10}
            overflowY={'auto'}
            overflowX={'hidden'}
            height={'25rem'}
            minWidth={'15vw'}
            className="no-scroll-bar snap-y"
          >
            {category.results.map((result) => (
              <IngredientCard
                imgLink={result.ingredients[0].image}
                title={result.ingredients[0].name}
                category={result.ingredients[0].category}
                onClick={() =>
                  append({
                    id: result.ingredients[0].id,
                    name: result.ingredients[0].name,
                    image: result.ingredients[0].image,
                    category: result.ingredients[0].category,
                    quantity: 1,
                  })
                }
              />
            ))}
          </VStack>
        ))}
      </HStack>
      <Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HStack
            spacing={10}
            overflowX={'auto'}
            overflowY={'hidden'}
            width={'80vw'}
            height={'10rem'}
            justifyContent={'start'}
          >
            {fields.map((item, index) => {
              return (
                <Flex direction={'row'} gap={4} key={index} minWidth={'3rem'}>
                  <Image src={item.image} alt={item.name} boxSize="100px" rounded={'xl'} />
                  <Flex direction={'column'} justifyContent={'center'} gap={4}>
                    <Controller
                      render={({ field }) => (
                        <NumberInput allowMouseWheel width={'2.2rem'} min={0} max={50}>
                          <NumberInputField {...field} />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                      name={`cart.${index}.quantity`}
                      control={control}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="delete"
                      colorScheme="pink"
                      variant="solid"
                      width={'0.5rem'}
                      onClick={() => remove(index)}
                    />
                  </Flex>
                </Flex>
              );
            })}
          </HStack>
        </form>
      </Flex>
    </Flex>
  );
}

export default Ingredient;

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
