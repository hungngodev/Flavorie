import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '@/models/UserModel.ts';

export const register = async (req: Request, res: Response) => {
    res.send('register');
};

export const login = async (req: Request, res: Response) => {
    res.send('login');
};

export const logout = (req: Request, res: Response) => {
    res.send('logout');
};
