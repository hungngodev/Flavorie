import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Card,
    CardBody,
    Grid,
    GridItem,
    HStack,
    IconButton,
    Image,
    Tooltip,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import { Select, SelectItem } from '@nextui-org/select';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import {
    Clipboard,
    MessageSquare,
    Mic,
    MicOff,
    MonitorUp,
    Move,
    PhoneMissed,
    ScreenShareOff,
    Settings,
    Video,
    VideoOff,
} from 'lucide-react';
import { createContext, useEffect, useRef, useState } from 'react';
import ProgressiveImage from 'react-progressive-graceful-image';
import { Link, useParams } from 'react-router-dom';
import { NoMeal } from '../assets/animations';
import ImageSlide, { BackendData } from '../components/meals/ImageSlide';
import { Chat, NameInput, VideoPlayer } from '../components/meeting';
import { useRoom, useUser } from '../hooks';
import { ws } from '../providers/RoomProvider';
import { PeerState } from '../reducers/peerReducer';
import socket from '../socket/socketio';

export const SlideContext = createContext({
    direction: '',
});

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
    const [direction, setDirection] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const mealOptions = mealDatas.map((meal: BackendData) => ({ key: meal.title, label: meal.title }));
    mealOptions.unshift({ key: 'none', label: 'None' });
    useEffect(() => {
        setFocus(screenSharingId);
    }, [screenSharingId]);

    useEffect(() => {
        if (stream) {
            ws.emit('join-room', { roomId: id, peerId: me?.id, userName, userId });
        }
    }, [id, me?.id, stream, userName, userId]);

    useEffect(() => {
        setRoomId(id || '');
    }, [id, setRoomId]);

    useEffect(() => {
        return () => {
            ws.emit('leave-room', { roomId: id, userId });
        };
    }, [id, userId]);

    const { [focus]: focusing, ...peersToShow } = peers;
    const focusingVideo = focus === userId ? (screenSharingId !== '' ? screenStream : stream) : focusing?.stream;

    const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
    const chatWidth = '500';
    const [hidden, setHidden] = useState(!isOpen);

    const peerVideos = [...Object.values(peersToShow as PeerState)];

    const myVideoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (myVideoRef.current && stream) {
            myVideoRef.current.srcObject = stream;
        }
    }, [stream, focus]);

    useEffect(() => {
        socket?.on('receiveAction', (action) => {
            switch (action) {
                case 'left-arrow':
                    setDirection('left');
                    break;
                case 'right-arrow':
                    setDirection('right');
                    break;
                default:
                    break;
            }
        });
        return () => {
            socket?.off('receiveAction');
        };
    }, []);

    useEffect(() => {
        let gestureRecognizer: GestureRecognizer;
        let animationFrameId: number;

        const initializeHandDetection = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
                );
                gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            'https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task',
                    },
                    numHands: 1,
                    runningMode: 'VIDEO',
                    minHandDetectionConfidence: 0.9,
                    minHandPresenceConfidence: 0.9,
                    minTrackingConfidence: 0.9,
                });
                detectHands();
            } catch (error) {
                console.error('Error initializing hand detection:', error);
            }
        };

        const detectHands = () => {
            if (myVideoRef.current && myVideoRef.current.readyState >= 2) {
                const detections = gestureRecognizer.recognizeForVideo(myVideoRef.current, performance.now());
                if (detections.gestures.length > 0) {
                    const gesture = detections.gestures[0][0];
                    if (gesture.categoryName === 'Thumb_Down') {
                        setDirection('left');
                    } else if (gesture.categoryName === 'Thumb_Up') {
                        setDirection('right');
                    } else {
                        setDirection('');
                    }
                } else {
                    setDirection('');
                }
            }
            requestAnimationFrame(detectHands);
        };
        initializeHandDetection();

        return () => {
            if (gestureRecognizer) {
                gestureRecognizer.close();
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return (
        <SlideContext.Provider value={{ direction }}>
            <Box height="100%" width="100%" position="relative" ref={containerRef}>
                <HStack height="100%" width="100%" padding={'5px'}>
                    <VStack width="full" height="full" gap={2}>
                        <Grid
                            height={'50vh'}
                            width="100%"
                            templateColumns={`repeat(6,1fr)`}
                            templateRows={`repeat(1,1fr)`}
                        >
                            {focusingVideo && (
                                <GridItem rowSpan={3} colSpan={3} padding={'8px'} onClick={() => setFocus('')}>
                                    <Card
                                        width={'full'}
                                        height="full"
                                        display={'flex'}
                                        justify={'center'}
                                        align={'center'}
                                        bgColor={'#BDE0FE'}
                                    >
                                        <VideoPlayer stream={focusingVideo} />
                                    </Card>
                                </GridItem>
                            )}

                            {focus !== userId && (
                                <GridItem rowSpan={1} colSpan={1} padding={'8px'}>
                                    <Card
                                        width={'full'}
                                        height="full"
                                        display={'flex'}
                                        justify={'center'}
                                        align={'center'}
                                        bgColor={'#BDE0FE'}
                                    >
                                        <CardBody>
                                            <video
                                                data-testid="peer-video"
                                                ref={myVideoRef}
                                                autoPlay
                                                muted={true}
                                                style={{
                                                    width: '90%',
                                                    height: '90%',
                                                    objectFit: 'cover',
                                                }}
                                                onClick={() => setFocus(userId)}
                                            />
                                            <NameInput />
                                            <canvas
                                                ref={canvasRef}
                                                style={{ display: 'none' }}
                                                width="640"
                                                height="480"
                                            />
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
                                        <Card bgColor={'#BDE0FE'} width={'full'} height="full">
                                            <CardBody>
                                                <VideoPlayer stream={peer.stream} />
                                                <div>{peer.userName}</div>
                                            </CardBody>
                                        </Card>
                                    </GridItem>
                                ))}
                            <GridItem colStart={6} rowStart={0} padding={2}>
                                <VStack height="100%" width="100%" justifyContent={'start'}>
                                    {mealOptions.length > 0 ? (
                                        <>
                                            <ProgressiveImage
                                                src={
                                                    mealDatas.find(
                                                        (meal: { title: string }) => meal.title === mealChoice,
                                                    )?.imageUrl ||
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
                                                        width="100%"
                                                        height="50%"
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
                                                listboxProps={{
                                                    style: {
                                                        maxHeight: '18vh',
                                                    },
                                                }}
                                                selectedKeys={[mealChoice]}
                                                onChange={(e) => setMealChoice(e.target.value)}
                                            >
                                                {(meal: { key: string; label: string }) => (
                                                    <SelectItem className="w-full rounded-none" key={meal.key}>
                                                        {meal.label}
                                                    </SelectItem>
                                                )}
                                            </Select>
                                        </>
                                    ) : (
                                        <>
                                            <Lottie
                                                animationData={NoMeal}
                                                style={{ width: '100%', height: '100%' }}
                                                loop={false}
                                            />
                                            <div>No meal options available</div>
                                        </>
                                    )}
                                </VStack>
                            </GridItem>
                        </Grid>
                        {currentMealInfo && Object.keys(currentMealInfo).length > 0 && (
                            <HStack
                                width={'100%'}
                                borderRadius={'xl'}
                                bgColor={'#9F9FED'}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <ImageSlide backendData={currentMealInfo} />
                            </HStack>
                        )}
                        <motion.div
                            drag
                            dragConstraints={containerRef}
                            dragElastic={0.8}
                            dragTransition={{ bounceDamping: 10 }}
                            // dragMomentum={false}
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 400,
                                zIndex: 1000,
                                background: 'transparent',
                            }}
                        >
                            <Accordion allowToggle bg="transparent">
                                <AccordionItem bg="transparent" border={'none'}>
                                    <HStack bg="transparent" border={'none'} gap={0}>
                                        <Move />
                                        <AccordionButton bg={'transparent'}>
                                            <Button leftIcon={<Settings />} rightIcon={<AccordionIcon />}></Button>
                                        </AccordionButton>
                                    </HStack>
                                    <AccordionPanel pb={4}>
                                        <VStack justifyContent="center" alignItems="center">
                                            <Tooltip
                                                hasArrow
                                                bg="gray.300"
                                                color="black"
                                                label={'Copy Room ID'}
                                                placement="left"
                                            >
                                                <IconButton
                                                    icon={<Clipboard />}
                                                    variant="solid"
                                                    onClick={() => navigator.clipboard.writeText(id || '')}
                                                    aria-label="Copy room Id"
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                hasArrow
                                                bg="gray.300"
                                                color="black"
                                                label="Share Screen"
                                                placement="left"
                                            >
                                                <IconButton
                                                    onClick={shareScreen}
                                                    isDisabled={screenSharingId !== userId && screenSharingId !== ''}
                                                    padding={0}
                                                    icon={
                                                        screenSharingId === userId ? <ScreenShareOff /> : <MonitorUp />
                                                    }
                                                    aria-label="Share screen"
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                hasArrow
                                                bg="gray.300"
                                                color="black"
                                                label="Toggle Video"
                                                placement="left"
                                            >
                                                <IconButton
                                                    icon={videoStatus ? <Video /> : <VideoOff />}
                                                    aria-label="Toggle video"
                                                    onClick={toggleVideo}
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                hasArrow
                                                bg="gray.300"
                                                color="black"
                                                label="Toggle Mic"
                                                placement="left"
                                            >
                                                <IconButton
                                                    icon={micStatus ? <Mic /> : <MicOff />}
                                                    aria-label="Toggle mic"
                                                    onClick={toggleMic}
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                hasArrow
                                                bg="gray.300"
                                                color="black"
                                                label="Toggle Chat"
                                                placement="left"
                                            >
                                                <IconButton
                                                    {...getButtonProps()}
                                                    icon={<MessageSquare />}
                                                    aria-label="Toggle chat"
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                hasArrow
                                                bg="gray.300"
                                                color="black"
                                                label="Leave Room"
                                                placement="left"
                                            >
                                                <Link to="/meeting">
                                                    <IconButton icon={<PhoneMissed />} aria-label="Leave room" />
                                                </Link>
                                            </Tooltip>
                                        </VStack>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </motion.div>
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
                            position:
                                currentMealInfo && Object.keys(currentMealInfo).length > 0 ? 'absolute' : 'relative',
                            background: 'white',
                            right: 0,
                            zIndex: 1200,
                        }}
                    >
                        <Chat />
                    </motion.div>
                </HStack>
            </Box>
        </SlideContext.Provider>
    );
};

export default Room;
