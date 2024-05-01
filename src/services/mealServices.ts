import Meals, { Meal } from '../models/MealModel';

export const getAllMeals = async () => {
    return await Meals.find();
}