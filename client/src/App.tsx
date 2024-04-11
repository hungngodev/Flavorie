import { ChakraBaseProvider, theme as chakraTheme, extendBaseTheme } from '@chakra-ui/react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

const { Button } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <div> Your components</div>,
      },
      {
        path: 'register',
        element: <div> Register</div>,
      },
      {
        path: 'login',
        element: <div> Your components</div>,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <div> Your dashboared</div>,
  },
]);

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraBaseProvider>
  );
}
export default App;
