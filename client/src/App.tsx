import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout.tsx';
import { Ingredient, Login, Main, Meal, Register } from './pages/index';
import theme from './style/theme';
import ReceiptScan from './pages/ReceiptScan.tsx';
import {io} from 'socket.io-client'

const socket = io('http://localhost:5100', {
  withCredentials: true
})
socket.on('connect', () => {
  console.log('Socket is connected')
})


// const { Button } = chakraTheme.components;

// const theme = extendBaseTheme({
//   components: {
//     Button,
//   },
// });

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
      {
        path: 'upload-receipts',
        element: <ReceiptScan />
      }
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
