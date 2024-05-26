import React, { useState } from 'react';
import UploadReceiptForm from '../components/UploadReceiptForm.tsx';
import useAuth  from '../hooks/useAuth.tsx';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
// import NotificationList from '../components/notifications/NotificationList.tsx';
import NotificationHeader from '../components/notifications/NotificationHeader.tsx';

// const socket = io('http://localhost:5100')

// socket.on('connect', () => {
//     console.log('Socket is connected')
// })
// socket.on("message", (data) => {
//     console.log(data)
// })



const ReceiptScan: React.FC = () => {
    const { currentUser } = useAuth();
    return (
        <div>
            <h1>Welcome, {currentUser.username}</h1>
            <UploadReceiptForm /> 
            <ToastContainer />
            <NotificationHeader />
            {/* <NotificationList /> */}
        </div>
    );
};

export default ReceiptScan;
