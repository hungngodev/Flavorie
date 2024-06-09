import { Router } from 'express';
import { createPost } from "../controllers/postController.ts"
import { checkUser } from "../middleware/authMiddleware.ts";
const router = Router();

router.get('/')
router.post("/create-post",checkUser, createPost)

export default router;