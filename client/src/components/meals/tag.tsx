import { Tag, TagCloseButton, TagLabel, TagLeftIcon, TagProps} from '@chakra-ui/react';
import React, {useState} from 'react';
import { PiFishSimple } from "react-icons/pi";

export type Allergy = "Dairy" | "Egg" | "Gluten" | "Grain" | "Peanut" | "Seafood" | "Sesame" | "Shellfish" | "Soy" | "Sulfite" | "Tree Nut" | "Wheat";
export type Diet = "Gluten Free" | "Ketogenic" | "Vegetarian" | "Lacto-Vegetarian" | "Ovo-Vegetarian" | "Vegan" | "Pescetarian" | "Paleo" | "Primal" | "Whole30" | "Low FODMAP"


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
    const allergyTypes: Allergy[] = ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"];
    const dietTypes: Diet[] = ["Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Whole30", "Low FODMAP"];
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
            pl="2"
            pr="3"
          >
          <TagLeftIcon as={PiFishSimple} backgroundColor="gray.50" borderRadius="full" boxSize="2.25rem" border="1px" borderWidth="0.5rem" borderColor="gray.50"/> 
          <TagLabel py="4" minWidth="4rem" fontSize="lg">{type}</TagLabel>
          {canClose && <TagCloseButton onClick={handleClose ?? defaultClose} />}
        </Tag>
        )}
      </>
    );
  },
);

export default CustomTag;
