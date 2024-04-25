import { ChakraBaseProvider, theme as chakraTheme, extendBaseTheme } from '@chakra-ui/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomeLayout from './layouts/homeLayout';
import { Login, Main, Register } from './pages/index';
import AuthContextProvider from './providers/authProvider';
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
    ],
  },
  {
    path: '/dashboard',
    element: <div> Your dashboard</div>,
  },
]);

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </ChakraBaseProvider>
  );
}
export default App;
