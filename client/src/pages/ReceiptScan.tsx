import React, { useState } from 'react';
import NotificationsList from '../components/NotificationList.tsx';
import UploadReceiptForm from '../components/UploadReceiptForm.tsx';
import useAuth  from '../hooks/useAuth.tsx';
import {io} from 'socket.io-client'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";


const socket = io('http://localhost:5100')

socket.on('connect', () => {
    console.log('Socket is connected')
})
// socket.on("message", (data) => {
//     console.log(data)
// })



const ReceiptScan: React.FC = () => {
    const { currentUser } = useAuth();
    return (
        <div>
            <h1>Welcome, {currentUser.username}</h1>
            <UploadReceiptForm socket={socket}/> 
            <ToastContainer />
            
            {/* <NotificationsList /> */}
        </div>
    );
};

export default ReceiptScan;
