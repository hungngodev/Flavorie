import { Request, Response } from 'express';
import axios, { AxiosHeaders } from 'axios';
import { ServerError, BadRequestError } from '../errors/customErrors.ts';
import { getAllMealsAPI } from '../services/spoonacularServices.ts';


export const getAllMeals = async (req: Request, res: Response) => {
    const { ingredients } = req.query;
    if (!ingredients || typeof ingredients !== 'string') {
        throw new BadRequestError('Please provide a list of ingredients');
    } else {
        try {
            const recipes = await getAllMealsAPI(ingredients.split(','))
            return res.json(recipes)
        } catch (error) {
            // return res.status(500).json({ message: `${error}` })
            throw new ServerError(`${error}`)
        }
    }
}