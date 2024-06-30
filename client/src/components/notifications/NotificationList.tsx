import useNotification from "../../hooks/useNotification.tsx";
import  useAuth  from "../../hooks/useAuth.tsx";
import { useState, useEffect } from "react";
import { Notification } from "../../contexts/NotificationContext.tsx";
import { Box, Button, Text, Heading, VStack, IconButton, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from 'date-fns';

const NotificationList = () => {
    const {notifications, markAsRead, deleteNotification, fetchNotificationById} = useNotification()
    const auth= useAuth()
    const [showData, setShowData] = useState<string | null>(null)
    const [isAutheticate, setIsAuthenticate] = useState(false)
    const navigate  = useNavigate()
    const handleClick = async (notification: Notification) => {
        const notificationId = notification._id;
        setShowData(showData === notificationId ? null : notificationId);
        if (!notification.status) {
            markAsRead(notificationId);
        }
        const data = await fetchNotificationById(notificationId)
        if (data){
            navigate(`/receipts/${notificationId}`)
        }
    };

    const handleDelete = (notification: Notification) => {
        deleteNotification(notification._id);
    };

    useEffect(() => {
        if (auth.currentUser.status === 'authenticated'){
            setIsAuthenticate(true)
        } else {
            setIsAuthenticate(false)
        }
    }, [auth.currentUser.status])

    return (
        <Box p={4} maxW="lg" mx="auto" mt= "2.5" bg="gray.100" borderRadius="lg" boxShadow="md">
            <Heading fontWeight="bold" size="lg" mb={4} textAlign="left">
                Notifications 
            </Heading>
            <VStack spacing={4} align="stretch">
                {isAutheticate && notifications.length > 0 ? (
                    notifications.map((noti) => (
                        <Button
                            key={noti._id}
                            p={4}
                            bg="white"
                            borderRadius="md"
                            boxShadow="md"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            _hover={{ bg: "gray.50" }}
                        >
                            <Box flex="1" textAlign="left" >
                                
                                    <Link as={RouterLink} onClick={() => handleClick(noti)}>
                                        <Text fontWeight={noti.status ? "normal" : "bold"}>
                                            {noti.message.title}
                                        </Text>
                                        <Text>
                                        {formatDistanceToNow(new Date(noti.timestamp), { addSuffix: true })}
                                        </Text>
                                    </Link>
                                </Box>
                            
                            
                            <IconButton
                                aria-label="Delete notification"
                                icon={<DeleteIcon />}
                                size="sm"
                                onClick={() => handleDelete(noti)}
                                colorScheme="red"
                                ml={2}
                            />
                        </Button>
                    ))
                ) : (
                    <Text textAlign="center">No notifications found</Text>
                )}
            </VStack>
        </Box>
    )
}
export default NotificationList
