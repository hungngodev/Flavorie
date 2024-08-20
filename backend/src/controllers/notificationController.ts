import NotificationModel from "@src/models/NotificationModel";
import { Request, Response } from "express";

const getNotificationCount = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(400).json({ error: "User not found" });
  }
  try {
    const count = await NotificationModel.countDocuments({
      userId: userId,
      status: false,
    });
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ error: "Cannot fetch notifications" });
  }
};

const getAllNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(400).json({ error: "User not found" });
  }
  try {
    const notifications = await NotificationModel.find({ userId: userId }).sort(
      { timestamp: -1 },
    );
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ error: "Cannot display notifications" });
  }
};

const getNotificationById = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(400).json({ error: "User not found" });
  }
  try {
    const currNotification = await NotificationModel.findById(req.params.id);
    console.log(currNotification);
    return res.status(200).json({ currNotification });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
export { getAllNotifications, getNotificationById, getNotificationCount };
