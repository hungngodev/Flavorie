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
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RiUserFollowLine } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useAuth } from '../hooks';
import customFetch from '../utils/customFetch';

const UserRegister = z
  .object({
    username: z.string().min(4, { message: 'Username must be at least 4 characters' }),
    email: z.string().email({ message: 'Please enter a valid email' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    reEnterPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.reEnterPassword, {
    message: 'You must re-enter your password correctly',
    path: ['reEnterPassword'],
  });

const RequestRegister = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

type UserRegisterType = z.infer<typeof UserRegister>;
type RequestRegisterType = z.infer<typeof RequestRegister>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (auth.currentUser.status === 'authenticated') {
      toast.warn('You already have an account!', { position: 'top-right', icon: <RiUserFollowLine /> });
      navigate('/');
    }
  }, [auth.currentUser.status, navigate]);

  const [existedUserError, setExistedUserError] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterType>();

  const onSubmit: SubmitHandler<UserRegisterType> = async (FormData) => {
    try {
      const newUserData: RequestRegisterType = {
        name: FormData.username,
        email: FormData.email,
        password: FormData.password,
      };
      const NewUserRequest = await customFetch.post('/auth/register', newUserData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (NewUserRequest.status === 201) {
        toast.success(`Welcome to Flavorie ${newUserData.name}!`, {
          position: 'top-right',
          icon: <RiUserFollowLine />,
        });
        setExistedUserError(false);
        navigate(redirect ? redirect : '/');
        auth.setUser();
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 409) {
        setExistedUserError(true);
      }
      return;
    }
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
                <Input {...register('username')} size="lg" type="username" placeholder="Enter username" isRequired />
                <FormErrorMessage>
                  {(errors.username && errors.username.message) || (existedUserError && 'User already existed')}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.email ? true : false}>
                <Input {...register('email')} size="lg" type="email" isRequired placeholder="Enter email" />
                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password ? true : false}>
                <Input {...register('password')} size="lg" type="password" placeholder="Enter password" isRequired />
                <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.reEnterPassword ? true : false}>
                <Input
                  {...register('reEnterPassword')}
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
