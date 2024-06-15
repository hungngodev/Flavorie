import { Flex } from '@chakra-ui/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { miyagi } from 'ldrs';
import { Params, useLoaderData } from 'react-router-dom';
import { ListOfMeals } from '../components';
import { SearchBar } from '../components/ingredients/SearchBar';
import { Specialty } from '../components/meals/Specialty';
import customFetch from '../utils/customFetch';

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
}

const allMealsQuery = (params: { [key: string]: string }) => {
  const search = params.search;
  return {
    queryKey: search ? ['meals', search] : ['meals'],
    queryFn: async () => {
      const data = await customFetch('/meal', {
        params: search ? { search } : {},
      });
      return data;
    },
  };
};

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }: { params: Params; request: Request }) => {
    const queries: { [key: string]: string } = Object.fromEntries(new URL(request.url).searchParams.entries());
    console.log(queries);
    queryClient.ensureQueryData(allMealsQuery(queries));
    return queries;
  };

function Meal() {
  const params = useLoaderData();
  const { data: queryData, status } = useQuery(allMealsQuery(params as { [key: string]: string }));
  const mealData = queryData?.data;
  return (
    <Flex flexDir={'column'} width={'100%'} height={'100%'}>
      <Specialty />
      <SearchBar autoCompleteLink="/meal/autocomplete" />
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
