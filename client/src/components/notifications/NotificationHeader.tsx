import useNotification from "../../hooks/useNotification";
import  useAuth  from "../../hooks/useAuth.tsx";
import { useState, useEffect } from "react";
import { Notification } from "../../contexts/NotificationContext.tsx";
import { Badge, Button } from "@chakra-ui/react";

const NotificationHeader = () => {
    const {notifications, numberOfNotifications, markAsRead, deleteNotification} = useNotification()
    const auth= useAuth()
    const [showData, setShowData] = useState<string | null>(null)
    const [isAutheticate, setIsAuthenticate] = useState(false)

    const renderData = (data: any) => {
                if (typeof data === 'object' && data !== null) {
                    return JSON.stringify(data, null, 2);
                }
                return data;
            };
    const handleClick = (notification: Notification) => {
        const notificationId = notification._id;
        setShowData(showData === notificationId ? null : notificationId);
        if (!notification.status) {
            markAsRead(notificationId);
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
        <>
        {isAutheticate && numberOfNotifications > 0 ? (
            <Button>
            <Badge>{numberOfNotifications}</Badge>
            </Button>
        ) : (
            <div>
                No notification
            </div>
        )}
        </>
        
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