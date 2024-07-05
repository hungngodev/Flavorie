import { Box, Heading, HStack, IconButton, VStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Hero } from '../../components';
import { Meal } from '../../pages/Meal';
import ImageCard from './ImageCard';
import theme from '../../style/theme';

interface MealTypeProps {
    Type: string;
    meals: Meal[];
}

export function ListOfMeals({ Type, meals }: MealTypeProps) {
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

  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  return (
      <VStack spacing={1} width={'95vw'} height={'fit'} marginBottom={'2vh'} alignItems="center">
          <Hero title="" boldTitle={Type} />
          <HStack width={'92%'} justifyContent={'center'} alignItems={'center'} marginTop={'1vh'}>
              <IconButton
                  icon={<ChevronLeftIcon />}
                  aria-label="left"
                  onClick={() => scroll('left', 500, 0)}
                  variant="solid"
                  bg={theme.colors.palette_indigo}
                  size="xs"
                  height="50%"
                  marginLeft={'2vh'}
              />
              <HStack
                  spacing={8}
                  overflowY={'hidden'}
                  overflowX={'auto'}
                  width={'100%'}
                  ref={(el) => (scrollRefs.current[0] = el as HTMLDivElement)}
                  className="no-scroll-bar"
                  justifyContent="flex-start"
                  py={5}
              >
                  {meals.map((meal, index) => (
                      <Box key={index + 'eachMeal'} flexShrink={0} width={'38vh'}>
                          <ImageCard
                              imageProps={{
                                  src: meal.image,
                                  title: meal.title,
                                  description: meal.description,
                                  category: meal.category,
                                  // price: meal.price,
                                  infoLink: `/meals/${meal.id}`,
                                  id: meal._id,
                                  numberOfLiked: meal.numberOfLiked,
                                  liked: meal.liked,
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
                  bg={theme.colors.palette_indigo}
              />
          </HStack>
      </VStack>
  );
}

export default ListOfMeals;
