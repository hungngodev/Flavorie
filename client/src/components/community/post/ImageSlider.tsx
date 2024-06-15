import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Box, Button, Flex, Progress, VStack, useMediaQuery, useTheme, IconButton, HStack } from '@chakra-ui/react';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion, useAnimation, useMotionValue, useAnimationControls, Transition } from 'framer-motion';
import { set } from 'lodash';
import { chakra } from '@chakra-ui/react';

interface ImageSliderProps {
  children: React.ReactNode[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideShift = useAnimationControls();
  let activeIndex = 0;

  useEffect(() => {
    if (containerRef.current) {
      setChildrenCount(containerRef.current.childNodes.length);
      setWindowWidth(containerRef.current.clientWidth);
      console.log(`children count: ${childrenCount}`);
      console.log(`full length: ${containerRef.current.clientWidth}`);
      console.log(`window length: ${containerRef.current.clientWidth / childrenCount}`);
    }
  }, []);

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
    console.log('here');
  }, [currentIndex]);

  const handleNextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, childrenCount - 1));
    console.log(currentIndex);
  };
  const handlePrevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    console.log(currentIndex);
  };
  return (
    <Box position="relative">
      <HStack w="auto" m={0} p={0} gap={0} as={motion.div} ref={containerRef} animate={slideShift}>
        {children}
      </HStack>
      <IconButton
        aria-label="previous-image-button"
        icon={<ChevronLeftIcon />}
        onClick={handlePrevSlide}
        position="absolute"
        top="50%"
        left={0}
      />
      <IconButton
        aria-label="next-image-button"
        icon={<ChevronRightIcon />}
        onClick={handleNextSlide}
        position="absolute"
        top="50%"
        right={0}
      />
    </Box>
  );
};
export default ImageSlider;
