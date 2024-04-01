import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
export const getCurrentUser = async (req: Request, res: Response) => {
    res.send('get current user');
};
export const updateUser = async (_req: Request, res: Response) => {
    res.send('update user');
};
