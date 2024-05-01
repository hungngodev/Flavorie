import { ChakraBaseProvider, theme as chakraTheme, extendBaseTheme } from '@chakra-ui/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import HomeLayout from './layouts/homeLayout';
import { Ingredient, Login, Main, Meal, Register } from './pages/index';
import AuthProvider from './providers/authProvider';//import ImageSlide from "./components/ImageSlide";
import ImageCard from './components/ImageCard';

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
        element: (
          <div>
            {' '}
            <div> this is ingredient page</div> <div> this is ingredient page</div> <div> this is ingredient page</div>{' '}
            <div> this is ingredient page</div> <div> this is ingredient page</div> <div> this is ingredient page</div>{' '}
            <div> this is ingredient page</div> <div> this is ingredient page</div> <div> this is ingredient page</div>{' '}
            <div> this is ingredient page</div> <div> this is ingredient page</div> <div> this is ingredient page</div>{' '}
            <div> this is ingredient page</div> <div> this is ingredient page</div> <div> this is ingredient page</div>{' '}
            <div> this is ingredient page</div> <div> this is ingredient page</div> <div> this is ingredient page</div>{' '}
            <div> this is ingredient page</div> <div> this is ingredient page</div> <div> this is ingredient page</div>{' '}
            <div> this is ingredient page</div> <div> this is ingredient page</div> <div> this is ingredient page</div>{' '}
            <div> this is ingredient page</div> <div> this is ingredient page</div> <div> this is ingredient page</div>{' '}
            <div> this is ingredient page</div> <div> this is ingredient page</div> <div> this is ingredient page</div>{' '}
            this is ingredient page
          </div>
        ),
      },
      {
        path: 'meals',
        element: <Meal />,
      },
      {
        path: 'community',
        element: <Ingredient />,
      },
    ],
  },
]);

function App() {
  const imageProps = {
    src: "../public/images/baked-brie-with-roasted-mushrooms.webp",
    alt: "Baked brie with roasted mushroom",
    description: "Baked brie cheese with roasted mushroom on top.",
    borderRadius: '8px',
    price: '$4.8'
  }
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
