import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout.tsx';
import { loader as ingredientsLoader } from './pages/Ingredient.tsx';
import { loader as mealsLoader } from './pages/Meal.tsx';
import { loader as recipeLoader } from './pages/Recipe.tsx';
import { Ingredient, Login, Main, Meal, Recipe, Register, User, Receipt } from './pages/index';
import theme from './style/theme';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'ingredients',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <div>HIHIH</div>,
          },
          {
            path: ':category',
            element: <Ingredient />,
            loader: ingredientsLoader(queryClient),
          },
        ],
      },
      {
        path: 'meals',
        children: [
          {
            index: true,
            element: <Meal />,
            loader: mealsLoader(queryClient),
          },
          {
            path: ':mealId',
            element: <Recipe />,
            loader: recipeLoader(queryClient),
          },
        ],
      },
      {
        path: 'community',
        element: <div>Community</div>,
      },
      {
        path: 'profile',
        element: <User />,
      },
      {
        path: 'receipts',
        element: <Receipt />,
      },
    ],
  },
]);

// const IndividualMealWrapper = () => {
//   const sampleMeal: Dish[] = [
//     {
//       image: '../public/images/baked-brie-with-roasted-mushrooms.webp',
//       title: 'Baked brie with roasted mushroom',
//       description: ' Step 1: Bake brie and roasted mushroom.',
//     },
//     {
//       image: '../public/images/apple-and-cheddar-crisp-salad-scaled.webp',
//       title: 'Apple and cheddar crisp salad',
//       description: 'Step 2: Wash salad and apple',
//     },
//     {
//       image: '../public/images/buffalo-chicken-cobb-salad-scaled.webp',
//       title: 'Buffalo chicken cobb salad',
//       description: 'Step 3: Roast buffalo chicken',
//     },
//     {
//       image: '../public/images/chocolate-raspberry-pavlova-stack-12-scaled.webp',
//       title: 'Chocolate raspberry pavlova stack',
//       description: 'Step 4: Wash raspberry',
//     },
//     {
//       image: '../public/images/new-york-crumb-cake-7-scaled.webp',
//       title: 'New york crumb cake',
//       description: 'Step 5: Bake cake',
//     },
//     {
//       image: '../public/images/summer-ricotta-grilled-vegetables.webp',
//       title: 'Summer ricotta grilled vegetables',
//       description: 'Step 6: Grilled vegetables after washing',
//     },
//   ];

//   return (
//     <IndividualMeal
//       individualMeal={sampleMeal}
//       title="Sample Meal Title"
//       overview="This is an overview of the sample meal."
//       totalTime="45 mins"
//       servings="4"
//       calories="500"
//       averageStar='5'
//       numReviews='1'
//     />
//   );
// };

function App() {
  return (
    <ChakraBaseProvider theme={extendTheme(theme)}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer autoClose={5000} limit={3} transition={Slide} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraBaseProvider>
  );
}
export default App;
