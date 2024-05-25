import { useContext } from "react";
import NotificationContext from "../contexts/notificationContext";

const useNotification = () => {
    return useContext(NotificationContext)
}
export default useNotification