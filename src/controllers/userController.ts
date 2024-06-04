import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.ts';
import MealModel from '../models/MealModel.ts';
import UserModel from '../models/UserModel.ts';
import { getUserItems, modifyOrdinaryInfo, modifyUserItems } from '../services/userServices.ts';

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
    const cart = await getUserItems(req.user.userId, 'cart');
    res.status(StatusCodes.OK).send({ cart });
}

export const getLeftOver = async (req: Request, res: Response) => {
    const leftOver = await getUserItems(req.user.userId, 'leftOver');
    res.status(StatusCodes.OK).send({ leftOver });
}

export const updateCart = async (req: Request, res: Response) => {
    await modifyUserItems(req.user.userId, req.body, 'cart');
    res.status(StatusCodes.OK).send({ msg: 'update cart' });
};

export const updateLeftOver = async (req: Request, res: Response) => {
    await modifyUserItems(req.user.userId, req.body, 'leftOver');
    res.status(StatusCodes.OK).send({ msg: 'update leftOver' });
};

export const getLikedMeals = async (req: Request, res: Response) => {
    const likedMeals = await getUserItems(req.user.userId, 'likedMeal');
    res.status(StatusCodes.OK).send({ likedMeals });
}

export const updateLikedMeals = async (req: Request, res: Response) => {
    const { mealId, meal_Id } = req.body;
    let newMeal = await MealModel.findById(meal_Id).exec();
    if (newMeal) {
        res.status(StatusCodes.OK).send({ msg: 'update likedMeals' });
    }

}