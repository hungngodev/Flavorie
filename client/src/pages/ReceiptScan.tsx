import React from 'react';
import UploadReceiptForm from '../components/UploadReceiptForm';
import ImageScan from '../components/ingredients/ImageScan';
import useAuth from '../hooks/useAuth';
import { Heading, Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';

const ReceiptScan: React.FC = () => {
  const { currentUser } = useAuth();
  return (
      <Flex mt="8" >
          <Box w={500}>
              <UploadReceiptForm />
              <ImageScan />
          </Box>
          <Box w={650}>
              <Heading mb="5">Welcome, {currentUser.username}</Heading>
              <Text fontSize={18} textAlign="justify">
                  We're excited to help you discover delicious meals based on the ingredients you have. Our website is designed to recommend recipes and guide you through cooking amazing dishes. Follow the simple steps below to get started:{' '}
              </Text>
          </Box>
      </Flex>
  );
};

export default ReceiptScan;
