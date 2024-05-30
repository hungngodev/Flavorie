import { Badge, Box, Button, Flex, Grid, Image, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
interface mockMeals {
  id: string;
  image: string;
  title: string;
  tags: string[];
}

const mockMealData: mockMeals[] = [
  {
    id: '1',
    image: 'https://www.themealdb.com/images/media/meals/wrpwuu1511786491.jpg',
    title: 'Ratatouille',
    tags: ['Stewed', 'Gluten-Free', 'Low-Calorie'],
  },
  {
    id: '2',
    image: 'https://www.themealdb.com/images/media/meals/4er7mj1598733193.jpg',
    title: 'Koshari',
    tags: ['High-Protein', 'Vegetarian', 'Boiled'],
  },
  {
    id: '3',
    image: 'https://www.themealdb.com/images/media/meals/yuwtuu1511295751.jpg',
    title: 'Lamb Tagine',
    tags: ['High-Protein', 'Gluten-Free', 'Slow-cooked'],
  },
  {
    id: '4',
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
    <Box
      borderWidth="1px"
      width="100%"
      height={'fit-content'}
      bgColor={'#FEB2B2'}
      margin={'20px'}
      borderRadius="xl"
      textAlign="center"
      padding="4"
    >
      {!showMeal ? (
        <Button textAlign="center" borderRadius="full" colorScheme="teal" onClick={handleClick}>
          What's special today?
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" justifyContent="center">
            <Image src={meal.image} alt={meal.title} boxSize="100px" borderRadius="full" mb={{ base: '4', md: '0' }} />
            <Box ml={{ md: '4' }} textAlign="left">
              <Grid templateColumns="repeat(2, auto)" gap="2">
                <Badge textAlign="center" borderRadius="full" px="4" py="2" colorScheme="teal" fontSize="md" mb="4">
                  {meal.title}
                </Badge>
                <Link href={meal.id}>
                  <Button textAlign="center" borderRadius="full" px="4" py="2" colorScheme="teal" fontSize="md" mb="4">
                    Cook now
                  </Button>
                </Link>
              </Grid>
              <Grid templateColumns="repeat(2, auto)" gap="2">
                {meal.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    borderRadius="full"
                    px="4"
                    py="2"
                    variant="outline"
                    textAlign="center"
                    colorScheme="blue"
                  >
                    {tag}
                  </Badge>
                ))}
              </Grid>
            </Box>
          </Flex>
        </motion.div>
      )}
    </Box>
  );
};
