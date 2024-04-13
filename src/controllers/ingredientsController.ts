import { Request, Response } from 'express';
import { getAllIngredientsAPI } from '../services/spoonacularServices.ts';
import { ServerError } from '../errors/customErrors.ts';


export const getAllIngredients = async (req: Request, res: Response) => {
    try {
        const response = await getAllIngredientsAPI([], []);
        res.status(200).json(response);
    } catch (error) {
        throw new ServerError(`${error}`);
    }
}