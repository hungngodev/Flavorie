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
import { CiCircleCheck } from 'react-icons/ci';
import { FaUserXmark } from 'react-icons/fa6';
import { RiUserFollowLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks';
import customFetch from '../utils/customFetch';
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
  const auth = useAuth();
  useEffect(() => {
    if (auth.currentUser.status === 'authenticated') {
      toast.warn('You are already logged in!', { position: 'top-right', icon: <RiUserFollowLine /> });
      navigate('/');
    }
  }, [auth.currentUser.status, navigate]);

  const requiredErrorMessage = {
    email: 'You need a email to login',
    password: 'You need a password to login',
  };
  const minLengthErrorMessage = {
    email: 'Your email should have at least 4 characters',
    password: 'Your password should have at least 8 characters',
  };

  const [userNotFounded, setUserNotFounded] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const checkUser: APIData = {
        email: data.email,
        password: data.password,
      };
      const LoginRequest = await customFetch.post('/auth/login', checkUser, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      console.dir(LoginRequest);
      if (LoginRequest.status === 200) {
        toast.success('You have successfully logged in !'), { position: 'top-right', icon: <CiCircleCheck /> };
        setUserNotFounded(false);
        navigate('/');
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(`Make sure your email and password is correct!: ${error.response.statusText} `, {
          position: 'top-right',
          icon: <FaUserXmark />,
        });
        setUserNotFounded(true);
      }
      console.dir(error);

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
              <FormControl isInvalid={errors.email || userNotFounded ? true : false}>
                <Input
                  {...register('email', {
                    required: {
                      value: true,
                      message: requiredErrorMessage['email'],
                    },
                    minLength: {
                      value: 4,
                      message: minLengthErrorMessage['email'],
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
                <FormErrorMessage>
                  {(errors.email && errors.email.message) || (userNotFounded && 'Email or password did not match')}
                </FormErrorMessage>
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
                  isRequired
                  placeholder="Enter password"
                />
                <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
              </FormControl>
              <Link textAlign="left" href="#" alignSelf="flex-start">
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
