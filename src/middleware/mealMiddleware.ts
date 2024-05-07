import { NextFunction, Request, Response } from "express";
import { ServerError } from "../errors/customErrors.ts";
import { Ingredients } from "../services/themealdb/data.ts";

export const checkValidIngredient = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients)) {
    throw new ServerError("Please provide a list of ingredients");
  }

  for (let ingredient of ingredients) {
    if (!Ingredients.includes(ingredient)) {
      throw new ServerError("Invalid ingredient");
    }
  }
  next();
};
