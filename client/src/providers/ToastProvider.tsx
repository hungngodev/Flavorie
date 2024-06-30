import React from "react";
import { toast } from "react-toastify";
import ToastContext from "../contexts/ToastContext";


interface ToastContextProviderProps {
    children: React.ReactNode;
}

const ToastProvider: React.FC<ToastContextProviderProps> = ({children}: ToastContextProviderProps) => {
    const notifySuccess = (message: string) => {
        toast.success(message)
    }
    
    const notifyError = (message: string) => {
        toast.error(message)
    }
    
    const notifyWarning = (message: string) => {
        toast.warn(message)
    }

    return (
        <ToastContext.Provider value={{notifyError, notifySuccess, notifyWarning}}>
            {children}
        </ToastContext.Provider>
    )
}
export default ToastProvider
