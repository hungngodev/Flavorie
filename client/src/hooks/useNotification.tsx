import { useContext } from "react";
import NotificationContext from "../contexts/NotificationContext.tsx";

const useNotification = () => {
    return useContext(NotificationContext)
}
export default useNotification