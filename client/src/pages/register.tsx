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

const Register: React.FC = () => {
  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <VStack width="100%" marginInline="auto" spacing={8}>
          <Heading textAlign="center">
            Welcome to <span style={{ color: "teal" }}>Flavorie!</span>
          </Heading>
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
              <Input
                size="lg"
                type="password"
                placeholder="Re-enter password"
                isRequired
              />
              <Button width="100%" colorScheme="teal">
                Login
              </Button>
            </VStack>
          </FormControl>
          <Link textAlign="center" href="/login">
            Already have an account?{" "}
            <span style={{ color: "teal" }}>Sign in!</span>
          </Link>
        </VStack>
      </Flex>
    </ChakraProvider>
  );
};

export default Register;
