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
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Control, Controller, FieldArrayWithId } from 'react-hook-form';
import { leftOverData } from '../../pages/Ingredient';
import theme from '../../style/theme';
interface LeftOverProps {
    height: string;
    removeItem: (index: number) => void;
    onSubmit: () => void;
    fields: FieldArrayWithId<leftOverData, 'leftOver', 'id'>[];
    control: Control<leftOverData>;
}
export default function LeftOver({ height, removeItem, onSubmit, fields, control }: LeftOverProps) {
    useEffect(() => {
        console.log('changing');
        queryClient.invalidateQueries({
            queryKey: ['leftOver'],
        });
    }, [queryClient]);
    const { control, handleSubmit, setValue } = useForm<leftOverData>({
        defaultValues: {
            leftOver: useMemo(
                () =>
                    leftOverStatus === 'success'
                            ? leftOverData.data.leftOver.map(
                                (item: { leftOver: { _id: string; name: string; image: string }; quantity: string }) => {
                                    return {
                                        id: item.leftOver._id,
                                        name: item.leftOver.name,
                                        image: item.leftOver.image,
                                        quantity: item.quantity,
                                    };
                                },
                            )
                        : [],
                [leftOverData, leftOverStatus],
            ),
        },
    });
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
            queryClient.invalidateQueries({
                queryKey: ['leftOver'],
            });
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
    const removeItem = (index: number) => {
        removeFunction(index);
    };

    return (
        <Flex
            marginTop={'4vh'}
            alignItems={'center'}
            width={'95%'}
            height={'82%'}
            gap={10}
            border="2px solid"
            flexDir={'column'}
            rounded={'xl'}
            maxH={'85vh'}
            bg={'#fef9ff'}
            borderColor={theme.colors.palette_purple}
        >
            <HStack mt="7">
                {/* <IconButton
                    icon={<ChevronUp />}
                    aria-label="left"
                    onClick={() => scroll('up', 100)}
                    variant="solid"
                    colorScheme="blue"
                    size="xs"
                    height="50%"
                /> */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    className=" rounded-full bg-indigo-500 p-3 text-white"
                >
                    Save
                </button>
                {/* <IconButton
                    icon={<ChevronDown />}
                    aria-label="right"
                    onClick={() => scroll('down', 100)}
                    variant="solid"
                    colorScheme="blue"
                    size="xs"
                    height="50%"
                /> */}
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
                    height={height}
                    px={6}
                    overflowY={'auto'}
                    overflowX={'hidden'}
                    alignItems={'center'}
                    justifyContent={'start'}
                >
                    {fields.map((item, index) => {
                        return (
                            <motion.div key={item.id + index + 'leftOver'}>
                                <HStack spacing={6} key={index} minWidth={'3rem'} flexShrink={0}>
                                    <Image
                                        src={
                                            item.image.length > 120
                                                ? item.image
                                                : 'https://img.spoonacular.com/ingredients_100x100/' + item.image
                                        }
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
                                        ml="5"
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
                                            bg={theme.colors.palette_indigo}
                                            aria-label="delete"
                                            colorScheme="pink"
                                            size="xs"
                                            minWidth={'full'}
                                            _hover={{ bg: theme.colors.palette_lavender }}
                                            variant="solid"
                                            onClick={() => removeItem(index)}
                                        />
                                    </Flex>
                                </HStack>
                            </motion.div>
                        );
                    })}
                </VStack>
            </form>
        </Flex>
    );
}
