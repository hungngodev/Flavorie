import { ChakraBaseProvider, theme as chakraTheme, extendBaseTheme } from '@chakra-ui/react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
//import ChakraCarousel from "./pages/ChakraCarousel";
import ImageSlide from "./components/ImageSlide";


const { Button } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
  },
});
const router = createBrowserRouter([
  {
    path: '/',
    element: <div> Your components </div>,
    children: [
      {
        index: true,
        element: <div> Your components </div>,
      },
      {
        path: "",
        element: <div> Your components </div>,
      },
      {
        path: "",
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
