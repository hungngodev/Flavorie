import { Request, Response} from "express";
import NotificationModel from "../models/NotificationModel.ts";

const getNotificationCount = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    if (!userId){
        return res.status(400).json({error: "User not found"})
    }
    try {
        const count = await NotificationModel.countDocuments({userId: userId, status: false})
        return res.status(200).json({count})
    } catch (error) {
        return res.status(500).json({error: "Cannot fetch notifications"})
    }
}

const getAllNotifications = async (req: Request, res: Response) => {
    const userId = req.user.userId
    if (!userId){
        return res.status(400).json({error: "User not found"})
    }
    try {
        const notifications = await NotificationModel.find({userId: userId, status: false}).sort({timestamp: -1})
        return res.status(200).json({notifications})
    } catch(error) {
        return res.status(500).json({error: "Cannot display notifications"})
    }
}
export  {getNotificationCount, getAllNotifications}

