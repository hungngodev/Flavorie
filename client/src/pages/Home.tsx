import { Box, Button, Flex, HStack, Image, Link, Stack, Text, useTheme } from '@chakra-ui/react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Lottie from 'lottie-react';
import React from 'react';
import HerroIllustration from '..//assets/images/hero-ilustration.jpg';
import { Cooking, Ingredient, LiveVideo, Scanning, Sharing } from '../assets/animations';
import { ContainerScroll, Hero, InfiniteMovingCards, StickyScrollReveal, WavyBackground } from '../components';
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
        <div className="flex flex-col gap-10 overflow-hidden pt-10">
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
                <Stack align={'center'} py={16} as={Stack} spacing={12}>
                    <Hero title="" boldTitle="Our Client Speak" />
                </Stack>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <InfiniteMovingCards items={testimonials} direction="right" speed="fast" className="w-full" />
                </Flex>
            </Box>
            <Box>
                <Footer />
            </Box>
        </div>
    );
};

export default Main;
const testimonials = [
    {
        quote: 'The design of Flavorie really satisfied my OCD, this treatment is better my therapy.',
        name: 'Jennifer Quach',
        avatar: 'https://wallpapers-clan.com/wp-content/uploads/2022/07/funny-cat-9.jpg',
        title: 'CEO @ OCD Corporation',
    },
    {
        quote: "I'm thrilled watching the Flavorie team in total chaos. However, they always deliver the best results.",
        name: 'Khoa Thien Le',
        title: 'Angel Investor @ RisingStars',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGVJiKcTzUq_vQE6L5DtlpdWA_dEd6ApyVVA&s',
    },
    {
        quote: 'Flavorie saves my wallet from dying of DoorDash orders and unknown expiring ingredients.',
        name: 'Phuong Cao',
        title: 'CTO @ One Member Corporation',
        avatar: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c2047868-eb3f-45a9-84ac-a12510bfedd9/dffyhn4-46435934-6190-41c1-af0d-8a3f01d36e1a.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2MyMDQ3ODY4LWViM2YtNDVhOS04NGFjLWExMjUxMGJmZWRkOVwvZGZmeWhuNC00NjQzNTkzNC02MTkwLTQxYzEtYWYwZC04YTNmMDFkMzZlMWEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.aITSRWznS7RYgbZJ3iAv6WEmR02Ypc_rRgt4gbyKv6U',
    },
    {
        quote: 'What an amazing time to go to the market and buy some fresh ingredients through Flavorie.',
        name: 'Hung Ngo',
        title: 'Lead Developer @ Flavorie',
        avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJVnfcMhqVA5LInxdEgbrUctiXdhk_v5KJI0tZh08bzxevVX8k5=s576-c-no',
    },
];
