
// const UploadReceiptForm = ({handleSubmit, handleFileChange}) => {
//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="file" onChange={handleFileChange} accept="image/*">
//                 <button type="submit">
//                     Upload receipt
//                 </button>
//             </input>
//         </form>
//     )
// }
// export default UploadReceiptForm
import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { io } from 'socket.io-client';

const socket = io('http://localhost:5100');


const UploadReceiptForm = () => {
    const [file, setFile] = useState<File | null>(null)
    useEffect(() => {
        socket.on('processReceipt', (data) => {
            console.log(data); 
            toast.success('Process successfully')
        })
        socket.on('error', (error) => {
            console.log(error);
            toast.error('Failed to process')
        })
        
        
    },[])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files){
        setFile(event.target.files[0])
    }
}
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) return;
        
        // const formData = new FormData()
        // formData.append('receipt', file)

        socket.emit('submitReceipt', file)
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

// // import axios from 'axios';
// import useNotification from '../hooks/useNotification.tsx';
// import customFetch from '../utils/customFetch.ts';

// const UploadReceiptForm: React.FC = () => {
//     const [file, setFile] = useState<File | null>(null);
//     const { setNotification } = useNotification();
    
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setFile(e.target.files[0]);
//         }
//     };
    
//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (!file) return;
        

//         const formData = new FormData();
//         formData.append('receipt', file);

//         try {
//             const response = await customFetch.post('http://localhost:5100/api/user/scan-receipt', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     // 'Authorization': `Bearer ${token}`
//                 }
//                 // withCredentials: true
//             });

//             // Handle the response and set a notification if needed
//             console.log(response.data);
//         } catch (error) {
//             console.error('Error uploading receipt:', error);
//             // Optionally set a notification for the error
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="file" onChange={handleFileChange} accept="image/*" />
//             <button type="submit">Upload Receipt</button>
//         </form>
//     );
// };

// export default UploadReceiptForm;
