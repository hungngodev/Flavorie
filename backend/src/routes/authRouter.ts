import {
  checkAuth,
  login,
  logout,
  register,
} from "@src/controllers/authController";
import { checkUser } from "@src/middleware/authMiddleware";
import { validateLoginInput } from "@src/middleware/validateMiddleware";
import { catchAsync } from "@src/utils/catchAsync";
import { Router } from "express";
import rateLimiter from "express-rate-limit";

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
