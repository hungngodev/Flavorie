import { useAuth } from '../hooks';
import React, { useState, useEffect } from 'react';
import socket from '../socket/socketio.tsx';
import useToast from '../hooks/useToast.tsx';


const UploadReceiptForm = () => {
    const auth = useAuth()
    const [file, setFile] = useState<File | null>(null)
    const {notifyError, notifySuccess, notifyWarning} = useToast()
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files){
        setFile(event.target.files[0])
    }
}
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            notifyError('Please upload files');
            return;
        }

        if (auth.currentUser.status === 'unauthenticated'){
            notifyError('Please log in or sign up to submit receipt')
            return;
        }
        
        // FileReader object to read a file
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64 = e.target?.result as string;
            const filename = file.name;
            socket?.emit('submitReceipt', { base64, filename });
            notifySuccess('Submit receipt successfully');
        };

        // initiate to read file => result is base64 encoded string
        reader.readAsDataURL(file);
    }
    return (
        <form onSubmit={handleSubmit}>
           <input type="file" onChange={handleFileChange} accept="image/*" />
           <button type="submit">Upload Receipt</button>
       </form>
    )
}
export default UploadReceiptForm

