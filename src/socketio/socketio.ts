import { Server, Socket } from "socket.io";
import { gestureHandler } from "../handler/gestureHandler.ts";
import { notificationHandler } from "../handler/notificationHandler.ts";
import { roomHandler } from "../handler/roomHandler.ts";
import { verifyJWT } from "../utils/tokenUtils.ts";
interface Cookies {
  [key: string]: string;
}
const authenticateSocketIO = (socket: Socket, next: Function) => {
  try {
    const cookie = socket.handshake.headers.cookie;
    const cookies: Cookies = {};
    if (cookie) {
      cookie.split(";").forEach(cookie => {
        const [key, value] = cookie.trim().split("=");
        cookies[key] = value;
      });
    }
    const token = cookies["flavorie_session_token"] || undefined;
    // console.log("COOKIE", cookies);
    // console.log("authenticate", token);
    if (token) {
      const { userId, role } = verifyJWT(token);
      socket.data.user = { userId, role };
      next();
    } else {
      console.log("authenticate invalid");
      next(new Error("authenticate invalid"));
    }
  } catch (error) {
    console.log("NOT TOKEN ERROR", error);
    next(new Error("authenticate error"));
  }
};

const setUpSocketIO = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 1e8,
  });

  io.use(authenticateSocketIO);
  io.on("connection", (socket: Socket) => {
    console.log("connected");
    roomHandler(socket);
    notificationHandler(socket);
    gestureHandler(socket);
  });

  return io;
};

export { setUpSocketIO };
