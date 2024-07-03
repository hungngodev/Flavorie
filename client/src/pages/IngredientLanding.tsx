import { QueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { cartQuery } from './Ingredient';

const leftOverQuery = {
    queryKey: ['leftOver'],
    queryFn: async () => {
        const data = await customFetch.get('/user/leftOver');
        return data;
    },
};
export const loader = (queryClient: QueryClient) => () => {
    queryClient.ensureQueryData(cartQuery);
    queryClient.ensureQueryData(leftOverQuery);
    return null;
};

export default function IngredientLanding() {
    return (
        <div className="b relative mx-auto mt-5 flex h-[65vh] w-full max-w-7xl flex-col items-start  justify-start [perspective:1000px]"></div>
    );
}
