import { Box, Button, Flex, Heading, Icon, ListItem, Text, UnorderedList, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import ImageScan from '../components/ingredients/ImageScan';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast.tsx';
// import { Box, Flex, VStack, Icon, Button,  } from '@chakra-ui/react';
import { FaCamera, FaUpload } from 'react-icons/fa';
import UploadImage from '../components/UploadReceiptForm';
import socket from '../socket/socketio.tsx';
import theme from '../style/theme';

const ReceiptScan: React.FC = () => {
    const { currentUser } = useAuth();
    const { notifyError, notifySuccess } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [backgroundImage, setBackgroundImage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            notifyError('Please upload your receipt');
            return;
        }

        if (currentUser.status === 'unauthenticated') {
            notifyError('Please log in to upload receipts');
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const base64 = e.target?.result as string;
            const filename = file.name;
            console.log('submitting receipt');
            socket.emit('submitReceipt', { base64, filename });
            notifySuccess('Submit receipt successfully');
        };

        reader.readAsDataURL(file);
    };

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        await handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    };

    return (
        <div className="flex flex-col overflow-hidden">
            <Flex direction="column" alignItems="center" mt="6" mb="24">
                <Box w="100%" maxW="1200px" p="4">
                    <Heading as="h1" fontSize="4xl" mb="4" color={theme.colors.palette_purple}>
                        {/* Hey {currentUser.username},  */}
                        Stuck on what to cook today?
                    </Heading>
                    <Text fontSize="22" textAlign="justify" mb="5" color="gray.600">
                        Don't worry! We're here to turn your grocery list into mouth-watering meals! Whether you have no
                        idea what to cook or just need some inspiration, we've got you covered. Just follow our simple
                        steps to get started!
                    </Text>
                    <Box mt="12">
                        <Heading as="h2" fontSize="36" mb="4" textAlign="center" color={theme.colors.palette_purple}>
                            How it works
                        </Heading>
                        <Flex justify="space-between" wrap="wrap" h="320px">
                            <Box
                                flex="1"
                                minW="250px"
                                p="5"
                                borderWidth="1px"
                                borderRadius="lg"
                                boxShadow="lg"
                                m="4"
                                bg={theme.colors.white_purple}
                            >
                                <Heading as="h4" size="md" mt="6" textAlign="center" color="gray.600">
                                    1. Scan or Upload Your Receipt
                                </Heading>
                                <Text textAlign="justify" p={4}>
                                    Either click "Scan receipt" to capture an image using your device's camera or choose
                                    an image or PDF file from your device.
                                </Text>
                            </Box>
                            <Box
                                flex="1"
                                minW="250px"
                                p="5"
                                borderWidth="1px"
                                borderRadius="lg"
                                boxShadow="lg"
                                m="4"
                                bg={theme.colors.white_purple}
                            >
                                <Heading as="h4" size="md" mt="6" mb="2" textAlign="center" color="gray.600">
                                    2. Verify Receipt Details
                                </Heading>
                                <Text textAlign="justify" p={4}>
                                    Review and verify the extracted items. If you have more receipts, use the button to
                                    go back and add them.
                                </Text>
                            </Box>
                            <Box
                                flex="1"
                                minW="250px"
                                p="5"
                                borderWidth="1px"
                                borderRadius="lg"
                                boxShadow="lg"
                                m="4"
                                bg={theme.colors.white_purple}
                            >
                                <Heading as="h4" size="md" mt="6" mb="2" textAlign="center" color="gray.600">
                                    3. Get Meal Suggestions
                                </Heading>
                                <Text textAlign="justify" p={4}>
                                    We will analyze the ingredients and provide personalized meal suggestions along with
                                    step-by-step cooking guides for you.
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                    <Box ml="3" mt="10" mb="12">
                        <Heading as="h5" size="md" color="gray.600">
                            Tips for best results:
                        </Heading>
                        <UnorderedList mt="4" spacing="2">
                            <ListItem>Ensure your receipt is well-lit and all items are clearly visible.</ListItem>
                            <ListItem>If scanning, hold your camera steady to avoid blurry images.</ListItem>
                            <ListItem>
                                For uploads, check that the file is not too large and is in a common format (JPG, PNG,
                                PDF).
                            </ListItem>
                        </UnorderedList>
                    </Box>
                    <Flex justify="space-between" wrap="wrap" h="630px">
                        <Box flex="1" minW="250px" p="4" borderWidth="1px" borderRadius="lg" boxShadow="lg" m="2">
                            <VStack spacing="4">
                                <Icon as={FaUpload} boxSize="7" color="indigo" />
                                <Box alignItems="center">
                                    <UploadImage
                                        setFile={setFile}
                                        backgroundImage={backgroundImage}
                                        setBackgroundImage={setBackgroundImage}
                                    />
                                </Box>
                                <Box width="100%" textAlign="center">
                                    <Button onClick={handleClick} variant="outline">
                                        Submit
                                    </Button>
                                </Box>
                            </VStack>
                        </Box>
                        <Box flex="1" minW="250px" p="4" borderWidth="1px" borderRadius="lg" boxShadow="lg" m="2">
                            <VStack spacing="4">
                                <Icon as={FaCamera} boxSize="7" color="indigo" />
                                <ImageScan />
                            </VStack>
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            {/* <Box>
                <Footer />
            </Box> */}
        </div>
    );
};

export default ReceiptScan;
