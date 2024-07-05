import { AspectRatio, Box, BoxProps, Container, forwardRef, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import React from 'react';
import theme from '../style/theme';

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
                                    <PreviewImage backgroundImage={backgroundImage} />
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
