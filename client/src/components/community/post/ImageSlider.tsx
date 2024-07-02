import React, { useEffect, useRef, useState } from 'react';

import { Box, Button, HStack, Icon, IconButton, Image, StackProps } from '@chakra-ui/react';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion, useAnimationControls } from 'framer-motion';
import { X } from 'lucide-react';
import { GoDotFill } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { BasePostProps, MediaObjectType } from './types';

interface ImageSliderProps extends StackProps, BasePostProps {
  slides: MediaObjectType[];
  onClose?: (arg?: any) => void;
  action: 'display' | 'direct';
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  children,
  slides,
  onClose,
  postId,
  action,
  postIndex,
  postData,
  ...props
}) => {
  const navigate = useNavigate();
  const [imageSlides, setImageSlides] = useState<MediaObjectType[]>(slides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const childrenContainerRef = useRef<HTMLDivElement | null>(null);
  const slideShift = useAnimationControls();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setWindowWidth(containerRef.current.clientWidth);
        if (childrenContainerRef.current) {
          setChildrenCount(imageSlides.length);
        }
      }
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  useEffect(() => {
    setImageSlides(slides);
    setChildrenCount(slides.length);
  }, [slides]);

  useEffect(() => {
    slideShift.start({
      x: -currentIndex * windowWidth,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 60,
        mass: 3,
      },
    });
  }, [currentIndex, childrenCount]);

  const handleNextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, childrenCount - 1));
  };
  const handlePrevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Box
      position="relative"
      // backgroundImage={slides[currentIndex]?.url.toString()}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      ref={containerRef}
      rounded="lg"
      id="image-slider-container"
    >
      <Box
        position="relative"
        overflow="hidden"
        rounded="lg"
        // background="transparent"
        // backdropFilter="blur(30px) brightness(0.65)"
        id="image-slider-background"
      >
        <HStack m={0} p={0} gap={0} as={motion.div} animate={slideShift} alignItems="center" ref={childrenContainerRef}>
          {imageSlides.map((slide, index) => (
            <Box key={index} flex="0 0 auto" width={`${windowWidth}px`} marginInline="auto" rounded="lg">
              {slide.type === 'image' ? (
                <Image
                  key={`${slide.url}-${index}`}
                  src={slide.url}
                  alt={slide.description ?? `post-image - ${slide.url} - ${index}`}
                  objectFit="cover"
                  justifySelf="center"
                  alignSelf="center"
                  marginInline="auto"
                  zIndex={2}
                  rounded="lg"
                  maxHeight="80dvh"
                  maxWidth="60dvw"
                  cursor="pointer"
                  onClick={
                    action === 'direct'
                      ? () => navigate(`/community/${postId}?index=${postIndex}`, { state: { post: postData } })
                      : () => {}
                  }
                />
              ) : (
                <Box
                  as="video"
                  key={`${slide.url}-${index}`}
                  src={slide.url}
                  controls
                  objectFit="cover"
                  justifySelf="center"
                  alignSelf="center"
                  marginInline="auto"
                  zIndex={2}
                  rounded="lg"
                  maxHeight="100%"
                  width="100%"
                />
              )}
            </Box>
          ))}
        </HStack>
        {childrenCount > 1 && (
          <HStack
            rounded="lg"
            gap={0}
            position="absolute"
            bottom={0}
            marginBottom={2}
            paddingX={2}
            right="50%"
            transform="translateX(50%)"
            id="count"
            backgroundColor="blackAlpha.700"
          >
            {[...Array(Math.min(childrenCount, 10))].map((_, index) => (
              <Icon
                as={GoDotFill}
                key={index}
                fontSize="lg"
                color={index === Math.min(currentIndex, Math.min(childrenCount, 10)) ? 'white' : 'gray.400'}
                marginInline={0}
                opacity={0.85}
              />
            ))}
          </HStack>
        )}
        {onClose && (
          <Button
            onClick={(e) => {
              onClose(currentIndex);
              setCurrentIndex((cur) => Math.max(cur - 1, 0));
            }}
            leftIcon={<X />}
            position="absolute"
            top={1}
            right={1}
          >
            Remove
          </Button>
        )}
      </Box>

      {childrenCount > 1 && (
        <IconButton
          aria-label="previous-image-button"
          icon={<ChevronLeftIcon fontSize={'1.25em'} color="white" />}
          onClick={handlePrevSlide}
          position="absolute"
          top="50%"
          left={0}
          isRound={true}
          size="lg"
          opacity={0.75}
          ml={2}
          isDisabled={currentIndex === 0}
          backgroundColor="blackAlpha.500"
          _hover={{ backgroundColor: 'blackAlpha.700' }}
          _active={{ backgroundColor: 'blackAlpha.700' }}
        />
      )}
      {childrenCount > 1 && (
        <IconButton
          aria-label="next-image-button"
          icon={<ChevronRightIcon fontSize={'1.25em'} color="white" />}
          onClick={handleNextSlide}
          position="absolute"
          top="50%"
          right={0}
          isRound={true}
          size="lg"
          opacity={0.75}
          mr={2}
          isDisabled={currentIndex === childrenCount - 1}
          backgroundColor="blackAlpha.500"
          _hover={{ backgroundColor: 'blackAlpha.700' }}
          _active={{ backgroundColor: 'blackAlpha.700' }}
        />
      )}
    </Box>
  );
};
export default ImageSlider;
