import React, { useState } from 'react';
import { useAuth } from '../hooks';
import useToast from '../hooks/useToast';
import socket from '../socket/socketio';
import { AspectRatio, Box, Button, BoxProps, Container, forwardRef, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import theme from '../style/theme';

// const UploadReceiptForm = () => {
//   const auth = useAuth();
//   const [file, setFile] = useState<File | null>(null);
//   const { notifyError, notifySuccess, notifyWarning } = useToast();

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFile(event.target.files[0]);
//     }
//   };
//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!file) {
//       notifyError('Please upload files');
//       return;
//     }

//     if (auth.currentUser.status === 'unauthenticated') {
//       notifyError('Please log in or sign up to submit receipt');
//       return;
//     }

//     // FileReader object to read a file
//     const reader = new FileReader();
//     reader.onload = function (e) {
//       const base64 = e.target?.result as string;
//       const filename = file.name;
//       console.log('submitting receipt');
//       socket.emit('submitReceipt', { base64, filename });
//       notifySuccess('Submit receipt successfully');
//     };

//     // initiate to read file => result is base64 encoded string
//     reader.readAsDataURL(file);
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="file" onChange={handleFileChange} accept="image/*" />
//       <button type="submit">Upload Receipt</button>
//     </form>
//   );
// };
// export default UploadReceiptForm;



const third = {
    rest: {
        scale: 1.2,
        filter: 'grayscale(80%)',
        transition: {
            duration: 0.5,
            type: 'tween',
            ease: 'easeIn',
        },
    },
    hover: {
        scale: 1.4,
        filter: 'grayscale(0%)',
        transition: {
            duration: 0.4,
            type: 'tween',
            ease: 'easeOut',
        },
    },
};

const PreviewImage = forwardRef<BoxProps, typeof Box>((props, ref) => {
    return (
        <Box
            bg="white"
            top="0"
            height="100%"
            width="100%"
            position="absolute"
            borderWidth="1px"
            borderStyle="solid"
            rounded="sm"
            borderColor={theme.colors.palette_lavender}
            as={motion.div}
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            backgroundPosition="center"
            backgroundImage={`url("https://image.shutterstock.com/image-photo/paella-traditional-classic-spanish-seafood-600w-1662253543.jpg")`}
            {...props}
            ref={ref}
        />
    );
});

interface UploadImageProps {
    backgroundImage: string;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
}

const UploadImage: React.FC<UploadImageProps> = ({ setFile, backgroundImage, setBackgroundImage }) => {
    const controls = useAnimation();
    const startAnimation = () => controls.start('hover');
    const stopAnimation = () => controls.stop();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImage(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <Container my="23">
            <AspectRatio width="62" ratio={1} h="400px" w="300px">
                <Box
                    borderColor="lavender"
                    borderStyle="dashed"
                    borderWidth="2px"
                    rounded="md"
                    shadow="sm"
                    role="group"
                    transition="all 150ms ease-in-out"
                    _hover={{
                        shadow: 'md',
                    }}
                >
                    <Box
                        as={motion.div}
                        initial="rest"
                        animate="rest"
                        whileHover="hover"
                        position="relative"
                        height="100%"
                        width="100%"
                    >
                        <Box
                            position="absolute"
                            top="0"
                            left="0"
                            height="100%"
                            width="100%"
                            display="flex"
                            flexDirection="column"
                        >
                            <Stack
                                height="100%"
                                width="100%"
                                display="flex"
                                alignItems="center"
                                justify="center"
                                spacing="4"
                            >
                                <Box height="20" width="14" position="relative" mt="10">
                                    <PreviewImage variants={third} backgroundImage={backgroundImage} />
                                </Box>
                                <Stack p="8" textAlign="center" spacing="1">
                                    <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                                        Drop images here
                                    </Heading>
                                    <Text fontWeight="light">or click to upload</Text>
                                </Stack>
                            </Stack>
                        </Box>
                        <Input
                            type="file"
                            height="100%"
                            width="100%"
                            position="absolute"
                            top="0"
                            left="0"
                            opacity="0"
                            aria-hidden="true"
                            accept="image/*"
                            onDragEnter={startAnimation}
                            onDragLeave={stopAnimation}
                            onChange={handleFileChange}
                        />
                    </Box>
                </Box>
            </AspectRatio>
        </Container>
    );
};

export default UploadImage;