import React from 'react';
import {z} from 'zod'

// export interface Notification {
//   _id: z.string(),
//   userId: z.string(),
//   status: z.boolean(),
//   message: {
//     title: z.string(),
//     data?: z.record(z.any()).optional(),
//   };
//   timestamp: z.date()
// }
export const NotificationSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  status: z.boolean(),
  message: z.object({
    title: z.string(),
    data: z.optional(z.array(z.object({
      name: z.string(),
      price: z.string(),
      quantity: z.string(),
      potential_matches: z.array(z.object({
        potential_name: z.string(),
        potential_image: z.string()
      }))
    })))
  }),
  timestamp: z.string().transform((val) => new Date(val))
})

export type Notification = z.infer<typeof NotificationSchema>

export type NotificationContextType = {
  notifications: Notification[];
  numberOfNotifications: number;
  notificationDetail: Notification | null;

  markAsRead: (id: string) => void;
  fetchNotifications: () => void;
  deleteNotification: (id: string) => void;
  fetchNotificationById: (id: string) => Promise<Notification | null>
};

const NotificationContext = React.createContext<NotificationContextType>({
  notifications: [],
  numberOfNotifications: 0,
  notificationDetail: null,
  markAsRead: () => {},
  fetchNotifications: () => {},
  deleteNotification: () => {},
  fetchNotificationById: async () => null,
});
export default NotificationContext;
