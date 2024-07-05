import mongoose from "mongoose";

export interface Notification extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  status: boolean;
  message: {
    title: string;
    data: object;
    notificationType: string;
  };
  timestamp: Date;
}

type NotificationModel = mongoose.Model<Notification>;

const NotificationSchema = new mongoose.Schema<Notification, NotificationModel>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    message: {
      title: {
        type: String,
        required: true,
      },
      data: {
        type: Object,
      },
      notificationType: {
        type: String,
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
);
export default mongoose.model<Notification>("Notification", NotificationSchema);
