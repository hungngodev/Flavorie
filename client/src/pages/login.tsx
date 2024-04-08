import {
  Button,
  ChakraProvider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Link,
  VStack,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormFields {
  username: string;
  password: string;
}
const Login: React.FC = () => {
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    //! submit logic added later
    console.log(JSON.stringify(data));
    console.log(errors);
  };

  const requiredErrorMessage = {
    username: "You need a username to login",
    password: "You need a password to login",
  };
  const minLengthErrorMessage = {
    username: "Your username should have at least 4 characters",
    password: "Your password should have at least 8 characters",
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <VStack width="100%" marginInline="auto" spacing={8}>
          <Heading textAlign="center">Welcome back</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6}>
              <FormControl isInvalid={errors.username ? true : false}>
                <Input
                  {...register("username", {
                    required: {
                      value: true,
                      message: requiredErrorMessage["username"],
                    },
                    minLength: {
                      value: 4,
                      message: minLengthErrorMessage["username"],
                    },
                  })}
                  size="lg"
                  type="username"
                  placeholder="Enter username"
                  isRequired
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password ? true : false}>
                <Input
                  {...register("password", {
                    required: {
                      value: true,
                      message: requiredErrorMessage["password"],
                    },
                    minLength: {
                      value: 8,
                      message: minLengthErrorMessage["password"],
                    },
                  })}
                  size="lg"
                  type="password"
                  placeholder="Enter password"
                  isRequired
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <Link textAlign="left" href="#" alignSelf="flex-start">
                Forgot your password?
              </Link>
              <Button
                width="100%"
                colorScheme="teal"
                type="submit"
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </VStack>
          </form>
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
