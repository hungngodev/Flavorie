import { Box, Button, ButtonGroup, Flex, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { FaPrint, FaShareAlt, FaStar } from 'react-icons/fa';
import ImageSlide from '../components/meals/ImageSlide';
import { Dish } from '../components/meals/ImageSlide';

interface MealProps {
    individualMeal: Dish[];
    title: string;
    overview: string;
    totalTime: string;
    servings: string;
    calories: string;
}

// interface Dish {
//     image: string;
//     title: string;
//     description: string;
// }

function IndividualMeal({ individualMeal, title, overview, totalTime, servings, calories }: MealProps) {
    return (
        <Stack alignItems="center" justifyContent="center" mt={8}>
            <Box textAlign="center" mb={5} >
                <Heading size="lg" fontSize="34" fontWeight="bold">
                {title}
                </Heading>
                <Text align="center" w="full" fontSize="26" mt={4}>
                {overview}
                </Text>
                <HStack align="left" mt={4}></HStack>
            </Box>
            <HStack justifyContent="flex-start" width="100%" ml={8} spacing={0}>
                <Box bg="base.50" p={4} position="relative" _after={{
                    content: '""',
                    position: 'absolute',
                    right: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '1px',
                    bg: 'base.200',
                }}>
                    <Text fontSize="18"><Box as="span" fontSize="20" fontWeight="bold">Total time:</Box> {totalTime}</Text>
                </Box>
                <Box bg="base.50" p={4} position="relative" _after={{
                    content: '""',
                    position: 'absolute',
                    right: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '1px',
                    bg: 'base.200',
                }}>
                    <Text fontSize="18"><Box as="span" fontSize="20" fontWeight="bold">Servings:</ Box> {servings}</Text>
                </Box>
                <Box bg="base.50" p={4}>
                    <Text fontSize="18"><Box as="span" fontSize="20" fontWeight="bold">Calories per serving:</Box> {calories}</Text>
                </Box>
            </HStack>
            <Box width="100%" mx="auto" px={4}>
                <ImageSlide dishes={individualMeal} />
            </Box>
            <HStack justifyContent="flex-end" width="100%" mr={8}>
                <ButtonGroup spacing={2}>
                <Button rightIcon={<FaStar />} bg="base.50">
                    Rate
                </Button>
                <Button rightIcon={<FaPrint />} bg="base.50">
                    Print
                </Button>
                <Button rightIcon={<FaShareAlt />} bg="base.50">
                    Share
                </Button>
                </ButtonGroup>
            </HStack>
        </Stack>
    );
}

export default IndividualMeal;
