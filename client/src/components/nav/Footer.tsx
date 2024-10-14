import { Box, Container, Flex, HStack, Icon, IconButton, Image, Link, Spacer, Stack, Text } from '@chakra-ui/react';
import { FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';
import FullLogo from '../../assets/Full-logo.svg';
import theme from '../../style/theme';
const Footer = () => {
    return (
        <Box bg={theme.colors.palette_indigo} color="white">
            <Container maxW="7xl" py="8">
                <Flex flexWrap="wrap" justifyContent="center">
                    <Box
                        display="flex"
                        justifyContent="flex-start"
                        bg="white"
                        objectFit="cover"
                        alignItems="center"
                        borderRadius="full"
                    >
                        <Image boxSize="150px" objectFit="cover" src={FullLogo} />
                    </Box>
                    <Spacer />
                    <Stack direction="column" justifyContent="center" h="150px">
                        <Text fontSize="xl" textAlign="center">
                            &copy; 2024 Flavorie. All rights reserved.
                        </Text>
                        <HStack justifyContent="center" mt="2" spacing="4">
                            <Link href="#" fontSize="md">
                                Privacy Policy
                            </Link>
                            <Link href="#" fontSize="md">
                                Terms
                            </Link>
                        </HStack>
                    </Stack>
                    <Spacer />
                    <Stack direction="column" justifyContent="center" h="150px">
                        <Text ml="2" fontWeight="bold">
                            Contact us
                        </Text>
                        <HStack justifyContent="center" spacing="2" fontWeight="bold">
                            <IconButton
                                as={Link}
                                href="https://www.facebook.com/yourcompany"
                                aria-label="Facebook"
                                icon={<Icon as={FaFacebook} />}
                                variant="ghost"
                                color="white"
                                fontSize="25px"
                                fontWeight="bold"
                                rounded="full"
                                _hover={{ color: 'gray.300' }}
                            />
                            <IconButton
                                as={Link}
                                href="https://www.instagram.com/yourcompany"
                                aria-label="Instagram"
                                icon={<Icon as={FaInstagram} />}
                                variant="ghost"
                                color="white"
                                fontSize="25px"
                                fontWeight="bold"
                                rounded="full"
                                _hover={{ color: 'gray.300' }}
                            />
                            <IconButton
                                as={Link}
                                href="mailto:flavorie123@gmail.com"
                                aria-label="Email"
                                icon={<Icon as={FaEnvelope} />}
                                variant="ghost"
                                color="white"
                                fontSize="25px"
                                rounded="full"
                                _hover={{ color: 'gray.300' }}
                            />
                        </HStack>
                    </Stack>
                </Flex>
            </Container>
        </Box>
    );
};

export default Footer;
