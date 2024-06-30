import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout';
import { loader as FeedLoader } from './pages/Feed';
import { loader as PostLoader } from './pages/FullPost';
import { Feed, FullPost, Login, Main, Receipt, Register, User } from './pages/index';
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
      // {
      //   path: 'ingredients',
      //   element: <Outlet />,
      //   children: [
      //     {
      //       index: true,
      //       element: <div>HIHIH</div>,
      //     },
      //     {
      //       path: ':category',
      //       element: <Ingredient />,
      //       loader: ingredientsLoader(queryClient),
      //     },
      //   ],
      // },
      // {
      //   path: 'meals',
      //   children: [
      //     {
      //       index: true,
      //       element: <Meal />,
      //       loader: mealsLoader(queryClient),
      //     },
      //     {
      //       path: ':mealId',
      //       element: <Recipe />,
      //       loader: recipeLoader(queryClient),
      //     },
      //   ],
      // },
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
        path: 'receipt',
        element: <Receipt />,
      },
    ],
  },
]);

function App() {
  return (
    <ChakraBaseProvider theme={extendTheme(theme)}>
      <ReduxProvider store={reduxStore}>
        <QueryClientProvider client={queryClient}>
          {/* <ImageScan /> */}
          <RouterProvider router={router} />
          {/* <IndividualMeal
          recipeData={backendData}
          calories='340 kcal'
          averageStar="4.5"
          numReviews="3"
        /> */}
          {/* <NutritionCard {...mockdata} /> */}
          <ToastContainer autoClose={5000} limit={3} transition={Slide} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ReduxProvider>
    </ChakraBaseProvider>
  );
}
export default App;
