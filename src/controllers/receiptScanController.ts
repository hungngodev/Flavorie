import { storage } from "../services/cloudinary/cloudinaryServices.ts"
import multer from "multer";
import { Request, Response } from "express";
import axios, {AxiosRequestHeaders} from "axios";
import FormData from "form-data";
import path from "path";
import fs from "fs"
import NotificationModel from "../models/NotificationModel.ts"
import { io } from "../index.ts";
import mongoose from "mongoose";

const upload = multer({storage})

const FLASK_SERVICE_URL = 'http://127.0.0.1:5000/scan-receipts'
const FLASK_CHECK_STATUS = 'http://127.0.0.1:5000/task-status'

const processReceipt = async (req: Request, res: Response) => {
    if (!req.file){
        return res.status(400).send('No image uploaded.')
    }

    const userId = req.user.userId
    // const taskId = req.body.taskId
    const taskId = new mongoose.Types.ObjectId().toString();

    const notification = new NotificationModel({
        taskId,
        userId,
        status: 'PENDING',
        message: {
            title: "Processing started"
        },
        timestamp: new Date()
    })
    await notification.save()
    io.to(userId).emit('notification', notification)

    const formData = new FormData()
    const imageUrl = req.file.path
    const imageResponse = await axios.get(imageUrl, {responseType: 'arraybuffer'});
    formData.append('receipt', imageResponse.data, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
    })
    formData.append('userId', userId)
    formData.append('taskId', taskId)
    // const notification = new NotificationModel({
    //     userId,
    //     taskId,
    //     status: 'PENDING',
    //     message: {
    //         info: 'Processing started'
    //     },
    //     timestamp: new Date()
    // })
    // await notification.save()

    // io.to(userId).emit('notification', notification)

    try {
        // const imageUrl = req.file.path
        // const imageResponse = await axios.get(imageUrl, {responseType: 'arraybuffer'});
        // const formData = new FormData();
        // formData.append('receipt', imageResponse.data, {
        //     filename: req.file.originalname,
        //     contentType: req.file.mimetype
        // })
        const response = await axios.post(FLASK_SERVICE_URL, formData, {
            headers: {
                ...formData.getHeaders(),
            }
        })
        return res.json(notification)

        // const notification = new NotificationModel({
        //     userId,
        //     taskId: response.data.taskId,
        //     status: response.data.status,
        //     message: {
        //         title: 'Processing started'
        //     },
        //     timestamp: new Date()
        // })

        // notification.status = 'SUCCESS';
        // notification.message = response.data
        // await notification.save()
        // io.to(req.user.userId).emit('notification', notification)
        // return res.json({message: 'Start processing', notification})
        // return res.json(notification)
    }
    

        
        
        // return res.json({
        //     message: "Image processed successfully",
        //     data: response.data
        // })

        

        
    
    catch (error) {
        console.log("Error calling Flask", error);
        // notification.status = 'FAILURE'
        // notification.message = {
        //     error: 'Failed to process image'
        // }
        // await notification.save()
        // io.to(req.user.userId).emit('notification', notification)
        const updatedNotification = await NotificationModel.findByIdAndUpdate(
            {taskId},
            {
                status: 'FAILURE',
                message: {
                    title: 'Failed to process image',
                    data: error
                }
            }
        )
        io.to(userId).emit('notification', updatedNotification)
        return res.status(500).send("Failed to process image")
    }
}
// export {upload, processReceipt}

const checkTaskStatus = async(req: Request, res: Response) => {
    const {taskId} = req.params

    // const numericTaskId = Number(taskId)
    // const headers = {
    //     'Authorization': req.headers['authorization'] as string
    // }
    try{
    const response = await axios.get(`${FLASK_CHECK_STATUS}/${taskId}`)

    // return res.json(response.data)
    if (response.data.state === 'SUCCESS'){
        const notification = await NotificationModel.findOne({taskId: taskId})
        console.log(`Database notification: ${notification}`);

        if (notification){
            notification.status = 'SUCCESS'
            notification.message.title = "Receip processed successfully"
            notification.message.data = response.data.result
            await notification.save()
            io.to(req.user.userId).emit('notification', notification)
            // return res.status(200).json({
            //     message: 'Processed completed',
            //     notification
            // })
            return res.status(200).json(notification)
        } else {
            return res.status(400).json({
                message: 'Notification not found'
            })
        }
    }
    else if (response.data.state === 'FAILURE'){
        const notification = await NotificationModel.findOne({taskId: taskId})
        if (notification){
            notification.status = 'FAILURE'
            notification.message = response.data.result
            await notification.save()
            io.to(req.user.userId).emit('notification', notification)
            // return res.status(200).json({
            //     message: 'Processed failed',
            //     notification
            // })
            return res.status(200).json(notification)
        } else {
            return res.status(400).json({
                message: 'Notification not found'
            })
        }
    }
    else if (response.data.state === 'ERROR'){
        return res.status(500).json({
            message: 'Error when processing',
            error: response.data.error
        })
    }
    else {
        return res.status(200).json(response.data)
    }
} catch(error){
    console.log("Error calling Flask", error);
    return res.status(500).send("Error when finding notification")

        // return res.status(500).json({ message: `${error}` })}
        // console.error("Error checking task status:", error.response ? error.response.data : error.message);
        // return res.status(500).send("Failed to check task status");
     
}
}

export {upload, processReceipt, checkTaskStatus}