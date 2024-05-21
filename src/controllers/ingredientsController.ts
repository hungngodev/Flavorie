import { Request, Response } from 'express';
import { getAllIngredientsAPI } from '../services/spoonacular/spoonacularServices.ts';
import { ServerError } from '../errors/customErrors.ts';
import Ingredients from '../models/IngredientsModel.ts';
import User from '../models/UserModel.ts';
import { classifyIngredient, getIngredientWithName, getIngredientsWithCategory } from '../services/ingredientServices.ts';
import { IngredientBank } from '../utils/queryBank.ts';
import { StatusCodes } from 'http-status-codes';
import { Ingredient } from '../models/IngredientsModel.ts';
import { findIngredientById } from '../services/spoonacular/spoonacularServices.ts';
import { error } from 'console';

export const getAllIngredients = async (req: Request, res: Response) => {
    const allergy = [];
    const diet = [];
    if (req.user) {
        const thisUser = await User.findOne({ _id: req.user.userId }).populate<{}>('leftOver');
        if (thisUser) {
            allergy.push(...thisUser.allergy);
            diet.push(thisUser.diet);
        }
    }
    try {
        const classifiedIngredients = await classifyIngredient()
        res.status(StatusCodes.OK).json({
            classifiedIngredients: classifiedIngredients,
            allergy,
            diet,
        })
    }
    catch (e) {
        console.error('Error classifying ingredients:', e)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ServerError('Failed to classify ingredients'))
    }

    // res.json({ ingredients, allergy, diet, leftOver }).status(StatusCodes.OK);
}

export const searchIngredients = async (req: Request, res: Response) => {
    const ingredientName = req.query.ingredientName as string;
    let { allergy, diet } = req.body;
    if (!allergy || !diet) allergy = diet = [];
    const ingredients = await getAllIngredientsAPI(allergy, diet, ingredientName);
    res.json({ ingredients }).status(StatusCodes.OK);
}

export const getIndividualIngredient = async (req: Request, res: Response) => {
    const ingredientId = req.params.ingredientId;
    const ingredient = await findIngredientById('', parseInt(ingredientId));
    res.json({ ingredient }).status(StatusCodes.OK);
}


