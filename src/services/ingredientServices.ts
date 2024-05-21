import Ingredients from "../models/IngredientsModel.ts";
import { Ingredient } from "../models/IngredientsModel.ts";
import { IngredientBank } from "../utils/queryBank.ts";

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

type QueryResults = {
    queryKey: string,
    ingredients: {
        id: number,
        name: string,
        image: string,
        category: string[]
    }[]
}
type CategoryResults = {
    categoryName: string,
    numberOfQueryKeys: number,
    totalNumberOfIngredients: number,
    results: QueryResults[]
}
export async function classifyIngredient() {
    const outputs: CategoryResults[] = []
    for (const category in IngredientBank) {
        const queryKeys = IngredientBank[category as keyof typeof IngredientBank]
        const categoryResults: CategoryResults = {
            categoryName: category,
            numberOfQueryKeys: queryKeys.length,
            totalNumberOfIngredients: 0,
            results: []
        }

        for (const key of queryKeys) {
            const ingredients = await Ingredients.aggregate([
                {
                    $match: {
                        originalName: { $regex: key, $options: 'i' },
                        relevance: { $exists: true, }
                    }
                },
                {
                    $addFields: { relevance_count: { $size: "$relevance" } }
                },
                {
                    $sort: { relevance_count: -1 }
                }
            ])

            categoryResults.totalNumberOfIngredients += ingredients.length
            if (ingredients.length === 0) continue;
            categoryResults.results.push({
                queryKey: key,
                ingredients: ingredients.map(ingredient => ({
                    id: ingredient._id.toString(),
                    name: ingredient.name,
                    image: "https://img.spoonacular.com/ingredients_100x100/" + ingredient.image,
                    category: ingredient.categoryPath
                }))
            })
        }
        outputs.push(categoryResults)
    }
    return outputs
}