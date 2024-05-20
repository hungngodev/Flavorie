import { Box, Button, HStack, IconButton, VStack, Heading } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRef, useEffect } from 'react';
import ImageCard from './ImageCard';

interface MealTypeProps {
    Type: string;
    meals: Meal[];
}

interface Meal {
    title: string;
    image: string;
    category: string;
    price: string;
    infoLink: string;
}

export function ListofMeals({ Type, meals }: MealTypeProps) {

    function scroll(direction: 'left' | 'right', distance: number, index: number) {
        const scrollRef = scrollRefs.current[index];
        if (scrollRef) {
            if (direction === 'left') {
                scrollRef.scrollTo({
                left: scrollRef.scrollLeft - distance,
                behavior: 'smooth',
                });
            } else {
                scrollRef.scrollTo({
                left: scrollRef.scrollLeft + distance,
                behavior: 'smooth',
                });
            }
        }
    }

    useEffect(() => {
        scrollRefs.current.forEach((ref) => {
            if (ref) {
            ref.scrollLeft = 0;
            }
        });
    }, []);

    const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
    return (
        <VStack spacing={18} width={'fit'} height={'fit'} marginTop={'2vh'} marginBottom={'5vh'} alignItems="center">
            <Button variant={'outline'}>
                <Heading size="lg">{Type}</Heading>
            </Button>
            <HStack width={'100%'} justifyContent={'center'} alignItems={'center'}>
            <IconButton
                icon={<ChevronLeftIcon />}
                aria-label="left"
                onClick={() => scroll('left', 500, 0)}
                variant="solid"
                colorScheme="blue"
                size="xs"
                height="50%"
                marginLeft={'5vh'}
            />
            <HStack
                spacing={4}
                overflowY={'hidden'}
                overflowX={'auto'}
                width={'100%'}
                ref={(el) => (scrollRefs.current[0] = el as HTMLDivElement)}
                className="no-scroll-bar"
                justifyContent="flex-start"
            >
                {meals.map((meal, index) => (
                <Box key={index} flexShrink={0}>
                    {' '}
                    <ImageCard
                    imageProps={{
                        src: meal.image,
                        title: meal.title,
                        category: meal.category,
                        price: meal.price,
                        infoLink: meal.infoLink,
                    }}
                    />
                </Box>
                ))}
            </HStack>
            <IconButton
                icon={<ChevronRightIcon />}
                aria-label="right"
                onClick={() => scroll('right', 500, 0)}
                variant="solid"
                colorScheme="blue"
                size="xs"
                height="50%"
                marginRight={'5vh'}
            />
            </HStack>
        </VStack>
        );
}

export default ListofMeals;
