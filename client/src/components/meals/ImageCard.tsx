import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
  useTheme,
} from '@chakra-ui/react';
import React from 'react';
import Heart from 'react-animated-heart';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';
import customFetch from '../../utils/customFetch';

interface ImageCardProps {
  imageProps: {
    src: string;
    title: string;
    description: string;
    borderRadius?: string;
    category: string;
    id: string;
    infoLink: string;
    numberOfLiked: number;
    liked?: boolean;
  };
}

const ImageCard: React.FC<ImageCardProps> = ({ imageProps }) => {
  // const handleSeeMore = () => {
  //   window.open(imageProps.infoLink, '_blank');
  // };
  const [numberOfLiked, setNumberOfLiked] = React.useState(imageProps.numberOfLiked);
  const [liked, setLiked] = React.useState(imageProps.liked);
  const theme = useTheme();
  const { currentUser } = useAuth();
  const handleLike = async () => {
    if (currentUser.status === 'authenticated') {
      const liked = await customFetch.post('/user/likedMeal', {
        mealId: imageProps.id,
      });
      setLiked(liked.data.liked);
      setNumberOfLiked(liked.data.liked ? numberOfLiked + 1 : numberOfLiked - 1);
    } else {
      toast.error('Please login to like');
    }
  };

  return (
    <Card maxW="sm" boxShadow="md" borderRadius="xl" variant={'outline'} bgColor={theme.colors.palette_indigo}>
      <CardBody>
        <Image
          src={imageProps.src}
          borderRadius={imageProps.borderRadius || 'lg'}
          width="300px"
          height="150px"
          objectFit="cover"
        />
        <Stack mt="2" spacing="1">
          <Box height={'52px'}>
            <Heading size="lg" fontSize="23" fontWeight="bold">
              {imageProps.title.toString().slice(0, 40)}
            </Heading>
          </Box>
          {imageProps.description && (
            <Box height={'60px'}>
              <Text w="full">{imageProps.description.replace(/<[^>]*>/g, '').slice(0, 90) + '...'}</Text>
            </Box>
          )}
        </Stack>
      </CardBody>
      <Divider borderColor="base.200" />
      <CardFooter>
        <HStack>
          <Box position="relative">
            <Heart isClick={liked || false} onClick={handleLike} />
            <Text fontSize="sm" fontWeight="bold" color="white" position={'absolute'} top="10" right="6">
              {numberOfLiked}
            </Text>
          </Box>
          <Link to={imageProps.infoLink}>
            <Button variant="solid" colorScheme="blue" fontWeight="bold">
              See more
            </Button>
          </Link>
        </HStack>
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
