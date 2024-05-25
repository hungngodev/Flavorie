import React from "react";

export interface Notification {
    taskId: string;
    userId: string;
    status: 'PENDING' | 'FAILURE' | 'SUCCESS';
    message: {
        title: string;
        data: {[key: string]: unknown}
    };
    timestamp: Date;
}

export type NotificationContextType = {
    notifications: Notification[];
    fetchNotifications: () => void;
    setNotification: (notification: Notification) => void;
}

const NotificationContext = React.createContext<NotificationContextType>({
    notifications: [],
    fetchNotifications: () => {},
    setNotification: () => {}
})
export default NotificationContext

// export type NotificationContextType = {
//     taskId: string,
    
//     status: 'pending' | 'failure' | 'success', 
//     message: string,
//     setNotification: (taskId: string, taskStatus: 'pending' | 'failure' | 'success') => void;
// }

// const NotificationContext = React.createContext<NotificationContextType>({
//     taskId: "",
//     status: 'pending',
//     message: "",
//     setNotification: () => {}
// })
// export default NotificationContext