import UserCard from '../components/users/InfoCard';
import { Box, Button, Flex, Image, Grid, GridItem, Heading, HStack, Progress, Spacer, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, background } from '@chakra-ui/react';
import React from 'react';
import { PersonalProps } from '../components/users/InfoCard';
import RecentMeals from '../components/meals/RecentMeals';
import { RecentMeal } from '../components/meals/RecentMeals';
import { Bar, PolarArea } from 'react-chartjs-2';
import { Chart, plugins, registerables, TooltipItem, ChartOptions } from 'chart.js';
import TagSelect from '../components/meals/TagSelect';
import { FaStar, FaUtensils, FaMedal, FaHeart, FaCheckCircle, FaListAlt } from 'react-icons/fa';
import theme from '../style/theme';

Chart.register(...registerables);
export interface TableData {
  mealType: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  // caloriesOfGoal: number;
}

interface RecentMeals {
  image: string;
  title: string;
  description: string;
  calories: string;
  date: string;
}

type recentMealProps = {
  meals: RecentMeal[];
};

// polar area chart
export type NutrientData = {
  protein: string;
  carb: string;
  fat: string;
  vitamins: string;
  minerals: string;
};

const generateChartData = ({ protein, carb, fat, vitamins, minerals }: NutrientData) => {
  const colors = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
  ];

  return {
    labels: ['Protein', 'Carbohydrates', 'Fat', 'Vitamins', 'Minerals'],
    datasets: [
      {
        label: 'Nutrients',
        data: [protein, carb, fat, vitamins, minerals],
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };
};

const NutrientChart = (nutrients: NutrientData) => {
  const { protein, carb, fat, vitamins, minerals } = nutrients;
  const hasData = [protein, carb, fat, vitamins, minerals].some((value) => parseInt(value, 10) > 0);

  if (!hasData) {
    return (
      <Box p={4} textAlign="center">
        <Text fontSize="lg">We'll analyze your nutrient intake after you log some meals.</Text>
      </Box>
    );
  }

  const chartData = generateChartData(nutrients);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'polarArea'>) => {
            const label = context.dataset.label ?? '';
            const value = context.raw as number;
            const index = context.dataIndex;
            const nutrient = chartData.labels?.[index] ?? '';

            if (nutrient === 'Vitamins') {
              return [`${label}: ${value}g`, 'Vitamin A: 2g', 'Vitamin B: 3g', 'Vitamin C: 3g', 'Vitamin D: 2g'];
            } 
            else if (nutrient === 'Minerals') {
              return [`${label}: ${value}g`, 'Iron: 2g', 'Calcium: 3g', 'Magnesium: 2g', 'Zinc: 1g'];
            }
            return `${label}: ${value}g`;
          },
        },
      },
    },
  };

  return (
    <Box
      p="2"
      borderRadius="md"
      boxShadow="md"
      bg="white"
      objectFit="fill"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      <PolarArea data={chartData} options={options} />
    </Box>
  );
};

// Weekly summary 
export type WeeklyData = {
  weeklyProtein: number;
  weeklyCarb: number;
  weeklyFat: number;
};

const WeeklySummary = ({ weeklyProtein, weeklyCarb, weeklyFat }: WeeklyData) => {
  const hasData = weeklyProtein > 0 || weeklyCarb > 0 || weeklyFat > 0;

  if (!hasData) {
    return (
      <Box p={2} textAlign="center">
        <Text fontSize="lg">We'll provide a summary after you log some meals.</Text>
      </Box>
    );
  }

  const chartData = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        data: [weeklyProtein, weeklyCarb, weeklyFat],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
        barThickness: 12,
        maxBarThickness: 15,
        minBarThickness: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box p="1" borderRadius="md" boxShadow="md" bg="white" h="150px">
      <Bar data={chartData} options={options} />
    </Box>
    // <Box p={4} borderRadius="md" boxShadow="md" bg="white">
    //   <Box>
    //     <Stack spacing="2">
    //       <Box>
    //         <Text fontSize="16" fontWeight="bold">
    //           Proteins
    //         </Text>
    //         <Progress colorScheme="lighpurple" size="sm" value={weeklyProtein} />
    //       </Box>
    //       <Box>
    //         <Text fontSize="16" fontWeight="bold">
    //           Carbs
    //         </Text>
    //         <Progress colorScheme="lighblue" size="sm" value={weeklyCarb} />
    //       </Box>
    //       <Box>
    //         <Text fontSize="16" fontWeight="bold">
    //           Fat
    //         </Text>
    //         <Progress colorScheme="lighblue" size="sm" value={weeklyFat} />
    //       </Box>
    //     </Stack>
    //   </Box>
    // </Box>
  );
};

