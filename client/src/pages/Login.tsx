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
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CiCircleCheck } from 'react-icons/ci';
import { FaUserXmark } from 'react-icons/fa6';
import { RiUserFollowLine } from 'react-icons/ri';
import { TbFaceIdError } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { useAuth } from '../hooks';
import customFetch from '../utils/customFetch';

const UserLogin = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email' }),
    password: z.string().min(8, { message: 'Please enter a password with 8 characters minimum' }),
  })
  .strict().required({ email: true, password: true });
type UserLoginType = z.infer<typeof UserLogin>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.currentUser.status === 'authenticated') {
      toast.warn('You are already logged in!', { position: 'top-right', icon: <RiUserFollowLine /> });
      navigate('/');
    }
  }, [auth.currentUser.status, navigate]);

  const [userNotFounded, setUserNotFounded] = useState<boolean>(false);

  const validateLogin: SubmitHandler<UserLoginType> = async (data) => {
    try {
      const userResponse: UserLoginType = {
        email: data.email,
        password: data.password,
      };
      const LoginRequest = await customFetch.post('/auth/login', userResponse, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      console.log(LoginRequest);
      if (LoginRequest.status === 200) {
        toast.success('You have successfully logged in !'), { position: 'top-right', icon: <CiCircleCheck /> };
        setUserNotFounded(false);
        navigate('/');
        auth.setUser();
      } else if (LoginRequest.status === 500) {
        toast.error('Oops! Something went wrong, please try again!', {
          position: 'top-right',
          icon: <TbFaceIdError />,
        });
        setUserNotFounded(true);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 404) {
        toast.error('Make sure your email and password is correct!', { position: 'top-right', icon: <FaUserXmark /> });
      } else {
        toast.error('Oops! Something went wrong, please try again!', {
          position: 'top-right',
          icon: <TbFaceIdError />,
        });
      }
      setUserNotFounded(true);
      return;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginType>({
    resolver: zodResolver(UserLogin),
  });

  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <VStack width="100%" marginInline="auto" spacing={8}>
          <Heading textAlign="center" color="teal">
            Welcome back
          </Heading>
          <form onSubmit={handleSubmit(validateLogin)} className="responsive-form">
            <VStack spacing={6}>
              <FormControl isInvalid={errors.email || userNotFounded ? true : false}>
                <Input {...register('email')} size="lg" type="email" placeholder="Enter your email" />
                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password || userNotFounded ? true : false}>
                <Input {...register('password')} size="lg" type="password" placeholder="Enter password" />
                <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
              </FormControl>
              <Link textAlign="left" href="#" alignSelf="flex-start" color="teal">
                Forgot your password?
              </Link>
              <Button width="100%" colorScheme="teal" type="submit" isLoading={isSubmitting}>
                Login
              </Button>
            </VStack>
          </form>
          <Link textAlign="center" href="/register">
            Don't have an account? <span style={{ color: 'teal' }}>Sign up now!</span>
          </Link>
        </VStack>
      </Flex>
    </ChakraProvider>
  );
};

export default Login;