import { Box, Button, ButtonGroup, Grid, GridItem, HStack, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { FaPrint, FaSave, FaShareAlt, FaStar } from 'react-icons/fa';
import ImageSlide from '../components/meals/ImageSlide';
import { Dish } from '../components/meals/ImageSlide';

export interface MealProps {
    individualMeal: Dish[];
    title: string;
    overview: string;
    image: string;
    totalTime: string;
    servings: string;
    calories: string;
    averageStar: string;
    numReviews: string;
    // tags: Tag[];
}

function IndividualMeal({ 
    individualMeal, 
    title, 
    overview,
    image, 
    totalTime, 
    servings, 
    calories, 
    averageStar, 
    numReviews,
}: MealProps) {
    return (
        <Stack alignItems="center" justifyContent="center">
            <Grid 
                templateRows='repeat(5)'
                templateColumns='repeat(4, 2fr)'
                mt='1' 
                width='100%'
            >
                <GridItem rowSpan={5} colSpan={2} ml={4}>
                    <Box 
                        width="100%" 
                        height="100%" 
                        display="flex" 
                        justifyContent="center" 
                        alignItems="center"
                    >
                        <Image src={image} alt={title} objectFit='cover' />  
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
                    <Box 
                    ml='10' 
                    mr='10' 
                    textAlign="center" 
                    alignItems="center" 
                    display="flex" 
                    flexDirection="column"
                    >
                        <Box 
                            width='80px' 
                            height='36px' 
                            bg='black' 
                            textColor='white' 
                            fontSize='14' 
                            display="flex" 
                            flexDirection="column" 
                            justifyContent="center" 
                            alignItems="center" 
                            mb={3} 
                            textAlign="center"
                        > 
                            RECIPES
                        </Box>
                        <Heading 
                            mb='3'
                            mt='4'
                            size="lg" 
                            fontSize="50" 
                            fontFamily="'Playfair Display', serif"
                            fontWeight="bold" 
                            textAlign="center"
                        >
                            {title}
                        </Heading>
                        <Text justifyContent="center" alignItems="center" fontSize={26}>{overview}</Text>
                        <HStack mt='2' justifyContent="center" alignItems="center" fontSize='14'>
                            <Text fontSize={18} ml={2}>{averageStar}</Text>
                            {Array(5).fill('').map((_, i) => (
                                <FaStar key={i} color="black" />
                            ))}
                            <Text fontSize={18} ml={2}>({numReviews})</Text>
                        </HStack>
                    </Box>
                </GridItem>
                <GridItem colSpan={2}>
                    <Box h="100%" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
                        <HStack justifyContent="center" alignItems="center" width="100%" spacing={0}>
                            <Box bg="base.50" p={4} position="relative" width='25%' _after={{
                                content: '""',
                                position: 'absolute',
                                right: 0,
                                top: '20%',
                                bottom: '20%',
                                width: '1px',
                                bg: 'base.200',
                            }}>
                                <Text fontSize="18">
                                    <Box as="span" fontSize="20" fontWeight="bold">Total time:</Box>
                                    <Box>{totalTime}</Box> 
                                </Text>
                            </Box>
                            <Box bg="base.50" p={4} position="relative" width='25%' _after={{
                                content: '""',
                                position: 'absolute',
                                right: 0,
                                top: '20%',
                                bottom: '20%',
                                width: '1px',
                                bg: 'base.200',
                            }}>
                                <Text fontSize="18">
                                    <Box as="span" fontSize="20" fontWeight="bold">Servings:</ Box> 
                                    <Box>{servings}</Box>
                                </Text>
                            </Box>
                            <Box bg="base.50" p={4} width='40%'>
                                <Text fontSize="18">
                                    <Box as="span" fontSize="20" fontWeight="bold">Calories per serving:</Box> <Box>{calories}</Box>
                                </Text>
                            </Box>
                        </HStack>
                    </Box>
                </GridItem>
            </Grid>
            <Box width="100%" mx="auto" px={4}>
                <ImageSlide dishes={individualMeal} />
            </Box>
            <HStack justifyContent="flex-end" width="100%" mr={8}>
                <ButtonGroup spacing={2} mb={10}>
                    <Button rightIcon={<FaSave />} bg="base.50">
                        Save
                    </Button>
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
