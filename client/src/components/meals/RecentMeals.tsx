import React from 'react'; 
import { Box, Heading, Image, Link, Text, HStack, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

export interface RecentMeal {
    image: string;
    title: string;
    calories: number;
    date: string;
    infoLink: string; // link to the individual meal
}

interface RecentMealsProps {
    meals: RecentMeal[];
}

export function RecentMeals({ meals }: RecentMealsProps) {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
        }
    }, []);

    return (
        <VStack width={'full'} height={'400px'} mt={'1vh'} mb={'1vh'}>
            <Box width="full" height="42px">
                <HStack bg="rgba(153, 102, 255, 0.3)" borderRadius="md" height="100%" width="100%" spacing={0}>
                    <Box
                    borderBottom="1px solid lightgray"
                    textAlign="center"
                    height="100%"
                    width="55%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    >
                    <Text fontWeight="bold">Meal</Text>
                    </Box>
                    <Box
                    borderBottom="1px solid lightgray"
                    height="100%"
                    width="22%"
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    >
                    <Text fontWeight="bold">Calories</Text>
                    </Box>
                    <Box
                    borderBottom="1px solid lightgray"
                    textAlign="center"
                    height="100%"
                    width="23%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    >
                    <Text fontWeight="bold">Date</Text>
                    </Box>
                </HStack>
            </Box>
            <Box height="300px" width="full" overflowY="auto" ref={scrollRef} border="1px solid lightgray" borderTop="none">
            {meals.length > 0 ? (
                meals.map((meal, index) => (
                <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    bg="white"
                    p={3}
                    borderBottom="1px solid lightgray"
                    _hover={{ bg: 'base.50', color: 'black' }}
                    width="full"
                >
                    <Image src={meal.image} alt={meal.title} boxSize="50px" borderRadius="full" mr="4" />
                    <Box flex="1">
                        <Link href={meal.infoLink} fontWeight="bold">
                            {meal.title}
                        </Link>
                    </Box>
                    <Box width="22%">
                        <Text color="base.400">{meal.calories} kCal</Text>
                    </Box>
                    <Box width="23%">
                        <Text flex="1" textAlign="right" color="base.400">
                            {meal.date}
                        </Text>
                    </Box>
                </Box>
                ))
            ) : (
                <Box p={4} textAlign="center">
                    <Text fontSize="lg" fontWeight="bold">
                        Let's get cooking!
                    </Text>
                    <Text>Start adding your favorite meals to see them here.</Text>
                </Box>
            )}
            </Box>
        </VStack>
    );
}

export default RecentMeals;