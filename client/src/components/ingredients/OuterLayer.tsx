import { Box, IconButton, useDisclosure } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Refrigerator } from 'lucide-react';
import { useState } from 'react';
import CategorySideBar from './CategorySidebar';

type OuterLayerProps = {
  children: React.ReactNode;
  fridgeWidth: string;
};

export default function OuterLayer({ children, fridgeWidth }: OuterLayerProps) {
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
  const [hidden, setHidden] = useState(!isOpen);
  const [expanded, setExpanded] = useState(false);

  return (
    <Box position="relative">
      <IconButton
        position="absolute"
        top="0"
        right="0"
        zIndex={10}
        isRound={true}
        variant="solid"
        colorScheme="teal"
        aria-label="Done"
        fontSize="20px"
        {...getButtonProps()}
        icon={<Refrigerator />}
      />
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
        animate={{ width: isOpen ? parseInt(fridgeWidth) : 0 }}
        style={{
          backgroundColor: 'red',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          position: 'absolute',
          right: '0',
          height: '100%',
          top: '0',
        }}
      ></motion.div>
      <aside className={`flex h-screen`}>
        <CategorySideBar expanded={expanded} setExpanded={() => setExpanded((cur) => !cur)} />
        <div className="relative z-0 h-full w-full overflow-auto">
          <Box
            as={motion.div}
            onAnimationStart={() => {
              setHidden(false);
            }}
            onAnimationComplete={() => {
              setHidden(!isOpen);
            }}
            animate={{ width: isOpen ? `calc(100% - ${fridgeWidth}px)` : '100%' }}
          >
            {children}
          </Box>
        </div>
      </aside>
    </Box>
  );
}
