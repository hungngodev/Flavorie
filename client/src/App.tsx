import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/HomeLayout.tsx';
import { Ingredient, Login, Main, Meal, Register } from './pages/index';
import theme from './style/theme';
import ReceiptScan from './pages/ReceiptScan.tsx';
import NotificationPage from './pages/NotificationPage.tsx';
import NotificationDetailPage from './pages/NotificationDetail.tsx';


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
      },
      {
        path: 'notifications', 
        element: <NotificationPage />
      },
      {
        path: 'notifications/:id',
        element: 
        <NotificationDetailPage />
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
