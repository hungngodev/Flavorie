import {
    Box,
    Button,
    Container,
    Flex,
    Icon,
    Stack,
    Text,
    createIcon,
    useColorModeValue,
    HStack,
    Image,
    useTheme,
    Link,
} from '@chakra-ui/react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Lottie from 'lottie-react';
import React from 'react';
import { Cooking, Ingredient, LiveVideo, Scanning, Sharing } from '../assets/animations';
import { ContainerScroll, Hero, StickyScrollReveal, Testimonials, WavyBackground } from '../components';
import HerroIllustration from '../../public/images/hero-ilustration.jpg';
const content = [
    {
        title: 'Browsing your recipes',
        description:
            'Browse through your recipes with ease. Our platform allows you to search, filter, and organize your recipes in a way that makes sense to you. Say goodbye to the days of endless scrolling and hello to a more efficient way of finding your favorite recipes.',
        content: (
            <Lottie
                animationData={Cooking}
                style={{ height: 300 }}
                interactivity={{
                    mode: 'scroll',
                    actions: [
                        {
                            visibility: [0, 0.2],
                            type: 'stop',
                            frames: [0],
                        },
                        {
                            visibility: [0.2, 0.8],
                            type: 'seek',
                            frames: [0, 100],
                        },
                        {
                            visibility: [0.8, 1],
                            type: 'stop',
                            frames: [100],
                        },
                    ],
                }}
            />
        ),
    },
    {
        title: 'Choosing your ingredients',
        description:
            'Choose your ingredients wisely. Our platform provides you with a variety of options to choose from, ensuring that you always have the freshest ingredients at your disposal. Say goodbye to the days of running out of ingredients and hello to a more organized way of cooking.',
        content: <Lottie animationData={Ingredient} loop={true} style={{ height: 300 }} />,
    },
    {
        title: 'Upload your receipts or your fridge',
        description:
            'Upload your receipts or your fridge. Our platform allows you to upload your receipts or take a picture of your fridge, so you always know what ingredients you have on hand. Say goodbye to the days of guessing and hello to a more accurate way of planning your meals.',
        content: <Lottie animationData={Scanning} loop={true} style={{ height: 300 }} />,
    },
    {
        title: 'Share with community',
        description:
            'Share with the community. Our platform allows you to share your recipes with the community, so you can inspire others to cook delicious meals. Say goodbye to the days of cooking alone and hello to a more social way of cooking.',
        content: <Lottie animationData={Sharing} loop={true} style={{ height: 300 }} />,
    },
    {
        title: 'Live video cooking',
        description:
            'Live video cooking. Our platform allows you to watch live cooking videos, so you can learn new recipes and techniques. Say goodbye to the days of watching cooking shows and hello to a more interactive way of learning.',
        content: <Lottie animationData={LiveVideo} loop={true} style={{ height: 300 }} />,
    },
];

const Main: React.FC = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollYProgress = useSpring(
        useScroll({
            target: containerRef,
        }).scrollYProgress,
    );
    const theme = useTheme();
    const translate = useTransform(scrollYProgress, [0, 1], [-50, -300]);
    return (
        <div className="flex flex-col overflow-hidden">
            <Box as={motion.div} style={{ translateY: translate }}>
                <WavyBackground backgroundFill="white" id="here" width="100%">
                    <Box width="100%">
                        <HStack
                            transform="translateY(22dvh)"
                            as={Box}
                            textAlign={'center'}
                            spacing={{ base: 8, md: 14 }}
                            // py={{ base: 20, md: 36 }}
                            px={{ base: 0, lg: 12 }}
                            backgroundColor="rgba(255, 255, 255, 0.45)"
                            marginInline="auto"
                            height={{ base: '100%', lg: '80dvh' }}
                            width={{ base: '100%', md: '90%', lg: '75%' }}
                            borderRadius="4em"
                            // Semi-transparent background
                            backdropFilter="blur(10px)"
                            shadow="2xl"
                        >
                            <Box>
                                <Box gap={0}>
                                    <Hero title="Welcome to " boldTitle="Flavorie" />
                                    <Text>Creating flavors, sharing love</Text>
                                </Box>

                                <Stack
                                    marginTop={12}
                                    direction={'column'}
                                    spacing={3}
                                    align={'center'}
                                    alignSelf={'center'}
                                    position={'relative'}
                                >
                                    <Button
                                        bg={theme.colors.palette_purple}
                                        color="white"
                                        rounded={'full'}
                                        px={6}
                                        _hover={{
                                            filter: 'brightness(0.95)',
                                            boxShadow: 'lg',
                                        }}
                                        size="lg"
                                    >
                                        <Link href="/ingredients">Get Started</Link>
                                    </Button>

                                    {/* <Box>
                                        <Icon
                                            as={Arrow}
                                            color={useColorModeValue('gray.800', 'gray.300')}
                                            w={71}
                                            position={'absolute'}
                                            right={-71}
                                            top={'10px'}
                                        />
                                        <Text
                                            fontSize={'lg'}
                                            fontFamily={'Caveat'}
                                            position={'absolute'}
                                            right={'-5px'}
                                            top={'-15px'}
                                            transform={'rotate(10deg)'}
                                        >
                                            It's 100% free
                                        </Text>
                                    </Box> */}
                                </Stack>
                            </Box>
                            <Box height="auto">
                                <Image
                                    src={HerroIllustration}
                                    objectFit="contain"
                                    maxHeight="70dvh"
                                    rounded="xl"
                                    shadow="dark-lg"
                                />
                            </Box>
                        </HStack>
                    </Box>
                </WavyBackground>
            </Box>
            <div>
                <ContainerScroll titleComponent={<Hero title="" boldTitle="Our features" />}>
                    <StickyScrollReveal content={content} />
                </ContainerScroll>
            </div>
            <Box as={motion.div} style={{ translateY: translate }}>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <Testimonials />
                </Flex>
            </Box>
        </div>
    );
};

export default Main;

const Arrow = createIcon({
    displayName: 'Arrow',
    viewBox: '0 0 72 24',
    path: (
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
            fill="currentColor"
        />
    ),
});
