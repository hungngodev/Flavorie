import { Dish } from './components/meals/ImageSlide';
import { Box, ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout';
import {loader as ingredientsLoader } from './pages/Ingredient.tsx';
import { loader as mealsLoader } from './pages/Meal.tsx';
import NotificationDetailPage from './pages/NotificationDetail.tsx';
import NotificationPage from './pages/NotificationPage.tsx';
import ReceiptScan from './pages/ReceiptScan.tsx';
import { loader as recipeLoader } from './pages/Recipe.tsx';
import { Ingredient, Login, Main, Meal, Recipe, Register, User } from './pages/index';
import ToastProvider from './providers/ToastProvider.tsx';
import theme from './style/theme';
import IndividualMeal from './pages/Recipe';
import { BackendData } from './components/meals/ImageSlide';
import NutritionCard from './components/ingredients/NutritionCard';
import { IngredientProps } from './components/ingredients/NutritionCard';
import ReviewCard, { Review } from './components/community/ReviewCard';
import { identity } from 'lodash';
import ReviewForm from './components/form/Review';
import Receipt from './pages/Receipt.tsx';

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
      {
        path: 'upload-receipts',
        element: <ReceiptScan />,
      },
      {
        path: 'notifications',
        element: <NotificationPage />,
      },
      {
        path: 'receipts/:id',
        element: <Receipt />,
      },
      // {
      //   path: 'notifications/:id',
      //   element: <NotificationDetailPage />
      // }
      // {
      //   path: 'receipts-test',
      //   element: <Receipt />
      // }
    ],
  },
]);

// const mockComments: Review[] = [
//   {
//     id: '001',
//     author: {
//       username: 'Alex B',
//       src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0WU10MyuUxOw4QSiIEzWPZn3sfytEl7Z4RA&s',
//     },
//     content: 'Parent comment.',
//     children: [
//       {
//         id: '002',
//         author: {
//           username: 'Bill K',
//           src: 'https://akns-images.eonline.com/eol_images/Entire_Site/2023013/rs_1024x759-230113124412-1024-Phineas-and-Ferb-perry.ct.jpg?fit=around%7C1024:759&output-quality=90&crop=1024:759;center,top',
//         },
//         content: 'First child comment',
//         children: [],
//       },
//       {
//         id: '003',
//         author: {
//           username: 'Cal A',
//           src: 'https://facts.net/wp-content/uploads/2023/09/22-facts-about-bubbles-the-powerpuff-girls-1694408222.jpg',
//         },
//         content: 'Second child comment',
//         children: [
//           {
//             id: '004',
//             author: {
//               username: 'Denny W',
//               src: 'path_to_denny_avatar.jpg',
//             },
//             content: 'Nested child comment',
//             children: [],
//           },
//         ],
//       },
//     ],
//   },
// ];

// const handleReviewSubmit = (content: string) => {
//     console.log('Review submitted:', content);
// };

function App() {
  return (
    
    <ChakraBaseProvider theme={extendTheme(theme)}>
      <ToastProvider>
      <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* <NutritionCard {...mockdata} /> */}
        <ToastContainer autoClose={5000} limit={3} transition={Slide} />
        <ReactQueryDevtools />
      </QueryClientProvider>
      </ToastProvider>
        {/* <ImageScan /> */}
        {/* <IndividualMeal
          recipeData={backendData}
          calories='340 kcal'
          averageStar="4.5"
          numReviews="3"
        /> */}
        {/* <NutritionCard {...mockdata} /> */}
        {/* <Box>
          {mockComments.map((review) => (
              <ReviewCard key={review.id} review={review} />
          ))}
        </Box> */}
        {/* <Box p="4">
          <ReviewForm onSubmit={handleReviewSubmit} />
        </Box> */}
        
    </ChakraBaseProvider>
  );
}
export default App;

