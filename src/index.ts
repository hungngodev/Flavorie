import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";

import authRouter from "./routes/authRouter";
import bugRouter from "./routes/bugRouter";
import ingredientRouter from "./routes/ingredientRouter";
import mealRouter from "./routes/mealRouter";
import postRouter from "./routes/postRouter";
import reviewRouter from "./routes/reviewRouter";
import userRouter from "./routes/userRouter";
import redisClient from "./services/redisClient/index";
// import reviewRouter from "./routes/reviewRouter";

import { createServer } from "http";
import { setUpSocketIO } from "./socketio/socketio";

dotenv.config();
redisClient.on("connect", () => {
  console.log("Redis at index");
});
const app = express();

// public
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const port = process.env.PORT || 5100;

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
// const __dirname = dirname(fileURLToPath(import.meta.url));
// app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.use(mongoSanitize());

const server = createServer(app);
setUpSocketIO(server);

app.get("/api/test", (req, res) => {
  res.json({ msg: "test route" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/meal", mealRouter);
app.use("/api/ingredient", ingredientRouter);
// app.use("/api/scan-receipt", receiptScanRouter)
app.use("/api/community", postRouter);
app.use("/api/community", reviewRouter);
app.use("/api/bug", bugRouter);

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
// });

// app.use("*", (req, res) => {
//   res.status(404).json({ msg: "not found" });
// });

try {
  mongoose.connect(process.env.MONGODB_URL ?? "");
  // app.listen(port, () => {
  //   console.log(`server running on PORT ${port}...`);
  // });
  server.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
