import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import theme from '../../style/theme';

export interface RecentMeal {
    likedMeal: any;
    status: string;
}

export function RecentMeals({ likedMeal, status }: RecentMeal) {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const { notifyError } = useToast();

    if (status === 'error') notifyError('Cannot load your recent meals. Please try again');
    if (status === 'pending') return <div>Loading...</div>;

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
                    <Box height="100%" width="22%" display="flex" justifyContent="center" flexDirection="column">
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
            <Box
                height="269px"
                width="full"
                overflowY="auto"
                ref={scrollRef}
                border="1px"
                borderColor={theme.colors.palette_lavender}
                borderRadius="md"
            >
                {likedMeal?.length > 0 ? (
                    likedMeal?.map((meal: any, index: number) => (
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
                            <Image
                                src={meal?.likedMeal?.imageUrl}
                                alt={meal?.likedMeal?.title}
                                boxSize="50px"
                                borderRadius="full"
                                mr="4"
                            />
                            <Box flex="1">
                                <Link to={`/meals/${meal?.likedMeal?.id}`}>
                                    <Text fontWeight="bold" color="purple.500">
                                        {meal?.likedMeal?.title}
                                    </Text>
                                </Link>
                            </Box>
                            <Box width="22%">
                                <Text color="base.400">{Math.round(Math.random() * 500)} kCal</Text>
                            </Box>
                            <Box width="23%">
                                <Text flex="1" textAlign="right" color="base.400">
                                    {new Date(meal.createdAt.toString()).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </Text>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Box p={4} textAlign="center">
                        <Text fontSize="lg" fontWeight="bold">
                            Let's get cooking!
                        </Text>
                        <Text fontSize="md" mt="2">
                            Start adding your favorite meals to see them here.
                        </Text>
                    </Box>
                )}
            </Box>
        </VStack>
    );
}

export default RecentMeals;
