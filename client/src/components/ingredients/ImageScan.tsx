import { Box, Button, ButtonGroup, Flex, HStack, Image, VStack } from '@chakra-ui/react';
import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import socket from '../../socket/socketio';

const CustomWebcam: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    const { notifyError, notifySuccess } = useToast();
    const auth = useAuth();

    // capture photo
    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
        }
    }, [webcamRef]);

    // retake photo
    const retake = () => {
        setImgSrc(null);
    };

    // submit photo
    const submit = () => {
        if (auth.currentUser.status === 'unauthenticated') {
            notifyError('Please log in or sign up to submit receipt');
            return;
        }
        if (imgSrc) {
            const filename = `webcam-photo-${Date.now()}.jpg`;
            socket?.emit('submitReceipt', { base64: imgSrc, filename });
            notifySuccess('Submit receipt successfully');
        }
    };

    return (
        <Flex className="container" direction="column" align="center" justify="center">
            {imgSrc ? (
                <Image src={imgSrc} alt="webcam" />
            ) : (
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
                            <Button mt="3" onClick={retake} colorScheme="blue" variant="outline">
                                Retake photo
                            </Button>
                            <Button mt="3" onClick={submit} colorScheme="blue">
                                Submit
                            </Button>
                        </ButtonGroup>
                    </HStack>
                ) : (
                    <Button mt="3" onClick={capture} colorScheme="blue">
                        Capture photo
                    </Button>
                )}
            </Box>
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
            <Button onClick={toggleWebcam} variant="outline">
                {showWebcam ? 'Close Webcam' : 'Scan receipt'}
            </Button>
            {showWebcam && <CustomWebcam />}
        </VStack>
    );
};

export default ImageScan;

// instruction to test
// paste <ImageScan /> into ChakraBaseProvider in App.tsx
