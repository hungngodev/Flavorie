import { Router } from "express";
import rateLimiter from "express-rate-limit";
import {
  createPost,
  deletePost,
  updatePost,
} from "../controllers/postController.ts";
import { checkUser } from "../middleware/authMiddleware.ts";

const router = Router();
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

router.get("/");
router.post("/post", checkUser, apiLimiter, createPost);
router.put("/post/:postid", checkUser, apiLimiter, updatePost);
router.delete("/post/:postid", checkUser, apiLimiter, deletePost);

export default router;
