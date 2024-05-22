import { Box, Button, Flex, HStack, IconButton, VStack, Heading, Text } from '@chakra-ui/react';
import ImageSlide from "./ImageSlide";

interface MealProps {
    individualMeal: Meal[];
    title:string;
    overview:string;
};

interface Meal {
    image: string;
    title: string;
    description: string;
}

function IndividualMeal({ individualMeal, title, overview }: MealProps) {
    return (
        <Flex alignItems="center" justifyContent="center">
            <Box textAlign="center" mb={8}>
                <Heading size="lg" fontSize="34" fontWeight="bold">
                    {title}
                </Heading>
                <Text align="center" w="full" fontSize="28" mt={4}>
                    {overview}
                </Text>
            </Box>
            <ImageSlide dishes={individualMeal} />
        </Flex>
        );
}

export default IndividualMeal;