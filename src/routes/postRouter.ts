import { Router } from "express";
import rateLimiter from "express-rate-limit";
import multer from "multer";
import {
  createPostController,
  deletePostController,
  getPostController,
  getUserPostController,
  hidePostController,
  newFeedController,
  reactPostController,
  savePostController,
  updatePostController,
} from "../controllers/postController";
import { PostError } from "../errors/customErrors";
import { checkUser } from "../middleware/authMiddleware";
import {
  bindAuthor,
  checkAuthor,
  handleMediaFiles,
} from "../middleware/postMiddleware";
import { storage } from "../services/cloudinary/cloudinaryServices";
import { catchAsync } from "../utils/catchAsync";

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 500 MB limit
  },
});

const router = Router();
const apiLimiter = rateLimiter({
  windowMs: 20 * 60 * 1000,
  max: 10000,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

router.get("/post/user", apiLimiter, checkUser, getUserPostController);

router.get("/post/:postid", checkUser, apiLimiter, getPostController);

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

router.post("/post/save/:postid", apiLimiter, checkUser, savePostController);

router.post("/post/hide/:postid", apiLimiter, checkUser, hidePostController);
export default router;
