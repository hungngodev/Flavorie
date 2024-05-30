import React, {useState, useEffect} from "react";
import {toast} from 'react-toastify'
import NotificationContext, {Notification} from '../contexts/NotificationContext.tsx';
import  useAuth  from "../hooks/useAuth.tsx";
import socket from "../socket/socketio.tsx";
import axios from "axios";

interface NotificationContextProviderProps {
    children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationContextProviderProps> = ({children}: NotificationContextProviderProps) => {
    const auth = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [numberOfNotifications, setCntNotifications] = useState(0)
    const [notificationDetail, setNotificationDetail] = useState<Notification | null>(null)
    // const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([])

    const [isAutheticate, setIsAuthenticate] = useState(false)
    const fetchNotifications = async () => {
        try {
            const cntResponse = await axios.get('http://localhost:5100/api/user/notifications/cnt', {withCredentials: true})
            setCntNotifications(cntResponse.data.count)

            const notiResponse = await axios.get('http://localhost:5100/api/user/notifications', {withCredentials: true})
            setNotifications(notiResponse.data.notifications)        
    } catch (error) {
        toast.error('Failed to display notifications')
        console.log(error)
    }
}
    const fetchNotificationById = async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:5100/api/user/notifications/${id}`, {withCredentials: true})
            console.log(response.data.currNotification)
            setNotificationDetail(response.data.currNotification)
        } catch (error) {
            toast.error('Cannot find notification')
            console.log(error)
        }
    }

useEffect(() => {
    if (auth.currentUser.status === 'authenticated'){
        console.log(auth.currentUser.status)
        setIsAuthenticate(true)

        fetchNotifications()
        socket.on('updateNotificationRead', (notificationId) => {
            setNotifications((prevNotis) => 
                prevNotis.map((noti) => (noti._id === notificationId ? {...noti, status: true} : noti)))
            setCntNotifications((prevCount) => prevCount - 1)
        })
        socket.on('updateNotificationDelete', (notificationId, wasUnread) => {
            setNotifications((prevNotis) => 
                prevNotis.filter((noti) => noti._id !== notificationId)
            )
            if (wasUnread){
                setCntNotifications((prevCount) => prevCount - 1)

            }
        })
        socket?.on('countNotification', (cnt) => {
            setCntNotifications(cnt)
        })
        socket?.on('displayNotifications', (allNotifications: Notification[]) => {
            setNotifications(allNotifications);
        });

        // socket?.on('displayUnreadNotifications', (allUnreadNotifications: Notification[]) => {
        //     setUnreadNotifications(allUnreadNotifications)
        // })

        return () => {
            socket.off('updateNotificationRead')
            socket.off('updateNotificationDelete')
            socket.off('countNotification')
            socket.off('displayNotifications')
            // socket.off('displayUnreadNotifications')
        }
    } 
    else if (auth.currentUser.status === 'unauthenticated'){
        // console.log(auth.currentUser.status)
        setIsAuthenticate(false)

        setNotifications([]);
        // setUnreadNotifications([])
        setCntNotifications(0);
        toast.warn('Please log in to view notifications');
    }
}, [auth.currentUser.status])

const markAsRead = (notificationId: string) => {
    socket?.emit('markRead', notificationId);
};

const deleteNotification = (notificationId: string) => {
    socket?.emit('deleteNotification', notificationId);
};


return (
    <NotificationContext.Provider value={{notifications, numberOfNotifications, markAsRead, fetchNotifications, deleteNotification, fetchNotificationById, notificationDetail}}>
        {children}
    </NotificationContext.Provider>
)
}
export default NotificationProvider