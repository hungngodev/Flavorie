import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout';
import { loader as FeedLoader } from './pages/Feed.tsx';
import { loader as PostLoader } from './pages/FullPost.tsx';
import { loader as ingredientsLoader } from './pages/Ingredient.tsx';
import { loader as mealsLoader } from './pages/Meal.tsx';
import NotificationPage from './pages/NotificationPage.tsx';
import Receipt from './pages/Receipt.tsx';
import ReceiptScan from './pages/ReceiptScan.tsx';
import { loader as recipeLoader } from './pages/Recipe.tsx';
import { Feed, FullPost, Ingredient, Login, Main, Meal, Recipe, Register, User } from './pages/index';
import ToastProvider from './providers/ToastProvider.tsx';
import { store as reduxStore } from './store/store';
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
        children: [
          {
            index: true,
            element: <Feed />,
            loader: FeedLoader(queryClient),
          },
          {
            path: ':postId',
            element: <FullPost />,
            loader: PostLoader(queryClient),
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
function App() {
  return (
    <ChakraProvider theme={extendTheme(theme)}>
      <ToastProvider>
        <ReduxProvider store={reduxStore}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ToastContainer autoClose={5000} limit={3} transition={Slide} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ReduxProvider>
      </ToastProvider>
    </ChakraProvider>
  );
}
export default App;
