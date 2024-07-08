import { Box, Button, Flex, HStack, Image, Link, Stack, Text, useTheme } from '@chakra-ui/react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Lottie from 'lottie-react';
import React from 'react';
import HerroIllustration from '../../public/images/hero-ilustration.jpg';
import { Cooking, Ingredient, LiveVideo, Scanning, Sharing } from '../assets/animations';
import { ContainerScroll, Hero, StickyScrollReveal, Testimonials, WavyBackground } from '../components';
import Footer from '../components/nav/Footer';

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
            <Box>
                <Footer />
            </Box>
        </div>
    );
};

export default Main;
