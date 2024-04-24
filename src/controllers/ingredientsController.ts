import { Request, Response } from 'express';
import { getAllIngredientsAPI } from '../services/spoonacular/spoonacularServices.ts';
import { ServerError } from '../errors/customErrors.ts';
import Ingredients from '../models/IngredientsModel.ts';
import User from '../models/UserModel.ts';
import { getIngredientWithName, getIngredientsWithCategory } from '../services/ingredientServices.ts';
import { IngredientBank } from '../utils/queryBank.ts';
import { StatusCodes } from 'http-status-codes';
import { Ingredient } from '../models/IngredientsModel.ts';

export const getAllIngredients = async (req: Request, res: Response) => {
    const allergy = [];
    const diet = [];
    const leftOver = [];
    if (req.user) {
        const thisUser = await User.findOne({ _id: req.user.userId }).populate<{}>('leftOver');
        if (thisUser) {
            allergy.push(...thisUser.allergy);
            diet.push(thisUser.diet);
            leftOver.push(...thisUser.leftOver);
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

    res.json({ ingredients, allergy, diet, leftOver }).status(StatusCodes.OK);
}

export const searchIngredients = async (req: Request, res: Response) => {
    const ingredientName = req.query.ingredientName as string;
    let { allergy, diet } = req.body;
    if (!allergy || !diet) allergy = diet = [];
    const ingredients = await getAllIngredientsAPI(allergy, diet, ingredientName);
    res.json({ ingredients }).status(StatusCodes.OK);
}

