import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const rooms: Record<string, Record<string, IUser>> = {};
const chats: Record<string, IMessage[]> = {};
interface IUser {
  userName: string;
  userId: string;
  peerId?: undefined | string;
}
interface IRoomParams {
  roomId: string;
  userId: string;
  peerId?: string;
}

interface IJoinRoomParams extends IRoomParams {
  userName: string;
  userId: string;
}
interface IMessage {
  content: string;
  author?: string;
  timestamp: number;
}

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = {};
    socket.emit("room-created", { roomId });
    console.log("user created the room");
  };
  const joinRoom = ({ roomId, peerId, userName, userId }: IJoinRoomParams) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    if (!chats[roomId]) chats[roomId] = [];
    socket.emit("get-messages", chats[roomId]);
    rooms[roomId][userId] = { userId, userName, peerId };
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { peerId, userName, userId });
    socket.emit("get-users", {
      roomId,
      participants: rooms[roomId],
    });

    socket.on("disconnect", () => {
      console.log("user left the room", userId);
      leaveRoom({ roomId, userId });
    });
  };

  const leaveRoom = ({ userId, roomId }: IRoomParams) => {
    // rooms[roomId] = rooms[roomId]?.filter((id) => id !== userId);
    socket.to(roomId).emit("user-disconnected", userId);
  };

  const startSharing = ({ userId, roomId }: IRoomParams) => {
    console.log("sharing started", userId);
    socket.to(roomId).emit("user-started-sharing", userId);
  };

  const stopSharing = ({ roomId }: { roomId: string }) => {
    console.log("leaving room", roomId);
    socket.to(roomId).emit("user-stopped-sharing");
  };

  const toggleVideo = ({ roomId, userId }: IRoomParams) => {
    console.log("stopping video", userId);
    socket.to(roomId).emit("user-toggle-video", userId);
  };

  const addMessage = (roomId: string, message: IMessage) => {
    console.log({ message });
    if (chats[roomId]) {
      chats[roomId].push(message);
    } else {
      chats[roomId] = [message];
    }
    socket.to(roomId).emit("add-message", message);
  };

  const changeName = ({
    userId,
    userName,
    roomId,
  }: {
    userId: string;
    userName: string;
    roomId: string;
  }) => {
    if (rooms[roomId] && rooms[roomId][userId]) {
      rooms[roomId][userId].userName = userName;
      socket.to(roomId).emit("name-changed", { userId, userName });
    }
  };
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
  socket.on("change-name", changeName);
  socket.on("toggle-video", toggleVideo);
};
