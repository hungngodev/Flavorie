import { Button, Card, CardBody, Grid, GridItem, HStack, IconButton, useDisclosure } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
    Clipboard,
    MessageSquare,
    Mic,
    MicOff,
    MonitorUp,
    PhoneMissed,
    ScreenShareOff,
    Video,
    VideoOff,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Chat, NameInput, VideoPlayer } from '../components/meeting';
import { useRoom, useUser } from '../hooks';
import { ws } from '../providers/RoomProvider';
import { PeerState } from '../reducers/peerReducer';

const Room = () => {
    const { id } = useParams();
    const {
        stream,
        screenStream,
        peers,
        shareScreen,
        screenSharingId,
        setRoomId,
        me,
        toggleVideo,
        toggleMic,
        videoStatus,
        micStatus,
    } = useRoom();
    const { userName, userId } = useUser();
    const [focus, setFocus] = useState(screenSharingId);

    useEffect(() => {
        setFocus(screenSharingId);
    }, [screenSharingId]);

    useEffect(() => {
        if (stream) ws.emit('join-room', { roomId: id, peerId: me?.id, userName, userId });
    }, [id, me?.id, stream, userName, userId]);

    useEffect(() => {
        setRoomId(id || '');
    }, [id, setRoomId]);
    useEffect(() => {
        return () => {
            ws.emit('leave-room', { roomId: id, userId });
        };
    }, []);

    const { [focus]: focusing, ...peersToShow } = peers;

    const focusingVideo = focus === userId ? (screenSharingId !== '' ? screenStream : stream) : focusing?.stream;

    const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
    const chatWidth = '500';
    const [hidden, setHidden] = useState(!isOpen);

    const peerVideos = [...Object.values(peersToShow as PeerState)];
    return (
        <Grid
            templateRows="repeat(14, 1fr)"
            templateColumns="repeat(1, 1fr)"
            height="100%"
            width="100%"
            position="relative"
        >
            <GridItem rowSpan={13} colSpan={1}>
                <HStack height="100%" width="100%" alignItems={'start'} padding={'5px'}>
                    <Grid height={'100%'} width="100%" templateColumns={`repeat(5,1fr)`} templateRows={`repeat(3,1fr)`}>
                        {focusingVideo && (
                            <GridItem rowSpan={3} colSpan={4} padding={'8px'} onClick={() => setFocus('')}>
                                <Card width={'full'} height="full" display={'flex'} justify={'center'} align={'center'}>
                                    <VideoPlayer stream={focusingVideo} />
                                </Card>
                            </GridItem>
                        )}

                        {focus !== userId && (
                            <GridItem rowSpan={1} colSpan={1} padding={'8px'} onClick={() => setFocus(userId)}>
                                <Card width={'full'} height="full" display={'flex'} justify={'center'} align={'center'}>
                                    <CardBody>
                                        <VideoPlayer stream={stream} />
                                        <NameInput />
                                    </CardBody>
                                </Card>
                            </GridItem>
                        )}
                        {peerVideos
                            .filter((peer) => !!peer.stream)
                            .map((peer, index) => (
                                <GridItem
                                    key={index}
                                    rowSpan={1}
                                    colSpan={1}
                                    padding={'8px'}
                                    onClick={() => setFocus(peer.userId)}
                                >
                                    <Card width={'full'} height="full">
                                        <CardBody>
                                            <VideoPlayer stream={peer.stream} />
                                            <div>{peer.userName}</div>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                            ))}
                    </Grid>

                    <motion.div
                        {...getDisclosureProps()}
                        hidden={hidden}
                        initial={false}
                        onAnimationStart={() => {
                            setHidden(false);
                        }}
                        onAnimationComplete={() => {
                            setHidden(!isOpen);
                        }}
                        animate={{ width: isOpen ? parseInt(chatWidth) : 0 }}
                        style={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            height: '100%',
                        }}
                    >
                        <Chat />
                    </motion.div>
                </HStack>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
                <HStack height="100%" justifyContent="center" alignItems="center" width="100%">
                    <Button
                        leftIcon={<Clipboard />}
                        variant="solid"
                        onClick={() => navigator.clipboard.writeText(id || '')}
                    >
                        Copy room Id
                    </Button>

                    <Button
                        onClick={shareScreen}
                        isDisabled={screenSharingId !== userId && screenSharingId !== ''}
                        padding={0}
                        leftIcon={screenSharingId == userId ? <ScreenShareOff /> : <MonitorUp />}
                        aria-label="Share screen"
                    />
                    <IconButton
                        icon={videoStatus ? <Video /> : <VideoOff />}
                        aria-label="Toggle video"
                        onClick={toggleVideo}
                    />
                    <IconButton icon={micStatus ? <Mic /> : <MicOff />} aria-label="Toggle mic" onClick={toggleMic} />

                    <IconButton
                        {...getButtonProps()}
                        color={'black'}
                        icon={<MessageSquare />}
                        aria-label="Toggle chat"
                    />

                    <Link to="/meeting">
                        <IconButton icon={<PhoneMissed />} aria-label="Leave room" />
                    </Link>
                </HStack>
            </GridItem>
        </Grid>
    );
};

export default Room;
