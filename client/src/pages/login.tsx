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
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
interface FormFields {
  username: string;
  password: string;
}

interface FormFields{
  username : string,
  password : string,
}
const Login: React.FC = () => {
  const requiredErrorMessage = {
    username: "You need a username to login",
    password: "You need a password to login",
  };
  const minLengthErrorMessage = {
    username: "Your username should have at least 4 characters",
    password: "Your password should have at least 8 characters",
  };

  const userNotFoundedMessage = "Username or password did not match";
  const [userNotFounded, setUserNotFounded] = useState<string>("");

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const currentUser = { username: data.username, password: data.password };
      const response = await customFetch.get("/auth/login");
      const returnedUser = {
        username: response.data.username,
        password: response.data.password,
      };
      if (returnedUser == currentUser) {
        setUserNotFounded("");
        redirect("/");
      } else {
        setUserNotFounded(userNotFoundedMessage);
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
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
              {userNotFounded && (
                <FormErrorMessage> userNotFounded</FormErrorMessage>
              )}
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
