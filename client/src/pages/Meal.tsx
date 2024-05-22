import { Flex } from '@chakra-ui/react';
import { SearchBar } from '../components/ingredients/SearchBar';
import { Specialty } from '../components/meals/Specialty';

function Meal() {
  return (
    <Flex>
      <Specialty />
      <SearchBar />
    </Flex>
  );
}

export default Meal;
