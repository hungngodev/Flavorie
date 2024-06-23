import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/authRouter.ts";
import ingredientRouter from "./routes/ingredientRouter.ts";
import mealRouter from "./routes/mealRouter.ts";
import postRouter from "./routes/postRouter.ts";
import receiptScanRouter from "./routes/receiptScanRouter.ts";
import userRouter from "./routes/userRouter.ts";
import bugRouter from "./routes/bugRouter.ts";
import reviewRouter from "./routes/reviewRouter.ts";
import http from "http";
import { Server } from "socket.io";
import { roomHandler } from "./handler/roomHandler.ts";


dotenv.config();
const app = express();

// public
const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./client/dist")));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(mongoSanitize());


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
}, 
maxHttpBufferSize: 1e8
});

io.on("connection", (socket) => {
    console.log("a user connected");
    roomHandler(socket);
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/test", (req, res) => {
  res.json({ msg: "test route" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/meal", mealRouter);
app.use("/api/ingredient", ingredientRouter);
app.use("/api/scan-receipt", receiptScanRouter)
app.use("/api/community", postRouter);
app.use("/api/community/reviews", reviewRouter);
app.use("/api/bug", bugRouter)

// app.use("*", (req, res) => {
//   res.status(404).json({ msg: "not found" });
// });

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGODB_URL ?? "");
  app.listen(port, () => {
    console.log(`server running on PORT ${port}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

// console.log('server started');
