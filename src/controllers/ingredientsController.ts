import { Request, Response } from 'express';
import { getAllIngredientsAPI } from '../services/spoonacularServices.ts';
import { ServerError } from '../errors/customErrors.ts';
import { all } from 'axios';
import User from '../models/UserModel.ts';


export const getAllIngredients = async (req: Request, res: Response) => {
    const allergy = [];
    const diet = [];
    if (req.user) {
        const thisUser = await User.findOne({ _id: req.user.userId });
        if (thisUser) {
            allergy.push(...thisUser.allergy);
            diet.push(thisUser.diet);
        }
    }
    try {
        const response = await getAllIngredientsAPI(allergy, diet, 'meat');
        res.status(200).json(response);
    } catch (error) {
        throw new ServerError(`${error}`);
    }
}