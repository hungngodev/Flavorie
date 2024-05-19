import { Tag, TagCloseButton, TagLabel, TagLeftIcon, TagProps} from '@chakra-ui/react';
import React, {useState} from 'react';
import { PiFishSimple, PiGrainsBold, PiShrimp } from "react-icons/pi";
import { Milk, EggFried, Wheat, WheatOff, Bean, Salad, Nut, FishOff, Cherry, Beef, CandyOff} from "lucide-react";
import { SlChemistry } from "react-icons/sl";
import { GiSesame } from "react-icons/gi";
import { TbBrandPeanut, TbMeatOff } from "react-icons/tb";

export type Allergy = "Dairy" | "Egg" | "Gluten" | "Grain" | "Peanut" | "Seafood" | "Sesame" | "Shellfish" | "Soy" | "Sulfite" | "Tree Nut" | "Wheat";
export type Diet = "Gluten Free" | "Ketogenic" | "Vegetarian" | "Lacto-Vegetarian" | "Ovo-Vegetarian" | "Vegan" | "Pescetarian" | "Paleo" | "Primal" | "Whole30" | "Low FODMAP"
export const allergyTypes: Allergy[] = ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"];
export const dietTypes: Diet[] = ["Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Whole30", "Low FODMAP"];

type AllergyIcons = Record<Allergy | Diet, React.ComponentType>;

const Icons: AllergyIcons = {
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


interface CustomTagProps extends TagProps {
  type: Allergy | Diet
  props?: TagProps;
  children?: React.ReactNode;
  canClose?: boolean;
  isOpen?: boolean;
  handleClose?: () => void;
  handleClick?: () => void;
}

const CustomTag: React.FC<CustomTagProps> = React.forwardRef<HTMLSpanElement, CustomTagProps>(
  (
    {
      canClose = false,
      handleClose,
      handleClick,
      fontSize = 'md',
      children,
      type,
      ...props
    },
    ref,
  ) => {
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
   
    const [isOpen, setOpen] = useState<boolean>(true);
    const defaultClose = () =>  {setOpen(!isOpen); console.log("clicked")};
    return (
      <>
        {isOpen && (
            <Tag
            {...props}
            ref={ref}
            onClick={handleClick}
            boxShadow="md"
            borderRadius="full"
            fontWeight="bold"
            bgColor={allergyTypes.includes(type as Allergy) ? colorScheme['allergy']['background'] : colorScheme['diet']['background']}
            color={dietTypes.includes(type as Diet) ? colorScheme['diet']['text'] : colorScheme['allergy']['text']}
            pl="1"
            pr="3"
            width="max-content"
          >
          <TagLeftIcon as={Icons[type] ?? Salad} backgroundColor="gray.50" borderRadius="full" boxSize="2.25rem" border="1px" borderWidth="0.5rem" borderColor="gray.50"/> 
          <TagLabel py="3" width="fit-content" fontSize="md" whiteSpace='nowrap'>{type}</TagLabel>
          {canClose && <TagCloseButton onClick={handleClose ?? defaultClose} />}
        </Tag>
        )}
      </>
    );
  },
);

export default CustomTag;
