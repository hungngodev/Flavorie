import { Router } from "express";
import rateLimiter from "express-rate-limit";
import {
  checkAuth,
  login,
  logout,
  register,
} from "../controllers/authController";
import { checkUser } from "../middleware/authMiddleware";
import { validateLoginInput } from "../middleware/validateMiddleware";
import { catchAsync } from "../utils/catchAsync";

const router = Router();

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

router.get("/", checkUser, catchAsync(checkAuth));
router.post("/register", apiLimiter, catchAsync(register));
router.post("/login", apiLimiter, validateLoginInput, catchAsync(login));
router.get("/logout", logout);

export default router;
