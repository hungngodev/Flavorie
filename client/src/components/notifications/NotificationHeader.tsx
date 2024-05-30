import useNotification from "../../hooks/useNotification";
import  useAuth  from "../../hooks/useAuth.tsx";
import { useState, useEffect } from "react";
import { Notification } from "../../contexts/NotificationContext.tsx";
import { Badge, Box, Button, Flex, Text, Heading, VStack, IconButton, Menu, MenuButton, MenuList, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";

const NotificationHeader = () => {
    const {notifications, numberOfNotifications, markAsRead, deleteNotification, fetchNotificationById, unreadNotifications} = useNotification()
    const auth= useAuth()
    const [showData, setShowData] = useState<string | null>(null)
    const [isAutheticate, setIsAuthenticate] = useState(false)

    
    const handleClick = (notification: Notification) => {
        const notificationId = notification._id;
        setShowData(showData === notificationId ? null : notificationId);
        if (!notification.status) {
            markAsRead(notificationId);
        }
        fetchNotificationById(notificationId)
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
                            <Box flex="1" textAlign="left">
                                    <Link as={RouterLink}to={`/notifications/${noti._id}`} onClick={() => handleClick(noti)}>
                                        <Text fontWeight={noti.status ? "normal" : "bold"}>
                                            {noti.message.title}
                                        </Text>
                                    </Link>
                                </Box>
                            
                            {/* <IconButton
                                aria-label="Mark as read"
                                icon={<CheckIcon />}
                                size="sm"
                                onClick={() => markAsRead(noti._id)}
                                colorScheme="green"
                                ml={2}
                            /> */}
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
        // <>
        // {isAutheticate && numberOfNotifications > 0 ? (
        //     <Flex direction="column" justifyContent="center" alignItems="center" height="100vh" width="100%">
        //         <Box
        //         bg="gray.200"
        //         borderRadius="lg"
        //         boxShadow="md"
        //         maxW="md"
        //         textAlign="center"
        //         width="100%"
        //         mt="0.75"
        //         >
        //         <Heading size="lg" mb={4} textAlign="center">Notifications</Heading>
        //         <ul>
        //                     {notifications.map((noti) => (
        //                         <li key={noti._id}>
        //                         <button onClick={() => handleClick(noti)}>
        //                          {noti.message.title}
        //                         </button>

        //                         <button onClick={() => handleDelete(noti)}>
        //                              Delete
        //                          </button>
        //                          {showData === noti._id && (
        //                              <div>
        //                                  {renderData(noti.message.data)}
        //                              </div>
        //                          )}
        //                       </li> 
                                

        //                     ))}
        //                 </ul>
        //     </Box>
        //     </Flex>
            
        //     // <Button>
        //     // <Badge>{numberOfNotifications}</Badge>
        //     // </Button>
        // ) : (
        //     <div>
        //         No notification
        //     </div>
        // )}
        // </>
        
    )
    // return (
    //     <div>
    //         {isAutheticate ? (
    //             <div>
    //                 <div>Number of notifications: {numberOfNotifications}</div>
    //                 <div>
    //                     Notification List:
    //                     <ul>
    //                         {notifications.map((noti) => (
    //                            <li key={noti._id}>
    //                             <button onClick={() => handleClick(noti)}>
    //                                 {noti.message.title}
    //                             </button>

    //                             <button onClick={() => handleDelete(noti)}>
    //                                 Delete
    //                             </button>
    //                             {showData === noti._id && (
    //                                 <div>
    //                                     {renderData(noti.message.data)}
    //                                 </div>
    //                             )}
    //                            </li> 
                                

    //                         ))}
    //                     </ul>
    //                 </div>
    //             </div>
    //         ) : (
    //             <div>No notification</div>
    //         )}
    //     </div>
    // )


}
export default NotificationHeader
// import { toast } from "react-toastify";
// import useAuth from "../../hooks/useAuth.tsx";
// import socket from '../../socket/socketio.tsx';
// import { useState, useEffect } from "react";
// import axios from "axios";

// type Notification = {
//     _id: string;
//     userId: string;
//     status: boolean;
//     message: {
//         title: string;
//         data?: object;
//     };
//     timestamp: Date;
// };
// const NotificationHeader = () => {
//     const [numberNotifications, setNumberNotifications] = useState(0)
//     const [notifications, setNotifications] = useState<Notification[]>([])
//     const [showData, setShowData] = useState<string | null>(null)
//     const {currentUser} = useAuth()
//     const [isAutheticate, setIsAuthenticate] = useState(false)

//     const renderData = (data: any) => {
//         if (typeof data === 'object' && data !== null) {
//             return JSON.stringify(data, null, 2);
//         }
//         return data;
//     };

//     const handleClick = (notification: Notification) => {
//         const notificationId = notification._id
//         setShowData(showData === notificationId ? null : notificationId)
//         if (!notification.status){
//             socket?.emit('markRead', notificationId)
//         }
//     }

//     const handleDelete = (notification: Notification) => {
//         const notificationId = notification._id
//         socket?.emit('deleteNotification', notificationId)
//     }

//     useEffect(() => {
//         const fetchNotifications = async () => {
//             try {
//                 const cntResponse = await axios.get('http://localhost:5100/api/user/notifications/cnt', {withCredentials: true})
//                 setNumberNotifications(cntResponse.data.count)

//                 const notiResponse = await axios.get('http://localhost:5100/api/user/notifications', {withCredentials: true})
//                 setNotifications(notiResponse.data.notifications)
//             } catch(error) {
//                 toast.error('Failed to display notifications')
//             }
//         }
//         if (currentUser.status === 'authenticated'){
//             setIsAuthenticate(true)
//             fetchNotifications()
//         } else {
//             console.log(currentUser.status)
//             toast.warn('Please log in to view notifications')
//             setIsAuthenticate(false)
//         }
//     }, [currentUser.status])

//     useEffect(() => {
//         socket?.on('updateNotificationRead', (notificationId) => {
//             setNotifications((prevNotis) => 
//                 prevNotis.map((noti) => (noti._id === notificationId ? {...noti, status: true} : noti)))
//             setNumberNotifications((prevCount) => prevCount - 1)
//         })
//         socket?.on('updateNotificationDelete', (notificationId, wasUnread) => {
//             setNotifications((prevNotis) => 
//                 prevNotis.filter((noti) => noti._id !== notificationId)
//             )
//             if (wasUnread){
//                 setNumberNotifications((prevCount) => prevCount - 1)

//             }
//         })
//         return () => {
//             socket?.off('updateNotificationRead')
//             socket?.off('updateNotificationDelete')
//         }
//     }, [])


//     useEffect(() => {
//         if (isAutheticate){
//             socket?.on('countNotification', (cnt) => {
//                 setNumberNotifications(cnt)
//             })
//             socket?.on('displayNotifications', (allNotifications: Notification[]) => {
//                 setNotifications(allNotifications);
//             });
//         }
//         return () => {
//             socket?.off('countNotification')
//             socket?.off('displayNotifications')
//         }
//     }, [isAutheticate])

    

//     return (
//             <div>
//                 {isAutheticate && (
//                 <div>
//                     <div>Number of notifications: {numberNotifications}</div>
//                     <div>
//                         Notification List:
//                         <ul>
//                             {notifications.map((noti) => (
//                                <li key={noti._id}>
//                                 <button onClick={() => handleClick(noti)}>
//                                     {noti.message.title}
//                                 </button>

//                                 <button onClick={() => handleDelete(noti)}>
//                                     Delete
//                                 </button>
//                                 {showData === noti._id && (
//                                     <div>
//                                         {renderData(noti.message.data)}
//                                     </div>
//                                 )}
//                                </li> 
                                

//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             )}

//             </div>
//     )
// }
// export default NotificationHeader