import { Router } from "express";
import rateLimiter from "express-rate-limit";
import multer from "multer";
import {
  createPostController,
  deletePostController,
  newFeedController,
  reactPostController,
  updatePostController,
} from "../controllers/postController.ts";
import { PostError } from "../errors/customErrors.ts";
import { checkUser } from "../middleware/authMiddleware.ts";
import {
  bindAuthor,
  checkAuthor,
  handleMediaFiles,
} from "../middleware/postMiddleware.ts";
import { storage } from "../services/cloudinary/cloudinaryServices.ts";
import { catchAsync } from "../utils/catchAsync.ts";

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 500 MB limit
  },
});

const router = Router();
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

router.get("/");
router.get("/feed", checkUser, apiLimiter, newFeedController);
router.post(
  "/post",
  apiLimiter,
  upload.array("media"),
  checkUser,
  // req.body.media -> req.files
  // req.user.userId -> req.body.author
  // handleMediaFiles,
  bindAuthor,
  createPostController,
);

router.put(
  "/post/:postid",
  apiLimiter,
  upload.array("media"),
  checkUser,
  catchAsync(checkAuthor),
  updatePostController,
);

router.delete(
  "/post/:postid",
  checkUser,
  catchAsync(checkAuthor),
  apiLimiter,
  deletePostController,
);

router.post("/post/react/:postid", checkUser, apiLimiter, reactPostController);

export default router;
