import { AddIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  chakra,
} from '@chakra-ui/react';
import NutritionCard, { Nutrition } from './NutritionCard';

type CardProps = {
  imgLink: string;
  title: string;
  category?: string;
  height?: string;
  width?: string;
  onClick?: () => void;
  id: string;
  amount: number;
  unitShort: string;
  nutrition: Nutrition;
};
function Card({ imgLink, title, height, width, onClick, amount, unitShort, nutrition }: CardProps) {
  return (
    <Flex alignItems="center" gap={5} justifyContent="center">
      <Flex direction="column" w={'full'} justifyContent="end" alignItems="center" mx="auto">
        <Box
          bg="gray.300"
          h={height}
          w={width}
          rounded="xl"
          shadow="md"
          bgSize="cover"
          bgPos="center"
          style={{
            backgroundImage: `url(${imgLink})`,
          }}
        ></Box>
        <chakra.h4
          textAlign="center"
          fontWeight="bold"
          fontSize={'xs'}
          textTransform="uppercase"
          color="gray.800"
          _dark={{
            color: 'white',
          }}
          letterSpacing={1}
        >
          {title}
        </chakra.h4>
      </Flex>
      <Flex direction={'column'} gap={4}>
        <IconButton
          colorScheme="teal"
          aria-label="Call Sage"
          fontSize="10px"
          size={'xs'}
          icon={<AddIcon />}
          onClick={onClick}
        />
        <Popover>
          <PopoverTrigger>
            <IconButton
              colorScheme="teal"
              aria-label="Call Sage"
              fontSize="15px"
              size={'xs'}
              icon={<InfoOutlineIcon />}
            />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Nutrition Information</PopoverHeader>
            <PopoverBody>
              <NutritionCard amount={amount} unitShort={unitShort} nutrition={nutrition} />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Flex>
  );
}

export default Card;
