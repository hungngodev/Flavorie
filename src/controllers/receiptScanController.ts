import axios from "axios";
import { Request, Response } from "express";
import FormData from "form-data";
import multer from "multer";
import { storage } from "../services/cloudinary/cloudinaryServices.ts";

const upload = multer({ storage })

const FLASK_SERVICE_URL = 'http://127.0.0.1:5000/scan-receipts'

const processReceipt = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No image uploaded.')
    }

    const imageUrl = req.file.path
    try {
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const formData = new FormData();
        formData.append('receipt', imageResponse.data, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        })
        const response = await axios.post(FLASK_SERVICE_URL, formData, {
            headers: {
                ...formData.getHeaders(),
            }
        })
        return res.json({
            message: "Image processed successfully",
            data: response.data
        })
    }
    catch (error) {
        console.log("Error calling Flask", error);
        return res.status(500).send("Failed to process image")
    }
}
export { processReceipt, upload };
