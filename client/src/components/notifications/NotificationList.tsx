import axios from "axios";
import { useEffect, useState } from "react";
import  useAuth  from "../../hooks/useAuth.tsx";
import { toast } from "react-toastify";
import useSocketIO from "../../hooks/useSocketio.tsx";


const NotificationList = () => {
    // const {socket} = useSocketIO()

    const [notifications, setNotifications] = useState([])
    const {currentUser} = useAuth()
    const [isAutheticate, setIsAuthenticate] = useState(false)
    useEffect(() => {
        if (currentUser.status === 'unauthenticated') {
            toast.warn('Please log in to view notifications')
            setIsAuthenticate(false)
        }
        else {
            setIsAuthenticate(true)
        }
    }, [currentUser])

    useEffect(() => {
        const fetchNotification = async () => {
            if (isAutheticate){
                try {
                    const response = await axios.get('http://localhost:5100/api/user/notifications', {withCredentials: true})
                    console.log ('Fetch notifications', response.data.notifications)
                    setNotifications(response.data.notifications)
                } catch (e){
                    console.log(e)
                }
            }
        }
        fetchNotification()
        
            // socket?.emit('displayNotifications')
            // socket?.on('notifications', (data) => {
            //     setNotifications(data);
            //   });
        },[isAutheticate]
    )
    return (
        <div>
          {isAutheticate && (
            <div>
              <h2>Notifications</h2>
              <ul>
                {notifications.map((notification, index) => (
                  <li key={index}>{notification}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    };
    export default NotificationList
