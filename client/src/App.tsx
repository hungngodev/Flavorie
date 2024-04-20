import {
  ChakraBaseProvider,
  theme as chakraTheme,
  extendBaseTheme,
} from "@chakra-ui/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
//import ChakraCarousel from "./pages/ChakraCarousel"; 
// import SlideShow from "./pages/slideShow";
import ImageSlide from "./pages/ImageSlide";

const { Button } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <ImageSlide/>,
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
    path: "/dashboard",
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
