import React, { useState } from 'react';
import UploadReceiptForm from '../components/UploadReceiptForm';
import ImageScan from '../components/ingredients/ImageScan';
import useAuth from '../hooks/useAuth';
import { Heading, Box, Button, Flex, Icon, HStack, UnorderedList, ListItem, Text, VStack } from '@chakra-ui/react';
import { FaUpload, FaCamera } from 'react-icons/fa';
import theme from '../style/theme';

const ReceiptScan: React.FC = () => {
  const { currentUser } = useAuth();

  return (
      <Flex direction="column" alignItems="center" mt="7">
          <Box w="100%" maxW="1200px" p="4">
              <Heading as="h1" mb="5" color="gray.600">
                  Welcome, {currentUser.username}
              </Heading>
              <Text fontSize={18} textAlign="justify" mb="5">
                  We're excited to help you discover delicious meals and guide you through cooking based on the
                  ingredients you have. If you don't have specific ideas, don't worry! Just follow our simple steps to
                  get started.
              </Text>
              <Box mt="10">
                  <Heading as="h3" size="lg" mb="4" textAlign="center" color={theme.colors.palette_purple}>
                      How it works
                  </Heading>
                  <Flex justify="space-between" wrap="wrap" h="320px">
                      <Box
                          flex="1"
                          minW="250px"
                          p="4"
                          borderWidth="1px"
                          borderRadius="lg"
                          boxShadow="lg"
                          m="2"
                          bg={theme.colors.white_purple}
                      >
                          <Heading as="h4" size="md" mt="6" textAlign="center" color="gray.600">
                              1. Scan or upload your receipt
                          </Heading>
                          <Text textAlign="justify" p={4}>
                              Click on the "Scan Receipt" button and use your device's camera to capture a clear image
                              of your grocery receipt. Ensure all items are visible for the best results.
                          </Text>
                      </Box>
                      <Box
                          flex="1"
                          minW="250px"
                          p="4"
                          borderWidth="1px"
                          borderRadius="lg"
                          boxShadow="lg"
                          m="2"
                          bg={theme.colors.white_purple}
                      >
                          <Heading as="h4" size="md" mt="6" mb="2" textAlign="center" color="gray.600">
                              2. Upload Your Receipt
                          </Heading>
                          <Text textAlign="justify" p={4}>
                              Click on the "Upload Receipt" button and select the image or PDF file of your grocery
                              receipt from your device. Make sure the receipt is legible and includes all purchased
                              items.
                          </Text>
                      </Box>
                      <Box
                          flex="1"
                          minW="250px"
                          p="4"
                          borderWidth="1px"
                          borderRadius="lg"
                          boxShadow="lg"
                          m="2"
                          bg={theme.colors.white_purple}
                      >
                          <Heading as="h4" size="md" mt="6" mb="2" textAlign="center" color="gray.600">
                              3. Get Meal Suggestions
                          </Heading>
                          <Text textAlign="justify" p={4}>
                              After uploading or scanning your receipt, our system will analyze the ingredients and
                              provide personalized meal suggestions along with step-by-step cooking guides.
                          </Text>
                      </Box>
                  </Flex>
              </Box>
              <Box ml="3" mt="10" mb="8">
                  <Heading as="h5" size="md" color="gray.600">
                      Tips for best results:
                  </Heading>
                  <UnorderedList mt="4" spacing="2">
                      <ListItem>Ensure your receipt is well-lit and all items are clearly visible.</ListItem>
                      <ListItem>If scanning, hold your camera steady to avoid blurry images.</ListItem>
                      <ListItem>
                          For uploads, check that the file is not too large and is in a common format (JPG, PNG, PDF).
                      </ListItem>
                  </UnorderedList>
              </Box>
              <Flex justify="space-between" wrap="wrap" h="630px">
                  <Box flex="1" minW="250px" p="4" borderWidth="1px" borderRadius="lg" boxShadow="lg" m="2">
                      <VStack spacing="4">
                          <Icon as={FaUpload} boxSize="7" color={theme.colors.palette_indigo} />
                          <Box alignItems="center">
                              <UploadReceiptForm />
                          </Box>
                      </VStack>
                  </Box>
                  <Box flex="1" minW="250px" p="4" borderWidth="1px" borderRadius="lg" boxShadow="lg" m="2">
                      <VStack spacing="4">
                          <Icon as={FaCamera} boxSize="7" color={theme.colors.palette_indigo} />
                          <ImageScan />
                      </VStack>
                  </Box>
              </Flex>
          </Box>
      </Flex>
  );
};

export default ReceiptScan;
