import { DeleteIcon } from '@chakra-ui/icons';
import {
    Flex,
    HStack,
    IconButton,
    Image,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';
import customFetch from '../../utils/customFetch';

export type leftOverData = {
    leftOver: {
        id: string;
        name: string;
        image: string;
        quantity: string;
    }[];
};

const leftOverQuery = {
    queryKey: ['leftOver'],
    queryFn: async () => {
        const data = await customFetch.get('/user/leftOver');
        return data;
    },
};
export default function LeftOver() {
    const { control, handleSubmit, setValue } = useForm<leftOverData>({
        defaultValues: {
            leftOver: [],
        },
    });
    const { data: leftOverData, status: leftOverStatus } = useQuery(leftOverQuery);
    useEffect(() => {
        if (leftOverStatus === 'success') {
            console.log(leftOverData);
            setValue(
                'leftOver',
                leftOverData.data.leftOver.map(
                    (item: { leftOver: { _id: string; name: string; image: string }; quantity: string }) => {
                        return {
                            id: item.leftOver._id,
                            name: item.leftOver.name,
                            image: item.leftOver.image,
                            quantity: item.quantity,
                        };
                    },
                ),
            );
        }
    }, [leftOverData, leftOverStatus, setValue]);
    const { fields, remove: removeFunction } = useFieldArray({
        control,
        name: 'leftOver',
    });

    const onSubmit = () => {
        handleSubmit((data: leftOverData) => {
            console.log(data);
            const results = data.leftOver.map((item) => {
                return {
                    itemId: item.id,
                    quantity: parseInt(item.quantity),
                    unit: 'unit',
                    userId: '',
                    type: 'leftOver',
                };
            });
            customFetch.patch(
                '/user/leftOver',
                {
                    leftOver: results,
                },
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                },
            );
        })();
    };
    const auth = useAuth();
    const scrollLeftOverRef = useRef<HTMLDivElement>(null);
    function scroll(direction: 'up' | 'down', distance: number) {
        if (scrollLeftOverRef.current) {
            if (direction === 'up') scrollLeftOverRef.current.scrollTop -= distance;
            else scrollLeftOverRef.current.scrollTop += distance;
        }
    }
    const [isLastItemRemoved, setIsLastItemRemoved] = useState(false);
    const [lastItemIndex, setLastItemIndex] = useState<null | number>(null);
    const removeItem = (index: number) => {
        if (index === fields.length - 1) {
            removeFunction(index);
            setIsLastItemRemoved(true);
            setLastItemIndex(index);
        } else {
            removeFunction(index);
        }
    };

    function onExitComplete() {
        if (isLastItemRemoved && lastItemIndex !== null && lastItemIndex >= 0) {
            console.log('onExitComplete: exit,', 'lastItem', lastItemIndex);
            removeFunction(lastItemIndex as number);
            setIsLastItemRemoved(false);
            setLastItemIndex(null);
        }
    }
    return (
        <Flex
            marginTop={'4vh'}
            alignItems={'center'}
            width={'95%'}
            height={'10rem'}
            gap={10}
            border="2px solid"
            borderColor="black"
            flexDir={'column'}
            rounded={'xl'}
            maxH={'85vh'}
        >
            <HStack>
                <IconButton
                    icon={<ChevronUp />}
                    aria-label="left"
                    onClick={() => scroll('up', 100)}
                    variant="solid"
                    colorScheme="blue"
                    size="xs"
                    height="50%"
                />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        if (auth.currentUser.status === 'authenticated') {
                            onSubmit();
                        } else {
                            toast.error('Please login to save your leftOver', { position: 'top-right' });
                        }
                    }}
                >
                    Save
                </button>
                <IconButton
                    icon={<ChevronDown />}
                    aria-label="right"
                    onClick={() => scroll('down', 100)}
                    variant="solid"
                    colorScheme="blue"
                    size="xs"
                    height="50%"
                />
            </HStack>

            <form
                style={{
                    width: 'full',
                    height: 'full',
                }}
            >
                <VStack
                    spacing={8}
                    width={'100%'}
                    height={'65vh'}
                    px={6}
                    overflowY={'auto'}
                    overflowX={'hidden'}
                    alignItems={'center'}
                    justifyContent={'start'}
                >
                    <AnimatePresence onExitComplete={onExitComplete}>
                        {fields.map((item, index) => {
                            return (
                                <motion.div key={item.id + index + 'leftOver'}>
                                    <HStack spacing={6} key={index} minWidth={'3rem'} flexShrink={0}>
                                        <Image
                                            src={'https://img.spoonacular.com/ingredients_100x100/' + item.image}
                                            alt={item.name}
                                            height={'full'}
                                            width={'6vw'}
                                            rounded={'xl'}
                                        />
                                        <Flex
                                            direction={'column'}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            gap={2}
                                            width={'5vw'}
                                        >
                                            <Controller
                                                render={({ field: { ref, ...restField } }) => (
                                                    <HStack spacing={4}>
                                                        <NumberInput
                                                            allowMouseWheel
                                                            {...restField}
                                                            min={1}
                                                            max={50}
                                                            size="md"
                                                            format={(n) => (typeof n === 'string' ? parseInt(n) : n)}
                                                        >
                                                            <Flex gap={1}>
                                                                <NumberIncrementStepper
                                                                    style={{
                                                                        background: 'transparent',
                                                                        border: 'none',
                                                                    }}
                                                                />
                                                                <NumberInputField
                                                                    ref={ref}
                                                                    name={restField.name}
                                                                    type="number"
                                                                    minWidth={'4.5rem'}
                                                                />
                                                                <NumberDecrementStepper
                                                                    style={{
                                                                        background: 'transparent',
                                                                        border: 'none',
                                                                    }}
                                                                />
                                                            </Flex>
                                                        </NumberInput>
                                                    </HStack>
                                                )}
                                                name={`leftOver.${index}.quantity`}
                                                control={control}
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message: 'Price is required',
                                                    },
                                                }}
                                            />
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                aria-label="delete"
                                                colorScheme="pink"
                                                size="xs"
                                                minWidth={'full'}
                                                variant="solid"
                                                onClick={() => removeItem(index)}
                                            />
                                        </Flex>
                                    </HStack>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </VStack>
            </form>
        </Flex>
    );
}
