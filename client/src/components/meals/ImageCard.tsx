import {
  Box,
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
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';

interface ImageCardProps {
  imageProps: {
    src: string;
    title: string;
    description: string;
    borderRadius?: string;
    category: string;
    infoLink: string;
  };
}

const ImageCard: React.FC<ImageCardProps> = ({ imageProps }) => {
  // const handleSeeMore = () => {
  //   window.open(imageProps.infoLink, '_blank');
  // };
  const { currentUser } = useAuth();
  const handleLike = () => {
    if (currentUser.status === 'authenticated') {
      toast.success('Liked');
    } else {
      toast.error('Please login to like');
    }
  };
  return (
    <Card maxW="sm" boxShadow="md" borderRadius="md" variant={'outline'}>
      <CardBody>
        <Image
          src={imageProps.src}
          borderRadius={imageProps.borderRadius || 'lg'}
          width="300px"
          height="150px"
          objectFit="cover"
        />
        <Stack mt="2" spacing="1">
          <Box height={'82px'}>
            <Heading size="lg" fontSize="23" fontWeight="bold">
              {imageProps.title}
            </Heading>
          </Box>
          <Box height={'60px'}>
            <Text w="full">{imageProps.description.replace(/<\/[^>]+(>|$)/g, '')}</Text>
          </Box>
          {/* <Text color="blue.350" fontSize="28">
            {imageProps.price}
          </Text> */}
        </Stack>
      </CardBody>
      <Divider borderColor="base.200" />
      <CardFooter>
        <ButtonGroup>
          <Link to={imageProps.infoLink}>
            <Button variant="solid" colorScheme="blue" fontWeight="bold">
              See more
            </Button>
          </Link>
          <Button variant="outline" colorScheme="blue" fontWeight="bold" onClick={handleLike}>
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
//   title: "Baked brie with roasted mushroom"
//   description: "Baked brie cheese with roasted mushroom on top.",
//   borderRadius: '8px',
//   price: '$4.8'
// }

// copy this line in return in App.tsx
//<ImageCard imageProps={imageProps} />
