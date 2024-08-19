import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    GridItem,
    HStack,
    Heading,
    Image,
    Stack,
    Tag,
    TagLabel,
    Text,
} from '@chakra-ui/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import Lottie from 'lottie-react';
import { FaCheck, FaPrint, FaSave, FaShareAlt, FaStar } from 'react-icons/fa';
import { Params, useLoaderData } from 'react-router-dom';
import RecipeLoading from '../assets/animations/RecipeLoading.json';
import ImageSlide, { BackendData } from '../components/meals/ImageSlide';
import theme from '../style/theme';
import customFetch from '../utils/customFetch';

// Default values shown

function formatString(inputString: any) {
    // Ensure input is a string and trim any leading/trailing whitespace
    inputString = inputString.toString().trim();

    // Check if the input string is empty
    if (inputString === '') {
        return '';
    }

    // Convert camelCase to spaced words
    inputString = inputString.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Convert the first character to uppercase and the rest to lowercase
    let formattedString = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();

    // Replace any non-alphanumeric characters (except spaces) with spaces
    formattedString = formattedString.replace(/[^a-zA-Z0-9 ]/g, ' ');

    // Replace multiple spaces with a single space
    formattedString = formattedString.replace(/\s+/g, ' ');

    return formattedString;
}
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
        return params.mealId;
    };

const Recipe = () => {
    const mealId = useLoaderData();
    const { data: queryData, status } = useQuery(individualMealQuery((mealId as string) ?? ''));
    if (status === 'pending') {
        return (
            <HStack w="full" h={'full'} alignItems={'center'} justifyContent={'center'}>
                <Lottie animationData={RecipeLoading} style={{ width: 800, height: 800 }} loop={true} />
            </HStack>
        );
    }
    const extractedData = queryData?.data;
    const recipeData: BackendData = extractedData;
    const cleanDescription = DOMPurify.sanitize(recipeData.description, { ALLOWED_TAGS: [] });
    const averageStar = 5;
    const numReviews = 100;
    const calories = 100;
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
                        <Image
                            rounded="lg"
                            w="800px"
                            h="700px"
                            src={recipeData.imageUrl}
                            alt={recipeData.title}
                            objectFit="cover"
                            borderRadius="md"
                        />
                        <Box
                            position="absolute"
                            bottom="2"
                            left="0"
                            right="0"
                            display="flex"
                            flexDirection="row"
                            flexWrap="wrap"
                            justifyContent="left"
                            alignItems="center"
                        >
                            {recipeData.tags.map((tag, index) => (
                                <Tag
                                    key={index}
                                    bg="rgba(126, 126, 126, 0.4)"
                                    // backgroundColor={theme.colors.palette_indigo}
                                    p={2}
                                    color="white"
                                    borderRadius="full"
                                    fontSize="20"
                                    m={2}
                                >
                                    <TagLabel px={1} py={1}>
                                        {formatString(tag)}
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
                            color="black"
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
                        <Text
                            justifyContent="justify"
                            textAlign="justify"
                            alignItems="center"
                            color="gray.500"
                            fontSize={18}
                        >
                            {cleanDescription}
                        </Text>
                        <HStack mt="2" justifyContent="center" alignItems="center" fontSize="14">
                            <Text color={theme.colors.palette_purple} fontSize={18} ml={2}>
                                {averageStar}
                            </Text>
                            {Array(5)
                                .fill('')
                                .map((_, i) => (
                                    <FaStar key={i} color={theme.colors.palette_purple} />
                                ))}
                            <Text color={theme.colors.palette_indigo} fontSize={18} ml={2}>
                                ({numReviews})
                            </Text>
                        </HStack>
                        <HStack justifyContent="center" width="100%" mt={8}>
                            <ButtonGroup spacing={2} mb={5}>
                                <Button variant="outline" rightIcon={<FaSave color={theme.colors.palette_purple} />}>
                                    Save
                                </Button>
                                <Button variant="outline" rightIcon={<FaStar />}>
                                    Rate
                                </Button>
                                <Button variant="outline" rightIcon={<FaPrint />}>
                                    Print
                                </Button>
                                <Button variant="outline" rightIcon={<FaShareAlt />}>
                                    Share
                                </Button>
                                <Button variant="outline" rightIcon={<FaCheck />}>
                                    Done
                                </Button>
                            </ButtonGroup>
                        </HStack>
                        <Text fontSize="14" textAlign="center" textColor="gray.500" mb="4">
                            * Source: {recipeData.source}
                        </Text>
                    </Box>
                </GridItem>
                <GridItem colSpan={2}>
                    <Box h="100%" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
                        <HStack justifyContent="center" alignItems="center" width="100%" spacing={0}>
                            <Box
                                bg={theme.colors.indigo}
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
                                    bg: theme.colors.bone_white,
                                }}
                            >
                                <Text fontSize="18">
                                    <Box as="span" color="white" fontSize="20" fontWeight="bold">
                                        Total time:
                                    </Box>
                                    <Box color="white">{totalTime} minutes</Box>
                                </Text>
                            </Box>
                            <Box
                                bg={theme.colors.indigo}
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
                                    bg: theme.colors.bone_white,
                                }}
                            >
                                <Text fontSize="18">
                                    <Box as="span" color="white" fontSize="20" fontWeight="bold">
                                        Servings:
                                    </Box>
                                    <Box color="white">{recipeData.servings}</Box>
                                </Text>
                            </Box>
                            <Box bg={theme.colors.indigo} p={4} width="40%">
                                <Text fontSize="18">
                                    <Box as="span" color="white" fontSize="20" fontWeight="bold">
                                        Calories per serving:
                                    </Box>{' '}
                                    <Box color="white">{calories}</Box>
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
export default Recipe;
