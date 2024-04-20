import { Request, Response } from 'express';
import { getAllIngredientsAPI } from '../services/spoonacularServices.ts';
import { ServerError } from '../errors/customErrors.ts';
import Ingredients from '../models/Ingredients.ts';
import User from '../models/UserModel.ts';
import { getIngredientWithName, getIngredientsWithCategory } from '../services/ingredientServices.ts';
import { IngredientBank } from '../utils/queryBank.ts';
import { StatusCodes } from 'http-status-codes';

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
    const cagetory = Object.keys(IngredientBank);
    let ingredients = [];
    for (let i = 0; i < cagetory.length; i++) {
        const category = cagetory[i];
        const ingredientsInCategory = await getIngredientsWithCategory(category);
        ingredients.push({
            category,
            ingredients: ingredientsInCategory
        });
    }
    res.json({ ingredients, allergy, diet }).status(StatusCodes.OK);
}

export const searchIngredients = async (req: Request, res: Response) => {
    const ingredientName = req.query.ingredientName as string;
    const ingredients = await getIngredientWithName(ingredientName);
    res.json({ ingredients }).status(StatusCodes.OK);
}