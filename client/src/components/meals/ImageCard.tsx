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
import theme from '../../style/theme';

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
        <Card maxW="sm" boxShadow="md" borderRadius="xl" variant={'outline'} bgColor={theme.colors.white_purple}>
            <CardBody>
                <Image
                    src={imageProps.src}
                    borderRadius={imageProps.borderRadius || 'lg'}
                    width="300px"
                    height="200px"
                    objectFit="cover"
                />
                <Stack mt="5" spacing="1">
                    <Box height={'58px'}>
                        <Heading size="lg" color="gray.600" fontSize="23" fontWeight="bold" textTransform="capitalize">
                            {imageProps.title.toString().slice(0, 40)}
                        </Heading>
                    </Box>
                    {imageProps.description && (
                        <Box height={'60px'} mt="2">
                            <Text color="gray.700" w="full">
                                {imageProps.description.replace(/<[^>]*>/g, '').slice(0, 90) + '...'}
                            </Text>
                        </Box>
                    )}
                </Stack>
            </CardBody>
            {/* <Divider borderColor="base.200" /> */}
            <CardFooter>
                <HStack mt="1" mb="4">
                    <Link
                        to={imageProps.infoLink}
                        style={{
                            color: theme.colors.palette_purple,
                            textDecoration: 'underline',
                        }}
                    >
                        See more
                    </Link>
                    <HStack
                        position="absolute"
                        bottom="1"
                        right="1"
                        objectFit="fill"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        borderRadius="full"
                        mr="1"
                    >
                        <Heart isClick={liked || false} onClick={handleLike} />
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color="gray.400"
                            position={'absolute'}
                            top="10"
                            right="4"
                            ml={1}
                        >
                            {numberOfLiked}
                        </Text>
                    </HStack>
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
