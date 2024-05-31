import React, { useEffect } from 'react';
import socket from '../socket/socketio.tsx';
import useToast from '../hooks/useToast.tsx';

interface SocketContextProviderProps {
    children: React.ReactNode;
}

const SocketProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
    const { notifyError, notifySuccess, notifyWarning } = useToast();

    useEffect(() => {
        socket.on('processReceipt', (data) => {
            console.log(data);
            notifySuccess('Process successfully');
        });

        socket.on('error', (error) => {
            console.log(error);
            notifyError('Failed to process receipt. Please try again');
        });

        return () => {
            socket.off('processReceipt');
            socket.off('error');
        };
    }, [notifyError, notifySuccess]);

    return <>{children}</>;
};

export default SocketProvider;