export interface WeeklyCalories {
  date: string;
  weeklyCalories: string;
}

const WeeklyCaloriesChart = ({ data }: { data: WeeklyCalories[] }) => {
  const hasData = data.length > 0;

  if (!hasData) {
    return (
      <Box p={4} textAlign="center">
        <Text fontSize="lg">We'll track your calories after you log some meals.</Text>
      </Box>
    );
  }

  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: 'Calories',
        data: data.map((item) => parseInt(item.weeklyCalories, 10)),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        barThickness: 18,
        maxBarThickness: 20,
        minBarThickness: 10,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Weekly Calories',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box p="2" borderRadius="md" boxShadow="md" bg="white">
      <Bar data={chartData} options={options} />
    </Box>
  );
};

interface UserProps {
  mealData: TableData[];
  info: PersonalProps;
  totalPosts: number;
  recipesShared: number;
  recipesRated: number;
  totalPoints: number;
  badgesEarned: number;
  recentMeals: RecentMeal[];
  protein: string;
  vitamins: string;
  carb: string;
  fat: string;
  minerals: string;
  weeklySummaryData: WeeklyData;
  weeklyCaloriesData: WeeklyCalories[];
}

const getBadgeLevel = (badgesEarned: number): string => {
  if (badgesEarned >= 100) return 'Diamond';
  if (badgesEarned >= 80) return 'Platinum';
  if (badgesEarned >= 60) return 'Gold';
  if (badgesEarned >= 30) return 'Silver';
  return 'Bronze';
};

const getBadgeColor = (badgeLevel: string): string => {
  switch (badgeLevel) {
    case 'Diamond':
      return 'blue.200';
    case 'Platinum':
      return 'base.300';
    case 'Gold':
      return 'yellow';
    case 'Silver':
      return 'base.400';
    default:
      return 'orange';
  }
};

