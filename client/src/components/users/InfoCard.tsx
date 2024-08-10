import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    Divider,
    Flex,
    Grid,
    HStack,
    Heading,
    IconButton,
    Input,
    Text,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaCamera, FaEllipsis } from 'react-icons/fa6';
import useToast from '../../hooks/useToast';
import theme from '../../style/theme';
import customFetch from '../../utils/customFetch';
export interface PersonalProps {
    avatar: string;
    // avatarFileName: string;
    name: string;
    lastName: string;
    email: string;
    city: string;
    country: string;
    description: string;
}

const UserCard = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState<PersonalProps>();
    const { notifyError, notifySuccess } = useToast();
    const { handleSubmit, control, setValue, reset } = useForm({
        defaultValues: userInfo,
    });
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await customFetch.get('/user');
                if (response.status === 200) {
                    setUserInfo(response.data.currUser);
                    reset(response.data.currUser);
                } else {
                    notifyError('Cannot load your info. Please try again');
                }
            } catch (error) {
                console.log('Error fetching personal data', error);
                notifyError('Cannot load your info. Please try again');
            }
        };
        fetchUserInfo();
    }, [notifyError, reset]);

    useEffect(() => {
        if (userInfo) {
            reset(userInfo);
        }
    }, [userInfo, reset]);

    const onSubmit = async (data: any) => {
        try {
            const response = await customFetch.patch('/user', data);
            if (response.status === 200) {
                const updatedUserInfo = { ...userInfo, ...data };
                setUserInfo(updatedUserInfo);
                setIsEditing(false);
                notifySuccess('Update profile successfully');
                queryClient.invalidateQueries({ queryKey: ['user'] });
            } else {
                notifyError('Cannot update your profile. Please try again');
            }
        } catch (error) {
            console.log('error when updating profile', error);
            notifyError('Cannot update your profile. Please try again');
        }
    };
    const handleCancelClick = () => {
        setIsEditing(false);
        reset(userInfo);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue('avatar', reader.result as string);
            };
            reader.readAsDataURL(file);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    };

    return (
        <Card maxW="md" position="relative">
            <Box p="3" position="relative">
                {isEditing ? (
                    <Box position="absolute" top="2" right="5">
                        <Button size="sm" onClick={handleSubmit(onSubmit)} mr="2">
                            Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCancelClick}>
                            Cancel
                        </Button>
                    </Box>
                ) : (
                    <IconButton
                        variant="normal"
                        color={theme.colors.palette_purple}
                        aria-label="Edit"
                        icon={<FaEllipsis />}
                        onClick={() => setIsEditing(true)}
                        position="absolute"
                        top="2"
                        right="2"
                        zIndex="1"
                        size="sm"
                    />
                )}
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap" justifyContent="space-between">
                    <HStack>
                        {isEditing ? (
                            <Box position="relative" width="fit-content" mt="7">
                                <Avatar size="xl" name={userInfo?.name} src={userInfo?.avatar} />
                                <Box
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    right="0"
                                    bottom="0"
                                    bg="gray.200"
                                    opacity="0.8"
                                    borderRadius="full"
                                />
                                <IconButton
                                    icon={<FaCamera />}
                                    aria-label="Upload Avatar"
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    size="md"
                                    colorScheme="teal"
                                    as="label"
                                    htmlFor="avatar-upload"
                                    cursor="pointer"
                                    zIndex="1"
                                />
                                <Input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    display="none"
                                />
                            </Box>
                        ) : (
                            <Avatar size="xl" name={userInfo?.name} src={userInfo?.avatar} mt="7" />
                        )}
                        <Box ml="4" mt="7">
                            <Heading mb="2" size="md" fontWeight="bold">
                                {isEditing ? (
                                    <HStack spacing="2" w="260px">
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} h="25px" size="sm" placeholder="First name" />
                                            )}
                                        />
                                        <Controller
                                            name="lastName"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} h="25px" size="sm" placeholder="Last name" />
                                            )}
                                        />
                                    </HStack>
                                ) : (
                                    <Box ml="2">{userInfo?.name}</Box>
                                )}
                            </Heading>
                            <Text>
                                {isEditing ? (
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => <Input {...field} w="260px" h="25px" size="sm" />}
                                    />
                                ) : (
                                    <Box ml="2">{userInfo?.email}</Box>
                                )}
                            </Text>
                        </Box>
                    </HStack>
                </Flex>
            </Box>
            <Box ml="32" mr="4">
                <Divider width="100%" borderColor={theme.colors.palette_indigo} />
            </Box>
            <CardBody>
                <Grid templateColumns="100px 1fr" gap={4} ml="19" mt="1" mb="3">
                    <Box w="100px">
                        <Text color="base.300" mb="1">
                            {' '}
                            City{' '}
                        </Text>
                        <Text color="base.300" mb="1">
                            {' '}
                            Country{' '}
                        </Text>
                        <Text color="base.300" mb="1">
                            {' '}
                            Description
                        </Text>
                    </Box>
                    <Box w="250px">
                        {isEditing ? (
                            <>
                                <Controller
                                    name="city"
                                    control={control}
                                    render={({ field }) => <Input {...field} h="25px" mb="1" />}
                                />
                                <Controller
                                    name="country"
                                    control={control}
                                    render={({ field }) => <Input {...field} h="25px" mb="1" />}
                                />
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => <Input {...field} h="25px" mb="1" />}
                                />
                            </>
                        ) : (
                            <>
                                <Text mb="1">{userInfo?.city}</Text>
                                <Text mb="1">{userInfo?.country}</Text>
                                <Text mb="1">{userInfo?.description}</Text>
                            </>
                        )}
                    </Box>
                </Grid>
            </CardBody>
        </Card>
    );
};

export default UserCard;

// Instruction to use

// copy this prop to function App in App.tsx
// const userInfoProps = {
//     avatar: {
//             src: "../public/images/1989-Taylors-Version.webp",
//             username: "Taylor Swift",
//         },
//         email: "taylorswift@gmail.com",
//         phone: "+1 (202) 444 1989",
//         address: {
//             city: "Nashville",
//             state: "Tennessee",
//             country: "USA",
//             zipcode: "37208",
//         },
// }

// copy this line in return in App.tsx
//<UserCard userInfoProps={userInfoProps} />
