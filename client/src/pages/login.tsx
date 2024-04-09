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
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
interface FormFields {
  email: string;
  password: string;
}

interface APIData {
  email: string;
  password: string;
}
const Login: React.FC = () => {
  const navigate = useNavigate();
  const requiredErrorMessage = {
    email: "You need a email to login",
    password: "You need a password to login",
  };
  const minLengthErrorMessage = {
    email: "Your email should have at least 4 characters",
    password: "Your password should have at least 8 characters",
  };

  const userNotFoundedMessage = "Email or password did not match";
  const [userNotFounded, setUserNotFounded] = useState<string>("");

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const checkUser: APIData = {
        email: data.email,
        password: data.password,
      };
      const checkLogin = await customFetch.post("/auth/login", checkUser, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setUserNotFounded("");
      navigate("/");
    } catch (error) {
      setUserNotFounded(userNotFoundedMessage);
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
            <VStack spacing={6}>
              <FormControl isInvalid={errors.email ? true : false}>
                <Input
                  {...register("email", {
                    required: {
                      value: true,
                      message: requiredErrorMessage["email"],
                    },
                    minLength: {
                      value: 4,
                      message: minLengthErrorMessage["email"],
                    },
                  })}
                  size="lg"
                  type="email"
                  placeholder="Enter email"
                  isRequired
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
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
