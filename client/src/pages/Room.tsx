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
import { useEffect, useRef, useState } from 'react';
import ProgressiveImage from 'react-progressive-graceful-image';
import { Link, useParams } from 'react-router-dom';
import ImageSlide, { BackendData } from '../components/meals/ImageSlide';
import { Chat, NameInput, VideoPlayer } from '../components/meeting';
import { useRoom, useUser } from '../hooks';
import { ws } from '../providers/RoomProvider';
import { PeerState } from '../reducers/peerReducer';
import axios from 'axios';

const mockData: BackendData = {
    "_id": "665a72f5a7da0532eed01ee6",
    "title": "Chorizo and Beef Quinoa Stuffed Pepper",
    "imageUrl": "https://img.spoonacular.com/recipes/715523-556x370.jpg",
    "allIngredients": [
        "66254eb8de4729f9b4e66510",
        "66254eb8de4729f9b4e66510",
        "6629d4e1a7fccfa7f2ed7326",
        "6629d4e2a7fccfa7f2ed73b7",
        "66230b8f7d3a87121cf5d729",
        "6629d4e0a7fccfa7f2ed6c75",
        "66254e78de4729f9b4e6556f",
        "6626fdd6a6be53e4db0621ad",
        "662309de71897b184e6b9ad0",
        "6628549aaa5852cf1cbd5409"
    ],
    "amount": {
        "capsicum": "bell peppers",
        "ground red pepper": "½ tsp cayenne",
        "chilli powder": "¼ tsp chili powder",
        "dried chorizo": "1 pound chorizo",
        "comino": "¼ tsp cumin",
        "spring onion": "green onion tops",
        "jack cheese": "¼ cup mixed monterrey jack and cheddar cheese",
        "extra lean ground beef": "1 pound lean ground beef",
        "quinoa": "1 cup quinoa"
    },
    "tags": [
        "gluten free",
        "glutenFree",
        "veryPopular"
    ],
    "source": "spoonacular",
    "analyzeInstruction": [
        {
            "name": "",
            "steps": [
                {
                    "number": 1,
                    "step": "The first thing you will want to do is heat the oven to 350, boil the water for the quinoa, and in a separate skillet brown the beef and chorizo together.",
                    "ingredients": [
                        {
                            "id": 99233,
                            "name": "chorizo",
                            "localizedName": "chorizo",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/chorizo.jpg",
                            "_id": "665a72f5a7da0532eed01ee9"
                        },
                        {
                            "id": 20035,
                            "name": "quinoa",
                            "localizedName": "quinoa",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/uncooked-quinoa.png",
                            "_id": "665a72f5a7da0532eed01eea"
                        },
                        {
                            "id": 14412,
                            "name": "water",
                            "localizedName": "water",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/water.png",
                            "_id": "665a72f5a7da0532eed01eeb"
                        },
                        {
                            "id": 23572,
                            "name": "beef",
                            "localizedName": "beef",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/beef-cubes-raw.png",
                            "_id": "665a72f5a7da0532eed01eec"
                        }
                    ],
                    "equipment": [
                        {
                            "id": 404645,
                            "name": "frying pan",
                            "localizedName": "frying pan",
                            "image": "https://spoonacular.com/cdn/equipment_100x100/pan.png",
                            "_id": "665a72f5a7da0532eed01eed"
                        },
                        {
                            "id": 404784,
                            "name": "oven",
                            "localizedName": "oven",
                            "image": "https://spoonacular.com/cdn/equipment_100x100/oven.jpg",
                            "_id": "665a72f5a7da0532eed01eee"
                        }
                    ],
                    "_id": "665a72f5a7da0532eed01ee8"
                },
                {
                    "number": 2,
                    "step": "Drain the meat mixture well, and then place into a medium mixing bowl.Once your quinoa is fully cooked, add it to the mixing bowl.",
                    "ingredients": [
                        {
                            "id": 20035,
                            "name": "quinoa",
                            "localizedName": "quinoa",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/uncooked-quinoa.png",
                            "_id": "665a72f5a7da0532eed01ef0"
                        },
                        {
                            "id": 1065062,
                            "name": "meat",
                            "localizedName": "meat",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/whole-chicken.jpg",
                            "_id": "665a72f5a7da0532eed01ef1"
                        }
                    ],
                    "equipment": [
                        {
                            "id": 405907,
                            "name": "mixing bowl",
                            "localizedName": "mixing bowl",
                            "image": "https://spoonacular.com/cdn/equipment_100x100/mixing-bowl.jpg",
                            "_id": "665a72f5a7da0532eed01ef2"
                        }
                    ],
                    "_id": "665a72f5a7da0532eed01eef"
                },
                {
                    "number": 3,
                    "step": "Add the green onion tops, cumin, cayenne, chili powder, and monterrey jack and cheddar cheese.",
                    "ingredients": [
                        {
                            "id": 11291,
                            "name": "green onions",
                            "localizedName": "green onions",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/spring-onions.jpg",
                            "_id": "665a72f5a7da0532eed01ef4"
                        },
                        {
                            "id": 1009,
                            "name": "cheddar cheese",
                            "localizedName": "cheddar cheese",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/cheddar-cheese.png",
                            "_id": "665a72f5a7da0532eed01ef5"
                        },
                        {
                            "id": 2009,
                            "name": "chili powder",
                            "localizedName": "chili powder",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/chili-powder.jpg",
                            "_id": "665a72f5a7da0532eed01ef6"
                        },
                        {
                            "id": 2031,
                            "name": "ground cayenne pepper",
                            "localizedName": "ground cayenne pepper",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/chili-powder.jpg",
                            "_id": "665a72f5a7da0532eed01ef7"
                        },
                        {
                            "id": 1002014,
                            "name": "cumin",
                            "localizedName": "cumin",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/ground-cumin.jpg",
                            "_id": "665a72f5a7da0532eed01ef8"
                        }
                    ],
                    "equipment": [],
                    "_id": "665a72f5a7da0532eed01ef3"
                },
                {
                    "number": 4,
                    "step": "Mix well.",
                    "ingredients": [],
                    "equipment": [],
                    "_id": "665a72f5a7da0532eed01ef9"
                },
                {
                    "number": 5,
                    "step": "Cut the tops from your bell peppers and scoop out any remaining seeds.Then take your meat mixture and start stuffing the bell peppers until they are full.",
                    "ingredients": [
                        {
                            "id": 10211821,
                            "name": "bell pepper",
                            "localizedName": "bell pepper",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/bell-pepper-orange.png",
                            "_id": "665a72f5a7da0532eed01efb"
                        },
                        {
                            "id": 18082,
                            "name": "stuffing",
                            "localizedName": "stuffing",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/stuffing-mix.png",
                            "_id": "665a72f5a7da0532eed01efc"
                        },
                        {
                            "id": 93818,
                            "name": "seeds",
                            "localizedName": "seeds",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/sunflower-seeds.jpg",
                            "_id": "665a72f5a7da0532eed01efd"
                        },
                        {
                            "id": 1065062,
                            "name": "meat",
                            "localizedName": "meat",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/whole-chicken.jpg",
                            "_id": "665a72f5a7da0532eed01efe"
                        }
                    ],
                    "equipment": [],
                    "_id": "665a72f5a7da0532eed01efa"
                },
                {
                    "length": {
                        "number": 10,
                        "unit": "minutes"
                    },
                    "number": 6,
                    "step": "Sprinkle with a little cheese and then bake in the oven for about 10 minutes until the bell pepper has softened.",
                    "ingredients": [
                        {
                            "id": 10211821,
                            "name": "bell pepper",
                            "localizedName": "bell pepper",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/bell-pepper-orange.png",
                            "_id": "665a72f5a7da0532eed01f00"
                        },
                        {
                            "id": 1041009,
                            "name": "cheese",
                            "localizedName": "cheese",
                            "image": "https://spoonacular.com/cdn/ingredients_100x100/cheddar-cheese.png",
                            "_id": "665a72f5a7da0532eed01f01"
                        }
                    ],
                    "equipment": [
                        {
                            "id": 404784,
                            "name": "oven",
                            "localizedName": "oven",
                            "image": "https://spoonacular.com/cdn/equipment_100x100/oven.jpg",
                            "_id": "665a72f5a7da0532eed01f02"
                        }
                    ],
                    "_id": "665a72f5a7da0532eed01eff"
                },
                {
                    "number": 7,
                    "step": "Serve immediately.",
                    "ingredients": [],
                    "equipment": [],
                    "_id": "665a72f5a7da0532eed01f03"
                }
            ],
            "_id": "665a72f5a7da0532eed01ee7"
        }
    ],
    "id": "715523",
    "videoLink": "https://www.pinkwhen.com/chorizo-and-beef-quinoa-stuffed-pepper-recipe/",
    "description": "Chorizo and Beef Quinoa Stuffed Pepper is a <b>gluten free</b> main course. One portion of this dish contains approximately <b>51g of protein</b>, <b>37g of fat</b>, and a total of <b>685 calories</b>. This recipe serves 4 and costs $3.69 per serving. Plenty of people made this recipe, and 1254 would say it hit the spot. It is brought to you by Pink When. If you have bell peppers, chorizo, chili powder, and a few other ingredients on hand, you can make it. From preparation to the plate, this recipe takes approximately <b>30 minutes</b>. With a spoonacular <b>score of 93%</b>, this dish is super. Similar recipes include <a href=\"https://spoonacular.com/recipes/pepper-stuffed-peppers-with-chorizo-498937\">Pepper-Stuffed Peppers with Chorizo</a>, <a href=\"https://spoonacular.com/recipes/chorizo-red-pepper-stuffed-potatoes-with-roasted-garlic-aioli-22379\">Chorizo & Red Pepper Stuffed Potatoes With Roasted Garlic Aioli</a>, and <a href=\"https://spoonacular.com/recipes/quinoa-and-ground-turkey-stuffed-pepper-1318051\">QUINOAn AND GROUND TURKEY STUFFED PEPPER</a>.",
    "price": "3.6937",
    "readyInMinutes": "30",
    "servings": 4,
    "dishTypes": [
        "lunch",
        "main course",
        "main dish",
        "dinner"
    ],
    "__v": 0,
    "numberOfLiked": 0
}
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
    const [direction, setDirection] = useState("")
    const [currSlide, setCurrSlide] = useState(0)
    // const mealOptions = mealDatas.map((meal: BackendData) => ({ key: meal.title, label: meal.title }));

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

    const myVideoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef(null)
    useEffect(() => {
        if (myVideoRef.current && stream) myVideoRef.current.srcObject = stream;
    }, [stream]);

    const sendFrameToServer = async () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(myVideoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const blob = await (await fetch(dataUrl)).blob();
        
        const formData = new FormData();
        formData.append('image', blob, 'frame.jpg');
    
        try {
          const response = await axios.post('http://127.0.0.1:5000/virtual-mouse', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log("Hand gesture", response.data.action)
          switch (response.data.action){
            case 'left-arrow':
                setCurrSlide((prev) => Math.max(prev - 2, 0))
                break
            case 'right-arrow':
                setCurrSlide((prev) => prev + 2)
                break
            default:
                break
          }
        } catch (err) {
          console.error('Error sending frame to server:', err);
        }
      };
    
      useEffect(() => {
        const interval = setInterval(sendFrameToServer, 1000); 
        return () => clearInterval(interval);
      }, []);
    
    return (
        <Box height="100%" width="100%" position="relative">
            <HStack height="100%" width="100%" padding={'5px'}>
                <VStack width="full" height="full" gap={2}>
                    <Grid height={'60vh'} width="100%" templateColumns={`repeat(5,1fr)`} templateRows={`repeat(2,1fr)`}>
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
                                        />

                                        <NameInput />
                                        <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />

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
                        <GridItem gridColumn={5} gridRow={1} colSpan={1} rowSpan={2} padding={2}>
                            {/* <VStack height="full" width="90%" justifyContent={'end'}>
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
                            </VStack> */}
                        </GridItem>
                    </Grid>
                    {mockData && Object.keys(mockData).length > 0 && (
                        <HStack width={'80%'} height="40vh" flexShrink={0}>
                            {/* {mealChoice} */}
                            <ImageSlide  backendData={mockData} />
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
