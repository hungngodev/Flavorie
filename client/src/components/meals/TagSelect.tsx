import { HStack, Image, Text, Tooltip, VStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import {
    Bean,
    Beef,
    CandyOff,
    Cherry,
    CircleHelp,
    EggFried,
    FishOff,
    Milk,
    Nut,
    Salad,
    Wheat,
    WheatOff,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { GiSesame } from 'react-icons/gi';
import { PiFishSimple, PiGrainsBold, PiShrimp } from 'react-icons/pi';
import { SlChemistry } from 'react-icons/sl';
import { TbBrandPeanut, TbMeatOff } from 'react-icons/tb';
import DietInfographic from '../../../public/images/diet-infographic.png';
import useToast from '../../hooks/useToast';
import customFetch from '../../utils/customFetch';
import CustomTag from './CustomTag';

export type Allergy =
    | 'Dairy'
    | 'Egg'
    | 'Gluten'
    | 'Grain'
    | 'Peanut'
    | 'Seafood'
    | 'Sesame'
    | 'Shellfish'
    | 'Soy'
    | 'Sulfite'
    | 'Tree Nut'
    | 'Wheat';
export type Diet =
    | 'Gluten Free'
    | 'Ketogenic'
    | 'Vegetarian'
    | 'Lacto-Vegetarian'
    | 'Ovo-Vegetarian'
    | 'Vegan'
    | 'Pescetarian'
    | 'Paleo'
    | 'Primal'
    | 'Whole30'
    | 'Low FODMAP';
export const allergyTypes: Allergy[] = [
    'Dairy',
    'Egg',
    'Gluten',
    'Grain',
    'Peanut',
    'Seafood',
    'Sesame',
    'Shellfish',
    'Soy',
    'Sulfite',
    'Tree Nut',
    'Wheat',
];
export const dietTypes: Diet[] = [
    'Gluten Free',
    'Ketogenic',
    'Vegetarian',
    'Lacto-Vegetarian',
    'Ovo-Vegetarian',
    'Vegan',
    'Pescetarian',
    'Paleo',
    'Primal',
    'Whole30',
    'Low FODMAP',
];

export type PreferenceType = Allergy | Diet;
export const Preferences: PreferenceType[] = [
    'Dairy',
    'Egg',
    'Gluten',
    'Grain',
    'Peanut',
    'Seafood',
    'Sesame',
    'Shellfish',
    'Soy',
    'Sulfite',
    'Tree Nut',
    'Wheat',
    'Gluten Free',
    'Ketogenic',
    'Vegetarian',
    'Lacto-Vegetarian',
    'Ovo-Vegetarian',
    'Vegan',
    'Pescetarian',
    'Paleo',
    'Primal',
    'Whole30',
    'Low FODMAP',
];

const Icons: Record<Allergy | Diet, React.ComponentType> = {
    Dairy: Milk,
    Egg: EggFried,
    Gluten: Wheat,
    Grain: PiGrainsBold,
    Peanut: TbBrandPeanut,
    Seafood: PiFishSimple,
    Sesame: GiSesame,
    Shellfish: PiShrimp,
    Soy: Bean,
    Sulfite: SlChemistry,
    'Tree Nut': Nut,
    Wheat: Wheat,
    'Gluten Free': WheatOff,
    Ketogenic: WheatOff,
    Vegetarian: Salad,
    'Lacto-Vegetarian': TbMeatOff,
    'Ovo-Vegetarian': TbMeatOff,
    Vegan: Salad,
    Pescetarian: FishOff,
    Paleo: Cherry,
    Primal: Beef,
    Whole30: CandyOff,
    'Low FODMAP': Beef,
};

const colorScheme = {
    allergy: {
        background: 'rgba(212, 193, 236, 0.2)',
        text: 'rgba(51, 24, 107, 1)',
        selectedBackground: ' rgba(159, 159, 237, 0.6)',
    },
    diet: {
        background: 'rgba(189, 224, 254, 0.2)',
        text: 'rgba(16, 67, 159, 1)', // #10439F
        selectedBackground: 'rgba(57, 167, 255, 0.5)',
    },
};

const dietRequirements = {
    'Gluten Free':
        'Eliminating gluten means avoiding wheat, barley, rye, and other gluten-containing grains and foods made from them (or that may have been cross contaminated).',
    Ketogenic:
        'The keto diet is based more on the ratio of fat, protein, and carbs in the diet rather than specific ingredients. Generally speaking, high fat, protein-rich foods are acceptable and high carbohydrate foods are not. The formula we use is 55-80% fat content, 15-35% protein content, and under 10% of carbohydrates.',
    Vegetarian: 'No ingredients may contain meat or meat by-products, such as bones or gelatin.',
    'Lacto-Vegetarian': 'All ingredients must be vegetarian and none of the ingredients can be or contain egg.',
    'Ovo-Vegetarian': 'All ingredients must be vegetarian and none of the ingredients can be or contain dairy.',
    Vegan: 'No ingredients may contain meat or meat by-products, such as bones or gelatin, nor may they contain eggs, dairy, or honey.',
    Pescetarian:
        'Everything is allowed except meat and meat by-products - some pescetarians eat eggs and dairy, some do not.',
    Paleo: 'Allowed ingredients include meat (especially grass fed), fish, eggs, vegetables, some oils (e.g. coconut and olive oil), and in smaller quantities, fruit, nuts, and sweet potatoes. We also allow honey and maple syrup (popular in Paleo desserts, but strict Paleo followers may disagree). Ingredients not allowed include legumes (e.g. beans and lentils), grains, dairy, refined sugar, and processed foods.',
    Primal: 'Very similar to Paleo, except dairy is allowed - think raw and full fat milk, butter, ghee, etc.',
    'Low FODMAP':
        "FODMAP stands for 'fermentable oligo-, di-, mono-saccharides and polyols'. Our ontology knows which foods are considered high in these types of carbohydrates (e.g. legumes, wheat, and dairy products).",
    Whole30:
        'Allowed ingredients include meat, fish/seafood, eggs, vegetables, fresh fruit, coconut oil, olive oil, small amounts of dried fruit and nuts/seeds. Ingredients not allowed include added sweeteners (natural and artificial, except small amounts of fruit juice), dairy (except clarified butter or ghee), alcohol, grains, legumes (except green beans, sugar snap peas, and snow peas), and food additives, such as carrageenan, MSG, and sulfites.',
};
const TagSelect = () => {
    const [selectedTags, setSelectedTags] = useState<Set<PreferenceType>>(new Set([]));
    const queryClient = useQueryClient();
    const { notifyError } = useToast();
    useEffect(() => {
        const fetchDietsAllergy = async () => {
            try {
                const response = await customFetch.get('/user');
                if (response.status === 200) {
                    const allergies = response.data.currUser.allergy;
                    const diets = response.data.currUser.diet;
                    setSelectedTags(new Set([...allergies, ...diets]));
                } else {
                    notifyError('Cannot load your preference. Please try again');
                }
            } catch (error) {
                console.log('error fetching preference', error);
                notifyError('Cannot load your preference. Please try again');
            }
        };
        fetchDietsAllergy();
    }, [notifyError]);

    const handleSelect = async (field: PreferenceType) => {
        const newTags = new Set(selectedTags);
        if (newTags.has(field)) {
            newTags.delete(field);
        } else {
            newTags.add(field);
        }
        setSelectedTags(newTags);
        try {
            const response = await customFetch.patch('/user', {
                allergy: Array.from(newTags).filter((tag): tag is Allergy => allergyTypes.includes(tag as Allergy)),
                diet: Array.from(newTags).filter((tag): tag is Diet => dietTypes.includes(tag as Diet)),
            });
            if (response.status !== 200) {
                notifyError('Failed to update your preference. Please try again');
            }
            queryClient.invalidateQueries({
                queryKey: ['meals'],
            });
        } catch (error) {
            console.log('error updating your preference', error);
            notifyError('Failed to update your preference. Please try again');
        }
    };

    return (
        <>
            <VStack spacing={2} align="start" marginBlock={2}>
                <Text fontSize="22" fontWeight="bold">
                    Allergies:
                </Text>
                <HStack flexWrap="wrap">
                    {allergyTypes.map((type) => (
                        <CustomTag
                            key={type}
                            type={type}
                            onClick={() => handleSelect(type)}
                            // border={selectedTags.has(type) ? '2px' : '0px'}
                            bgColor={
                                selectedTags.has(type)
                                    ? colorScheme.allergy.selectedBackground
                                    : colorScheme.allergy.background
                            }
                            color={colorScheme.allergy.text}
                            icon={Icons[type]}
                        />
                    ))}
                </HStack>
                <Text fontSize="22" fontWeight="bold" mt="2">
                    Diets:
                </Text>
                <HStack flexWrap="wrap">
                    {dietTypes.map((type) => (
                        <HStack gap={0} mr={'1rem'}>
                            <CustomTag
                                key={type}
                                type={type}
                                onClick={() => handleSelect(type)}
                                // border={selectedTags.has(type) ? '2px' : '0px'}
                                bgColor={
                                    selectedTags.has(type)
                                        ? colorScheme.diet.selectedBackground
                                        : colorScheme.diet.background
                                }
                                color={colorScheme.diet.text}
                                icon={Icons[type]}
                            />
                            <Tooltip label={dietRequirements[type]} hasArrow>
                                <CircleHelp
                                    cursor="pointer"
                                    onClick={() => {
                                        alert(dietRequirements[type]);
                                    }}
                                />
                            </Tooltip>
                        </HStack>
                    ))}
                </HStack>
                <Image src={DietInfographic} alt="Diet Infographic" />
            </VStack>
            {/* <Button mt="1" onClick={submitTags}>SubmitTags</Button> */}
        </>
    );
};

export default TagSelect;
