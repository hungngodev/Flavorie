import { Box, Flex, Heading, Input, VStack } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BackgroundImage from '../../../public/images/BackgroundImage.png';
import Connect from '../../assets/animations/Connect.json';
import { ws } from '../../providers/RoomProvider';
import theme from '../../style/theme';
import { Button } from './Button';
import { NameInput } from './Name';

const Join: React.FC = () => {
    const [input, setInput] = useState('');
    const createRoom = () => {
        ws.emit('create-room');
    };
    return (
        <Flex
            flex="1"
            h="100vh"
            backgroundImage={BackgroundImage}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            minH="calc(70vh)"
            alignItems="center"
            px="15"
        >
            <Flex w="50%" h="100%" justifyContent="center" alignItems="center">
                <Box borderRadius="25px" overflow="hidden">
                    <Lottie animationData={Connect} loop={true} style={{ height: '70vh', maxWidth: '100%' }} />
                </Box>
            </Flex>
            <VStack
                flex="1"
                gap="5"
                p="14"
                h="70%"
                alignItems="center"
                boxShadow="md"
                justifyContent="center"
                backgroundColor="white"
                backdropFilter="blur(10px)"
                mr="24"
                ml="1"
                rounded="3xl"
            >
                <Heading
                    bgGradient={theme.gradients.palette_purple_gradient}
                    bgClip="text"
                    mb="8"
                    mt="4"
                    size="lg"
                    fontSize="30"
                    fontWeight="bold"
                    textAlign="center"
                >
                    Let's Cook and Connect with Your Friends!
                </Heading>
                <Box
                    w="60%"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    p={5}
                    textAlign="center"
                >
                    <NameInput />
                    <Button onClick={createRoom} className="w-full p-2 text-lg">
                        Start new meeting
                    </Button>
                    <Input
                        borderColor={input ? theme.colors.palette_purple : theme.colors.palette_indigo}
                        focusBorderColor={theme.colors.palette_purple}
                        placeholder="Room ID"
                        className="mt-10"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Link to={`/meeting/room/${input}`}>
                        <Button className="w-full p-2 px-10 text-lg">Join meeting</Button>
                    </Link>
                </Box>
            </VStack>
        </Flex>
    );
};
export default Join;
