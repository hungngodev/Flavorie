import { QueryClient, useQuery } from '@tanstack/react-query';
import { waveform } from 'ldrs';
import { Params, useOutletContext, useParams } from 'react-router-dom';
import { TypeWriter } from '../components';
import IngredientsMain from '../components/ingredients/IngredientsMain';
import { OutletIngredientType } from '../layouts/IngredientLayout';
import customFetch from '../utils/customFetch';

waveform.register();

export const loader =
    (queryClient: QueryClient) =>
    async ({ params, request }: { params: Params; request: Request }) => {
        const queries: { [key: string]: string } = Object.fromEntries(new URL(request.url).searchParams.entries());
        if (params.category) {
            queryClient.ensureQueryData(allIngredientsQuery(params.category));
        }

        return queries;
    };
const allIngredientsQuery = (category: string) => {
    return {
        queryKey: ['ingredients', category],
        queryFn: async () => {
            if (category === '/') {
                return null;
            }
            const data = await customFetch('/ingredient', {
                params: {
                    category: category,
                },
            });
            return data;
        },
    };
};
export default function Category() {
    const { addFunction } = useOutletContext<OutletIngredientType>();
    let { category: currentCategory } = useParams<{ category: string }>();
    currentCategory = currentCategory === undefined ? '/' : currentCategory;

    const { data: queryData, status } = useQuery(allIngredientsQuery(currentCategory));
    console.log(queryData);
    const ingredientData = queryData?.data.category;
    return (
        <>
            {status === 'pending' ? (
                <>
                    <l-waveform size="100" stroke="3.5" speed="1" color="black"></l-waveform>
                    <TypeWriter words={moreCookingJokes} duration={5000} />
                </>
            ) : (
                <IngredientsMain data={ingredientData} addFunction={addFunction} />
            )}
        </>
    );
}
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
