import { Request, Response} from "express";
import NotificationModel from "../models/NotificationModel.ts";
import User from "../models/UserModel.ts"

const getAllNotifications = async (req: Request, res: Response) => {
    const {userId} = req.user;
    if (!userId){
        return res.status(400).json({error: "User not found"})
    }
    try {
        const notifications = await NotificationModel.find({
            $and: [
                {userId: userId}, 
                {status: false}
            ]
        }).sort({timestamp: -1})
        const totalNotifications = await NotificationModel.countDocuments({userId})
        return res.status(200).json({notifications, totalNotifications})
    } catch (error) {
        return res.status(500).json({error: "Cannot fetch notifications"})
    }
}

const deleteNotification = async (req: Request, res: Response) => {
    const {userId} = req.user;
    if (!userId){
        res.status(400).json({error: "User not found"})
    }
    const { id } = req.params
    try {
        const deleteNoti = await NotificationModel.findById(id)
        if (!deleteNoti) {
            return res.status(400).json({error: "Cannot find notification"})
        }
        await NotificationModel.deleteOne({id})
        return res.json(200).json({message: "Successfully delete notification"})
    } catch(error) {
        return res.status(500).json({error})
    }
}

const deleteAllNotifications = async (req: Request, res: Response) => {
    const {userId} = req.user;
    if (!userId){
        res.status(400).json({error: "User not found"})
    }
    try {
        await NotificationModel.deleteMany({userId: userId})
        res.status(200).json({message: "Delete all notifications successfully"})
    } catch(error) {
        res.status(400).json({error: `${error}`})
    }
}

const markReadOneNotification = async (req: Request, res: Response) => {
    const {userId} = req.user;
    if (!userId){
        res.status(400).json({error: "User not found"})
    }
    
    const {id} = req.params
    try {
        const noti = await NotificationModel.findById(id)
        if (!noti) {
            return res.status(400).json({error: "Cannot find notification"})
        }
        noti.status = true
        await noti.save()
        return res.json(200).json({message: "Mark this notification as read"})
    } catch(error) {
        return res.status(500).json({error})
    }        
    }

const markReadAllNotifications = async (req: Request, res: Response) => {
    const {userId} = req.user
    if (!userId){
        res.status(400).json({error: "User not found"})
    }
    try {
        await NotificationModel.updateMany({userId: userId}, {$set: {status: true}})
        res.status(200).json({message: "Delete all notifications successfully"})
    } catch(error) {
        res.status(400).json({error: `${error}`})
    }
}
export {getAllNotifications, deleteNotification, deleteAllNotifications, markReadOneNotification, markReadAllNotifications}




// export const getNotificationByUser = async(req: Request, res: Response) => {
//     const {userId} = req.user;
//     try {
//         const notifications = await NotificationModel.find({userId}).sort({timestamp: -1})
//         res.status(200).json(notifications)
//     }
//     catch (e){
//         res.status(500).json({error: "Cannot fetch notifications"})
//     }
// }