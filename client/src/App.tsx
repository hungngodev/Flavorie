import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout';
import { loader as ingredientsLoader } from './pages/Ingredient.tsx';
import { loader as mealsLoader } from './pages/Meal.tsx';
import { loader as recipeLoader } from './pages/Recipe.tsx';
import {
  Ingredient,
  IngredientLanding,
  Login,
  Main,
  Meal,
  Notifications,
  Receipt,
  ReceiptScan,
  Recipe,
  Register,
  User,
} from './pages/index';
import ToastProvider from './providers/ToastProvider.tsx';
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
            element: <IngredientLanding />,
            loader: ingredientsLoader(queryClient),
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
        element: <Notifications />,
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

function App() {
  return (
    <ChakraBaseProvider theme={extendTheme(theme)}>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ToastContainer autoClose={5000} limit={3} transition={Slide} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ToastProvider>
    </ChakraBaseProvider>
  );
}
export default App;
