import {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} from '@/errors/customErrors.js';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export const validateLoginInput = (req: Request, res: Response, next: NextFunction) => {
    //do something
    next();
}
