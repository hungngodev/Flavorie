import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout.tsx';
import { Ingredient, Login, Main, Meal, Register } from './pages/index';

import { loader as ingredientsLoader } from './pages/Ingredient.tsx';
import theme from './style/theme';

const queryClient = new QueryClient({
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
        loader: ingredientsLoader(queryClient),
        children: [
          {
            index: true,
            element: <Ingredient />,
          },
          {
            path: ':category',
            element: <Ingredient />,
          },
        ],
      },
      {
        path: 'meals',
        element: <Meal />,
      },
      {
        path: 'community',
        element: <div>Community</div>,
      },
    ],
  },
]);

function App() {
  return (
    <ChakraBaseProvider theme={extendTheme(theme)}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer autoClose={5000} limit={3} transition={Slide} />
      </QueryClientProvider>
    </ChakraBaseProvider>
  );
}
export default App;
