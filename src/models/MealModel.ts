import mongoose, { Types } from "mongoose";
import { Ingredient } from "./IngredientModel.ts";
type Source = 'themealdb' | 'spoonacular' | 'user';
export interface Meal extends mongoose.Document {
    title: string;
    imageUrl: string;
    allIngredients: Types.DocumentArray<Ingredient>;
    instructions: string;
    source: Source;
    mealID: string;
}
type MealModel = mongoose.Model<Meal>;
const MealSchema = new mongoose.Schema<Meal, MealModel>({
    title: String,
    imageUrl: String,
    allIngredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient'
    }],
    source: {
        type: String,
        enum: ['themealdb', 'spoonacular', 'user'],
        required: true
    },
    instructions: String,
    mealID: {
        type: String,
        required: true
    }
})

export default mongoose.model<Meal>('Meal', MealSchema);