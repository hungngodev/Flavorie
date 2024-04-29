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
    Text,
    ChakraProvider,
    extendTheme
    } from '@chakra-ui/react';
import theme from "../style/theme.tsx";
import { capsFirst } from "../utils/index.tsx";

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
        <ChakraProvider theme={extendTheme(theme)}>
        <Card maxW='sm' boxShadow='md' borderRadius='md' p={2}>
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
                    <Text color='blue.350' fontSize='28'>
                        {imageProps.price}
                    </Text>
                </Stack>
            </CardBody>
            <Divider borderColor='black.200' />
            <CardFooter>
                <ButtonGroup>
                    <Button variant='solid' colorScheme='blue' fontWeight='bold'>
                        See more
                    </Button>
                    <Button variant='outline' colorScheme='blue' fontWeight='bold'>
                        Like
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
        </ChakraProvider>
    );
};

export default ImageCard;


