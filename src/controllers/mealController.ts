import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
export const getAllMeals = async (req: Request, res: Response) => {
    res.send('get all meals');
};
