import { AddIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import {
    Flex,
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
            <Flex direction="column" w={'full'} justifyContent="start" alignItems="center" mx="auto">
                <Image
                    height={height}
                    maxWidth={width}
                    rounded="xl"
                    shadow="md"
                    bgSize="cover"
                    bgPos="center"
                    bgColor="white"
                    src={imgLink.length > 120 ? imgLink : 'https://img.spoonacular.com/ingredients_100x100/' + imgLink}
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
                    {title.slice(0, 20)}
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
