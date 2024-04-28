import mongoose, { Types } from "mongoose";
import { Ingredient } from "./IngredientsModel.ts";
export interface Meal extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    imageUrl: string;
    allIngredients: Types.DocumentArray<Ingredient>;
    missingIngredients: Types.DocumentArray<Ingredient>;
    instructions: string;
}
type MealModel = mongoose.Model<Meal>;
const MealSchema = new mongoose.Schema<Meal, MealModel>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    imageUrl: String,
    allIngredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient'
    }],
    missingIngredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient'
    }],
    instructions: String
})

export default mongoose.model<Meal>('Meal', MealSchema);