import {Box, HStack, Button, VStack, Text} from "@chakra-ui/react"
import React, {useState} from "react";
import CustomTag from "./CustomTag"
import { PiFishSimple, PiGrainsBold, PiShrimp } from "react-icons/pi";
import { Milk, EggFried, Wheat, WheatOff, Bean, Salad, Nut, FishOff, Cherry, Beef, CandyOff} from "lucide-react";
import { SlChemistry } from "react-icons/sl";
import { GiSesame } from "react-icons/gi";
import { TbBrandPeanut, TbMeatOff } from "react-icons/tb";
import theme from "../../style/theme";

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
    background: 'rgba(255, 192, 203, 0.5)',
    text: 'rgba(244, 83, 138, 1)', //rgba(244, 83, 138, 1)  rgba(255, 99, 132, 11)
    selectedBackground: ' rgba(252, 129, 158, 0.5)', // rgba(252, 129, 158, 0.4) rgba(255, 112, 171, 0.48) rgba(242, 123, 189, 0.38) rgba(255, 113, 205, 0.4)  rgba(255, 112, 171, 0.48) rgba(242, 102, 171, 0.4) rgba(255, 106, 194, 0.4)
  },
  diet: {
    background: 'rgba(189, 224, 254, 0.6)',
    text: 'rgba(16, 67, 159, 1)', // #10439F
    selectedBackground: 'rgba(57, 167, 255, 0.5)', //rgba(90, 178, 255, 0.5)  rgba(64, 162, 227, 0.4)  rgba(57, 167, 255, 0.5)
  },
};
const TagSelect = () => {
  const [selectedTags, setSelectedTags] = useState<Set<PreferenceType>>(new Set([]));

  // const handleSelect = (field: PreferenceType) => {
  //   if(selectedTags.has(field)){
  //     setSelectedTags((prevTags)=>{
  //       prevTags.delete(field);
  //       return new Set(prevTags);
  //     })
  //   }
  //   else{
  //     setSelectedTags((prevTags)=>{
  //       prevTags.add(field);
  //       return new Set(prevTags);
  //     })
  //   }
  // }

  // const submitTags = () => {
  //   const tagRequest = {
  //     tags: Array.from(selectedTags)
  //   }
  //   console.log(tagRequest);
  // }

  const handleSelect = (field: PreferenceType) => {
    setSelectedTags((prevTags) => {
      const newTags = new Set(prevTags);
      if (newTags.has(field)) {
        newTags.delete(field);
      } else {
        newTags.add(field);
      }
      return newTags;
    });
  };
  
// interface TagSelectProps {
//   handleSelect: (tag : PreferenceType) => void;
//   selectedTags: Set<PreferenceType>;
// }
// const TagSelect: React.FC<TagSelectProps> = ({handleSelect, selectedTags}) => {

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
