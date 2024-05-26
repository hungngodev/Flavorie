import { verifyJWT } from "../utils/tokenUtils.ts";
import { Server, Socket } from "socket.io";
import fs from 'fs'
import FormData from "form-data";
import axios from "axios";
import NotificationModel from "../models/NotificationModel.ts";

const FLASK_SERVICE_URL = 'http://127.0.0.1:5000/scan-receipts'
const authenticateSocketIO = async (socket: Socket, next) => {
    try {
        const token = socket.handshake.headers.cookie?.split("=")[1]
        if (token){
            const {userId, role} = verifyJWT(token)
            socket.data.user = {userId, role}
            next()
        }
        
        else {
            next(new Error('Authenticate invalid'))
        }
    } catch(error){

        next(new Error('Authentication error'))
    }
}

const setUpSocketIO = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    } )

    io.use(authenticateSocketIO)
    io.on("connection", (socket: Socket) => {
        console.log(socket)
        socket.on('submitReceipt', async (data) => {
            
            try{
                const fileBuffer = Buffer.from(data, 'base64')
                const filePath = `${data.filename}`
                fs.writeFileSync(filePath, fileBuffer)

                const form = new FormData()
                form.append('receipt', fs.createReadStream(filePath), data.filename);

                const response = await axios.post(FLASK_SERVICE_URL, form, {
                    headers: form.getHeaders()
                })
                socket.emit('processReceipt', response.data) 
                const notification = new NotificationModel({
                    userId: socket.data.user.userId, 
                    status: false,
                    message: {
                        title: 'Process receipt successfully',
                        data: response.data
                    },
                    timestamp: new Date()
                })
                await notification.save()
                
                } catch(error) {
                    console.log('Error processing receipt', error)
                    socket.emit('error', 'Failed to process receipt')
                    const notification = new NotificationModel({
                        userId: socket.data.user.userId, 
                        status: false,
                        message: {
                            title: 'Cannot process receipt. Please try again',
                        },
                        timestamp: new Date()
                    })
                    await notification.save()
                }
            })
        })
        // console.log('User connected')
        return io

    }

export  {setUpSocketIO}

