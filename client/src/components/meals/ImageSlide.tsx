import { Box, Container, Flex, Grid, GridItem, HStack, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import React from 'react';
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
          <Text color="black">{ingredient.name}</Text>
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
  const message = [
    'Let’s get started! Gather your ingredients and set up your workspace. You’re on your way to creating something delicious!',
    'Keep it up! Your dedication will pay off in a tasty dish.',
    "You're on your way! Each step brings you closer to a delicious result.",
    'Great work! Every action you take is one step closer to success.',
    "Halfway there! You're creating something wonderful. Enjoy the process!",
    'You’re doing amazing! Stay focused and keep moving forward.',
    'Patience pays off! Let your dish  to perfection, and soon you’ll enjoy a warm, delightful treat.',
    "Keep the momentum! You're building flavors with each step.",
    'You’re doing great! As your dish cooks, savor the wonderful aromas filling your kitchen. It’s a sign of good things to come!',
    "You're almost there! Just a few more steps to perfection.",
    'Stay motivated! Your effort is about to pay off.',
    'Well done! Once your dish is plated, take a moment to admire your creation. You’ve worked hard and it shows!',
    "Final stretch! You're so close to the finish line",
    'Congratulations! Enjoy the delicious results of your hard work.',
  ];

  const getRandomText = (() => {
    const middleTexts = message.slice(1, message.length - 1); 
    return (index: number, total: number) => {
      if (index === 0) return message[0];
      if (index === total - 1) return message[message.length - 1];

      const randomIndex = Math.floor(Math.random() * middleTexts.length);
      return middleTexts.splice(randomIndex, 1)[0]; 
    };
  })();

  const slides: Slide[] = backendData.analyzeInstruction.flatMap((instruction, instructionIndex) => {
    // const bgColor = colorLevels[instructionIndex % colorLevels.length];
    const totalSteps = instruction.steps.length + 1;

    const instructionSlides: Slide[] = [
      {
        type: 'title' as const,
        title: `${instructionIndex + 1}. ${instruction.name}`,
        description: getRandomText(instructionIndex, totalSteps),
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
      <ChakraCarousel gap={28}>
        {slides.map((slide, index) => (
          <Flex
            key={index}
            boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
            flexDirection="column"
            justifyContent="flex-start"
            overflow="hidden"
            color="black.200"
            bg={theme.colors.white_purple}
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
                <Box mt="2">
                  <Text fontSize="18" textAlign="justify">{slide.description}</Text>
                </Box>
                {/* <Lottie animationData={Livecook} style={{ height: 200, width: 200 }} /> */}
              </>
            ) : (
              <Grid mt="4" mb="4" templateRows="repeat(2)" templateColumns="repeat(3, 2fr)" width="100%">
                <GridItem>
                  <Box borderRadius="md" boxShadow="md" bg={theme.colors.light_lavender}>
                    <Heading fontSize="20" fontWeight="bold" ml="2" p="2" mb="1">
                      Ingredients
                    </Heading>
                    <IngredientsList ingredients={slide.ingredients} />
                  </Box>
                </GridItem>
                <GridItem rowSpan={2} colSpan={2} ml="6">
                  <VStack mb={2} textAlign="left" display="flex" flexDirection="column" justifyContent="flex-start">
                    <Heading fontSize="22" fontWeight="bold">
                      Instruction
                    </Heading>
                    <Text w="full" fontSize="18" textAlign="justify">
                      {slide.description}
                    </Text>
                  </VStack>
                </GridItem>
                {slide.equipment.length > 0 && (
                  <GridItem mt="4">
                    <Box borderRadius="md" boxShadow="md" bg={theme.colors.light_lavender}>
                      <Heading fontSize="20" fontWeight="bold" ml="2" p="2" mb="1">
                        Equipment
                      </Heading>
                      <Box p={1}>
                        {slide.equipment.map((equip, index) => (
                          <HStack mb={3} key={index}>
                            <Box bg="white" boxSize="40px" borderRadius="full" ml="2" mr="1">
                              <Image src={equip.image} alt={equip.name} boxSize="40px" borderRadius="full" />
                            </Box>
                            <Text color="black">{equip.name}</Text>
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
