import { Box, IconButton, IconButtonProps, Text, chakra } from '@chakra-ui/react';
import { isValidMotionProp, motion } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';

interface NotificationBellProps extends IconButtonProps {
  isTriggered: boolean;
  notiCount: number;
  handleClick?: () => void;
}

const MotionIconButton = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});

// const NotificationBell: React.FC<NotificationBellProps> = ({ isTriggered, handleClick, ...props }) => {
//   return (
//     <Box>
//       <MotionIconButton
//         {...props}
//         aria-label={props['aria-label'] ?? 'notification-button'}
//         icon={<Bell />}
//         onClick={handleClick}
//         animate={isTriggered ? { rotate: [0, -25, 25, -25, 25, 0] } : { rotate: 0 }}
//       >
//         {isTriggered ? <BellRing /> : <Bell />}
//       </MotionIconButton>
//     </Box>
//   );
// };
const NotificationBell = memo(function NotificationBell({
  isTriggered,
  notiCount,
  handleClick,
  ...props
}: NotificationBellProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    console.log(buttonRef.current?.offsetWidth);
  }, [buttonRef.current]);
  return (
    <Box position="relative" height="auto" width="auto">
      {notiCount && (
        <Text
          position="absolute"
          top={-2}
          right={-2}
          fontSize="sm"
          backgroundColor="red.400"
          color="white"
          fontWeight="semibold"
          rounded="full"
          paddingX="0.75em"
          paddingY="0.175em"
          zIndex={10}
        >
          {notiCount}
        </Text>
      )}
      <MotionIconButton
        width="auto"
        height="auto"
        animate={isTriggered ? { rotate: [0, -25, 25, -25, 25, 0] } : { rotate: 0 }}
      >
        <IconButton
          ref={buttonRef}
          {...props}
          aria-label={props['aria-label'] ?? 'notification-button'}
          icon={<FaBell />}
          onClick={handleClick}
          isRound={true}
        />
      </MotionIconButton>
    </Box>
  );
});

export default NotificationBell;
