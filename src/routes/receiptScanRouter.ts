import express from "express"
import { processReceipt, upload } from "../controllers/receiptScanController.ts"

const router = express.Router();

router.post('/', upload.single('receipt'), processReceipt);
export default router;