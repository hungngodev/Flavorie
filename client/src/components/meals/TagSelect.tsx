import {HStack, Button, VStack, Text} from "@chakra-ui/react"
import React, {useState} from "react";
import CustomTag from "./CustomTag"
import { PiFishSimple, PiGrainsBold, PiShrimp } from "react-icons/pi";
import { Milk, EggFried, Wheat, WheatOff, Bean, Salad, Nut, FishOff, Cherry, Beef, CandyOff} from "lucide-react";
import { SlChemistry } from "react-icons/sl";
import { GiSesame } from "react-icons/gi";
import { TbBrandPeanut, TbMeatOff } from "react-icons/tb";

export type Allergy = "Dairy" | "Egg" | "Gluten" | "Grain" | "Peanut" | "Seafood" | "Sesame" | "Shellfish" | "Soy" | "Sulfite" | "Tree Nut" | "Wheat";
export type Diet = "Gluten Free" | "Ketogenic" | "Vegetarian" | "Lacto-Vegetarian" | "Ovo-Vegetarian" | "Vegan" | "Pescetarian" | "Paleo" | "Primal" | "Whole30" | "Low FODMAP"
export const allergyTypes: Allergy[] = ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"];
export const dietTypes: Diet[] = ["Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Whole30", "Low FODMAP"];

export type PreferenceType = Allergy | Diet;
export const Preferences: PreferenceType[] = ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat", "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Whole30", "Low FODMAP"];

const Icons: Record<Allergy | Diet, React.ComponentType> = {
  "Dairy": Milk,
  "Egg": EggFried,
  "Gluten": Wheat,
  "Grain": PiGrainsBold,
  "Peanut": TbBrandPeanut,
  "Seafood": PiFishSimple,
  "Sesame": GiSesame,
  "Shellfish": PiShrimp,
  "Soy": Bean,
  "Sulfite": SlChemistry,
  "Tree Nut": Nut,
  "Wheat": Wheat,
  "Gluten Free": WheatOff,
  "Ketogenic": WheatOff,
  "Vegetarian": Salad,
  "Lacto-Vegetarian": TbMeatOff,
  "Ovo-Vegetarian": TbMeatOff,
  "Vegan": Salad,
  "Pescetarian": FishOff,
  "Paleo": Cherry,
  "Primal": Beef,
  "Whole30": CandyOff,
  "Low FODMAP": Beef,
};

const colorScheme = {
  allergy: {
    background: 'red.200',
    text: 'red.800',
  },
  diet: {
    background: 'orange.200',
    text: 'orange.800',
  },
};

const TagSelect = () => {
  const [selectedTags, setSelectedTags] = useState<Set<PreferenceType>>(new Set([]));

  const handleSelect = (field: PreferenceType) => {
    if(selectedTags.has(field)){
      setSelectedTags((prevTags)=>{
        prevTags.delete(field);
        return new Set(prevTags);
      })
    }
    else{
      setSelectedTags((prevTags)=>{
        prevTags.add(field);
        return new Set(prevTags);
      })
    }
  }

  const submitTags = () => {
    const tagRequest = {
      tags: Array.from(selectedTags)
    }
    console.log(tagRequest);
  }
  return (
    <>
      <VStack spacing={3} align="start" marginBlock={3}>
        <Text fontSize="22" fontWeight="bold">
          Allergies:
        </Text>
        <HStack flexWrap="wrap">
          {allergyTypes.map((type) => (
            <CustomTag
              key={type}
              type={type}
              onClick={() => handleSelect(type)}
              border={selectedTags.has(type) ? '2px' : '0px'}
              // change component color and background base on whether it is an allergy or diet
              bgColor={colorScheme.allergy.background}
              color={colorScheme.allergy.text}
              icon={Icons[type]}
            />
          ))}
        </HStack>
        <Text fontSize="22" fontWeight="bold">
          Diets:
        </Text>
        <HStack flexWrap="wrap">
          {dietTypes.map((type) => (
            <CustomTag
              key={type}
              type={type}
              onClick={() => handleSelect(type)}
              border={selectedTags.has(type) ? '2px' : '0px'}
              bgColor={colorScheme.diet.background}
              color={colorScheme.diet.text}
              icon={Icons[type]}
            />
          ))}
        </HStack>
      </VStack>
      <Button mt="1" onClick={submitTags}>SubmitTags</Button>
    </>
  );
}

export default TagSelect;
