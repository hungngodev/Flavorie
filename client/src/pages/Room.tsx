import { Button, Grid, GridItem, HStack, IconButton, useDisclosure } from '@chakra-ui/react';
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

    useEffect(() => {
        if (stream) ws.emit('join-room', { roomId: id, peerId: me?.id, userName, userId });
    }, [id, me?.id, stream, userName, userId]);

    useEffect(() => {
        setRoomId(id || '');
    }, [id, setRoomId]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useEffect(() => {
        console.log(screenSharingId);
    }, [screenSharingId]);
    const { [screenSharingId]: sharing, ...peersToShow } = peers;
    // console.log(sharing);
    useEffect(() => {
        console.log('CHANGINGNIGNGIN', peers);
    }, [peers]);

    const screenSharingVideo = screenSharingId === userId ? screenStream : sharing?.stream;

    const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
    const chatWidth = '500';
    const [hidden, setHidden] = useState(!isOpen);
    return (
        <Grid
            templateRows="repeat(14, 1fr)"
            templateColumns="repeat(1, 1fr)"
            height="100%"
            width="100%"
            position="relative"
        >
            <GridItem rowSpan={13} colSpan={1}>
                <HStack height="100%" width="100%" alignItems={'start'}>
                    {screenSharingVideo && (
                        <div className="w-4/5 pr-4">
                            <VideoPlayer stream={screenSharingVideo} />
                        </div>
                    )}
                    <div className={`grid gap-4 ${screenSharingVideo ? 'grid-col-1 w-1/5' : 'grid-cols-4'}`}>
                        {screenSharingId !== userId && (
                            <div>
                                <VideoPlayer stream={stream} />
                                <NameInput />
                                {userId}
                            </div>
                        )}

                        {Object.values(peersToShow as PeerState)
                            .filter((peer) => !!peer.stream)
                            .map((peer, index) => (
                                <div key={peer.userId + index}>
                                    <VideoPlayer stream={peer.stream} />
                                    <div>{peer.userName}</div>
                                    <div>{peer.userId}</div>
                                </div>
                            ))}
                    </div>
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
                        isDisabled={screenSharingId !== userId && !!screenSharingVideo}
                        padding={0}
                        leftIcon={screenSharingVideo && screenSharingId == userId ? <ScreenShareOff /> : <MonitorUp />}
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
