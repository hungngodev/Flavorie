import {
  Button,
  ChakraProvider,
  Flex,
  FormControl,
  Heading,
  Input,
  Link,
  VStack,
} from "@chakra-ui/react";

const Login: React.FC = () => {
  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <VStack width="100%" marginInline="auto" spacing={8}>
          <Heading textAlign="center">Welcome back</Heading>
          <FormControl
            width={{
              base: "95%",
              md: "40%",
            }}
          >
            <VStack spacing={6}>
              <Input
                size="lg"
                type="username"
                placeholder="Enter username"
                isRequired
              />
              <Input
                size="lg"
                type="password"
                placeholder="Enter password"
                isRequired
              />
              <Link textAlign="left" href="#" alignSelf="flex-start">
                Forgot your password?
              </Link>
              <Button width="100%" colorScheme="teal">
                Login
              </Button>
            </VStack>
          </FormControl>
          <Link textAlign="center" href="/register">
            Don't have an account?{" "}
            <span style={{ color: "teal" }}>Sign up now!</span>
          </Link>
        </VStack>
      </Flex>
    </ChakraProvider>
  );
};

export default Login;
