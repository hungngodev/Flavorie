import { io } from 'socket.io-client';

const socket = io('https://1fed-123-20-129-45.ngrok-free.app', {
    withCredentials: true,
    autoConnect: false,
});

export default socket;
