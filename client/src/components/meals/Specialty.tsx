import { Badge, Box, Button, Flex, Grid, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface mockMeals {
  image: string;
  title: string;
  tags: string[];
}

const mockMealData: mockMeals[] = [
  {
    image: 'https://www.themealdb.com/images/media/meals/wrpwuu1511786491.jpg',
    title: 'Ratatouille',
    tags: ['Stewed', 'Gluten-Free', 'Low-Calorie'],
  },
  {
    image: 'https://www.themealdb.com/images/media/meals/4er7mj1598733193.jpg',
    title: 'Koshari',
    tags: ['High-Protein', 'Vegetarian', 'Boiled'],
  },
  {
    image: 'https://www.themealdb.com/images/media/meals/yuwtuu1511295751.jpg',
    title: 'Lamb Tagine',
    tags: ['High-Protein', 'Gluten-Free', 'Slow-cooked'],
  },
  {
    image: 'https://www.thecocktaildb.com/images/media/drink/eg9i1d1487603469.jpg',
    title: 'Pineapple Gingerale Smoothie',
    tags: ['Gluten-Free', 'Dairy-Free', 'Summer Drink'],
  },
];
const getMealSpecial = () => {
  const randomIdx = Math.floor(Math.random() * mockMealData.length);
  return mockMealData[randomIdx];
};
export const Specialty = () => {
  const [meal, setMeal] = useState(getMealSpecial());
  const [showMeal, setShowMeal] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setMeal(getMealSpecial());
      },
      24 * 60 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, [meal]);

  const handleClick = () => {
    setShowMeal(!showMeal);
  };
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" textAlign="center" padding="4" backgroundColor="beige">
      {!showMeal ? (
        <Button borderRadius="full" colorScheme="teal" onClick={handleClick}>
          What's special today?
        </Button>
      ) : (
        <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" justifyContent="center">
          <Image src={meal.image} alt={meal.title} boxSize="200px" borderRadius="full" mb={{ base: '4', md: '0' }} />
          <Box ml={{ md: '4' }} textAlign="left">
            <Grid templateColumns="repeat(2, auto)" gap="2">
              <Badge borderRadius="full" px="4" py="2" colorScheme="teal" fontSize="lg" mb="4">
                {meal.title}
              </Badge>
              <Button borderRadius="full" px="4" py="2" colorScheme="teal" fontSize="lg" mb="4">
                Cook now
              </Button>
            </Grid>

            <Grid templateColumns="repeat(2, auto)" gap="2">
              {meal.tags?.map((tag, index) => (
                <Badge key={index} borderRadius="full" px="4" py="2" variant="outline" colorScheme="blue">
                  {tag}
                </Badge>
              ))}
            </Grid>
          </Box>
        </Flex>
      )}
    </Box>
  );
};
