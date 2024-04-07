import {
  Button,
  ChakraProvider,
  Flex,
  FormControl,
  Heading,
  Input,
  Link,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import {useForm, SubmitHandler} from "react-hook-form";

interface FormFields {
  username:string,
  email:string,
  password:string,
  reEnterPassword:string,
}
const Register: React.FC = () => {
  const {register, handleSubmit, formState : {errors, isSubmitting}} = useForm<FormFields>();

  const onSubmit : SubmitHandler<FormFields> = (data) => {
    //! submit logic added later
    console.log(JSON.stringify(data))
    console.log(errors)
  }
  const minLengthErrorMessage = {
    username: "Your username should have at least 4 characters",
    password: "Your password should have at least 8 characters",
    reEnterPassword: "You need to re-enter your password with at least 8 characters"
  }
  const requiredErrorMessage = {
    username       : "You need a username to register",
    email          : "You need an email to register",
    password       : "You need a password to register",
    reEnterPassword: "You need to re-enter your password correctly to register",
  }
  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <VStack marginInline="auto" spacing={8}>
          <Heading textAlign="center">
            Welcome to <span style={{ color: "teal" }}>Flavorie!</span>
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6}>
            <FormControl isInvalid={errors.username ? true : false}>
              <Input
              // register is a method returning {onChange, onBlue, name, ref}. spreading returns all of the properties of the returned object
              {...register("username", {
                minLength : {
                  value: 4,
                  message: minLengthErrorMessage["username"],
                },
                required : {
                  value : true,
                  message: requiredErrorMessage["username"],
                }
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
                required:{
                  value:true,
                  message:requiredErrorMessage["email"],
                }
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
          <FormControl isInvalid = {errors.password ? true : false}>
              <Input
              {...register("password", {
                required:{
                  value:true,
                  message:requiredErrorMessage["password"],
                },
                minLength:{
                  value: 8,
                  message:minLengthErrorMessage["password"],
                }
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
          <FormControl isInvalid = {errors.reEnterPassword ? true : false}>
              <Input
              {...register("reEnterPassword", {
                required:{
                  value:true,
                  message:requiredErrorMessage["reEnterPassword"],
                },
                minLength:{
                  value: 8,
                  message:minLengthErrorMessage["reEnterPassword"],
                }
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
          <Button width="100%" colorScheme="teal" type="submit"> isLoading={isSubmitting}
                Login
            </Button>
            </VStack>
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
