import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
    title: String, 
    imageUrl: String, 
    description: String,
})
export default mongoose.model('Ingredient', IngredientSchema)