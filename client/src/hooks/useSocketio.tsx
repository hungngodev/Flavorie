import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const useSocketIO = () => {
    const [socket, setSocket] = useState<Socket | null>(null)
    useEffect(() => {
        const connection = io ("http://localhost:5100", {
            withCredentials: true
        })
        setSocket(connection)
    }, [])
    return {socket}
}
export default useSocketIO