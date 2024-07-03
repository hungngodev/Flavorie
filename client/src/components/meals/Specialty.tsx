import { Box, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { AutoSlider } from '../../components';
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
export const Specialty = () => {
    const [showMeal, setShowMeal] = useState(false);

    const handleClick = () => {
        setShowMeal(!showMeal);
    };
    return (
        <Box width="95%" height={'fit-content'} margin={'20px'} borderRadius="xl" textAlign="center">
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
                    <AutoSlider className="h-[60vh]" images={mockMealData} />
                </motion.div>
            )}
        </Box>
    );
};
