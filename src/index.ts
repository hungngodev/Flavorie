import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from 'fs'
import "express-async-errors";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { authenticateUser } from "./middleware/authMiddleware.ts";
import authRouter from "./routes/authRouter.ts";
import ingredientRouter from "./routes/ingredientRouter.ts";
import mealRouter from "./routes/mealRouter.ts";
import userRouter from "./routes/userRouter.ts";
// import receiptScanRouter from "./routes/receiptScanRouter.ts"
import { createServer } from "http";
import { Server } from "socket.io";
import FormData from "form-data";
import axios from "axios";
import { Form } from "react-router-dom";

dotenv.config();
const app = express();
// const allowedOrigins = 'http://localhost:5173';



// public
const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./client/dist")));

// app.use(cors());
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true 
// }));
// app.use(cors:)

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/test", (req, res) => {
  res.json({ msg: "test route" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", authenticateUser, userRouter);
app.use("/api/meal", mealRouter);
app.use("/api/ingredient", ingredientRouter);
// app.use("/api", receiptScanRouter)



// app.use("*", (req, res) => {
//   res.status(404).json({ msg: "not found" });
// });

const port = process.env.PORT || 5100;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  // console.log('user is connected');
  // console.log(socket)

socket.on("submitReceipt", async (data) => {
  console.log(data)
  try {
    const fileBuffer = Buffer.from(data, 'base64');
      const filePath = `${data.filename}`;
      fs.writeFileSync(filePath, fileBuffer);

      // Prepare the file to be sent to the Flask microservice
      const form = new FormData();
      form.append('receipt', fs.createReadStream(filePath), data.filename);
    const response = await axios.post('http://127.0.0.1:5000/scan-receipts', form, {
      headers: form.getHeaders()
    })
    socket.emit('processReceipt', response.data)
  } catch (error) {
    console.error('Error processing receipt:', error);
socket.emit('error', 'Failed to process receipt');
  }

  // try {
//     // const formData = new FormData()
//     // const imageUrl = file.path
//     // const imageResponse = await axios.get(imageUrl, {responseType: 'arraybuffer'});
//     // formData.append('receipt', imageResponse.data, {
//     //     filename: file.originalname,
//     //     contentType: file.mimetype
//     // })
//     const response = await axios.post('http://127.0.0.1:5000/scan-receipts', file
//     )
//     socket.emit('processReceipt', response.data)
//   }
//  catch (error) {
//   console.error('Error processing receipt:', error);
//       socket.emit('error', 'Failed to process receipt');
// }
})

  // socket.emit("message", "Hello")

  // socket.on('disconnect', () => {
  //   console.log('user disconnected')
  // })
})
try {
  await mongoose.connect(process.env.MONGODB_URL ?? "");
  // app.listen(port, () => {
  //   console.log(`server running on PORT ${port}...`);
  // });
  server.listen(port, () => {
    console.log('Server is running')
  })
} catch (error) {
  console.log(error);
  process.exit(1);
}

export { io }
// console.log('server started');
