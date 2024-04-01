import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
export const getAllIngredients = async (req: Request, res: Response) => {
    res.send('get all meals');
};
