import React from 'react'; 
import { Box, Button, ButtonGroup, Grid, GridItem, HStack, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { waveform } from 'ldrs';
import { FaPrint, FaSave, FaShareAlt, FaStar } from 'react-icons/fa';
import { Params, useParams } from 'react-router-dom';
import ImageSlide from '../components/meals/ImageSlide';
import customFetch from '../utils/customFetch';
import { Tag, TagLabel } from '@chakra-ui/react';
import { BackendData } from '../components/meals/ImageSlide';
import theme from '../style/theme';


waveform.register();

// Default values shown

const individualMealQuery = (id: string) => {
    return {
        queryKey: ['individualMeal', id],
        queryFn: async () => {
        const data = await customFetch(`/meal/${id}`, {});
        return data;
        },
    };
};

export const loader =
    (queryClient: QueryClient) =>
    async ({ params }: { params: Params }) => {
        queryClient.ensureQueryData(individualMealQuery(params.mealId ?? ''));
        return null;
    };


// function Recipe() {
//     const sampleMeal: Dish[] = [
//         {
//         image: '../public/images/baked-brie-with-roasted-mushrooms.webp',
//         title: 'Baked brie with roasted mushroom',
//         description: ' Step 1: Bake brie and roasted mushroom.',
//         },
//         {
//         image: '../public/images/apple-and-cheddar-crisp-salad-scaled.webp',
//         title: 'Apple and cheddar crisp salad',
//         description: 'Step 2: Wash salad and apple',
//         },
//         {
//         image: '../public/images/buffalo-chicken-cobb-salad-scaled.webp',
//         title: 'Buffalo chicken cobb salad',
//         description: 'Step 3: Roast buffalo chicken',
//         },
//         {
//         image: '../public/images/chocolate-raspberry-pavlova-stack-12-scaled.webp',
//         title: 'Chocolate raspberry pavlova stack',
//         description: 'Step 4: Wash raspberry',
//         },
//         {
//         image: '../public/images/new-york-crumb-cake-7-scaled.webp',
//         title: 'New york crumb cake',
//         description: 'Step 5: Bake cake',
//         },
//         {
//         image: '../public/images/summer-ricotta-grilled-vegetables.webp',
//         title: 'Summer ricotta grilled vegetables',
//         description: 'Step 6: Grilled vegetables after washing',
//         },
//     ];
//     const individualMeal = sampleMeal;
//     const lastDish = sampleMeal[sampleMeal.length - 1];
//     const title = 'Sample Meal Title';
//     const overview = 'This is an overview of the sample meal.';
//     const image = 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800';
//     const totalTime = '45 mins';
//     const servings = '4';
//     const calories = '500';
//     const averageStar = '5';
//     const numReviews = '1';

//     const { mealId } = useParams<{ mealId: string }>();
//     const { data: queryData, status } = useQuery(individualMealQuery(mealId ?? ''));
//     const recipeData = queryData?.data;
//     console.log(recipeData);
//     console.log(status);

interface IndividualMealProps {
    recipeData: BackendData;
    calories: string;
    averageStar: string;
    numReviews: string;
    }

const IndividualMeal: React.FC<IndividualMealProps> = ({ recipeData, calories, averageStar, numReviews }) => {
    const totalTime = recipeData.analyzeInstruction.reduce((acc, instruction) => {
        return (
        acc +
        instruction.steps.reduce((stepAcc, step) => {
            return stepAcc + (step.length?.number || 0);
        }, 0)
        );
    }, 0);

    return (
        <Stack alignItems="center" justifyContent="center">
        <Grid templateRows="repeat(5)" templateColumns="repeat(4, 2fr)" mt="6" width="100%">
            <GridItem rowSpan={5} colSpan={2} ml={4} objectFit="cover">
            <Box
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius="md"
                mb="3"
                objectFit="cover"
                position="relative"
            >
                <Image src={recipeData.imageUrl} alt={recipeData.title} objectFit="cover" borderRadius="md" />
                <Box
                position="absolute"
                bottom="0"
                left="0"
                right="0"
                p={4}
                display="flex"
                flexWrap="wrap"
                justifyContent="left"
                alignItems="center"
                >
                {recipeData.tags.map((tag, index) => (
                    <Tag key={index} bg="rgba(126, 126, 126, 0.4)" color="white" borderRadius="full" fontSize="20" m={1}>
                    <TagLabel px={1} py={1}>
                        {tag}
                    </TagLabel>
                    </Tag>
                ))}
                </Box>
            </Box>
            </GridItem>
            <GridItem
            rowSpan={4}
            colSpan={2}
            fontSize={34}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            >
            <Box ml="10" mr="10" textAlign="center" alignItems="center" display="flex" flexDirection="column">
                {/* <Box
                width="80px"
                height="36px"
                bg="black"
                textColor="white"
                fontSize="14"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                mb={3}
                textAlign="center"
                >
                RECIPES
                </Box> */}
                <Heading
                mb="3"
                mt="4"
                size="lg"
                fontSize="50"
                fontFamily="'Playfair Display', serif"
                fontWeight="bold"
                textAlign="center"
                >
                {recipeData.title}
                </Heading>
                <Text justifyContent="center" alignItems="center" color="base.500" fontSize={26}>
                {recipeData.description}
                </Text>
                <HStack mt="2" justifyContent="center" alignItems="center" fontSize="14">
                <Text fontSize={18} ml={2}>
                    {averageStar}
                </Text>
                {Array(5)
                    .fill('')
                    .map((_, i) => (
                    <FaStar key={i} color="black" />
                    ))}
                <Text fontSize={18} ml={2}>
                    ({numReviews})
                </Text>
                </HStack>
                <HStack justifyContent="flex-end" width="100%" mt={8}>
                <ButtonGroup spacing={2} mb={10}>
                    <Button rightIcon={<FaSave />}  bg="base.50">
                    Save
                    </Button>
                    <Button rightIcon={<FaStar />}  bg="base.50">
                    Rate
                    </Button>
                    <Button rightIcon={<FaPrint />}  bg="base.50">
                    Print
                    </Button>
                    <Button rightIcon={<FaShareAlt />}  bg="base.50">
                    Share
                    </Button>
                </ButtonGroup>
                </HStack>
                <Text fontSize="14" textAlign="center" textColor="base.600">
                * Source: {recipeData.source}
                </Text>
            </Box>
            </GridItem>
            <GridItem colSpan={2}>
            <Box h="100%" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
                <HStack justifyContent="center" alignItems="center" width="100%" spacing={0}>
                <Box
                    bg="base.50"
                    p={4}
                    position="relative"
                    width="25%"
                    _after={{
                    content: '""',
                    position: 'absolute',
                    right: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '1px',
                    bg: 'base.200',
                    }}
                >
                    <Text fontSize="18">
                        <Box as="span" fontSize="20" fontWeight="bold">
                            Total time:
                        </Box>
                        <Box>{totalTime} minutes</Box>
                    </Text>
                </Box>
                <Box
                    bg="base.50"
                    p={4}
                    position="relative"
                    width="25%"
                    _after={{
                    content: '""',
                    position: 'absolute',
                    right: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '1px',
                    bg: 'base.200',
                    }}
                >
                    <Text fontSize="18">
                    <Box as="span" fontSize="20" fontWeight="bold">
                        Servings:
                    </Box>
                    <Box>{recipeData.servings}</Box>
                    </Text>
                </Box>
                <Box bg="base.50" p={4} width="40%">
                    <Text fontSize="18">
                    <Box as="span" fontSize="20" fontWeight="bold">
                        Calories per serving:
                    </Box>{' '}
                    <Box>{calories}</Box>
                    </Text>
                </Box>
                </HStack>
            </Box>
            </GridItem>
        </Grid>
        <Box width="100%" mx="auto" px={4}>
            <ImageSlide backendData={recipeData} />
        </Box>
        </Stack>
    );
};

// export default Recipe;
export default IndividualMeal;
