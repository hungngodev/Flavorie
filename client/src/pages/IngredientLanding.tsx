import { Grid, GridItem, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { Pagination } from '@nextui-org/pagination';
import { Select, SelectItem } from '@nextui-org/select';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Params, useLoaderData, useOutletContext } from 'react-router-dom';
import { IngredientCard, TypeWriter } from '../components';
import IngredientLine from '../components/ingredients/IngredientLine.tsx';
import { SearchBar } from '../components/ingredients/SearchBar';
import { Ingredient, OutletIngredientType } from '../layouts/IngredientLayout.tsx';
import theme from '../style/theme';
import customFetch from '../utils/customFetch';

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
export const loader =
    (queryClient: QueryClient) =>
    async ({ request }: { params: Params; request: Request }) => {
        const queries: { [key: string]: string } = Object.fromEntries(new URL(request.url).searchParams.entries());
        queryClient.ensureQueryData(searchIngredientQuery(queries));
        return queries;
    };
function IngredientLanding() {
    const queries = useLoaderData();
    const currentSearchQuery = (queries as { [key: string]: string }).search;
    const { addFunction } = useOutletContext<OutletIngredientType>();
    const { data: searchData, status: searchStatus } = useQuery(
        searchIngredientQuery(queries as { [key: string]: string }),
    );
    const [mealChoice, setMealChoice] = useState(0);
    const [page, setPage] = useState(1);
    const size = currentSearchQuery && currentSearchQuery !== '' ? 20 : 15;
    console.log(searchData);

    return (
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
                                    items={searchData?.data.result.map((currentLiked: any, index: number) => ({
                                        key: index,
                                        label: currentLiked.meal.title,
                                    }))}
                                    variant="bordered"
                                    label="Select a meal"
                                    className="w-5/6"
                                    selectedKeys={[mealChoice]}
                                    onChange={(e) => setMealChoice(parseInt(e.target.value))}
                                >
                                    {(meal: { key: string; label: string }) => (
                                        <SelectItem className="w-full rounded-none bg-white" key={meal.key}>
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
                                            ingredients: searchData?.data.result[mealChoice].missingIngredients,
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
                            currentSearchQuery && currentSearchQuery !== '' ? 'repeat(4,1fr)' : 'repeat(3,1fr)'
                        }
                        mb="2"
                    >
                        {searchData?.data.ingredients
                            .slice((page - 1) * size, page * size)
                            .map((ingredient: Ingredient, index: number) => (
                                <GridItem colSpan={1} rowSpan={1} key={ingredient.id + index + Math.random() * 1000000}>
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
    );
}

export default IngredientLanding;
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
