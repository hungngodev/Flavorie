import React from 'react';
import UploadReceiptForm from '../components/UploadReceiptForm.tsx';
import useAuth  from '../hooks/useAuth.tsx';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NotificationHeader from '../components/notifications/NotificationHeader.tsx';



const ReceiptScan: React.FC = () => {
    const { currentUser } = useAuth();
    return (
        <div>
            <h1>Welcome, {currentUser.username}</h1>
            <UploadReceiptForm /> 
            <ToastContainer />
            <NotificationHeader />
        </div>
    );
};

export default ReceiptScan;
