import IngredientModel from "@src/models/IngredientModel";
import NotificationModel from "@src/models/NotificationModel";
import { cloudinary } from "@src/services/cloudinary/cloudinaryServices";
import redisClient from "@src/services/redisClient/index";
import mongoose from "mongoose";
import { Socket } from "socket.io";

const receiptStreamKey = "server:receipts_stream";
const instacartStreamKey = "server:instacart_stream";

export const notificationHandler = (socket: Socket) => {
  socket.on("submitReceipt", async data => {
    const { base64, filename } = data;
    try {
      const uploadResponse = await cloudinary.uploader.upload(base64, {
        folder: process.env.CLOUDINARY_FOLDER || "",
        public_id: filename,
        overwrite: true,
      });
      console.log("adding to redis stream in receipts handler");

      await redisClient.xadd(
        receiptStreamKey,
        "*",
        "receipt",
        uploadResponse.secure_url,
        "userId",
        socket.data.user.userId,
        "timestamp",
        new Date().toISOString(),
        "type",
        "scan-receipt",
      );
      console.log("added to redis stream in receipts handler");
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

      socket.emit(
        "processingDone",
        allNotifications[0].message.notificationType,
      );
      socket.emit("displayNotifications", allNotifications);
    }
  });
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
    console.log("send to instacart", data);
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
    await redisClient.xadd(
      instacartStreamKey,
      "*",
      "listOfNames",
      JSON.stringify(listOfNames),
      "userId",
      socket.data.user.userId,
      "timestamp",
      new Date().toISOString(),
      "type",
      "instacart",
    );
    // Add to redis stream
  });
};
