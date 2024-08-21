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
import { AxiosError } from 'axios';
import { ChefHat } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RiUserFollowLine } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import foodBackground from '..//assets/images/food-background.jpg';
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
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response && error.response.status === 409) {
                setExistedUserError(true);
            }
            return;
        }
    };
    const theme = useTheme();
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
                        backgroundColor="rgba(255, 255, 255, 0.35)" // Semi-transparent background
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
                            Let's get you started!
                        </Heading>
                        <Box width={{ base: '100%', md: '90%', xl: '80%' }}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <VStack spacing={4}>
                                    <FormControl isInvalid={errors.username || existedUserError ? true : false}>
                                        <Input
                                            {...register('username')}
                                            size="lg"
                                            type="username"
                                            placeholder="Enter username"
                                            isRequired
                                        />
                                        <FormErrorMessage>
                                            {(errors.username && errors.username.message) ||
                                                (existedUserError && 'User already existed')}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={errors.email ? true : false}>
                                        <Input
                                            {...register('email')}
                                            size="lg"
                                            type="email"
                                            isRequired
                                            placeholder="Enter email"
                                        />
                                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={errors.password ? true : false}>
                                        <Input
                                            {...register('password')}
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
                                            {...register('reEnterPassword')}
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
                                        Let's get cooking!
                                    </Button>
                                </VStack>
                            </form>
                        </Box>
                        <Link textAlign="center" href="/login">
                            Already have an account? <span style={{ color: 'teal' }}>Sign in now!</span>
                        </Link>
                    </VStack>
                </VStack>
            </Flex>
        </ChakraProvider>
    );
};
export default Register;
