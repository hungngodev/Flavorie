import { Box, Heading, Tag, TagLabel, TagLeftIcon, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { LuBeef, LuDroplet, LuFlame, LuSprout, LuWheat } from 'react-icons/lu';

interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
  _id: {
    $oid: string;
  };
}

export interface Nutrition {
  nutrients: Nutrient[];
  caloricBreakdown: {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
  };
  weightPerServing: {
    amount: number;
    unit: string;
  };
}

export interface IngredientProps {
  amount: number;
  unitShort: string;
  nutrition: Nutrition;
}

const nutritionIcons = {
  Calories: LuFlame,
  Protein: LuBeef,
  Carbohydrates: LuWheat,
  Fat: LuDroplet,
  Fiber: LuSprout,
};

const NutritionCard: React.FC<IngredientProps> = ({ amount, unitShort, nutrition }) => {
  const tags = [
    {
      label: 'Calories',
      value: nutrition.nutrients.find((nutrient) => nutrient.name === 'Calories')?.amount,
      unit: 'kcal',
      icon: nutritionIcons.Calories,
      bg: 'green.50',
      borderbg: 'green.100',
      iconborder: 'green.200',
      iconcolor: 'green.500',
    },
    {
      label: 'Protein',
      value: nutrition.nutrients.find((nutrient) => nutrient.name === 'Protein')?.amount,
      unit: 'g',
      icon: nutritionIcons.Protein,
      bg: 'blue.50',
      borderbg: 'blue.100',
      iconborder: 'blue.200',
      iconcolor: 'blue.500',
    },
    {
      label: 'Carbs',
      value: nutrition.nutrients.find((nutrient) => nutrient.name === 'Carbohydrates')?.amount,
      unit: 'g',
      icon: nutritionIcons.Carbohydrates,
      bg: 'orange.50',
      borderbg: 'orange.100',
      iconborder: 'orange.200',
      iconcolor: 'orange.500',
    },
    {
      label: 'Fat',
      value: nutrition.nutrients.find((nutrient) => nutrient.name === 'Fat')?.amount,
      unit: 'g',
      icon: nutritionIcons.Fat,
      bg: 'pink.50',
      borderbg: 'pink.100',
      iconborder: 'pink.200',
      iconcolor: 'pink.500',
    },
    {
      label: 'Fiber',
      value: nutrition.nutrients.find((nutrient) => nutrient.name === 'Fiber')?.amount,
      unit: 'g',
      icon: nutritionIcons.Fiber,
      bg: 'purple.50',
      borderbg: 'purple.100',
      iconborder: 'purple.200',
      iconcolor: 'purple.500',
    },
  ];

  return (
    <Box boxShadow="md" borderRadius="md" p={2} display="inline-block">
      <Heading as="h3" fontSize="15" mb={2} textAlign="left" fontWeight="bold">
        Nutrition per {amount}
        {unitShort}
      </Heading>
      <VStack spacing={2} alignItems="left" align="center">
        {tags.every((tag) => tag.value !== undefined) && tags.some((tag) => tag.value !== 0) ? (
          tags.map((tag, index) => (
            <Tag
              key={index}
              bg={tag.bg}
              boxShadow="md"
              borderRadius="full"
              borderColor={tag.borderbg}
              pl="1"
              pr="3"
              width="max-content"
            >
              <TagLeftIcon
                as={tag.icon}
                backgroundColor="gray.50"
                borderRadius="full"
                boxSize="2.0rem"
                border="1px"
                borderWidth="0.1rem"
                borderColor={tag.iconborder}
                color={tag.iconcolor}
                p="0.28rem"
              />
              <Box>
                <TagLabel py="1" fontSize="10" fontWeight="bold" textColor="base.500">
                  {tag.label}
                </TagLabel>
                <Text fontSize="15" fontWeight="bold" mb="1">
                  {tag.value} {tag.unit}
                </Text>
              </Box>
            </Tag>
          ))
        ) : (
          <Text>No nutrition information available</Text>
        )}
      </VStack>
    </Box>
  );
};

export default NutritionCard;
