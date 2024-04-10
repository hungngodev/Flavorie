import {
  ChakraBaseProvider,
  theme as chakraTheme,
  extendBaseTheme,
} from "@chakra-ui/react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import { default as Main, default as Register } from "./pages/register";
const { Button } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
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
