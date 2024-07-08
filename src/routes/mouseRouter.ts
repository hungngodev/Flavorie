import { virtualMouse } from '../controllers/virtualController.ts'
import { Router } from "express";

const router = Router();
router.post('/virtual-mouse', virtualMouse)
export default router