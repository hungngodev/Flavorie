import { Box, Container, Flex, Grid, GridItem, HStack, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import React from 'react';
import ChakraCarousel from './ChakraCarousel';

export interface Ingredient {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}
interface Equipment {
  id: number;
  name: string;
  localizedName: string;
  image: string;
  temperature?: {
    number: number;
    unit: string;
  };
}
interface Length {
  number: number;
  unit: string;
}
interface Step {
  number: number;
  step: string;
  ingredients: Ingredient[];
  equipment: Equipment[];
  length?: Length;
}

export interface AnalyzeInstruction {
  name: string;
  steps: Step[];
}

export interface BackendData {
  title: string;
  imageUrl: string;
  allIngredients: Ingredient[];
  amount: Map<string, string>;
  tags: string[];
  source: 'themealdb' | 'spoonacular' | 'user';
  instruction: string;
  analyzeInstruction: AnalyzeInstruction[];
  id: string;
  videoLink?: string;
  description: string;
  price: string;
  readyInMinutes: string;
  servings: number;
  dishTypes: string[];
  taste: {
    sweetness: number;
    saltiness: number;
    sourness: number;
    bitterness: number;
    savoriness: number;
    fattiness: number;
    spiciness: number;
  };
}


interface IngredientsProps {
  ingredients: Ingredient[];
}


export const IngredientsList = ({ ingredients }: IngredientsProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <Box ref={scrollRef} maxHeight="220px" overflowY="auto" p={1}>
      {ingredients.map((ingredient, index) => (
        <HStack key={index} mb={4} alignItems="center">
          <Box bg="white" boxSize="40px" borderRadius="full" mr="2">
            <Image
              src={ingredient.name}
              alt={ingredient.image}
              boxSize="40px"
              borderRadius="full"
            />
          </Box>
          <Text>{ingredient.name}</Text>
        </HStack>
      ))}
    </Box>
  );
};
interface ImageSlideProps {
  backendData: BackendData;
}

function ImageSlide({ backendData }: ImageSlideProps) {
  const colorLevels = ['base.50', 'base.100', 'base.200', 'base.300', 'base.400', 'base.500', 'base.600'];

  const slides = backendData.analyzeInstruction.flatMap((instruction, instructionIndex) => {
    return instruction.steps.map((step) => {
      const bgColor = colorLevels[(instructionIndex) % colorLevels.length];
      const title = instruction.name;
      const description = step.step;

      // ingredients
      const ingredients = step.ingredients.map((ingredient) => ({
        id: ingredient.id,
        image: ingredient.image || '',
        name: ingredient.name || '',
        localizedName: ingredient.localizedName,
      }));

      // equipment
      const equipment = step.equipment.map((equip) => ({
        image: equip.image || '',
        name: equip.name || '',
      }));

      return {
        title,
        description,
        bgColor,
        ingredients,
        equipment,
      };
    });
  });

  return (
    <Container
      py={4}
      px={0}
      maxW={{
        base: '100%',
        sm: '35rem',
        md: '43.75rem',
        lg: '57.5rem',
        xl: '75rem',
        xxl: '87.5rem',
      }}
    >
      <ChakraCarousel gap={30}>
        {slides.map((slide, index) => (
          <Flex
            key={index}
            boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
            flexDirection="column"
            justifyContent="flex-start"
            overflow="hidden"
            color="black.200"
            bg={slide.bgColor}
            rounded={5}
            flex={1}
            p={5}
          >
            <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mb="3" textAlign="center" w="full">
              {slide.title}
            </Heading>
            <Grid mt="4" templateRows="repeat(2)" templateColumns="repeat(3, 2fr)" width="100%">
              <GridItem>
                <Box borderRadius="md" boxShadow="md" bg="brown.20">
                  <Heading fontSize="20" fontWeight="bold" ml="2" mt="2" mb="2">
                    Ingredients
                  </Heading>
                  <IngredientsList ingredients={slide.ingredients} />
                </Box>
              </GridItem>
              <GridItem rowSpan={2} colSpan={2} ml="4">
                {/* <img src={dish.image} alt={dish.title} style={{ maxWidth: '100%', borderRadius: '8px' }} /> */}
                <VStack mb={2} textAlign="left" display="flex" flexDirection="column" justifyContent="flex-start">
                  <Heading fontSize="20" fontWeight="bold">
                    Instruction
                  </Heading>
                  <Text w="full" textAlign="justify">
                    {slide.description}
                  </Text>
                </VStack>
              </GridItem>
              <GridItem mt="4">
                <Box borderRadius="md" boxShadow="md" bg="brown.20">
                  <Heading fontSize="20" fontWeight="bold" ml="2" mt="2" mb="2">
                    Equipment
                  </Heading>
                  <Box p={1}>
                    {slide.equipment.map((equip, index) => (
                      <HStack mb={4} key={index}>
                        <Box bg="white" boxSize="40px" borderRadius="full" mr="2">
                          <Image src={equip.image} alt={equip.name} boxSize="40px" borderRadius="full" />
                        </Box>
                        <Text>{equip.name}</Text>
                      </HStack>
                    ))}
                  </Box>
                </Box>
              </GridItem>
            </Grid>
          </Flex>
        ))}
      </ChakraCarousel>
    </Container>
  );
}

export default ImageSlide;
