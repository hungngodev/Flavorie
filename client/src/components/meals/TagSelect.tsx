import {Box, HStack, Button, VStack, Text} from "@chakra-ui/react"
import React, {useEffect, useState} from "react";
import CustomTag from "./CustomTag"
import { PiFishSimple, PiGrainsBold, PiShrimp } from "react-icons/pi";
import { Milk, EggFried, Wheat, WheatOff, Bean, Salad, Nut, FishOff, Cherry, Beef, CandyOff} from "lucide-react";
import { SlChemistry } from "react-icons/sl";
import { GiSesame } from "react-icons/gi";
import { TbBrandPeanut, TbMeatOff } from "react-icons/tb";
import theme from "../../style/theme";
import customFetch from "../../utils/customFetch";
import useToast from "../../hooks/useToast";
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
    background: 'rgba(212, 193, 236, 0.2)',
    text: 'rgba(51, 24, 107, 1)', 
    selectedBackground: ' rgba(159, 159, 237, 0.6)', 
  },
  diet: {
    background: 'rgba(189, 224, 254, 0.2)',
    text: 'rgba(16, 67, 159, 1)', // #10439F
    selectedBackground: 'rgba(57, 167, 255, 0.5)', 
  },
};
const TagSelect = () => {
  const [selectedTags, setSelectedTags] = useState<Set<PreferenceType>>(new Set([]));

  const {notifyError} = useToast()
  useEffect(() => {
    const fetchDietsAllergy = async () => {
      try {
        const response = await customFetch.get('/user')
        if (response.status === 200){
          const allergies = response.data.currUser.allergy 
          const diets = response.data.currUser.diet 
          setSelectedTags(new Set([...allergies, ...diets]))
        } else {
          notifyError("Cannot load your preference. Please try again")
        }
      } catch(error){
        console.log("error fetching preference", error)
        notifyError("Cannot load your preference. Please try again")
      }
    }
    fetchDietsAllergy()
  },[notifyError])
  const handleSelect = async (field: PreferenceType) => {
    const newTags = new Set(selectedTags)
    if (newTags.has(field)){
      newTags.delete(field)
    } else {
      newTags.add(field)
    }
    setSelectedTags(newTags)
      try {
        const response = await customFetch.patch("/user", {
          allergy: Array.from(newTags).filter((tag): tag is Allergy => allergyTypes.includes(tag as Allergy)),
          diet: Array.from(newTags).filter((tag): tag is Diet => dietTypes.includes(tag as Diet))
        })
        if (response.status !== 200){
          notifyError("Failed to update your preference. Please try again")
        }
      } catch(error){
        console.log("error updating your preference", error)
        notifyError("Failed to update your preference. Please try again")
      }
    };
  

  return (
    <>
      <VStack spacing={2} align="start" marginBlock={2}>
        <Text fontSize="22" fontWeight="bold">
          Allergies:
        </Text>
          <HStack flexWrap="wrap">
            {allergyTypes.map((type) => (
              <CustomTag
                key={type}
                type={type}
                onClick={() => handleSelect(type)}
                // border={selectedTags.has(type) ? '2px' : '0px'}
                bgColor={
                  selectedTags.has(type) ? colorScheme.allergy.selectedBackground : colorScheme.allergy.background
                }
                color={colorScheme.allergy.text}
                icon={Icons[type]}
              />
            ))}
          </HStack>
        <Text fontSize="22" fontWeight="bold" mt="2">
          Diets:
        </Text>
        <HStack flexWrap="wrap">
          {dietTypes.map((type) => (
            <CustomTag
              key={type}
              type={type}
              onClick={() => handleSelect(type)}
              // border={selectedTags.has(type) ? '2px' : '0px'}
              bgColor={selectedTags.has(type) ? colorScheme.diet.selectedBackground : colorScheme.diet.background}
              color={colorScheme.diet.text}
              icon={Icons[type]}
            />
          ))}
        </HStack>
      </VStack>
      {/* <Button mt="1" onClick={submitTags}>SubmitTags</Button> */}
    </>
  );
}

export default TagSelect;
