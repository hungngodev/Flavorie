import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth.tsx";
import useSocketIO from "../../hooks/useSocketio.tsx";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";


const NotificationHeader = () => {
    const {socket} = useSocketIO()

    // const navigate = useNavigate()
    const [numberNotifications, setNumberNotifications] = useState(0)
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
        if (isAutheticate){
            socket?.on('countNotification', (cnt) => {
                setNumberNotifications(cnt)
            })
        }
        return () => {
            socket?.off('countNotification')
        }
    }, [isAutheticate, socket])

    // useEffect(() => {
    //     if (isAutheticate){
//         //     socket?.on('connect', () => {
//         //         socket?.emit('getNumberNotification', currentUser.email)
//         // socket?.on('notificationLength', (data) => {
//         //     setNumberNotifications(data)
//         // })
//         // const timer = setTimeout(() => {
//         //     socket.emit('getNumberNotification', currentUser.email)
//         // }, 30000)
//         return () => {
//             socket.off('notificationLength')
//             clearTimeout(timer)
//         }
//             })
//         // socket?.emit('getNumberNotification', currentUser.email)
//         // socket?.on('notificationLength', (data) => {
//         //     setNumberNotifications(data)
//         // })
        
//     }
// }, [isAutheticate, currentUser.email])

    return (
        // <button onClick={() => {navigate('/notificationsList')}}>
            <div>
                {isAutheticate && <div>Number of notifications: {numberNotifications}</div>}
            </div>
        // </button>
    )
}
export default NotificationHeader