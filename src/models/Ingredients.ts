import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
    _id: String,
    title: String, 
    imageUrl: String, 
    description: String,
})