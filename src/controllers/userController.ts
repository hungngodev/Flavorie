import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.ts';
import User from '../models/UserModel.ts';

export const getCurrentUser = async (req: Request, res: Response) => {
    const user = await User.findOne({ _id: req.user.userId });
    if (user) {
        const userWithoutPassword = user.toJSON();
        res.status(StatusCodes.OK).send({ user: userWithoutPassword });
    } else {
        throw new NotFoundError('User not found');
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const updatedUser = await User.findById(req.user.userId);
    if (!updatedUser) {
        throw new NotFoundError('User not found');
    }
    console.dir(req.files)
    if (req.files) {
        const files = req.files as Express.Multer.File[];
        updatedUser.avatar = files[0].path;
        updatedUser.avatarFileName = files[0].filename;
    }
    await updatedUser.save();
    res.status(StatusCodes.OK).send({ msg: 'update user' });
};

