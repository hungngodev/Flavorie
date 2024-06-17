import { Router } from "express";
import rateLimiter from "express-rate-limit";
import { postService } from "../controllers/postController.ts";
import { checkUser } from "../middleware/authMiddleware.ts";
import { checkAuthor } from "../middleware/postMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";

const router = Router();
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

router.get("/");
router.post("/post", checkUser, apiLimiter, postService);
router.put(
  "/post/:postid",
  checkUser,
  catchAsync(checkAuthor),
  apiLimiter,
  postService,
);
router.delete(
  "/post/:postid",
  checkUser,
  catchAsync(checkAuthor),
  apiLimiter,
  postService,
);

export default router;
