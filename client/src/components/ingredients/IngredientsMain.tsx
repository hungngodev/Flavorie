import { Button, HStack, Heading, VStack } from '@chakra-ui/react';
import { IngredientCard } from '../../components';
import { IngredientData, SubCategory } from '../../pages/Ingredient';

type IngredientsMainProps = {
  data: IngredientData;
  addFunction: (ingredientData: SubCategory) => void;
};

export function IngredientsMain({ addFunction, data }: IngredientsMainProps) {
  return (
    <HStack spacing={20} overflowX={'auto'} width={'95%'} height={'fit'} marginBottom={'1vh'}>
      {data.map((category, index) => (
        <VStack flexShrink={0} key={index}>
          <Button variant={'link'} colorScheme={category.color}>
            <Heading as="h1" size="4xl" noOfLines={1} fontSize={'2rem'}>
              {category.categoryName}
            </Heading>
          </Button>
          <VStack
            spacing={4}
            overflowY={'auto'}
            overflowX={'hidden'}
            flexShrink={0}
            height={'53vh'}
            className="no-scroll-bar snap-y"
          >
            {category.results.map((result, index) => (
              <IngredientCard
                key={result.ingredients[0].id + index}
                imgLink={result.ingredients[0].image}
                title={result.ingredients[0].name}
                category={result.ingredients[0].category}
                height="12vh"
                onClick={() => {
                  addFunction(result);
                }}
              />
            ))}
          </VStack>
        </VStack>
      ))}
    </HStack>
  );
}

export default IngredientsMain;
