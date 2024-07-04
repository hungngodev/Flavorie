import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, HStack, IconButton, Link, Text, VStack } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Notification } from '../../contexts/NotificationContext';
import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import theme from '../../style/theme';

const NotificationBell = () => {
    const { notifications, markAsRead, deleteNotification, fetchNotificationById } = useNotification();
    const auth = useAuth();
    const [showData, setShowData] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const handleClick = async (notification: Notification) => {
        const notificationId = notification._id;
        setShowData(showData === notificationId ? null : notificationId);
        if (!notification.status) {
            markAsRead(notificationId);
        }
        const data = await fetchNotificationById(notificationId);
        if (data) {
            navigate(`/receipts/${notificationId}`);
        }
    };

    const handleDelete = (notification: Notification) => {
        deleteNotification(notification._id);
    };

    useEffect(() => {
        if (auth.currentUser.status === 'authenticated') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [auth.currentUser.status]);

    return (
        <Box p={2} position="relative" mt="2.5" w="342px">
            <Heading fontWeight="bold" size="md" mb={3} textAlign="left">
                Notifications
            </Heading>
            <VStack spacing={2} align="stretch" w="100%">
                {isAuthenticated && notifications.length > 0 ? (
                    notifications.map((noti) => (
                        <Button
                            key={noti._id}
                            p={2}
                            py="8"
                            bg={theme.colors.white_purple}
                            borderRadius="md"
                            boxShadow="md"
                            display="flex"
                            textAlign="left"
                            justifyContent="space-between"
                            alignItems="center"
                            _hover={{ bg: "base.50" }}
                        >
                            <HStack textAlign="left" w="100%" justify="space-between">
                                <Box flex="1">
                                    <Link as={RouterLink} ml="0" onClick={() => handleClick(noti)}>
                                        <Text color="black" fontSize="14" fontWeight={noti.status ? 'normal' : 'bold'}>
                                            {noti.message.title}
                                        </Text>
                                        <Text color="gray" fontSize="14">
                                            {formatDistanceToNow(new Date(noti.timestamp), { addSuffix: true })}
                                        </Text>
                                    </Link>
                                </Box>
                                <IconButton
                                    aria-label="Delete notification"
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    onClick={() => handleDelete(noti)}
                                    color="white"
                                    bg={theme.colors.palette_indigo}
                                />
                            </HStack>
                        </Button>
                    ))
                ) : (
                    <Text textAlign="center" color="gray">
                        No notifications found
                    </Text>
                )}
            </VStack>
        </Box>
    );
};

export default NotificationBell;
