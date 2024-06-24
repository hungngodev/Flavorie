import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Card, CardBody, Divider, Flex, HStack, Heading, IconButton, Input, Text, useToast, VStack } from '@chakra-ui/react';
import { FaCamera, FaEllipsis, FaEllipsisVertical } from 'react-icons/fa6';
import React, { ReactHTMLElement, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import theme from '../../style/theme';

export interface PersonalProps {
    avatar: {
      src: string;
      username: string;
    };
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: {
      city: string;
      state: string;
      country: string;
      zipcode?: string;
    };
};

const UserCard: React.FC<PersonalProps> = ({ avatar, firstname, lastname, email, phone, address }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    avatar: avatar.src,
    username: avatar.username,
    firstname,
    lastname,
    email,
    phone,
    city: address.city,
    state: address.state,
    country: address.country,
    zipcode: address.zipcode,
  });

  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = () => {
    setIsEditing(false);
    toast({
      title: 'Profile updated.',
      description: 'Your profile information has been successfully updated.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      avatar: avatar.src,
      username: avatar.username,
      firstname,
      lastname,
      email,
      phone,
      city: address.city,
      state: address.state,
      country: address.country,
      zipcode: address.zipcode,
    });
  };

  return (
    <Card maxW="md" position="relative">
      <Box p="4" position="relative">
        {/* <Flex ml="4" mt="4" mr="4" mb="2"> */}
        {isEditing ? (
          <Box position="absolute" top="2" right="2">
            <Button size="sm" onClick={handleSaveClick} mr="2">
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
            onClick={handleEditClick}
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
              <Box position="relative" width="fit-content" mt="4">
                <Avatar size="xl" name={formData.username} src={formData.avatar} />
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
                <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} display="none" />
              </Box>
            ) : (
              <Avatar size="xl" name={avatar.username} src={avatar.src} mt="4"/>
            )}
            <Box ml="4" mt="4">
              <Heading mb="2" size="md" fontWeight="bold">
                {isEditing ? (
                  <Input value={formData.username} name="username" onChange={handleInputChange} h="25px" size="sm" />
                ) : (
                  avatar.username
                )}
              </Heading>
              <Text>
                {isEditing ? (
                  <Input value={formData.email} name="email" onChange={handleInputChange} h="25px" size="sm" />
                ) : (
                  email
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
        <HStack spacing="20px" ml="19">
          <Box w="80px">
            <Text color="base.300" mb="1">
              Phone
            </Text>
            <Text color="base.300" mb="1">
              City
            </Text>
            <Text color="base.300" mb="1">
              State
            </Text>
            <Text color="base.300" mb="1">
              Country
            </Text>
            <Text color="base.300" mb="1">
              Zipcode
            </Text>
          </Box>
          <Box w="240px">
            {isEditing ? (
              <>
                <Input value={formData.phone} name="phone" onChange={handleInputChange} h="25px" mb="1" />
                <Input value={formData.city} name="city" onChange={handleInputChange} h="25px" mb="1" />
                <Input value={formData.state} name="state" onChange={handleInputChange} h="25px" mb="1" />
                <Input value={formData.country} name="country" onChange={handleInputChange} h="25px" mb="1" />
                <Input value={formData.zipcode} name="zipcode" onChange={handleInputChange} h="25px" mb="1" />
              </>
            ) : (
              <>
                <Text mb="1">{phone}</Text>
                <Text mb="1">{address.city}</Text>
                <Text mb="1">{address.state}</Text>
                <Text mb="1">{address.country}</Text>
                <Text mb="1">{address.zipcode}</Text>
              </>
            )}
          </Box>
        </HStack>
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
