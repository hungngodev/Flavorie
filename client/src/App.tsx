import React from 'react';
import { Box, ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout';
import { loader as ingredientsLoader } from './pages/Ingredient';
import { loader as mealsLoader } from './pages/Meal';
import { loader as recipeLoader } from './pages/Recipe';
import { Ingredient, Login, Main, Meal, Recipe, Register, User } from './pages/index';
import theme from './style/theme.tsx';
import IndividualMeal from './pages/Recipe.tsx';
import { Dish } from './components/meals/ImageSlide.tsx'
import { BackendData, transformToDishes } from './utils/mealDataTransform.tsx';
import ReviewCard, { Review } from './components/community/reviewCard.tsx';
import { identity } from 'lodash';

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
        children: [
          {
            index: true,
            element: <div>Community</div>,
          },
        ],
      },
      {
        path: 'profile',
        element: <User />,
      },
    ],
  },
]);

const mockComments: Review[] = [
  {
    id: '001',
    author: {
      username: 'Alex B',
      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0WU10MyuUxOw4QSiIEzWPZn3sfytEl7Z4RA&s',
    },
    content: 'Parent comment.',
    children: [
      {
        id: '002',
        author: {
          username: 'Bill K',
          src: 'https://akns-images.eonline.com/eol_images/Entire_Site/2023013/rs_1024x759-230113124412-1024-Phineas-and-Ferb-perry.ct.jpg?fit=around%7C1024:759&output-quality=90&crop=1024:759;center,top',
        },
        content: 'First child comment',
        children: [],
      },
      {
        id: '003',
        author: {
          username: 'Cal A',
          src: 'https://facts.net/wp-content/uploads/2023/09/22-facts-about-bubbles-the-powerpuff-girls-1694408222.jpg',
        },
        content: 'Second child comment',
        children: [
          {
            id: '004',
            author: {
              username: 'Denny W',
              src: 'path_to_denny_avatar.jpg',
            },
            content: 'Nested child comment',
            children: [],
          },
        ],
      },
    ],
  },
];

function App() {
  return (
    <ChakraBaseProvider theme={extendTheme(theme)}>
      <QueryClientProvider client={queryClient}>
        {/* <ImageScan /> */}
        <RouterProvider router={router} />
        {/* <IndividualMeal
          individualMeal={individualMeal}
          title={backendData.title}
          overview={backendData.instruction}
          image={backendData.imageUrl}
          source={backendData.source}
          totalTime="20 minutes"
          servings="4 servings"
          calories="150 kcal"
          averageStar="4.5"
          numReviews="10"
          tags={backendData.tags}
        /> */}
        {/* <Box>
          {mockComments.map((review) => (
              <ReviewCard key={review.id} review={review} />
          ))}
        </Box> */}
      <ToastContainer autoClose={5000} limit={3} transition={Slide} />
      <ReactQueryDevtools />
      </QueryClientProvider> 
    </ChakraBaseProvider>
  );
}
export default App; 
