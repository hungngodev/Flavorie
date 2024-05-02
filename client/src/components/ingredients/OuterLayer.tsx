import { Box, useDisclosure } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

type OuterLayerProps = {
  children: React.ReactNode;
  width: string;
};

export default function OuterLayer({ children, width }: OuterLayerProps) {
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
  const [hidden, setHidden] = useState(!isOpen);

  return (
    <Box position="relative">
      <button {...getButtonProps()}>Toggle Fridge</button>
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
        animate={{ width: isOpen ? parseInt(width) : 0 }}
        style={{
          backgroundColor: 'red',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          position: 'absolute',
          right: '0',
          height: '100%',
          top: '0',
        }}
      >
        <button {...getButtonProps()}>Toggle12312312312</button>
      </motion.div>
      <Box
        as={motion.div}
        onAnimationStart={() => {
          setHidden(false);
        }}
        onAnimationComplete={() => {
          setHidden(!isOpen);
        }}
        animate={{ width: isOpen ? `calc(100% - ${width}px)` : '100%' }}
      >
        {children}
      </Box>
    </Box>
  );
}
