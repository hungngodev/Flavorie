import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import { url } from "inspector";
import { never } from "zod";
import { MainCategories } from "./data.ts";
import {
  areaType,
  categoryType,
  filterParamType,
  ingredientType,
} from "./type.ts";
import { getDataFromParam, getQueryParameter, getRandomKey } from "./utils.ts";

dotenv.config();

export const Endpoint = {
  SINGLE_RANDOM: "/random.php",
  FILTER: "/filter.php",
};

const baseFetch = axios.create({
  baseURL: process.env.themealDB_API_ENDPOINT || "",
  timeout: 9000,
});

export const getRandomMeal = async () => {
  try {
    const randomMealRequest = await baseFetch.get(Endpoint.SINGLE_RANDOM);
    return randomMealRequest.data.meals[0];
  } catch (error) {
    console.log(`API call for random meal error : ${error}`);
  }
};

export const getRandomMainMeal = async () => {
  try {
    const randomMainCategory = getRandomKey(MainCategories);

    const randomMealParam = new URLSearchParams();
    randomMealParam.append("c", randomMainCategory);

    const mealRequest: AxiosResponse = await baseFetch.get(
      Endpoint.SINGLE_RANDOM,
    );

    return mealRequest.data.meals[0];
  } catch (error) {
    console.log(`API call for random main meal error : ${error}`);
  }
};

export const getMealByFilter = async (
  filter: filterParamType,
  value: ingredientType | categoryType | areaType | "random" = "random",
  size?: number,
) => {
  try {
    const searchParam = new URLSearchParams();
    const filteredParam = getQueryParameter(filter);

    if (!filteredParam) {
      throw new Error("Invalid filter parameter");
    }
    if (value === "random") {
      const searchList = getDataFromParam(filter);
      value = getRandomKey(searchList);
    }

    searchParam.append(filteredParam, value);
    const mealFilterRequest = await baseFetch.get(Endpoint.FILTER, {
      params: searchParam,
    });

    if (size === 0) {
      return [];
    } else if (size && size > mealFilterRequest.data.meals.length) {
      return mealFilterRequest.data.meals;
    }
    return size
      ? mealFilterRequest.data.meals.slice(0, size)
      : mealFilterRequest.data.meals;
  } catch (error) {
    console.log(`API call for meal by filter error : ${error}`);
  }
};
