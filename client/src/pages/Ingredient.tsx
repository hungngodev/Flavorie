import { Flex, HStack, VStack } from '@chakra-ui/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Hero, IngredientCard } from '../components';

function Ingredient() {
  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      cart: [],
    },
  });
  const { fields, append, prepend, remove, swap, move, insert, replace } = useFieldArray({
    control,
    name: 'cart',
  });
  return (
    <Flex width={'100%'} height="100%" direction={'column'} justify={'center'} alignItems={'center'}>
      <Hero title="" boldTitle="Market" />
      <HStack spacing={10} overflowX={'auto'} overflowY={'hidden'} width={'90%'} height={'30rem'}>
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
              />
            ))}
          </VStack>
        ))}
      </HStack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          {fields.map((item, index) => {
            return (
              <li key={item.id}>
                <input {...register(`test.${index}.firstName`, { required: true })} />

                <Controller
                  render={({ field }) => <input {...field} />}
                  name={`test.${index}.lastName`}
                  control={control}
                />
                <button type="button" onClick={() => remove(index)}>
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
        <input type="submit" />
      </form>
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
      // More results...
    ],
  },
  // More categories...
];
