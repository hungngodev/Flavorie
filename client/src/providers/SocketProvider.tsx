import React, { useEffect } from 'react';
import socket from '../socket/socketio.tsx';
import useToast from '../hooks/useToast.tsx';
import useAuth from '../hooks/useAuth.tsx';

interface SocketContextProviderProps {
    children: React.ReactNode;
}

const SocketProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
    const { notifyError, notifySuccess, notifyWarning } = useToast();
    const auth = useAuth()
    useEffect(() => {
        if (auth.currentUser.status === 'authenticated'){
            if (!socket.connected){
                socket.connect()
                console.log('Socket is connected')
            }
        } else {
            if (socket.connected){
                socket.disconnect()
                console.log('Disconnect socket')
            }
        }

        socket.on('processReceipt', (data) => {
            console.log("Process receipt successfully", data);
            // notifySuccess('Process successfully');
        });

        socket.on('error', (error) => {
            console.log(error);
            notifyError('Failed to process receipt. Please try again');
        });

        return () => {
            socket.off('processReceipt');
            socket.off('error');
        };
    }, [auth.currentUser.status, notifyError, notifySuccess]);

    return <>{children}</>;
};

export default SocketProvider;
