import { AddIcon } from '@chakra-ui/icons';
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    chakra,
} from '@chakra-ui/react';
import theme from '../../style/theme';
import customFetch from '../../utils/customFetch';
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
function Card({ id, imgLink, title, height, width, onClick, amount, unitShort, nutrition }: CardProps) {
    return (
        <Flex alignItems="center" justifyContent="center">
            <Flex direction="column" w={'full'} justifyContent="start" alignItems="center" mx="auto" p={1}>
                <Box objectFit="scale-down" bg="white" borderRadius="md" position="relative" boxShadow="md">
                    <Image
                        height={height}
                        maxWidth={width}
                        margin={4}
                        rounded="xl"
                        bgSize="cover"
                        bgPos="center"
                        bgColor="white"
                        src={
                            imgLink.length > 120
                                ? imgLink
                                : 'https://img.spoonacular.com/ingredients_100x100/' + imgLink
                        }
                        onError={async (e) =>
                            ((e.target as HTMLImageElement).src = (
                                await customFetch('/bug/image-fix', {
                                    params: {
                                        name: title,
                                        type: 'ingredient',
                                        _id: id,
                                    },
                                })
                            ).data)
                        }
                    ></Image>
                    <Box
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        p={4}
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="right"
                        alignItems="center"
                    >
                        <IconButton
                            bg="gray.300"
                            color="gray.500"
                            isRound={true}
                            aria-label="Call Sage"
                            fontSize="10px"
                            size={'xs'}
                            icon={<AddIcon />}
                            onClick={onClick}
                            _hover={{ bg: theme.colors.palette_indigo, color: 'white' }}
                        />
                    </Box>
                </Box>
                <HStack>
                    <Popover>
                        <PopoverTrigger>
                            <chakra.h4
                                textAlign="left"
                                mt="1"
                                fontWeight="bold"
                                fontSize={'md'}
                                textTransform={'capitalize'}
                                color="gray.500"
                                _dark={{
                                    color: 'white',
                                }}
                                _hover={{
                                    color: theme.colors.palette_indigo,
                                    textDecoration: 'underline',
                                }}
                                className="select-none"
                                letterSpacing={1}
                            >
                                {title.slice(0, 20)}
                            </chakra.h4>
                            {/* <IconButton
                                bg={theme.colors.palette_lavender}
                                color="gray.600"
                                aria-label="Call Sage"
                                isRound={true}
                                fontSize="15px"
                                size={'xs'}
                                icon={<InfoOutlineIcon />}
                            /> */}
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                                <NutritionCard amount={amount} unitShort={unitShort} nutrition={nutrition} />
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </HStack>
            </Flex>
        </Flex>
    );
}

export default Card;
