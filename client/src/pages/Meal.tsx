import { Specialty } from "../components/meals/Specialty";
import { SearchBar } from "../components/ingredients/SearchBar";
import { Flex, HStack, VStack } from "@chakra-ui/react";

function Meal() {
  return ( 
    <VStack spacing={4}>
    <Specialty />
    <SearchBar />
    </VStack>
      
    
  )
}

export default Meal;
