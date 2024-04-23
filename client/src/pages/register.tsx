'use client';
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
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RiUserFollowLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks';
import customFetch from '../utils/customFetch';

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
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    if (auth.currentUser.status === 'authenticated') {
      toast.warn('You already have an account!', { position: 'top-right', icon: <RiUserFollowLine /> });
      navigate('/');
    }
  }, [auth.currentUser.status]);

  const [existedUserError, setExistedUserError] = useState<boolean>(false);
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
      const NewUserRequest = await customFetch.post('/auth/register', newUserData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      // // const test = await customFetch.get("/test");
      // // console.log(test.data);
      if (NewUserRequest.status === 201) {
        toast.success(`Welcome to Flavorie ${newUserData.name}!`, {
          position: 'top-right',
          icon: <RiUserFollowLine />,
        });
        setExistedUserError(false);
        navigate('/');
        auth.setUser();
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        setExistedUserError(true);
      }
      return;
    }
  };
  const minLengthErrorMessage = {
    username: 'Your username should have at least 4 characters',
    password: 'Your password should have at least 8 characters',
    reEnterPassword: 'You need to re-enter your password with at least 8 characters',
  };
  const requiredErrorMessage = {
    username: 'You need a username to register',
    email: 'You need an email to register',
    password: 'You need a password to register',
    reEnterPassword: 'You need to re-enter your password correctly to register',
  };
  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <VStack marginInline="auto" spacing={8}>
          <Heading textAlign="center">
            Welcome to <span style={{ color: 'teal' }}>Flavorie!</span>
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.username || existedUserError ? true : false}>
                <Input
                  {...register('username', {
                    minLength: {
                      value: 4,
                      message: minLengthErrorMessage['username'],
                    },
                    required: {
                      value: true,
                      message: requiredErrorMessage['username'],
                    },
                  })}
                  size="lg"
                  type="username"
                  placeholder="Enter username"
                  isRequired
                />
                <FormErrorMessage>
                  {(errors.username && errors.username.message) || (existedUserError && 'User already existed')}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.email ? true : false}>
                <Input
                  {...register('email', {
                    required: {
                      value: true,
                      message: requiredErrorMessage['email'],
                    },
                    pattern: {
                      // regex for email validation
                      value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                      message: 'You need to login with a valid email',
                    },
                  })}
                  size="lg"
                  type="email"
                  isRequired
                  placeholder="Enter email"
                />
                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password ? true : false}>
                <Input
                  {...register('password', {
                    required: {
                      value: true,
                      message: requiredErrorMessage['password'],
                    },
                    minLength: {
                      value: 8,
                      message: minLengthErrorMessage['password'],
                    },
                  })}
                  size="lg"
                  type="password"
                  placeholder="Enter password"
                  isRequired
                />
                <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.reEnterPassword ? true : false}>
                <Input
                  {...register('reEnterPassword', {
                    required: {
                      value: true,
                      message: requiredErrorMessage['reEnterPassword'],
                    },
                    minLength: {
                      value: 8,
                      message: minLengthErrorMessage['reEnterPassword'],
                    },
                    validate: (val: string) => {
                      if (watch('password') != val) {
                        return 'You must re-enter your password correctly';
                      }
                    },
                  })}
                  size="lg"
                  type="password"
                  placeholder="Re-enter password"
                  isRequired
                />
                <FormErrorMessage>{errors.reEnterPassword && errors.reEnterPassword.message}</FormErrorMessage>
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
          <Link textAlign="center" href="/login">
            Already have an account? <span style={{ color: 'teal' }}>Sign in!</span>
          </Link>
        </VStack>
      </Flex>
    </ChakraProvider>
  );
};

export default Register;
