import { ChakraBaseProvider, theme as chakraTheme, extendBaseTheme } from '@chakra-ui/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/homeLayout';
import { Login, Main, Register } from './pages/index';
import AuthProvider from './providers/authProvider';
const { Button } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
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
        element: <div> this is ingredient page</div>,
      },
      {
        path: 'meals',
        element: <div> this is meals page</div>,
      },
      {
        path: 'community',
        element: <div> this is community page</div>,
      },
    ],
  },
]);

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer autoClose={5000} limit={3} transition={Slide} />
      </AuthProvider>
    </ChakraBaseProvider>
  );
}
export default App;
