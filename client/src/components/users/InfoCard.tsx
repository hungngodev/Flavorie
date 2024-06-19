import { EditIcon } from '@chakra-ui/icons';
import { Avatar, Box, Card, CardBody, Divider, Flex, HStack, Heading, IconButton, Text } from '@chakra-ui/react';
import React from 'react';

export interface PersonalProps {
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


const UserCard: React.FC<PersonalProps> = ({ avatar, email, phone, address }) => {
  return (
    <Card maxW="md">
      <Flex ml="4" mt="4" mr="4" mb="4">
        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
          <HStack>
            <Avatar size="2xl" name={avatar.username} src={avatar.src} />
            <Box ml="4">
              <Heading size="md" fontWeight="bold">
                {avatar.username}
              </Heading>
              <Text>
                {address.city}, {address.state}
              </Text>
            </Box>
          </HStack>
        </Flex>
        <IconButton variant="solid" colorScheme="gray" aria-label="Edit" icon={<EditIcon />} />
      </Flex>
      <Box ml="36" mr="4">
        <Divider width="100%" borderColor="base.200" />
      </Box>
      <CardBody>
        <HStack spacing="20px" ml="19">
          <Box w="80px">
            <Text color="base.300">Email</Text>
            <Text color="base.300">Phone</Text>
            <Text color="base.300">City</Text>
            <Text color="base.300">State</Text>
            <Text color="base.300">Country</Text>
            <Text color="base.300">Zipcode</Text>
          </Box>
          <Box w="240px">
            <Text>{email}</Text>
            <Text>{phone}</Text>
            <Text>{address.city}</Text>
            <Text>{address.state}</Text>
            <Text>{address.country}</Text>
            <Text>{address.zipcode}</Text>
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
