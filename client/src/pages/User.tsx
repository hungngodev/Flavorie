// function User() {
//   return <div>User</div>;
// }

// export default User;

import UserCard from "../components/users/UserInforCard";
import {Box, Button, Flex, Image, Grid, GridItem, Heading, Stack, Table, Tbody, Td, Text, Th, Thead, Tr} from '@chakra-ui/react';
// import { PolarArea } from 'react-chartjs-2';
import React from "react";
import { PersonalProps } from "../components/users/UserInforCard";
import { StringNullableChain } from "lodash";
import RecentMeals from "../components/meals/RecentMeals";
import { RecentMeal } from "../components/meals/RecentMeals";

export interface TableData {
  mealType: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  caloriesOfGoal: number;
}

// interface RecentMeals {
//   image: string;
//   title: string;
//   description: string;
//   calories: string;
//   date: string;
// }

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
}

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
  minerals
}: UserProps) {
  return (
    <Grid templateRows="repeat(6)" templateColumns="repeat(10, 3fr)" mt="1">
      <GridItem rowSpan={2} colSpan={3} objectFit="cover" ml="2" mr="2">
        <Box height="100%" width="100%">
          <UserCard {...info} />
        </Box>
      </GridItem>
      <GridItem rowSpan={2} colSpan={5} mr="2">
        <Box bg="lightgray">
          <Box mb="2" borderRadius="md">
            <Table variant="simple" fontSize="11">
              <Thead>
                <Tr>
                  <Th fontSize="11">Meal Type</Th>
                  <Th fontSize="11">Carbs</Th>
                  <Th fontSize="11">Protein</Th>
                  <Th fontSize="11">Fat</Th>
                  <Th fontSize="11">Calories</Th>
                  <Th fontSize="11">Calories of goal, %</Th>
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
                    <Td>
                      <Box bg="lightgray" width={`${meal.caloriesOfGoal}%`} height="10px" />
                      {meal.caloriesOfGoal}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          {/* <Box>
            <PolarArea
          </Box> */}
        </Box>
      </GridItem>
      <GridItem rowSpan={1} colSpan={3}>
        <Box>Preferences</Box>
      </GridItem>
      <GridItem rowSpan={4} colSpan={4} mt="2">
        {/* <Box bg="lightblue">
          <Heading fontSize="22" fontWeight="bold" textAlign="center">
            Recent Meals
          </Heading>
          <Box p={4} borderRadius="md" boxShadow="md">
            {recentMeals.map((meal, index) => (
              <Flex
                key={index}
                alignItems="center"
                p={2}
                borderRadius="md"
                bg="white"
                _hover={{ bg: 'base.600', color: 'white' }}
              >
                <Image src={meal.image} alt={meal.title} boxSize="50px" borderRadius="full" mr="2" />
                <Box flex="1">
                  <Text fontWeight="bold">{meal.title}</Text>
                  <Text color="base.500">{meal.description}</Text>
                </Box>
                <Flex>
                  <Box>
                    <Text color="base.500"></Text>
                  </Box>
                </Flex>
                <Flex></Flex>
              </Flex>
            ))}
          </Box>
        </Box> */}
        <RecentMeals meals={recentMeals}/>
      </GridItem>
      <GridItem rowSpan={1} colSpan={3}>
        <Box>Allergies</Box>
      </GridItem>
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
    </Grid>
  );
}

export default PersonalDashboard;
