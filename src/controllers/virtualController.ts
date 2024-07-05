import axios from "axios";
import { Request, Response } from "express";

export const virtualMouse = async (req: Request, res: Response) => {
    try {
        const response = await axios.post('http://127.0.0.1:5001/virtual-mouse');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error controlling virtual mouse' });
    }
    }
