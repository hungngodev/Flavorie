import { Router } from 'express';
import { login, logout, register } from '../controllers/authController.ts';
import rateLimiter from 'express-rate-limit';
import { validateLoginInput } from '../middleware/validateMiddleware.ts';
import { catchAsync } from '../utils/catchAsync.ts';

const router = Router();

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { msg: 'IP rate limit exceeded, retry in 15 minutes.' },
});

router.post('/register', apiLimiter, catchAsync(register));
router.post('/login', apiLimiter, validateLoginInput, catchAsync(login));
router.get('/logout', logout);

export default router;