import {
  ChakraBaseProvider,
  theme as chakraTheme,
  extendBaseTheme,
} from "@chakra-ui/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { validateRegisterInput } from "/Users/vynguyen/Documents/VSCode/Flavorie/src/middleware/validateRegis.ts";

const { Button } = chakraTheme.components;

const sampleRegis = {
  username: "Sophie",
  email: "sophie.abc@gmail.com",
  password: "12345678",
  reEnterPassword: "12345678",
};

const theme = extendBaseTheme({
  components: {
    Button,
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <div> Your components </div>,
    children: [
      {
        index: true,
        element: <div> Your components</div>,
      },
      {
        path: "register",
        element: <div> Register</div>,
      },
      {
        path: "login",
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
  try {
    validateRegisterInput.parse(sampleRegis);
    console.log("Register data is ok");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Registration data is invalid:", error.message);
    } else {
      console.error("Unknown error occurred:", error);
    }
  }
  return (
    <ChakraBaseProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraBaseProvider>
  );
}
export default App;
