import e, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.ts';
import UserModel from '../models/UserModel.ts';
import { getUserItems, modifyOrdinaryInfo, modifyUserItems } from '../services/userServices.ts';

export const getCurrentUser = async (req: Request, res: Response) => {
    if (!req.user) { res.status(StatusCodes.OK).send({ msg: 'Unauthorized' }); return; }
    const user = await UserModel.findById(req.user.userId);
    if (user) {
        res.status(StatusCodes.OK).send({ user });
    } else {
        throw new NotFoundError('User not found');
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const updatedUser = await UserModel.findById(req.user.userId);
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


export const getCart = async (req: Request, res: Response) => {
    const user = await getUserItems(req.user.userId, 'cart');
    if (user) {
        res.status(StatusCodes.OK).send({ user });
    } else {
        throw new NotFoundError('User not found');
    }
}

export const getLeftOver = async (req: Request, res: Response) => {
    const user = await getUserItems(req.user.userId, 'leftOver');
    if (user) {
        res.status(StatusCodes.OK).send({ user });
    } else {
        throw new NotFoundError('User not found');
    }
}

export const updateCart = async (req: Request, res: Response) => {
    await modifyUserItems(req.user.userId, req.body, 'cart');
    res.status(StatusCodes.OK).send({ msg: 'update cart' });
};

export const updateLeftOver = async (req: Request, res: Response) => {
    await modifyUserItems(req.user.userId, req.body, 'leftOver');
    res.status(StatusCodes.OK).send({ msg: 'update leftOver' });
};