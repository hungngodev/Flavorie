import authRouter from "@src/routes/authRouter";
import bugRouter from "@src/routes/bugRouter";
import ingredientRouter from "@src/routes/ingredientRouter";
import mealRouter from "@src/routes/mealRouter";
import postRouter from "@src/routes/postRouter";
import reviewRouter from "@src/routes/reviewRouter";
import userRouter from "@src/routes/userRouter";
import redisClient from "@src/services/redisClient/index";
import { setUpSocketIO } from "@src/socketio/socketio";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import mongoSanitize from "express-mongo-sanitize";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import { createServer } from "http";
import mongoose from "mongoose";
import morgan from "morgan";
import { ExpressPeerServer } from "peer";

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
    origin: process.env.CLIENT_URL,
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

app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]);
const apiLimiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 5 minutes
  max: 100,
  message: { msg: "IP rate limit exceeded, retry in 5 minutes." },
});
app.use(apiLimiter);
// app.get("/api/test", (req: Request, res: Response) => {
//   res.json({ msg: "test route" });
// });
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/meal", mealRouter);
app.use("/api/ingredient", ingredientRouter);
// app.use("/api/scan-receipt", receiptScanRouter)
app.use("/api/community", postRouter);
app.use("/api/community", reviewRouter);
app.use("/api/bug", bugRouter);

const peerServer = ExpressPeerServer(server, {
  allow_discovery: true,
});

app.use(
  "/peer-server",
  (req, res, next) => {
    console.log("peer-server");
    next();
  },
  peerServer,
);
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
