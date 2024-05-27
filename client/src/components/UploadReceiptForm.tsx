import { useAuth } from '../hooks';
import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import socket from '../socket/socketio.tsx';


const UploadReceiptForm = () => {
    const auth = useAuth()
    const [file, setFile] = useState<File | null>(null)
    useEffect(() => {
        
        socket?.on('processReceipt', (data) => {
            console.log(data); 
            toast.success('Process successfully')
        })
        
        socket?.on('error', (error) => {
            console.log(error);
            toast.error('Failed to process')
        })
        
        return () => {
            socket?.off('processReceipt')
            socket?.off('error')
        }
    },[])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files){
        setFile(event.target.files[0])
    }
}
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            toast.error('Please upload files');
            return;
        }

        if (auth.currentUser.status === 'unauthenticated'){
            toast.error('Please log in or sign up to submit receipt')
            return;
        }
        
        
        socket?.emit('submitReceipt', file)
        toast.success('Submit receipt successfully')
    }
    return (
        <form onSubmit={handleSubmit}>
           <input type="file" onChange={handleFileChange} accept="image/*" />
           <button type="submit">Upload Receipt</button>
       </form>
    )
}
export default UploadReceiptForm

