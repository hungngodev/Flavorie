import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  VStack,
  MenuItem,
  MenuList,
  Button,
} from '@chakra-ui/react';
import { Check, Settings, Ellipsis } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import NotificationField from '../components/form/NotificationField.tsx';
import customFetch from '../utils/customFetch';

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
