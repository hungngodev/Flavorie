import React from "react";
import {
    Avatar,
    Box,
    Card,
    CardHeader,
    CardBody,
    ChakraProvider,
    Divider,
    extendTheme,
    Flex,
    IconButton,
    Heading,
    HStack,
    Text,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons'
import theme from "../style/theme.tsx";

interface UserProps {
    userInfoProps: {
        avatar: {
            src: string;
            username: string;
        };
        email: string;
        phone: string;
        address: {
            city: string;
            state: string;
            country: string;
            zipcode?: string;
        };
    };
}

const UserCard: React.FC<UserProps> = ({ userInfoProps }) => {
    return (
        <ChakraProvider theme={extendTheme(theme)}>
        <Card maxW='md'>
            <Flex ml='4' mt='4' mr='4' mb='4'>
                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                    <HStack>
                        <Avatar size='2xl' name={userInfoProps.avatar.username} src={userInfoProps.avatar.src} />
                        <Box ml='4'>
                            <Heading size='md' fontWeight='bold'>{userInfoProps.avatar.username}</Heading>
                            <Text>{userInfoProps.address.city}, {userInfoProps.address.state}</Text>
                        </Box>
                    </HStack>
                </Flex>
                <IconButton
                    variant="solid"
                    colorScheme="gray"
                    aria-label='Edit'
                    icon={<EditIcon />} 
                />
            </Flex>
            <Box ml='36' mr='4'>
                <Divider width="100%" borderColor='base.200' />
            </Box>
            <CardBody>
                <HStack spacing='20px' ml='19' >
                    <Box w='80px'>
                        <Text color='base.300'>Email</Text>
                        <Text color='base.300'>Phone</Text>
                        <Text color='base.300'>City</Text>
                        <Text color='base.300'>State</Text>
                        <Text color='base.300'>Country</Text>
                        <Text color='base.300'>Zipcode</Text>
                    </Box>
                    <Box w='240px'>
                        <Text>{userInfoProps.email}</Text>
                        <Text>{userInfoProps.phone}</Text>
                        <Text>{userInfoProps.address.city}</Text>
                        <Text>{userInfoProps.address.state}</Text>
                        <Text>{userInfoProps.address.country}</Text>
                        <Text>{userInfoProps.address.zipcode}</Text>
                    </Box>
                </HStack>
            </CardBody>
        </Card>
        </ChakraProvider>
    );
};

export default UserCard;
