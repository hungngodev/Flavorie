import axios from "axios";
import FormData from "form-data";
import { url } from "inspector";
import mongoose from "mongoose";
import { Socket } from "socket.io";
import IngredientModel from "../models/IngredientModel.ts";
import NotificationModel from "../models/NotificationModel.ts";
import { cloudinary } from "../services/cloudinary/cloudinaryServices.ts";
import { groceryGenerating } from "../services/puppeteer/connecting.ts";

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
          notificationType: "receipt",
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
          notificationType: "error",
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
    const ingredients = await IngredientModel.find({
      _id: {
        $in: data.map((ingredient: { itemId: string }) => ingredient.itemId),
      },
    });
    const listOfNames = ingredients.map(ingredient => ingredient.name);
    console.log(
      "ingredients",
      ingredients.map(ingredient => ingredient.name),
    );

    try {
      const response = await groceryGenerating(listOfNames);
      socket.emit("processReceipt", "Let's go to Instacart!");
      const notification = new NotificationModel({
        userId: socket.data.user.userId,
        status: false,
        message: {
          title: "Connecting With Instacart Successfully!",
          data: response,
          notificationType: "instacart",
        },
        timestamp: new Date(),
      });
      await notification.save();
    } catch (error) {
      console.log("Error connecting to Instacart", error);
      socket.emit("error", "Failed to connect to Instacart");
      const notification = new NotificationModel({
        userId: socket.data.user.userId,
        status: false,
        message: {
          title:
            "Cannot connect to Instacart because the system is overloading. Please try again!",
        },
        timestamp: new Date(),
      });
      await notification.save();
    }
  });
};
