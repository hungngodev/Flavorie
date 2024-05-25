import mongoose, {Types} from "mongoose";

export interface Notification extends mongoose.Document{
    // notificationId: number;
    taskId: string;
    // taskName: string;
    userId: mongoose.Types.ObjectId;
    status: 'PENDING' | 'SUCCESS' | 'FAILURE';
    // message: object;
    message: {
        title: string;
        data: object;
    }
    timestamp?:Date; 
}

type NotificationModel = mongoose.Model<Notification>;
const NotificationSchema = new mongoose.Schema<Notification, NotificationModel>({
    taskId: {
        type: String, 
        required: true
    },
    // taskName: 

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILURE'],
        required: true,
    },
    message: {
        // type: Object 
        title: {
            type: String,
            required: true
        }, 
        data: {
            type: Object, 
            // required: true
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})
export default mongoose.model<Notification>('Notification', NotificationSchema)