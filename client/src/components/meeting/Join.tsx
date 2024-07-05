import { NameInput } from "./Name";
import { Button } from "./Button";
import { ws } from '../../providers/RoomProvider';
import { Box, Flex, Heading, Input, Stack } from '@chakra-ui/react';
import {Link} from "react-router-dom";
import { useState } from "react";
import theme from "../../style/theme";
import Lottie from 'lottie-react';
import Connect from '../../assets/animations/Connect.json';

const Join: React.FC = () => {
    const [input, setInput] = useState("");
    const createRoom = () => {
        ws.emit("create-room");
    };
    return (
        <Flex flex="1" h="100vh" alignItems="center">
            <Box w="50%" h="100%">
                <Lottie animationData={Connect} loop={true} style={{ height: '100vh', maxWidth: '100%' }} />
            </Box>
            <Stack flex="1" alignItems="center" flexDirection="column" justifyContent="center">
                <Heading
                    color={theme.gradients.palette_purple_gradient}
                    mb="3"
                    mt="4"
                    size="lg"
                    fontSize="30"
                    fontWeight="bold"
                    textAlign="center"
                >
                    Let's Cook and Connect with Your Friends!
                </Heading>
                <Box
                    w="350px"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    p={5}
                    textAlign="center"
                >
                    <NameInput />
                    <Button onClick={createRoom} className="px-8 py-2 text-lg">
                        Start new meeting
                    </Button>
                    <Input
                        borderColor={input ? theme.colors.palette_purple : theme.colors.palette_indigo}
                        focusBorderColor={theme.colors.palette_purple}
                        placeholder="Room ID"
                        className="mt-7"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Link to={`/meeting/room/${input}`}>
                        <Button className="mt-2 px-8 py-2 text-lg">Join meeting</Button>
                    </Link>
                </Box>
            </Stack>
        </Flex>
    );
};
export default Join;