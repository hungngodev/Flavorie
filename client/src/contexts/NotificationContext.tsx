import React from 'react';

export interface Notification {
  _id: string;
  userId: string;
  status: boolean;
  message: {
    title: string;
    data?: object;
  };
  timestamp: Date;
}

export type NotificationContextType = {
  notifications: Notification[];
  numberOfNotifications: number;
  notificationDetail: Notification | null;

  markAsRead: (id: string) => void;
  fetchNotifications: () => void;
  deleteNotification: (id: string) => void;
  fetchNotificationById: (id: string) => void;
};

const NotificationContext = React.createContext<NotificationContextType>({
  notifications: [],
  numberOfNotifications: 0,
  notificationDetail: null,
  markAsRead: () => {},
  fetchNotifications: () => {},
  deleteNotification: () => {},
  fetchNotificationById: () => {},
});
export default NotificationContext;
