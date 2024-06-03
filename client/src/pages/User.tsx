import UserCard from "../components/users/UserInforCard";
import {Box, Button, Flex, Image, Grid, GridItem, Heading, Progress, Stack, Table, Tbody, Td, Text, Th, Thead, Tr} from '@chakra-ui/react';
// import { PolarArea } from 'react-chartjs-2';
import React from "react";
import { PersonalProps } from "../components/users/UserInforCard";
import RecentMeals from "../components/meals/RecentMeals";
import { RecentMeal } from "../components/meals/RecentMeals";
import { Bar, PolarArea } from 'react-chartjs-2';
import { Chart, plugins, registerables, TooltipItem, ChartOptions } from 'chart.js'; 


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
interface UserProps {
    mealData: TableData[];
    info: PersonalProps;
    totalMeals: string;
    points: string;
    tags: string;
    reviewsGiven: string;
    recipesShared: string;
    caloriesConsumed: string;
    badgesEarned: string;
    recentMeals: RecentMeal[];
    protein: string;
    vitamins: string;
    carb: string;
    fat: string;
    minerals: string;
    weeklySummaryData: WeeklyData;
    weeklyCaloriesData: WeeklyCalories[];
}

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
              return [
                `${label}: ${value}g`,
                'Vitamin A: 2g', 
                'Vitamin B: 3g', 
                'Vitamin C: 3g', 
                'Vitamin D: 2g'];
            } else if (nutrient === 'Minerals') {
              return [
                `${label}: ${value}g`, 
                'Iron: 2g', 
                'Calcium: 3g', 
                'Magnesium: 2g', 
                'Zinc: 1g'];
            }
            return `${label}: ${value}g`;
          },
        },
      },
    },
  };

  return <PolarArea data={chartData} options={options} />;
};

export type WeeklyData = {
  weeklyProtein: number;
  weeklyCarb: number;
  weeklyFat: number;
};

const WeeklySummary = ({ weeklyProtein, weeklyCarb, weeklyFat }: WeeklyData) => {
  return (
    <Box p={4} borderRadius="md" boxShadow="md" bg="white">
      <Heading fontSize="22" fontWeight="bold" mb={5}>
        Weekly Summary
      </Heading>
      <Box>
        <Stack spacing="2">
          <Box>
            <Text fontSize="16" fontWeight="bold">
              Proteins
            </Text>
            <Progress colorScheme="lighpurple" size="sm" value={weeklyProtein} />
          </Box>
          <Box>
            <Text fontSize="16" fontWeight="bold">
              Carbs
            </Text>
            <Progress colorScheme="lighblue" size="sm" value={weeklyCarb} />
          </Box>
          <Box>
            <Text fontSize="16" fontWeight="bold">
              Fat
            </Text>
            <Progress colorScheme="lighblue" size="sm" value={weeklyFat} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export interface WeeklyCalories {
  date: string;
  weeklyCalories: string;
};

const WeeklyCaloriesChart = ({ data }: { data: WeeklyCalories[] }) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: 'Calories',
        data: data.map((item) => parseInt(item.weeklyCalories, 10)),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        barThickness: 20,
        maxBarThickness: 30,
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

function PersonalDashboard({
  mealData,
  info,
  totalMeals,
  points,
  tags,
  reviewsGiven,
  recipesShared,
  caloriesConsumed,
  badgesEarned,
  recentMeals,
  protein,
  vitamins,
  carb,
  fat,
  minerals,
  weeklySummaryData,
  weeklyCaloriesData
}: UserProps) {
  const nutrientData: NutrientData = {protein, carb, fat, vitamins, minerals};

  return (
    <Grid templateRows="repeat(6)" templateColumns="repeat(10, 3fr)" mt="1">
      <GridItem rowSpan={2} colSpan={3} objectFit="cover" ml="2" mr="2">
        <Box height="100%" width="100%">
          <UserCard {...info} />
        </Box>
      </GridItem>
      <GridItem rowSpan={2} colSpan={4} mr="2">
        <Box>
          <Box mb="2" borderRadius="md" bg="lightgray">
            <Table variant="simple" fontSize="11">
              <Thead>
                <Tr>
                  <Th fontSize="11">Meal Type</Th>
                  <Th fontSize="11">Carbs</Th>
                  <Th fontSize="11">Protein</Th>
                  <Th fontSize="11">Fat</Th>
                  <Th fontSize="11">Calories</Th>
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
          <Box>Preferences</Box>
          <Box>Allergies</Box>
        </Box>
      </GridItem>
      <GridItem rowSpan={2} colSpan={3} ml="2">
        <NutrientChart {...nutrientData} />
      </GridItem>
      {/* <GridItem rowSpan={1} colSpan={3}>
        <Box>Preferences</Box>
        <Box>Allergies</Box>
      </GridItem> */}
      <GridItem rowSpan={2} colSpan={3}>
        <Box>
          <Heading mt="2" fontSize="22" fontWeight="bold" textAlign="center">
            Statistics
          </Heading>
          <Text ml="2">Total meals: {totalMeals}</Text>
          <Text ml="2">Calories consumed: {caloriesConsumed}</Text>
          <Text ml="2">Total points: {points}</Text>
          <Text ml="2">Tags: {tags}</Text>
          <Text ml="2">Recipes shared: {recipesShared}</Text>
          <Text ml="2">Reviews given: {reviewsGiven}</Text>
          <Text ml="2">Badges earned: {badgesEarned}</Text>
        </Box>
      </GridItem>
      <GridItem rowSpan={4} colSpan={4} mt="2">
        <RecentMeals meals={recentMeals} />
      </GridItem>
      <GridItem rowSpan={4} colSpan={3} mt="4" ml="2">
        <Box>
          <Box>
            <WeeklySummary {...weeklySummaryData} />
          </Box>
          <Box>
            <WeeklyCaloriesChart data={weeklyCaloriesData} />
          </Box>
        </Box>
      </GridItem>
    </Grid>
  );
}

export default PersonalDashboard;
