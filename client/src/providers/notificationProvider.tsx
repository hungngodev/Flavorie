import NotificationContext, { NotificationContextType } from "../contexts/notificationContext";
import { Notification } from "../contexts/notificationContext";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks";
import {io, Socket} from 'socket.io-client'
import {ToastContainer, toast} from 'react-toastify'
import axios from "axios";
import customFetch from '../utils/customFetch';

interface NotificationProviderProps{
    children: React.ReactNode
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({children}: NotificationProviderProps) => {
    const {currentUser} = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([])


    // const [taskId, setTaskId] = useState<NotificationContextType['taskId']>("")
    // const [status, setStatus] = useState<NotificationContextType['status']>("pending")
    const [socket, setSocket] = useState<Socket | null>(null)

    const fetchNotifications = async () => {
        if (currentUser.status === 'authenticated'){
            try {
                const response = await fetch('/api/notifications')

                const data = await response.json()
                setNotifications(data.notifications)
            } catch(error){
                console.log('Cant fetch notifications', error)
            }
        } 
    }
    // useEffect(() => {
    //     if (currentUser.status === 'authenticated'){
    //         const fetchNotifications = async () => {
    //             try {
                    // const response = await axios.get('http://localhost:5100/api/notifications', {
                    //     headers: {
                    //         Authorization: `Bearer ${localStorage.getItem('token')}`
                    //     }
                    // })
            //         const response = await customFetch.get('http://localhost:5100/api/notifications')
            //         setNotifications(response.data)
            //     } catch (error) {
            //         console.error('Failed to fetch notifications', error)
            //     }
            // }
            // fetchNotifications()

            const setNotification = (notification: Notification) => {
                setNotifications((prevNotifications) => [...prevNotifications, notification])
            }

            useEffect(() => {
                if (currentUser.status === 'authenticated'){
                    const newSocket = io('http://localhost:5100')
                    newSocket.on('connect', () => {
                        console.log('Socket connected')
                })
                newSocket.on('notification', (notification: Notification) => {
                    setNotification(notification)
                    // setNotifications(prevNotifications => [notification, ...prevNotifications])
                    toast.success(`New notification: ${notification.message.title}`)
                })
                setSocket(newSocket)
                return () => {
                    newSocket.close()
                }
            }
            }, [currentUser.status])

            useEffect(() => {
fetchNotifications()
            }, [fetchNotifications])
            
            // const newSocket = io('http://localhost:5100'
                // auth: {
                //     token: localStorage.getItem('token')
                // }
            // )

            // newSocket.on('connect', () => {
            //     console.log('Socket connected')
            // })

            // newSocket.on('notification', (notification: Notification) => {
            //     setNotification(notification)
            //     // setNotifications(prevNotifications => [notification, ...prevNotifications])
            //     toast.success(`New notification: ${notification.message.title}`)
            // })

            // setSocket(newSocket)

            // return () => {
            //     newSocket.close()
            // }
            // const token = localStorage.getItem('token')
            // const newSocket = io('http://localhost:5100', {
            //     auth: {token}
            // })

            // newSocket.on('connect', () => {
            //     console.log('Socket connected')
            // })

            // newSocket.on('notification', (notification: {
            //     taskId: string,
            //     status: 'pending' | 'success' | 'failure',
            //     message: string
            // }) => {
            //     setTaskId(notification.taskId);
            //     setStatus(notification.status)
            //     toast.success(`You have new notification: ${notification.message}`)
            // })

            // setSocket(newSocket)

            // return () => {
            //     newSocket.close()
            // }
    //     }
    // }, [currentUser.status])

    // const setNotification = (notification: Notification) => {
    //     setNotifications(prevNotifications => [notification, ...prevNotifications])
    // }
    // const setNotification = (taskId: string, taskStatus: 'pending' | 'success' | 'failure') => {
    //     setCurrentTaskId(taskId)
    //     setTaskStatus(taskStatus)
    // } 

    return (
        <NotificationContext.Provider value={{notifications, fetchNotifications: () => {}, setNotification}}>
            {children}
            <ToastContainer />
        </NotificationContext.Provider>
    )
}
export default NotificationProvider