import { io } from 'socket.io-client';

const socket = io('https://localhost:5100', {
    withCredentials: true,
    autoConnect: false,
});

export default socket;
