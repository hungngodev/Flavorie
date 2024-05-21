import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Box, Button, ButtonGroup, Flex, HStack, VStack, Text } from '@chakra-ui/react';

const CustomWebcam: React.FC = () => {
    const webcamRef = useRef<Webcam>(null); 
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // capture photo
    const capture = useCallback(() => {
        if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setMessage(null)
        }
    }, [webcamRef]);

    // retake photo
    const retake = () => {
        setImgSrc(null);
        setMessage(null);
    };

    // submit photo
    const submit = () => {
        if (imgSrc) {
            setMessage('Sucessfully submitted');
        }
    };

    return (
        <Flex className="container" direction='column' align='center' justify='center'>
            {imgSrc ? (
                <img src={imgSrc} alt="webcam" />
            ): (
                <Webcam 
                    height={800} 
                    width={800} 
                    ref={webcamRef} 
                    screenshotFormat="image/jpeg"
                    screenshotQuality={0.9} 
                />
            )}
            <Box className="btn-container" alignItems="center">
            {imgSrc ? (
                <HStack>
                    <ButtonGroup>
                        <Button mt='3' onClick={retake} colorScheme="blue">
                            Retake photo
                        </Button>
                        <Button mt='3' onClick={submit} colorScheme="blue">
                            Submit
                        </Button>
                    </ButtonGroup> 
                </HStack>
            ) : (
                <Button mt='3' onClick={capture} colorScheme="blue">Capture photo</Button>
            )}
            </Box>
            {message && (
                <Text color="black.500" mt={3}>
                    {message}
                </Text>
            )}
        </Flex>
    );
};

const ImageScan: React.FC = () => {
    const [showWebcam, setShowWebcam] = useState(false);

    const toggleWebcam = () => {
        setShowWebcam(!showWebcam);
    };

    return (
        <VStack spacing={4} align="center">
            <Button onClick={toggleWebcam} colorScheme="blue">
                {showWebcam ? 'Close Webcam' : 'Scan receipt'}
            </Button>
            {showWebcam && <CustomWebcam />}
        </VStack>
    );
};

export default ImageScan;

// instruction to test
// paste <ImageScan /> into ChakraBaseProvider in App.tsx