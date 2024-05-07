import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';

interface ImageCardProps {
  imageProps: {
    src: string;
    alt: string;
    description: string;
    borderRadius?: string;
    price: string;
  };
}

const ImageCard: React.FC<ImageCardProps> = ({ imageProps }) => {
  return (
    <Card maxW="sm" boxShadow="md" borderRadius="md" p={2}>
      <CardBody>
        <Image src={imageProps.src} alt={imageProps.alt} borderRadius={imageProps.borderRadius || 'lg'} />
        <Stack mt="6" spacing="3">
          <Heading size="lg" fontSize="22" fontWeight="bold">
            Ingredient Information
          </Heading>
          <Text w="full">{imageProps.description}</Text>
          <Text color="blue.350" fontSize="28">
            {imageProps.price}
          </Text>
        </Stack>
      </CardBody>
      <Divider borderColor="black.200" />
      <CardFooter>
        <ButtonGroup>
          <Button variant="solid" colorScheme="blue" fontWeight="bold">
            See more
          </Button>
          <Button variant="outline" colorScheme="blue" fontWeight="bold">
            Like
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default ImageCard;

// Instruction to use

// copy this prop to function App in App.tsx
// const imageProps = {
//   src: "../public/images/baked-brie-with-roasted-mushrooms.webp",
//   alt: "Baked brie with roasted mushroom",
//   description: "Baked brie cheese with roasted mushroom on top.",
//   borderRadius: '8px',
//   price: '$4.8'
// }

// copy this line in return in App.tsx
//<ImageCard imageProps={imageProps} />
