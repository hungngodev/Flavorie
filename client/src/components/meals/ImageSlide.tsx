import { Container, Flex, HStack, Heading, Text, VStack } from '@chakra-ui/react';
// import "fontsource-inter/500.css";
//import { capsFirst } from "../utils/index.tsx";
import ChakraCarousel from '../ChakraCarousel.tsx';

interface Dishes {
  image: string;
  title: string;
  description: string;
}

const dishes: Dishes[] = [
  {
    image: '../public/images/baked-brie-with-roasted-mushrooms.webp',
    title: 'Baked brie with roasted mushroom',
    description: ' Step 1: Bake brie and roasted mushroom.',
  },
  {
    image: '../public/images/apple-and-cheddar-crisp-salad-scaled.webp',
    title: 'Apple and cheddar crisp salad',
    description: 'Step 2: Wash salad and apple',
  },
  {
    image: '../public/images/buffalo-chicken-cobb-salad-scaled.webp',
    title: 'Buffalo chicken cobb salad',
    description: 'Step 3: Roast buffalo chicken',
  },
  {
    image: '../public/images/chocolate-raspberry-pavlova-stack-12-scaled.webp',
    title: 'Chocolate raspberry pavlova stack',
    description: 'Step 4: Wash raspberry',
  },
  {
    image: '../public/images/new-york-crumb-cake-7-scaled.webp',
    title: 'New york crumb cake',
    description: 'Step 5: Bake cake',
  },
  {
    image: '../public/images/summer-ricotta-grilled-vegetables.webp',
    title: 'Summer ricotta grilled vegetables',
    description: 'Step 6: Grilled vegetables after washing',
  },
];

function ImageSlide(): JSX.Element {
  // const [data, setData] = useState<Post[]>([]);

  // useEffect(() => {
  //     fetch("https://jsonplaceholder.typicode.com/posts/")
  //     .then((res) => res.json())
  //     .then((res: Post[]) => setData(res));
  // }, []);

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
        {dishes.map((dish: Dishes, index: number) => (
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
            <VStack mt={4} mb={4}>
              <Heading fontSize={{ base: 'xl', md: '2xl' }} textAlign="left" w="full" mb={2}>
                {dish.title}
              </Heading>
            </VStack>

            <Flex justifyContent="space-between">
              <HStack spacing={2}>
                <Text w="full">{dish.description}</Text>
              </HStack>
              {/* <Button
                    onClick={() => alert(`Post ${post.id - 5} clicked`)}
                    colorScheme="green"
                    fontWeight="bold"
                    color="gray.900"
                    size="sm"
                    >
                    More
                    </Button> */}
            </Flex>
          </Flex>
        ))}
      </ChakraCarousel>
    </Container>
  );
}

export default ImageSlide;
