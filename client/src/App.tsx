import { ChakraBaseProvider, theme as chakraTheme, extendBaseTheme } from '@chakra-ui/react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
//import ImageSlide from "./components/ImageSlide";
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
    element: <div>  </div>,
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
  const imageProps = {
    src: "../public/images/baked-brie-with-roasted-mushrooms.webp",
    alt: "Baked brie with roasted mushroom",
    description: "Baked brie cheese with roasted mushroom on top.",
    borderRadius: '8px',
    price: '$4.8'
  }
  return (
    <ChakraBaseProvider theme={theme}>
      <RouterProvider router={router} />
      <ImageCard imageProps={imageProps} />
    </ChakraBaseProvider>
  );
}
export default App;
