import { ChakraBaseProvider, theme as chakraTheme, extendBaseTheme } from '@chakra-ui/react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
//import ImageSlide from "./components/ImageSlide";
//import ImageCard from './components/ImageCard';
import UserCard from './components/UserInforCard';

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
  // const imageProps = {
  //   src: "../public/images/baked-brie-with-roasted-mushrooms.webp",
  //   alt: "Baked brie with roasted mushroom",
  //   description: "Baked brie cheese with roasted mushroom on top.",
  //   borderRadius: '8px',
  //   price: '$4.8'
  // }
  const userInfoProps = {
    avatar: {
            src: "../public/images/1989-Taylors-Version.webp",
            username: "Taylor Swift",
        },
        email: "taylorswift@gmail.com",
        phone: "+1 (202) 444 1989",
        address: {
            city: "Nashville",
            state: "Tennessee",
            country: "USA",
            zipcode: "37208",
        },
  }
  return (
    <ChakraBaseProvider theme={theme}>
      <RouterProvider router={router} />
      {/* <ImageCard imageProps={imageProps} /> */}
      <UserCard userInfoProps={userInfoProps} />
    </ChakraBaseProvider>
  );
}
export default App;
