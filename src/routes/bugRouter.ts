import axios from "axios";
import dotenv from "dotenv";
import { Router } from "express";
import IngredientModel from "../models/IngredientModel";
dotenv.config();

const router = Router();

router.get("/image-fix", async (req, res) => {
  const { _id, type, name } = req.query;
  const newImageLink = await axios.get(
    `https://api.unsplash.com/search/photos?page=1&query=${name}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
  );
  if (type === "ingredient") {
    await IngredientModel.updateOne(
      { _id },
      { image: newImageLink.data.results[0].urls.small },
    );
  }

  console.log(newImageLink.data.results[0].urls.small);
  res.json(newImageLink.data.results[0].urls.small);
});

export default router;
