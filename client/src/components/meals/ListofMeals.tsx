import { Box, HStack, IconButton, VStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Hero } from '../../components';
import { Meal } from '../../pages/Meal';
import ImageCard from './ImageCard';

interface MealTypeProps {
  Type: string;
  meals: Meal[];
}

export function ListofMeals({ Type, meals }: MealTypeProps) {
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

  useEffect(() => {
    scrollRefs.current.forEach((ref) => {
      if (ref) {
        ref.scrollLeft = 0;
      }
    });
  }, []);
  console.log(meals);
  const truncateDescription = (description: string): string => {
    return description.length > 60 ? `${description.substring(0, 60)}...` : description;
  };

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <VStack spacing={1} width={'100%'} height={'fit'} marginBottom={'10vh'} alignItems="center">
      <Hero title="" boldTitle={Type} />
      <HStack width={'92%'} justifyContent={'center'} alignItems={'center'} marginTop={'1vh'}>
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="left"
          onClick={() => scroll('left', 500, 0)}
          variant="solid"
          colorScheme="blue"
          size="xs"
          height="50%"
          marginLeft={'2vh'}
        />
        <HStack
          spacing={2}
          overflowY={'hidden'}
          overflowX={'auto'}
          width={'95%'}
          ref={(el) => (scrollRefs.current[0] = el as HTMLDivElement)}
          className="no-scroll-bar"
          justifyContent="flex-start"
        >
          {meals.map((meal, index) => (
            <Box key={index} flexShrink={0} width={'38vh'}>
              <ImageCard
                imageProps={{
                  src: meal.image,
                  title: meal.title,
                  description: truncateDescription(meal.description ?? ''),
                  category: meal.category,
                  // price: meal.price,
                  infoLink: `/meals/${meal.id}`,
                }}
              />
            </Box>
          ))}
        </HStack>
        <IconButton
          icon={<ChevronRightIcon />}
          aria-label="right"
          onClick={() => scroll('right', 500, 0)}
          variant="solid"
          colorScheme="blue"
          size="xs"
          height="50%"
          marginRight={'2vh'}
        />
      </HStack>
    </VStack>
  );
}

export default ListofMeals;
