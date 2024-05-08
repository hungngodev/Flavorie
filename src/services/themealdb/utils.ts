import { get } from "http";
import { Areas, Categories, Ingredients } from "./data.ts";
import { filterParamType } from "./type";

// get a random key from a data array
export const getRandomKey = (givenData: string[]): string => {
  const randomIndex = Math.floor(Math.random() * givenData.length);
  return givenData[randomIndex];
};

// get a data array based on a filter
export const getDataFromParam = (param: filterParamType): string[] => {
  let dataFromParam: any = [];
  switch (param) {
    case "area":
      dataFromParam = Areas;
      break;
    case "category":
      dataFromParam = Categories;
      break;
    case "ingredient":
      dataFromParam = Ingredients;
      break;
    default:
      dataFromParam = [];
  }
  return dataFromParam;
};

// get query parameter for API call from a filter
export const getQueryParameter = (filter: filterParamType): string | null => {
  let queryParam = null;
  switch (filter) {
    case "area":
      queryParam = "a";
      break;
    case "category":
      queryParam = "c";
      break;
    case "ingredient":
      queryParam = "i";
      break;
    default:
      queryParam = null;
  }
  return queryParam;
};

// check if a key exists in a data array of a filter
export const getFilteredValue = (
  filter: filterParamType,
  filterValue: string | "random",
): string | null => {
  let resultCategory = null;
  const data = getDataFromParam(filter);

  if (filterValue == "random") {
    filterValue = getRandomKey(data);
  }
  if (!data.includes(filterValue)) {
    resultCategory = null;
  } else {
    resultCategory = filterValue;
  }
  return resultCategory ?? null;
};