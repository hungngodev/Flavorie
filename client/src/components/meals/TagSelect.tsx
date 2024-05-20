import {HStack, Button} from "@chakra-ui/react"
import React, {useState} from "react";
import CustomTag, {Allergy, Diet} from "./CustomTag"

export type PreferenceType = Allergy | Diet;
export const Preferences: PreferenceType[] = ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat", "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Whole30", "Low FODMAP"];

interface TagSelectProps {
    tags: PreferenceType[];
}

const TagSelect: React.FC<TagSelectProps> = ({tags}) => {
  const [selectedTags, setSelectedTags] = useState<Set<typeof tags[0]>>(new Set([]));

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
  return (
    <>
    <HStack flexWrap="wrap" marginBlock={4}>
      {Preferences.map((type) => (
        <CustomTag key={type} type={type} canClose={true} handleClick={()=>{handleSelect(type)}} border={selectedTags.has(type) ? "2px" : "0px"} />
      ))}
    </HStack>
    <Button onClick={()=>{console.log(selectedTags)}}>SubmitTags</Button>
    </>
  );
}

export default TagSelect;
