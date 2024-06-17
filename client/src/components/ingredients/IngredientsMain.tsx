import { HStack, Heading, IconButton, Text, VStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRef } from 'react';
import { Category, Ingredient } from '../../pages/Ingredient';
import Hero from '../ui/Hero';
import IngredientCard from './Card';

type IngredientsMainProps = {
  data: Category;
  addFunction: (ingredientData: Ingredient) => void;
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
    <VStack spacing={6} overflowY={'auto'} overflowX={'hidden'} width={'95%'} height={'fit'} marginBottom={'1vh'}>
      <Hero title="" boldTitle={data.categoryName.toUpperCase()} />
      <Text fontSize={'1.5rem'}>{data.totalNumberOfIngredients} Ingredients</Text>
      {data.results.map((subCategory, index) => (
        <VStack width="100%" key={index + subCategory.queryKey} alignItems={'start'} mt="2">
          <HStack justifyContent={'space-between'} width="95%">
            <Heading as="h1" size="4xl" noOfLines={1} fontSize={'1.5rem'} fontFamily={'monospace'} fontWeight="bold">
              {subCategory.queryKey.charAt(0).toUpperCase() + subCategory.queryKey.slice(1)}
            </Heading>
            <HStack gap={2}>
              <IconButton
                icon={<ChevronLeftIcon />}
                aria-label="left"
                onClick={() => scroll('left', 500, index)}
                variant="solid"
                colorScheme="blue"
                size="xs"
                height="50%"
              />
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
          </HStack>
          <HStack width={'95%'} justifyContent={'center'} alignItems={'center'}>
            <HStack
              spacing={6}
              overflowY={'hidden'}
              overflowX={'auto'}
              width={'100%'}
              height={'20vh'}
              alignItems={'start'}
              ref={(el) => (scrollRefs.current[index] = el as HTMLDivElement)}
              className="no-scroll-bar"
            >
              {subCategory.ingredients.map((ingredient, innerIndex) => (
                <IngredientCard
                  key={ingredient.id + innerIndex * index}
                  id={ingredient.id}
                  imgLink={ingredient.image}
                  title={ingredient.name}
                  category={ingredient.category}
                  height="8vw"
                  width="12vw"
                  onClick={() => {
                    addFunction(ingredient);
                  }}
                  amount={ingredient.amount}
                  unitShort={ingredient.unitShort}
                  nutrition={ingredient.nutrition}
                />
              ))}
            </HStack>
          </HStack>
        </VStack>
      ))}
    </VStack>
  );
}

export default IngredientsMain;
