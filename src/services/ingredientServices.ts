import Ingredients from "../models/IngredientsModel";
import { Ingredient } from "../models/IngredientsModel";

export async function getIngredientWithName(ingredientName: string) {
    return await Ingredients.find({
        originalName: { $regex: ingredientName, $options: 'i' }
    })
}

export async function getIngredientsWithCategory(category: string) {
    return await Ingredients.find({
        categoryPath: { $in: [category] }
    }).populate<{
        relevance: Ingredient
    }>('relevance');
}