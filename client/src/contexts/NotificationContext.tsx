import React from 'react'

export interface Notification{
    _id: string;
    userId: string;
    status: boolean; 
    message: {
        title: string;
        data?: object
    },
    timestamp: Date
}

export type NotificationContextType = {
    notifications: Notification[];
    numberOfNotifications: number;
    markAsRead: (id: string) => void;
    fetchNotifications: () => void;
    deleteNotification: (id: string) => void
}

const NotificationContext = React.createContext<NotificationContextType>({
    notifications: [],
    numberOfNotifications: 0,
    markAsRead: () => {}, 
    fetchNotifications: () => {},
    deleteNotification: () => {}
})
export default NotificationContext