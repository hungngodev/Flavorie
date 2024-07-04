import React, { useState } from 'react'; 
import { Box, Heading, Image, Link, Text, HStack, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import theme from '../../style/theme';
import customFetch from '../../utils/customFetch.ts';
import useToast from '../../hooks/useToast';

export interface RecentMeal {
    image: string;
    title: string;
    calories: number;
    date: string;
    infoLink: string; // link to the individual meal
}


export function RecentMeals() {
    const [meals, setMeals] = useState<RecentMeal[]>([])
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const { notifyError } = useToast();


    useEffect(() => {
        const fetchRecentMeals = async () => {
            try {
                const response = await customFetch.get('/user/likedMeal')
                if (response.status === 200){
                    console.log("Response like meals", response.data.likedMeals)
                    setMeals(response.data.likedMeals)
                } else {
                    notifyError("Cannot load your recent meals. Please try again")
                }
            } catch(error){
                console.log("Error fetching recent meals", error)
                notifyError("Cannot load your recent meals. Please try again")
            }
        }
        fetchRecentMeals()
        if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
        }
    }, [notifyError]);

    return (
        <VStack width={'full'} height={'400px'} mt={'1vh'} mb={'1vh'}>
            <Box width="full" height="42px">
                <HStack bg="rgba(153, 102, 255, 0.3)" borderRadius="md" height="100%" width="100%" spacing={0}>
                    <Box
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
                    height="100%"
                    width="22%"
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    >
                    <Text fontWeight="bold">Calories</Text>
                    </Box>
                    <Box
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
            <Box height="269px" width="full" overflowY="auto" ref={scrollRef} border="1px" borderColor={theme.colors.palette_lavender}  borderRadius="md">
            {meals.length > 0 ? (
                meals.map((meal, index) => (
                <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    bg="white"
                    p={2}
                    borderBottom="1px"
                    borderColor={theme.colors.palette_lavender}
                    _hover={{ bg: 'base.50', color: 'black' }}
                    width="full"
                >
                    <Image src={meal.image} alt={meal.title} boxSize="50px" borderRadius="full" mr="4" />
                    <Box flex="1">
                        <Link href={meal.infoLink} fontWeight="bold" color="purple.500">
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
                    <Text fontSize="md" mt="2">Start adding your favorite meals to see them here.</Text>
                </Box>
            )}
            </Box>
        </VStack>
    );
}

export default RecentMeals;