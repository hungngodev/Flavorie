import {
    Box,
    Button,
    ChakraProvider,
    Flex,
    FormControl,
    FormErrorMessage,
    Heading,
    Image,
    Input,
    Link,
    Text,
    useTheme,
    VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { ChefHat } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CiCircleCheck } from 'react-icons/ci';
import { FaUserXmark } from 'react-icons/fa6';
import { RiUserFollowLine } from 'react-icons/ri';
import { TbFaceIdError } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as z from 'zod';
import foodBackground from '..//assets/images/food-background.jpg';
import { useAuth } from '../hooks';
import customFetch from '../utils/customFetch';

const UserLogin = z
    .object({
        email: z.string().email({ message: 'Please enter a valid email' }),
        password: z.string().min(8, { message: 'Please enter a password with 8 characters minimum' }),
    })
    .strict()
    .required({ email: true, password: true });
type UserLoginType = z.infer<typeof UserLogin>;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const redirect = searchParams.get('redirect');
    const auth = useAuth();
    const theme = useTheme();

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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
                withCredentials: true,
            });
            if (LoginRequest.status === 200) {
                toast.success('You have successfully logged in !'), { position: 'top-right', icon: <CiCircleCheck /> };
                setUserNotFounded(false);
                navigate(redirect ? redirect : '/');
            } else if (LoginRequest.status === 500) {
                toast.error('Oops! Something went wrong, please try again!', {
                    position: 'top-right',
                    icon: <TbFaceIdError />,
                });
                setUserNotFounded(true);
            }
        } catch (error) {
            if (
                error instanceof AxiosError &&
                error.response &&
                (error.response.status === 404 || error.response.status === 401)
            ) {
                toast.error('Make sure your email and password is correct!', {
                    position: 'top-right',
                    icon: <FaUserXmark />,
                });
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
            <Flex height="100dvh" alignItems="center" backgroundColor="gray.100">
                <Box height="100%" position="relative" display={{ base: 'none', lg: 'block' }}>
                    <Image
                        src={foodBackground}
                        alt="food background"
                        objectFit="contain"
                        maxHeight="100%"
                        filter="brightness(0.65)"
                        rounded="lg"
                    />
                    <Box
                        maxWidth="90%"
                        marginInline="auto"
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        width="90%" // Adjust based on your needs
                        backgroundColor="rgba(255, 255, 255, 0.15)" // Semi-transparent background
                        backdropFilter="blur(10px)"
                        paddingBlock={10}
                        rounded="3xl"
                        paddingInline={4}
                        boxShadow="dark-lg"
                        color="white"
                    >
                        <Heading zIndex={2} rounded="lg" size="2xl" marginBottom={6}>
                            Welcome to Flavorie
                        </Heading>
                        <Text fontSize="xl" fontWeight="semibold">
                            Manage ingredients, explore great dishes with friends, this is where the fun of cooking
                            begins!
                        </Text>
                    </Box>
                </Box>
                <VStack
                    marginInline="auto"
                    spacing={8}
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    flex={1}
                >
                    <VStack
                        paddingInline={6}
                        paddingBlock={4}
                        height="85%"
                        width={{ base: '100%', md: '80%' }}
                        border="1px"
                        borderColor="gray.200"
                        rounded="2xl"
                        boxShadow="xl"
                        justifyContent="center"
                        gap={8}
                        backgroundColor="white"
                    >
                        <Heading
                            textAlign="center"
                            size="2xl"
                            bgGradient={theme.gradients.palette_purple_gradient}
                            bgClip="text"
                            lineHeight="auto"
                        >
                            Welcome back!
                        </Heading>
                        <Box width={{ base: '100%', md: '90%', xl: '80%' }}>
                            <form onSubmit={handleSubmit(validateLogin)} style={{ width: '100%' }}>
                                <VStack spacing={6} height="100%">
                                    <FormControl isInvalid={errors.email || userNotFounded ? true : false}>
                                        <Input
                                            {...register('email')}
                                            size="lg"
                                            type="email"
                                            placeholder="Enter your email"
                                        />
                                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={errors.password || userNotFounded ? true : false}>
                                        <Input
                                            {...register('password')}
                                            size="lg"
                                            type="password"
                                            placeholder="Enter password"
                                        />
                                        <FormErrorMessage>
                                            {errors.password && errors.password.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <Link textAlign="left" href="#" alignSelf="flex-start" color="teal">
                                        Forgot your password?
                                    </Link>
                                    <Button
                                        width="100%"
                                        bgGradient={theme.gradients.palette_purple_gradient}
                                        type="submit"
                                        isLoading={isSubmitting}
                                        color="white"
                                        fontWeight="semibold"
                                        size="lg"
                                        _hover={{
                                            bgGradient: theme.gradients.palette_purple_gradient,
                                            filter: 'brightness(0.95)',
                                            boxShadow: 'lg',
                                        }}
                                        leftIcon={<ChefHat />}
                                    >
                                        Login
                                    </Button>
                                </VStack>
                            </form>
                        </Box>
                        <Link textAlign="center" href="/register">
                            Don't have an account? <span style={{ color: 'teal' }}>Sign up now!</span>
                        </Link>
                    </VStack>
                </VStack>
            </Flex>
        </ChakraProvider>
    );
};

export default Login;
