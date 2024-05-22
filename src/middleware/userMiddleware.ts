import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel.ts";
import ItemModel from "../models/ItemModel.ts";

export async function getDietAndAllergy(req: Request, res: Response, next: NextFunction) {
    const allergy = [];
    const diet = [];
    if (req.user) {
        const thisUser = await User.findOne({ _id: req.user.userId });
        if (thisUser) {
            allergy.push(...thisUser.allergy);
            diet.push(thisUser.diet);
        }
    }
    req.body.allergy = allergy;
    req.body.diet = diet;
    next();
}

export async function getLeftOver(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.user;
    const items = await ItemModel.find({ userId: userId, type: 'leftover' }).populate('itemId');
    req.body.getLeftOver = items.map((item) => item.itemId);
}

