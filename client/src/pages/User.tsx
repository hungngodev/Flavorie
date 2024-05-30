// function User() {
//   return <div>User</div>;
// }

// export default User;

import UserCard from "../components/users/UserInforCard";
import {Box, Button, Grid, GridItem, Heading, Stack, Text} from '@chakra-ui/react';
import React from "react";
import { PersonalProps } from "@/components/users/UserInforCard";

interface recentMeals {
  name: string;
  date: string;
}

type recentMealProps = {
  meals: recentMeals[];
};
interface UserProps {
    info: PersonalProps;
    totalMeals: string;
    points: string;
    tags: string;
    reviewsGiven: string;
    recipesShared: string;
    caloriesConsumed: string;
    badgesEarned: string;
    recentMeals: recentMeals[];
    protein: string;
    vitamins: string;
    carb: string;
    fat: string;
    minerals: string;
}

function PersonalDashboard({
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
      <GridItem rowSpan={2} colSpan={7} mr="2">
        <Box bg="lightgray">Chart</Box>
      </GridItem>
      <GridItem rowSpan={1} colSpan={3}>
        <Box>Preferences</Box>
      </GridItem>
      <GridItem rowSpan={4} colSpan={7} mt='2'>
        <Box bg='lightblue'>
          <Heading fontSize="24" fontWeight="bold" textAlign="center">
            Recent Meals
          </Heading>
        </Box>
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
