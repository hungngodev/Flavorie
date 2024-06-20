import React from 'react';
import { Box, Image, Text, Container, Flex, Grid, GridItem, HStack, Heading, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
// import "fontsource-inter/500.css";
//import { capsFirst } from "../utils/index.tsx";
import { ReactNode } from 'react';
import ChakraCarousel from './ChakraCarousel';
import theme from '../../style/theme';
import Lottie from 'lottie-react';
// import { Livecook } from '../../assets/animations';
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
          <Box bg="white" boxSize="40px" borderRadius="full" ml="2" mr="1">
            <Image src={ingredient.image} alt={ingredient.name} boxSize="40px" borderRadius="full"/>
          </Box>
          <Text color="pink.400">{ingredient.name}</Text>
        </HStack>
      ))}
    </Box>
  );
};
interface ImageSlideProps {
  backendData: BackendData;
}

interface TitleSlide {
  type: 'title';
  title: string;
  description: string;
  ingredients: never[];
  equipment: never[];
}

interface DetailSlide {
  type: 'detail';
  title: string;
  description: string;
  ingredients: Ingredient[];
  equipment: Equipment[];
}

type Slide = TitleSlide | DetailSlide;

// interface Slide {
//   type: 'title' | 'detail';
//   title: string;
//   description: string;
//   ingredients: Ingredient[];
//   equipment: Equipment[];
// }

function ImageSlide({ backendData }: ImageSlideProps) {
  // const colorLevels = ['base.50', 'base.100', 'base.200', 'base.300', 'base.400', 'base.500', 'base.600'];

  const slides: Slide[] = backendData.analyzeInstruction.flatMap((instruction, instructionIndex) => {
    // const bgColor = colorLevels[instructionIndex % colorLevels.length];
    const instructionSlides: Slide[] = [
      {
        type: 'title' as const,
        title: `${instructionIndex + 1}. ${instruction.name}`,
        description: '',
        ingredients: [],
        equipment: [],
      },
      ...instruction.steps.map((step, stepIndex) => ({
        type: 'detail' as const,
        title: '',
        description: step.step,
        ingredients: step.ingredients,
        equipment: step.equipment,
      })),
    ];

      // // ingredients
      // const ingredients = step.ingredients.map((ingredient) => ({
      //   id: ingredient.id,
      //   image: ingredient.image || '',
      //   name: ingredient.name || '',
      //   localizedName: ingredient.localizedName,
      // }));

      // // equipment
      // const equipment = step.equipment.map((equip) => ({
      //   image: equip.image || '',
      //   name: equip.name || '',
      // }));

      return instructionSlides;;
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
      <ChakraCarousel gap={25}>
        {slides.map((slide, index) => (
          <Flex
            key={index}
            boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
            flexDirection="column"
            justifyContent="flex-start"
            overflow="hidden"
            color="black.200"
            bg="base.50"
            rounded={5}
            flex={1}
            p={5}
          >
            {/* <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mb="3" textAlign="center" w="full">
              {slide.title}
            </Heading> */}
            {slide.type === 'title' ? (
              <>
                <Heading
                  fontSize={{ base: 'xl', md: '2xl' }}
                  fontWeight="bold"
                  mb="5"
                  mt="4"
                  textAlign="center"
                  w="full"
                >
                  {slide.title}
                </Heading>
                {/* <Lottie animationData={Livecook} style={{ height: 200, width: 200 }} /> */}
              </>
            ) : (
              <Grid mt="4" mb="4" templateRows="repeat(2)" templateColumns="repeat(3, 2fr)" width="100%">
                <GridItem>
                  <Box borderRadius="md" boxShadow="md" bg="brown.20">
                    <Heading fontSize="20" fontWeight="bold" ml="2" p="2" mb="1">
                      Ingredients
                    </Heading>
                    <IngredientsList ingredients={slide.ingredients} />
                  </Box>
                </GridItem>
                <GridItem rowSpan={2} colSpan={2} ml="6">
                  <VStack mb={2} textAlign="left" display="flex" flexDirection="column" justifyContent="flex-start">
                    <Heading fontSize="20" fontWeight="bold">
                      Instruction
                    </Heading>
                    <Text w="full" textAlign="justify">
                      {slide.description}
                    </Text>
                  </VStack>
                </GridItem>
                {slide.equipment.length > 0 && (
                  <GridItem mt="4">
                    <Box borderRadius="md" boxShadow="md" bg="brown.20">
                      <Heading fontSize="20" fontWeight="bold" ml="2" p="2" mb="1">
                        Equipment
                      </Heading>
                      <Box p={1}>
                        {slide.equipment.map((equip, index) => (
                          <HStack mb={3} key={index}>
                            <Box bg="white" boxSize="40px" borderRadius="full" ml="2" mr="1">
                              <Image src={equip.image} alt={equip.name} boxSize="40px" borderRadius="full" />
                            </Box>
                            <Text color="pink.400">{equip.name}</Text>
                          </HStack>
                        ))}
                      </Box>
                    </Box>
                  </GridItem>
                )}
              </Grid>
            )}
          </Flex>
        ))}
      </ChakraCarousel>
    </Container>
  );
}

export default ImageSlide;
