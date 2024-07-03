import { Badge, Box, Button, Flex, Heading, Link, useTheme } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

const AutoSlider = ({
    images,
    overlay = true,
    overlayClassName,
    className,
    autoplay = true,
    direction = 'up',
}: {
    images: {
        id: string;
        image: string;
        title: string;
        tags: string[];
    }[];
    overlay?: React.ReactNode;
    overlayClassName?: string;
    className?: string;
    autoplay?: boolean;
    direction?: 'up' | 'down';
}) => {
    const theme = useTheme();
    console.log(theme);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState<string[]>([]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1 === images.length ? 0 : prevIndex + 1));
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1));
    };
    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = () => {
        const loadPromises = images.map((image) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = image.image;
                img.onload = () => resolve(image);
                img.onerror = reject;
            });
        });

        Promise.all(loadPromises)
            .then((loadedImages) => {
                setLoadedImages(loadedImages as string[]);
            })
            .catch((error) => console.error('Failed to load images', error));
    };
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') {
                handleNext();
            } else if (event.key === 'ArrowLeft') {
                handlePrevious();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // autoplay
        let interval: NodeJS.Timeout;
        if (autoplay) {
            interval = setInterval(() => {
                handleNext();
            }, 5000);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(interval);
        };
    }, []);

    const slideVariants = {
        initial: {
            scale: 0,
            opacity: 0,
            rotateX: 45,
        },
        visible: {
            scale: 1,
            rotateX: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.645, 0.045, 0.355, 1.0],
            },
        },
        upExit: {
            opacity: 1,
            y: '-150%',
            transition: {
                duration: 1,
            },
        },
        downExit: {
            opacity: 1,
            y: '150%',
            transition: {
                duration: 1,
            },
        },
    };
    const areImagesLoaded = loadedImages.length > 0;
    return (
        <div
            className={cn(
                'neomorphic-banner relative flex h-full w-full items-center justify-center overflow-hidden ',
                className,
            )}
            style={{
                perspective: '1000px',
            }}
        >
            {areImagesLoaded && overlay && (
                <div className={cn('absolute left-20 z-40', overlayClassName)}>
                    <motion.div
                        initial="initial"
                        animate="visible"
                        exit={direction === 'up' ? 'upExit' : 'downExit'}
                        variants={slideVariants}
                    >
                        <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" justifyContent="center">
                            <Box ml={{ md: '4' }} textAlign="left">
                                <Heading as="h3" size="3xl" color="white" mb="4" width="40vw" className="text-wrap">
                                    {images[currentIndex].title}
                                </Heading>
                                <Link href={images[currentIndex].id}>
                                    <Button
                                        textAlign="center"
                                        borderRadius="full"
                                        px="4"
                                        py="2"
                                        colorScheme="teal"
                                        fontSize="md"
                                        mb="4"
                                    >
                                        Cook now
                                    </Button>
                                </Link>
                                <Flex gap="2">
                                    {images[currentIndex].tags?.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            borderRadius="full"
                                            px="4"
                                            py="2"
                                            variant="outline"
                                            textAlign="center"
                                            bgColor={theme.colors.palette_pink}
                                            color={'white'}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </Flex>
                            </Box>
                        </Flex>
                    </motion.div>
                </div>
            )}
            {areImagesLoaded && (
                <AnimatePresence>
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex].image}
                        initial="initial"
                        animate="visible"
                        exit={direction === 'up' ? 'upExit' : 'downExit'}
                        variants={slideVariants}
                        className=" image absolute  right-0  z-40  rounded-3xl object-contain object-right"
                    />
                    {/* <motion.div
                        className="  absolute    z-30 h-full w-full rounded-3xl"
                        // initial="initial"
                        // animate="visible"
                        // exit={direction === 'up' ? 'upExit' : 'downExit'}
                        // variants={slideVariants}
                    ></motion.div> */}
                </AnimatePresence>
            )}
        </div>
    );
};

export default AutoSlider;
