import { Text as CharkaText, Container, Flex, HStack, Heading, VStack } from '@chakra-ui/react';
// import "fontsource-inter/500.css";
//import { capsFirst } from "../utils/index.tsx";
import { ReactNode } from 'react';
import ChakraCarousel from './ChakraCarousel.tsx';

export interface Dish {
  image: string;
  title: string;
  description: string;
}

type DishesProps = {
  dishes: Dish[];
}

function ImageSlide({ dishes }: DishesProps): ReactNode {
  return (
    <Container
      py={8}
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
      <ChakraCarousel gap={32}>
        {dishes.map((dish: Dish, index: number) => (
          <Flex
            key={index}
            boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
            justifyContent="space-between"
            flexDirection="column"
            overflow="hidden"
            color="black.200"
            bg="base.d100"
            rounded={5}
            flex={1}
            p={5}
          >
            <img src={dish.image} alt={dish.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
            <VStack mt={4} mb={2}>
              <Heading fontSize={{ base: 'xl', md: '2xl' }} textAlign="left" w="full">
                {dish.title}
              </Heading>
            </VStack>

            <Flex justifyContent="space-between">
              <HStack spacing={2}>
                <CharkaText w="full">{dish.description}</CharkaText>
              </HStack>
            </Flex>
          </Flex>
        ))}
      </ChakraCarousel>
    </Container>
  );
}

export default ImageSlide;
