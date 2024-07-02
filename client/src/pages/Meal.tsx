import React from 'react';
import { Flex } from '@chakra-ui/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { miyagi } from 'ldrs';
import { Params } from 'react-router-dom';
import { SearchBar } from '../components/ingredients/SearchBar';
import { Specialty } from '../components/meals/Specialty';
import customFetch from '../utils/customFetch';
// import { singleMeal } from '../components/meals/ListofMeals';
import { ListOfMeals } from '../components/meals/ListofMeals';

miyagi.register();

// Default values shown
export interface Meal {
  id: string;
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  // price: string;
  infoLink: string;
}

const allMealsQuery = (category: string) => {
  return {
    queryKey: ['meals', category],
    queryFn: async () => {
      const data = await customFetch('/meal', {
        params: {
          category: category,
        },
      });
      return data;
    },
  };
};

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: Params }) => {
    queryClient.ensureQueryData(allMealsQuery(params.category ?? ''));
    return null;
  };

function Meal() {
  const { data: queryData, status } = useQuery(allMealsQuery(''));
  const mealData = queryData?.data;
  return (
    <Flex flexDir={'column'} width={'100%'} height={'100%'}>
      <Specialty />
      <SearchBar />
      {status === 'pending' ? (
        <Flex justifyContent={'center'} alignItems={'center'} height={'100%'}>
          <l-miyagi size="150" stroke="3.5" speed="0.9" color="black"></l-miyagi>
        </Flex>
      ) : (
        <div>
          {Object.entries(mealData).map((entry, index) => {
            return <ListOfMeals key={index} Type={entry[0].toString()} meals={entry[1] as Meal[]} />;
          })}
        </div>
      )}
    </Flex>
  );
}

export default Meal;
