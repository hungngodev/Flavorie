import React from 'react';
import { Box, Image, Text, Container, Flex, Grid, GridItem, HStack, Heading, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
// import "fontsource-inter/500.css";
//import { capsFirst } from "../utils/index.tsx";
import { ReactNode } from 'react';
import ChakraCarousel from './ChakraCarousel';

interface Ingredient {
  image: string;
  name: string;
}

interface IngredientsProps {
  ingredients: Ingredient[];
}

interface Equipment {
  image: string;
  name: string;
}

export interface Dish {
  ingredients: Ingredient[];
  title: string;
  description: string;
  bgColor: string;
  equipment: Equipment[];
}

type DishesProps = {
  dishes: Dish[];
};

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
            <Image src={ingredient.image} alt={ingredient.name} boxSize="40px" borderRadius="full"/>
          </Box>
          <Text>{ingredient.name}</Text>
        </HStack>
      ))}
    </Box>
  );
};

function ImageSlide({ dishes }: DishesProps): ReactNode {
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
        {dishes.map((dish: Dish, index: number) => (
          <Flex
            key={index}
            boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
            flexDirection="column"
            justifyContent="flex-start"
            overflow="hidden"
            color="black.200"
            bg={dish.bgColor}
            rounded={5}
            flex={1}
            p={5}
          >
            <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mb="3" textAlign="center" w="full">
              {dish.title}
            </Heading>
            <Grid mt="4" templateRows="repeat(2)" templateColumns="repeat(3, 2fr)" width="100%">
              <GridItem>
                <Box borderRadius="md" boxShadow="md" bg="brown.20">
                  <Heading fontSize="20" fontWeight="bold" ml="2" mt="2" mb="2">
                    Ingredients
                  </Heading>
                  <IngredientsList ingredients={dish.ingredients} />
                </Box>
              </GridItem>
              <GridItem rowSpan={2} colSpan={2} ml="4" >
                {/* <img src={dish.image} alt={dish.title} style={{ maxWidth: '100%', borderRadius: '8px' }} /> */}
                <VStack mb={2} textAlign="left" display="flex" flexDirection="column" justifyContent="flex-start">
                  <Heading fontSize="20" fontWeight="bold">
                    Instruction
                  </Heading>
                  <Text w="full" textAlign="justify">
                    {dish.description}
                  </Text>
                </VStack>
              </GridItem>
              <GridItem mt="4">
                <Box borderRadius="md" boxShadow="md" bg="brown.20">
                  <Heading fontSize="20" fontWeight="bold" ml="2" mt="2" mb="2">
                    Equipment
                  </Heading>
                  <Box p={1}>
                    {dish.equipment.map((equip, index) => (
                      <HStack mb={4}>
                        <Box bg="white" boxSize="40px" borderRadius="full" mr="2">
                          <Image
                            src={equip.image}
                            alt={equip.name}
                            boxSize="40px"
                            borderRadius="full"
                          />
                        </Box>
                        <Text>{equip.name}</Text>
                      </HStack>
                    ))}
                  </Box>
                </Box>
              </GridItem>
              {/* <Flex justifyContent="space-between">
              <HStack spacing={2}></HStack>
            </Flex> */}
            </Grid>
          </Flex>
        ))}
      </ChakraCarousel>
    </Container>
  );
}

export default ImageSlide;
