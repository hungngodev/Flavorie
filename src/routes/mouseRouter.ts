import { Router } from "express";
import { virtualMouse } from "../controllers/virtualController";

const router = Router();
router.post("/virtual-mouse", virtualMouse);
export default router;
