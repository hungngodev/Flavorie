import { Router } from "express";
import rateLimiter from "express-rate-limit";
import {
  createPostController,
  deletePostController,
  newFeedController,
  updatePostController,
} from "../controllers/postController.ts";
import { checkUser } from "../middleware/authMiddleware.ts";
import { bindAuthor, checkAuthor } from "../middleware/postMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";

const router = Router();
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

router.get("/");
router.get("/feed", checkUser, apiLimiter, newFeedController);
router.post("/post", checkUser, bindAuthor, apiLimiter, createPostController);
router.put(
  "/post/:postid",
  checkUser,
  catchAsync(checkAuthor),
  apiLimiter,
  updatePostController,
);
router.delete(
  "/post/:postid",
  checkUser,
  catchAsync(checkAuthor),
  apiLimiter,
  deletePostController,
);

export default router;
