import {
  ChakraBaseProvider,
  theme as chakraTheme,
  extendBaseTheme,
} from "@chakra-ui/react";

const { Button } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
  },
});

function App() {
  return <ChakraBaseProvider theme={theme}></ChakraBaseProvider>;
}
export default App;
