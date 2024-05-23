import { Box, ButtonGroup, Button, Flex, HStack, IconButton, VStack, Heading, Text } from '@chakra-ui/react';
import { StarIcon, PrintIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FaShareAlt, FaStar, FaPrint } from 'react-icons/fa';
import ImageSlide from "./ImageSlide";

interface MealProps {
    individualMeal: Meal[];
    title: string;
    overview: string;
    totalTime: string;
    servings: string;
    calories: string;
};

interface Meal {
    image: string;
    title: string;
    description: string;
}

function IndividualMeal({ individualMeal, title, overview, totalTime, servings, calories }: MealProps) {
    return (
        <Flex alignItems="center" justifyContent="center">
            <Box textAlign="center" mb={8}>
                <Heading size="lg" fontSize="34" fontWeight="bold">
                    {title}
                </Heading>
                <Text align="center" w="full" fontSize="28" mt={4}>
                    {overview}
                </Text>
                <HStack align="left" mt={4}></HStack>
            </Box>
            <HStack justifyContent="flex-start" width="100%" mb={4}>
                <Box bg="base.200">Total time: {totalTime}</Box>
                <Box bg="base.200">Servings: {servings}</Box>
                <Box bg="base.200">Calories per serving: {calories}</Box>
            </HStack>
            <ImageSlide dishes={individualMeal} />
            <HStack justifyContent="flex-end" width="100%" mt={4}>
                <ButtonGroup spacing={4}>
                    <Button rightIcon={<FaStar />} colorScheme="blue">
                        Rate
                    </Button>
                    <Button rightIcon={<FaPrint />} colorScheme="blue">
                        Print
                    </Button>
                    <Button rightIcon={<FaShareAlt />} colorScheme="blue">
                        Share
                    </Button>
                </ButtonGroup>
            </HStack>
        </Flex>
        );
}

export default IndividualMeal;