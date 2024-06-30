import React from "react";

export type ToastContextType = {
    notifyError: (message: string) => void;
    notifySuccess: (message: string) => void;
    notifyWarning: (message: string) => void
}

const ToastContext = React.createContext<ToastContextType>({
    notifyError: () => {},
    notifySuccess: () => {},
    notifyWarning: () => {}
})
export default ToastContext