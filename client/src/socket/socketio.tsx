import { io } from "socket.io-client";

const socket = io('http://localhost:5100', 
    {
    withCredentials: true,
    autoConnect: false
}
)

export default socket
