import axios from "axios";
import FormData from "form-data";
import mongoose from "mongoose";
import { Socket } from "socket.io";
import NotificationModel from "../models/NotificationModel.ts";
import { cloudinary } from "../services/cloudinary/cloudinaryServices.ts";

const FLASK_SERVICE_URL = "http://127.0.0.1:5000/scan-receipts";

export const notificationHandler = (socket: Socket) => {
  socket.on("submitReceipt", async data => {
    console.log("submit receipt");
    const { base64, filename } = data;
    try {
      // upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(base64, {
        folder: process.env.CLOUDINARY_FOLDER || "",
        public_id: filename,
        overwrite: true,
      });

      const form = new FormData();
      form.append("receipt", uploadResponse.secure_url);

      const response = await axios.post(FLASK_SERVICE_URL, form, {
        headers: form.getHeaders(),
      });

      socket.emit("processReceipt", response.data);
      const notification = new NotificationModel({
        userId: socket.data.user.userId,
        status: false,
        message: {
          title: "Process receipt successfully",
          data: response.data,
        },
        timestamp: new Date(),
      });
      await notification.save();
    } catch (error) {
      console.log("Error processing receipt", error);
      socket.emit("error", "Failed to process receipt");
      const notification = new NotificationModel({
        userId: socket.data.user.userId,
        status: false,
        message: {
          title: "Cannot process receipt. Please try again",
        },
        timestamp: new Date(),
      });
      await notification.save();
    }
  });

  // update new notification when the receipt is done
  const userId = socket.data.user.userId;
  const pipeline = [
    {
      $match: { "fullDocument.userId": new mongoose.Types.ObjectId(userId) },
    },
  ];
  const changeStream = NotificationModel.watch(pipeline);
  changeStream.on("change", async next => {
    if (next.operationType === "insert") {
      const notificationCount = await NotificationModel.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        status: false,
      });
      socket.emit("countNotification", notificationCount);

      const allNotifications = await NotificationModel.find({
        userId: new mongoose.Types.ObjectId(userId),
      }).sort({ timestamp: -1 });

      socket.emit("displayNotifications", allNotifications);
    }
    // if (next.operationType === 'update'){
    //     const allUnreadNotifications = await NotificationModel.find({ userId: new mongoose.Types.ObjectId(userId), status: false}).sort({ timestamp: -1 })

    //     socket.emit('displayUnreadNotifications', allUnreadNotifications)
    // }
  });

  // mark the notification as read
  socket.on("markRead", async notificationId => {
    try {
      const notification = await NotificationModel.findById(notificationId);
      if (notification) {
        notification.status = true;
        await notification.save();
        socket.emit("updateNotificationRead", notificationId);
      }
    } catch (error) {
      console.log("Error to mark read notification", error);
    }
  });

  // delete the notification
  socket.on("deleteNotification", async notificationId => {
    try {
      const notification = await NotificationModel.findById(notificationId);

      if (notification) {
        const wasUnread = !notification.status;
        await NotificationModel.deleteOne({ _id: notificationId });
        socket.emit("updateNotificationDelete", notificationId, wasUnread);
      }
    } catch (error) {
      console.log("Error when deleting notifications", error);
    }
  });

  socket.on("sendToInstacart", async data => {
    console.log("sendToInstacart", data);
  });
};
