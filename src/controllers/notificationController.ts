import { Request, Response } from "express";
import NotificationModel from "../models/NotificationModel.ts"
import User  from "../models/UserModel.ts";
import { io } from "../index.ts";
import { error } from "console";

// export const createNotification = async (req: Request, res: Response) => {
//     const {taskId, userId, status} = req.body;
//     try {
//         const user = await User.findById(userId);
//         if (!user){
//             res.status(404).json({
//                 error: 'User not found'
//             })
//             return;
//         }
//         const notification = new NotificationModel({taskId, userId, status});
//         await notification.save()

//         io.to(userId).emit('notification', notification)
//         res.status(201).json(notification)
//     } catch(e){
//         res.status(500).json({error: 'Cant create notification'})
//     }
// }

export const getNotificationByUser = async(req: Request, res: Response) => {
    const {userId} = req.user;
    try {
        const notifications = await NotificationModel.find({userId}).sort({timestamp: -1})
        res.status(200).json(notifications)
    }
    catch (e){
        res.status(500).json({error: "Cannot fetch notifications"})
    }
}