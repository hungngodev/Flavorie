import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import { MainCategories } from "./data.ts";
import {
  areaType,
  categoryType,
  filterParamType,
  ingredientType,
} from "./type.ts";
import { getDataFromParam, getQueryParameter, getRandomKey } from "./utils.ts";
import { ServerError } from "../../errors/customErrors.ts";
import ApiTrack from "../../models/ApiTrack.ts";

dotenv.config();

export const Endpoint = {
  SINGLE_RANDOM: "/random.php",
  FILTER: "/filter.php",
  ID: (id: string) => `/lookup.php?i=${id}`,
  SEARCH: (name: string) => `/search.php?s=${name}`,
};

export const baseCall = async () => {
  let TheMealDBTrack = await ApiTrack.findOne({ serviceName: 'themealdb' });
  if (!TheMealDBTrack) {
    TheMealDBTrack = new ApiTrack({ serviceName: 'themealdb', usageCount: 0, currentKey: 0, callPerMin: 0, updatedAt: new Date(), lastMinute: new Date() });
  }
  let { usageCount, callPerMin, lastMinute } = TheMealDBTrack;

  const rate = process.env.themealdb_rate || 60;

  if (Math.abs(Number(new Date().getTime()) - Number(lastMinute)) > 10000) {
    callPerMin = 0;
    lastMinute = new Date();
  }
  if (callPerMin > Number(rate) && Math.abs(Number(new Date().getTime()) - Number(lastMinute)) < 10000) {
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  TheMealDBTrack.usageCount = usageCount + 1;
  TheMealDBTrack.callPerMin = callPerMin + 1;
  TheMealDBTrack.lastMinute = lastMinute;
  await TheMealDBTrack.save();

  return axios.create({
    baseURL: process.env.themealDB_API_ENDPOINT || "",
    timeout: 9000,
  });
}

export const getRandomMeal = async () => {
  try {
    const baseFetch = await baseCall();
    const randomMealRequest = await baseFetch.get(Endpoint.SINGLE_RANDOM);
    return randomMealRequest.data.meals[0];
  } catch (error) {
    throw new ServerError("API call for random meal error");
  }
};

export const getRandomMainMeal = async () => {
  try {
    const randomMainCategory = getRandomKey(MainCategories);

    const randomMealParam = new URLSearchParams();
    randomMealParam.append("c", randomMainCategory);
    const baseFetch = await baseCall();
    const mealRequest: AxiosResponse = await baseFetch.get(
      Endpoint.SINGLE_RANDOM,
    );

    return mealRequest.data.meals[0];
  } catch (error) {
    throw new ServerError("API call for random main meal error");
  }
};

export const getMealByFilter = async (
  filter: filterParamType,
  value: ingredientType | categoryType | areaType | "random" = "random",
  size?: number,
) => {
  try {
    value = value.toString().toLowerCase();
    const searchParam = new URLSearchParams();
    const filteredParam = getQueryParameter(filter);

    if (!filteredParam) {
      throw new Error("Invalid filter parameter");
    }
    if (value === "random") {
      const searchList = getDataFromParam(filter);
      value = getRandomKey(searchList);
    }

    searchParam.append(filteredParam, value.toLowerCase());
    const baseFetch = await baseCall();
    const mealFilterRequest = await baseFetch.get(Endpoint.FILTER, {
      params: searchParam,
    });
    if (!mealFilterRequest.data.meals) {
      return [];
    }
    if (size === 0) {
      return [];
    }
    for (let i = 0; i < mealFilterRequest.data.meals.length; i++) {
      mealFilterRequest.data.meals[i] = await getMealById(mealFilterRequest.data.meals[i].idMeal.toString());
    }
    if (size && size > mealFilterRequest.data.meals.length) {
      return mealFilterRequest.data.meals;
    }
    return size
      ? mealFilterRequest.data.meals.slice(0, size)
      : mealFilterRequest.data.meals;
  } catch (error) {
    console.log(error);
    throw new ServerError("API call for meal by filter error");
  }
};

export const getMealById = async (id: string) => {
  try {
    const baseFetch = await baseCall();
    const mealRequest = await baseFetch.get(Endpoint.ID(id));
    return mealRequest.data.meals[0];
  } catch (error) {
    console.log(error);
    throw new ServerError("API call for meal by id error");
  }
}

export const getMealByName = async (name: string) => {
  try {
    name = name.toLowerCase();
    const baseFetch = await baseCall();
    const mealRequest = await baseFetch.get(Endpoint.SEARCH(name));
    return mealRequest.data.meals;
  } catch (error) {
    throw new ServerError("API call for meal by name error");
  }
}