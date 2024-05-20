import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.ts';
import { modifyOrdinaryInfo, getUserById } from '../services/userServices.ts';
import User from '../models/UserModel.ts';

export const getCurrentUser = async (req: Request, res: Response) => {
    const user = await getUserById(req.user.userId);
    if (user) {
        res.status(StatusCodes.OK).send({ user });
    } else {
        throw new NotFoundError('User not found');
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const updatedUser = await User.findById(req.user.userId);
    if (!updatedUser) {
        throw new NotFoundError('User not found');
    }
    if (req.files) {
        const files = req.files as Express.Multer.File[];
        updatedUser.avatar = files[0].path;
        updatedUser.avatarFileName = files[0].filename;
    }
    await modifyOrdinaryInfo(req.user.userId, req.body);
    await updatedUser.save();
    res.status(StatusCodes.OK).send({ msg: 'update user' });
};

