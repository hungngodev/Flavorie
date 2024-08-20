import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import NotificationContext, { Notification, NotificationSchema } from '../contexts/NotificationContext.tsx';
import useAuth from '../hooks/useAuth.tsx';
import useToast from '../hooks/useToast.tsx';
import socket from '../socket/socketio.tsx';
import customFetch from '../utils/customFetch.ts';

interface NotificationContextProviderProps {
    children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationContextProviderProps> = ({
    children,
}: NotificationContextProviderProps) => {
    const auth = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [numberOfNotifications, setCntNotifications] = useState(0);
    const [notificationDetail, setNotificationDetail] = useState<Notification | null>(null);
    const { notifyError, notifyWarning } = useToast();

    // const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([])

    //fetch all notifications
    const fetchNotifications = useCallback(async () => {
        try {
            const cntResponse = await customFetch.get('/user/notifications/cnt', {
                withCredentials: true,
            });
            setCntNotifications(cntResponse.data.count);

            const notiResponse = await customFetch.get('/user/notifications', {
                withCredentials: true,
            });
            setNotifications(notiResponse.data.notifications);
        } catch (error) {
            notifyError('Failed to display notifications');
            console.log(error);
        }
    }, [notifyError]);

    // get notification detail
    const fetchNotificationById = async (id: string): Promise<Notification | null> => {
        try {
            const response = await customFetch.get(`/user/notifications/${id}`, {
                withCredentials: true,
            });

            const parsedData = NotificationSchema.safeParse(response.data.currNotification);
            if (parsedData.success) {
                setNotificationDetail(parsedData.data);
                localStorage.setItem('notificationDetail', JSON.stringify(parsedData.data.message.data));
                return parsedData.data;
            } else {
                return null;
            }
        } catch (error) {
            toast.error('Cannot find notification');
            console.log(error);
            return null;
        }
    };

    useEffect(() => {
        if (auth.currentUser.status === 'authenticated') {
            fetchNotifications();
            socket.on('updateNotificationRead', (notificationId) => {
                // setNotifications((prevNotis) =>
                //   prevNotis.filter((noti) => (noti._id !== notificationId)),
                // );
                setNotifications((prevNotis) =>
                    prevNotis.map((noti) => (noti._id === notificationId ? { ...noti, status: true } : noti)),
                );
                setCntNotifications((prevCount) => prevCount - 1);
            });
            socket.on('updateNotificationDelete', (notificationId, wasUnread) => {
                setNotifications((prevNotis) => prevNotis.filter((noti) => noti._id !== notificationId));
                if (wasUnread) {
                    setCntNotifications((prevCount) => prevCount - 1);
                }
            });
            socket.on('countNotification', (notificationCount) => {
                setCntNotifications(notificationCount);
            });
            socket.on('displayNotifications', (allNotifications: Notification[]) => {
                setNotifications(allNotifications);
            });

            return () => {
                socket.off('updateNotificationRead');
                socket.off('updateNotificationDelete');
                socket.off('countNotification');
                socket.off('displayNotifications');
            };
        } else if (auth.currentUser.status === 'unauthenticated') {
            // console.log(auth.currentUser.status)
            setNotifications([]);
            setCntNotifications(0);
        }
    }, [auth.currentUser.status, fetchNotifications, notifyWarning]);

    const markAsRead = (notificationId: string) => {
        socket?.emit('markRead', notificationId);
    };

    const deleteNotification = (notificationId: string) => {
        socket?.emit('deleteNotification', notificationId);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                numberOfNotifications,
                markAsRead,
                fetchNotifications,
                deleteNotification,
                fetchNotificationById,
                notificationDetail,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
export default NotificationProvider;
