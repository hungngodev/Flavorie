import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout';
import { Ingredient, Login, Main, Meal, Register } from './pages/index';
import theme from './style/theme';

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
        element: <Ingredient />,
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
      <RouterProvider router={router} />
      <ToastContainer autoClose={5000} limit={3} transition={Slide} />
    </ChakraBaseProvider>
  );
}
export default App;
