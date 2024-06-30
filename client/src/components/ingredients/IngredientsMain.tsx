import { Text, VStack } from '@chakra-ui/react';
import { Pagination } from '@nextui-org/pagination';
import { useState } from 'react';
import { Category, Ingredient } from '../../pages/Ingredient';
import Hero from '../ui/Hero';
import IngredientLine from './IngredientLine';

type IngredientsMainProps = {
  data: Category;
  addFunction: (ingredientData: Ingredient) => void;
};

export function IngredientsMain({ addFunction, data }: IngredientsMainProps) {
  const [page, setPage] = useState(1);
  const size = 3;
  const dataToRender = data.results.slice((page - 1) * size, page * size);

  return (
    <VStack
      spacing={0}
      overflowX={'hidden'}
      width={'95%'}
      height={'120%'}
      marginBottom={'5vh'}
      position="relative"
      zIndex={0}
      justifyContent={'space-around'}
    >
      <Hero title="" boldTitle={data.categoryName.toUpperCase()} />
      <Text fontSize={'1.5rem'}>{data.totalNumberOfIngredients} Ingredients</Text>
      <VStack width={'100%'} height={'100%'}>
        {dataToRender.map((subCategory, index) => (
          <IngredientLine
            key={index + subCategory.queryKey}
            index={index}
            subCategory={subCategory}
            addFunction={addFunction}
          />
        ))}
      </VStack>
      <div className="h-[100px]">
        <Pagination
          showControls
          onChange={(page) => setPage(page)}
          total={Math.ceil(data.results.length / size)}
          initialPage={1}
        />
      </div>
    </VStack>
  );
}

export default IngredientsMain;
