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
import { SubmitHandler, useForm } from "react-hook-form";
import { redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
interface FormFields {
  username: string;
  email: string;
  password: string;
  reEnterPassword: string;
}
interface APIData {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (FormData) => {
    try {
      const newUserData: APIData = {
        name: FormData.username,
        email: FormData.email,
        password: FormData.password,
      };
      console.log(newUserData);
      const NewUserRequest = await customFetch.post(
        "/auth/register",
        {
          name: "FormData.username",
          email: "FormData@gmail.com",
          password: "FormData.password",
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );
      // const test = await customFetch.get("/test");
      // console.log(test.data);
      // redirect("/");
    } catch (error) {
      console.log("this is error");
      console.log(error);
      return;
    }
  };
  const minLengthErrorMessage = {
    username: "Your username should have at least 4 characters",
    password: "Your password should have at least 8 characters",
    reEnterPassword:
      "You need to re-enter your password with at least 8 characters",
  };
  const requiredErrorMessage = {
    username: "You need a username to register",
    email: "You need an email to register",
    password: "You need a password to register",
    reEnterPassword: "You need to re-enter your password correctly to register",
  };
  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <VStack marginInline="auto" spacing={8}>
        <VStack marginInline="auto" spacing={8}>
          <Heading textAlign="center">
            Welcome to <span style={{ color: "teal" }}>Flavorie!</span>
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.username ? true : false}>
                <Input
                  {...register("username", {
                    minLength: {
                      value: 4,
                      message: minLengthErrorMessage["username"],
                    },
                    required: {
                      value: true,
                      message: requiredErrorMessage["username"],
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
              <FormControl isInvalid={errors.email ? true : false}>
                <Input
                  {...register("email", {
                    required: {
                      value: true,
                      message: requiredErrorMessage["email"],
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
              <FormControl isInvalid={errors.reEnterPassword ? true : false}>
                <Input
                  {...register("reEnterPassword", {
                    required: {
                      value: true,
                      message: requiredErrorMessage["reEnterPassword"],
                    },
                    minLength: {
                      value: 8,
                      message: minLengthErrorMessage["reEnterPassword"],
                    },
                    validate: (val: string) => {
                      if (watch("password") != val) {
                        return "You must re-enter your password correctly";
                      }
                    },
                  })}
                  size="lg"
                  type="password"
                  placeholder="Re-enter password"
                  isRequired
                />
                <FormErrorMessage>
                  {errors.reEnterPassword && errors.reEnterPassword.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                width="100%"
                colorScheme="teal"
                type="submit"
                isLoading={isSubmitting}
                loadingText="Signing you up..."
              >
                Sign Up
              </Button>
            </VStack>
          </form>
          </form>
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
