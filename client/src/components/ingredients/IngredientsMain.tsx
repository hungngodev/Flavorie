import { Button, HStack, Heading, IconButton, VStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRef } from 'react';
import { IngredientData, SubCategory } from '../../pages/Ingredient';
import IngredientCard from './Card';

type IngredientsMainProps = {
  data: IngredientData;
  addFunction: (ingredientData: SubCategory) => void;
};

export function IngredientsMain({ addFunction, data }: IngredientsMainProps) {
  function scroll(direction: 'left' | 'right', distance: number, index: number) {
    const scrollRef = scrollRefs.current[index];
    if (scrollRef) {
      if (direction === 'left') {
        scrollRef.scrollTo({
          left: scrollRef.scrollLeft - distance,
          behavior: 'smooth',
        });
      } else {
        scrollRef.scrollTo({
          left: scrollRef.scrollLeft + distance,
          behavior: 'smooth',
        });
      }
    }
  }

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <VStack spacing={10} overflowY={'auto'} overflowX={'hidden'} width={'95%'} height={'fit'} marginBottom={'1vh'}>
      {data.map((category, index) => (
        <VStack width="100%" key={index}>
          <Button variant={'outline'} colorScheme={category.color}>
            <Heading as="h1" size="4xl" noOfLines={1} fontSize={'2rem'}>
              {category.categoryName}
            </Heading>
          </Button>
          <HStack width={'95%'} justifyContent={'center'} alignItems={'center'}>
            <IconButton
              icon={<ChevronLeftIcon />}
              aria-label="left"
              onClick={() => scroll('left', 500, index)}
              variant="solid"
              colorScheme="blue"
              size="xs"
              height="50%"
            />
            <HStack
              spacing={4}
              overflowY={'hidden'}
              overflowX={'auto'}
              width={'100%'}
              ref={(el) => (scrollRefs.current[index] = el as HTMLDivElement)}
              className="no-scroll-bar "
            >
              {category.results.map((result, index) => (
                <IngredientCard
                  key={result.ingredients[0].id + index}
                  imgLink={result.ingredients[0].image}
                  title={result.ingredients[0].name}
                  category={result.ingredients[0].category}
                  height="8vw"
                  width="8vw"
                  onClick={() => {
                    addFunction(result);
                  }}
                />
              ))}
            </HStack>
            <IconButton
              icon={<ChevronRightIcon />}
              aria-label="left"
              onClick={() => scroll('right', 500, index)}
              variant="solid"
              colorScheme="blue"
              size="xs"
              height="50%"
            />
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
}

export default IngredientsMain;
