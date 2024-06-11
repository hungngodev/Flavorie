import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
} from '@chakra-ui/react';
import { Check, Ellipsis, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import NotificationBell from '../components/notification/NotificationBell.tsx';
import NotificationField from '../components/notification/NotificationField.tsx';
export type NotificationType = {
  header: string;
  body: string;
  date: Date;
};

const notificationMenu = [
  { name: 'Mark all as read', icon: <Check /> },
  { name: 'Settings', icon: <Settings /> },
];

export const mockData: NotificationType[] = [
  {
    header: 'Welcome!',
    body: 'Thank you for joining our platform.',
    date: new Date(),
  },
  {
    header: 'Update Available',
    body: 'A new update has been released. Please update your application.',
    date: new Date(),
  },
  {
    header: 'Maintenance Notice',
    body: 'Scheduled maintenance will occur on March 1st, 2024 from 2:00 AM to 4:00 AM UTC.',
    date: new Date('2024-03-01T02:00:00Z'),
  },
  {
    header: 'Maintenance Notice',
    body: 'Scheduled maintenance will occur on March 1st, 2024 from 2:00 AM to 4:00 AM UTC.',
    date: new Date('2024-03-01T02:00:00Z'),
  },
  {
    header: 'Maintenance Notice',
    body: 'Scheduled maintenance will occur on March 1st, 2024 from 2:00 AM to 4:00 AM UTC.',
    date: new Date('2024-03-01T02:00:00Z'),
  },
  {
    header: 'Maintenance Notice',
    body: 'Scheduled maintenance will occur on March 1st, 2024 from 2:00 AM to 4:00 AM UTC.',
    date: new Date('2024-03-01T02:00:00Z'),
  },
  {
    header: 'Maintenance Notice',
    body: 'Scheduled maintenance will occur on March 1st, 2024 from 2:00 AM to 4:00 AM UTC.',
    date: new Date('2024-03-01T02:00:00Z'),
  },
  {
    header: 'Maintenance Notice',
    body: 'Scheduled maintenance will occur on March 1st, 2024 from 2:00 AM to 4:00 AM UTC.',
    date: new Date('2024-03-01T02:00:00Z'),
  },
  {
    header: 'Maintenance Notice',
    body: 'Scheduled maintenance will occur on March 1st, 2024 from 2:00 AM to 4:00 AM UTC.',
    date: new Date('2024-03-01T02:00:00Z'),
  },
];

const isOverflow = (containerRef: HTMLDivElement | null) => {
  if (containerRef) {
    return containerRef.scrollHeight > containerRef.offsetHeight;
  }
  return false;
};

const Notification = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [notificationList, setNotificationList] = useState<NotificationType[]>(mockData);
  const [resizeButton, setResizeButton] = useState<boolean>(isOverflow(containerRef.current));
  const [trigger, setTrigger] = useState<boolean>(false);
  //   useEffect(() => {
  //     const getAllNoti = async () => {
  //       const notiReq = await customFetch.get('/notification');
  //       setNotificationList(notiReq.data);
  //     };
  //     getAllNoti();
  //   }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setResizeButton(isOverflow(containerRef.current));
  }, []);

  // const ringAnimation: AnimationDefinition<string & {}> | undefined = {
  //   rotate: [0, -25, 25, -25, 25, 0],
  //   transition: { duration: 0.5, type: 'spring', stiffness: 300 },
  // };

  const OpenButton = () => {
    return (
      <HStack
        width="100%"
        boxShadow="sm"
        backgroundColor="white"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        bottom={0}
        borderTop="1px"
        borderColor="blackAlpha.500"
        paddingBlock="2.5em"
      >
        <NotificationBell
          color="blackAlpha.700"
          boxSize="1.75em"
          fontSize="2.25em"
          notiCount={2}
          isTriggered={true}
          aria-label="notification-button"
          backgroundColor="gray.50"
          isRound={true}
        />
        <Button
          variant="ghost"
          color="teal.500"
          fontSize="2xl"
          fontWeight="semibold"
          lineHeight={4}
          _hover={{ background: 'transparent', color: 'teal.600' }}
          onClick={() => {
            setResizeButton(!resizeButton);
            console.log('resizeButton', resizeButton);
          }}
        >
          See All Notifications
        </Button>
      </HStack>
    );
  };

  return (
    <VStack
      height="100dvh"
      width="100%"
      backgroundColor="blackAlpha.50"
      alignItems="center"
      justifyContent="center"
      ref={containerRef}
      overflow={resizeButton ? 'hidden' : 'auto'}
    >
      <Card
        width={{ base: '100%', md: '80%', lg: '70%' }}
        minHeight="100%"
        backgroundColor="whiteAlpha.800"
        boxShadow="md"
        position="relative"
      >
        <CardHeader>
          <HStack width="100%" justifyContent="space-between" color="blackAlpha.700">
            <Heading size="xl" fontWeight="bold">
              Notifications
            </Heading>
            <Menu>
              <MenuButton as={IconButton} icon={<Ellipsis />} background="none" color="blackAlpha.700" isRound={true} />
              <MenuList>
                {notificationMenu.map((menu) => {
                  return <MenuItem icon={menu.icon}>{menu.name}</MenuItem>;
                })}
              </MenuList>
            </Menu>
          </HStack>
        </CardHeader>
        <Divider />
        <CardBody padding={0}>
          <VStack alignItems="start" gap={0}>
            {notificationList.map((noti, index) => {
              return (
                <NotificationField
                  isRead={index % 4 === 0 ? true : false}
                  notification={noti}
                  alignItems="start"
                  backgroundColor={index % 4 === 0 ? 'transparent' : 'gray.200'}
                  width="100%"
                  paddingBlock={4}
                  paddingRight={4}
                  flexDirection="row"
                  borderBottom="1px"
                  borderColor="gray.200"
                  headerProps={{ fontSize: '2xl', color: 'blackAlpha.700', fontWeight: 'semibold' }}
                  bodyProps={{ fontSize: 'xl', color: 'blackAlpha.600', noOfLines: 1 }}
                />
              );
            })}
          </VStack>
          {resizeButton && <OpenButton />}
        </CardBody>
      </Card>
    </VStack>
  );
};
export default Notification;
