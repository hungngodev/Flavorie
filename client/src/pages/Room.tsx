import {
    Box,
    Button,
    Card,
    CardBody,
    Grid,
    GridItem,
    HStack,
    IconButton,
    Image,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import { Select, SelectItem } from '@nextui-org/select';
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
import ProgressiveImage from 'react-progressive-graceful-image';
import { Link, useParams } from 'react-router-dom';
import ImageSlide, { BackendData } from '../components/meals/ImageSlide';
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
        currentMeal: mealChoice,
        setCurrentMeal: setMealChoice,
        mealDatas,
        currentMealInfo,
    } = useRoom();
    const { userName, userId } = useUser();
    const [focus, setFocus] = useState(screenSharingId);

    const mealOptions = mealDatas.map((meal: BackendData) => ({ key: meal.title, label: meal.title }));

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
        <Box height="100%" width="100%" position="relative">
            <HStack height="100%" width="100%" padding={'5px'}>
                <VStack width="full" height="full ">
                    <Grid height={'60%'} width="100%" templateColumns={`repeat(5,1fr)`} templateRows={`repeat(2,1fr)`}>
                        {focusingVideo && (
                            <GridItem rowSpan={3} colSpan={3} padding={'8px'} onClick={() => setFocus('')}>
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
                        <GridItem gridColumn={5} gridRow={1} colSpan={1} rowSpan={1}>
                            <VStack height="full" width="full" justifyContent={'end'}>
                                <ProgressiveImage
                                    src={
                                        mealDatas.find((meal: any) => meal.title === mealChoice)?.imageUrl ||
                                        'https://cdn.shopify.com/s/files/1/0078/2503/1204/files/c.jpg?v=1582371638'
                                    }
                                    placeholder={''}
                                >
                                    {(src, loading) => (
                                        <Image
                                            style={{
                                                filter: loading ? 'blur(5px)' : 'blur(0)',
                                                transition: 'filter 2s',
                                            }}
                                            maxH={'26vh'}
                                            src={src}
                                            borderRadius={'lg'}
                                            objectFit="fill"
                                            onLoad={() => console.log('loaded')}
                                        />
                                    )}
                                </ProgressiveImage>
                                <Select
                                    items={mealOptions}
                                    variant="bordered"
                                    label="Meal Choice"
                                    className="w-full"
                                    selectedKeys={[mealChoice]}
                                    onChange={(e) => setMealChoice(e.target.value)}
                                >
                                    {(meal: { key: string; label: string }) => (
                                        <SelectItem className="w-full rounded-none bg-white" key={meal.key}>
                                            {meal.label}
                                        </SelectItem>
                                    )}
                                </Select>
                            </VStack>
                        </GridItem>
                    </Grid>
                    {currentMealInfo && Object.keys(currentMealInfo).length > 0 && (
                        <HStack width={'80%'} height="50%">
                            {mealChoice}
                            <ImageSlide backendData={currentMealInfo} />
                        </HStack>
                    )}
                </VStack>
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

            <HStack
                justifyContent="center"
                alignItems="center"
                position="absolute"
                bottom={0}
                zIndex={1000}
                left="50%"
                transform={'translateX(-50%)'}
            >
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

                <IconButton {...getButtonProps()} icon={<MessageSquare />} aria-label="Toggle chat" />

                <Link to="/meeting">
                    <IconButton icon={<PhoneMissed />} aria-label="Leave room" />
                </Link>
            </HStack>
        </Box>
    );
};

export default Room;
