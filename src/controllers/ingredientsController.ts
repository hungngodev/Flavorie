import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ServerError } from '../errors/customErrors.ts';
import User from '../models/UserModel.ts';
import { classifyIngredient, findIngredients } from '../services/ingredientServices.ts';
import { findIngredientById, getAllIngredientsAPI } from '../services/spoonacular/spoonacularServices.ts';

export const getAllIngredients = async (req: Request, res: Response) => {
    const { category } = req.query;
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
        const classifiedIngredients = await classifyIngredient()
        res.status(StatusCodes.OK).json({
            category: category !== '/' ? classifiedIngredients.filter((SubCategory) => SubCategory.categoryName === category) : classifiedIngredients,
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
    const ingredients = await getAllIngredientsAPI(allergy, diet, ingredientName, 50);
    res.json({ ingredients }).status(StatusCodes.OK);
}

export const getIndividualIngredient = async (req: Request, res: Response) => {
    const ingredientId = req.params.ingredientId;
    const ingredient = await findIngredientById('', parseInt(ingredientId));
    res.json({ ingredient }).status(StatusCodes.OK);
}
export const getSuggestionIngredients = async (req: Request, res: Response) => {
    try {
        const query = req.query.name as string
        const formatedQuery = query.toLowerCase().trim()
        const ingredientSuggestions = await findIngredients(formatedQuery)
        const filterSuggestions = ingredientSuggestions.map((ingredient) => ({
            name: ingredient.name,
            img: ingredient.image
        }))
        res.json({filterSuggestions}).status(StatusCodes.OK)
}
catch(error){
    console.log("Error when searching ingredients", error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ServerError('Failed to search ingredients'))

}
}