function User({
  mealData,
  info,
  totalPosts,
  recipesShared,
  recipesRated,
  totalPoints,
  badgesEarned,
  recentMeals,
  protein,
  vitamins,
  carb,
  fat,
  minerals,
  weeklySummaryData,
  weeklyCaloriesData,
}: UserProps) {
  const nutrientData: NutrientData = { protein, carb, fat, vitamins, minerals };
  const { username } = info.avatar;
  const badgeLevel = getBadgeLevel(badgesEarned);
  const badgeColor = getBadgeColor(badgeLevel);

  return (
    <Grid templateRows="repeat(3, 2fr)" templateColumns="repeat(10, 3fr)" mt="3">
      <GridItem rowSpan={3} colSpan={3} objectFit="cover" ml="4" mr="4">
        <Box height="100%" width="100%">
          <UserCard {...info} />
          <TagSelect />
        </Box>
      </GridItem>
      <GridItem colSpan={4} ml="2" mr="2">
        <Box>
          <Box mb="2" display="flex" flexDirection="column" justifyContent="flex-start">
            <Heading fontSize="20" fontWeight="bold" mt="1">
              Hi {username},
            </Heading>
            <Text mt="1">Welcome back! Let's check the nutrition of your meals for today.</Text>
          </Box>
          <Box
            mb="2"
            borderRadius="md"
            bg="rgba(153, 102, 255, 0.3)"
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            mt="4"
          >
            <Table variant="simple" fontSize="14">
              <Thead>
                <Tr>
                  <Th fontSize="12">Meal Type</Th>
                  <Th fontSize="12">Carbs</Th>
                  <Th fontSize="12">Protein</Th>
                  <Th fontSize="12">Fat</Th>
                  <Th fontSize="12">Calories</Th>
                  {/* <Th fontSize="11">Calories of goal, %</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {mealData.map((meal) => (
                  <Tr key={meal.mealType}>
                    <Td>{meal.mealType}</Td>
                    <Td>{meal.carbs}</Td>
                    <Td>{meal.protein}</Td>
                    <Td>{meal.fat}</Td>
                    <Td>{meal.calories}</Td>
                    {/* <Td>
                      <Box bg="lightgray" width={`${meal.caloriesOfGoal}%`} height="10px" />
                      {meal.caloriesOfGoal}
                    </Td> */}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Box mt="3" mb="2">
            <Heading mb="2" fontSize="22" fontWeight="bold">
              Statistics
            </Heading>
            <Box borderRadius="md" boxShadow="md" p="4" border="1px" borderColor={theme.colors.palette_lavender}>
              <VStack bg="white">
                <HStack h="50px" w="100%" mb="2">
                  <Box borderRadius="md" w="32%" border="1px" borderColor={theme.colors.palette_lavender}>
                    <HStack ml="5">
                      <FaListAlt size={24} color={theme.colors.palette_blue} />
                      <Box mr="2" mb="1">
                        <Text ml="2" fontSize="lg" fontWeight="bold">
                          {totalPosts}
                        </Text>
                        <Text ml="2" color="base.400" fontSize="14">
                          Total posts
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Spacer />
                  <Box w="26%" borderRadius="md" border="1px" borderColor={theme.colors.palette_lavender}>
                    <HStack ml="5">
                      <FaUtensils size={24} color="gray" />
                      <Box mr="2" mb="1">
                        <Text ml="2" fontSize="lg" fontWeight="bold">
                          {recipesShared}
                        </Text>
                        <Text ml="2" color="base.400" fontSize="14">
                          Shares
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Spacer />
                  <Box w="36%" borderRadius="md" border="1px" borderColor={theme.colors.palette_lavender}>
                    <HStack ml="5">
                      <FaHeart size={24} color="pink" />
                      <Box mr="2" mb="1">
                        <Text ml="2" fontSize="lg" fontWeight="bold">
                          {recipesRated}
                        </Text>
                        <Text ml="2" color="base.400" fontSize="14">
                          Recipes rated
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
                <HStack h="50px" w="100%">
                  <Box w="32%" borderRadius="md" border="1px" borderColor={theme.colors.palette_lavender}>
                    <HStack ml="5">
                      <FaStar size={24} color="gold" />
                      <Box mr="2" mb="1">
                        <Text ml="2" fontSize="lg" fontWeight="bold">
                          {totalPoints}
                        </Text>
                        <Text ml="2" color="base.400" fontSize="14">
                          Total points
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Spacer />
                  <Box w="26%" borderRadius="md" border="1px" borderColor={theme.colors.palette_lavender}>
                    <HStack ml="5">
                      <FaMedal size={24} color="gold" />
                      <Box mr="2" mb="1">
                        <Text ml="2" fontSize="lg" fontWeight="bold">
                          {badgesEarned}
                        </Text>
                        <Text ml="2" color="base.400" fontSize="14">
                          Badges
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Spacer />
                  <Box w="36%" borderRadius="md" border="1px" borderColor={theme.colors.palette_lavender}>
                    <HStack ml="5">
                      <FaCheckCircle size={24} color={badgeColor} />
                      <Box mr="2" mb="1">
                        <Text ml="2" fontSize="lg" fontWeight="bold">
                          {badgeLevel}
                        </Text>
                        <Text ml="2" color="base.400" fontSize="14">
                          Badge level
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </VStack>
            </Box>
          </Box>
          {/* <Box>Allergies</Box> */}
        </Box>
      </GridItem>
      <GridItem rowSpan={3} colSpan={3} ml="4" mr="4">
        <Box flexDirection="column" alignItems="center" justifyContent="center">
          <Heading fontSize="22" fontWeight="bold" mt="2" mb="1">
            Daily Summary
          </Heading>
          <Box>
            <NutrientChart {...nutrientData} />
          </Box>
        </Box>
        <Box mt="4">
          <Heading fontSize="22" fontWeight="bold" mb={1}>
            Weekly Summary
          </Heading>
          <Box mb="2">
            <WeeklySummary {...weeklySummaryData} />
          </Box>
          <WeeklyCaloriesChart data={weeklyCaloriesData} />
        
        </Box>
      </GridItem>
      <GridItem rowSpan={2} colSpan={4} ml="2" mr="2" mt="2">
        <Box>
          <Heading fontSize="22" fontWeight="bold" mb={1}>
            Recent Meals
          </Heading>
          <RecentMeals meals={recentMeals} />
        </Box>
      </GridItem>
      {/* <GridItem rowSpan={2} colSpan={3} mt="2" ml="4">
        <Box>
          <Heading fontSize="22" fontWeight="bold" mb={2}>
            Weekly Summary
          </Heading>
          <Box>
            <WeeklySummary {...weeklySummaryData} />
          </Box>
          <Box mt="1">
            <WeeklyCaloriesChart data={weeklyCaloriesData} />
          </Box>
        </Box>
      </GridItem> */}
    </Grid>
  );
}

export default User;
