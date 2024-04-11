import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
    spoonacularId: Number,
    title: String,
    imageUrl: String,
    description: String,
})
export default mongoose.model('Ingredient', IngredientSchema)