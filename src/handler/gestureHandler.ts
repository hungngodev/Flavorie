// import axios from "axios";
// import FormData from "form-data";
import { Socket } from "socket.io";
import redisClient from "../services/redisClient/index";

// const FLASK_GESTURE_URL = "http://127.0.0.1:5000/virtual-mouse";
export const gestureHandler = (socket: Socket) => {
  socket.on("sendFrame", async data => {
    try {
      // const form = new FormData();
      // form.append("image", data.image, "frame.jpg");
      // const response = await axios.post(FLASK_GESTURE_URL, form, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      const imageBuffer = Buffer.from(data.image, "base64");
      await redisClient.xadd("server:gesture", "*", "image", imageBuffer);

      // socket.emit("receiveAction", response.data.action);
    } catch (err) {
      console.log("error processing gesture", err);
    }
  });
};
