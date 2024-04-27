import React from 'react';
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
    Text
    } from '@chakra-ui/react';

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
        <Card maxW='sm' boxShadow='md' borderRadius='md' p={5}>
            <CardBody>
                <Image
                src={imageProps.src}
                alt={imageProps.alt}
                borderRadius={imageProps.borderRadius || 'lg'}
                />
                <Stack mt="6" spacing="3">
                    <Heading size="lg" fontSize='22' fontWeight='bold'>Ingredient Information</Heading>
                    <Text w="full">
                        {imageProps.description}
                    </Text>
                    <Text color='blue600' fontSize='2xl'>
                        {imageProps.price}
                    </Text>
                </Stack>
            </CardBody>
            <Divider borderColor='gray.200' />
            <CardFooter>
                <ButtonGroup>
                    <Button variant='outline' colorScheme='gray' bg='white'>
                        See more
                    </Button>
                    <Button variant='ghost' colorScheme='gray'>
                        Like
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    );
};

export default ImageCard;


