import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import NotificationContext, { Notification } from '../contexts/NotificationContext.tsx';
import useAuth from '../hooks/useAuth.tsx';
import useToast from '../hooks/useToast.tsx';
import socket from '../socket/socketio.tsx';

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
  const { notifyError, notifyWarning, notifySuccess } = useToast();
  const [isAutheticate, setIsAuthenticate] = useState(false)

  // const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([])

  //fetch all notifications 
  const fetchNotifications = useCallback(async () => {
    try {
      const cntResponse = await axios.get('http://localhost:5100/api/user/notifications/cnt', {
        withCredentials: true,
      });
      setCntNotifications(cntResponse.data.count);

      const notiResponse = await axios.get('http://localhost:5100/api/user/notifications', { withCredentials: true });
      setNotifications(notiResponse.data.notifications);
    } catch (error) {
      notifyError('Failed to display notifications');
      console.log(error);
    }
  }, [notifyError]);

  // get notification detail 
  const fetchNotificationById = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:5100/api/user/notifications/${id}`, { withCredentials: true });
      console.log(response.data.currNotification);
      setNotificationDetail(response.data.currNotification);
    } catch (error) {
      toast.error('Cannot find notification');
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth.currentUser.status === 'authenticated') {
        setIsAuthenticate(true)

      fetchNotifications();
      socket.on('updateNotificationRead', (notificationId) => {
        setNotifications((prevNotis) =>
          prevNotis.filter((noti) => (noti._id !== notificationId)),
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
      setIsAuthenticate(false)

      setNotifications([]);
      setCntNotifications(0);
      notifyWarning('Please log in to view notifications');
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
