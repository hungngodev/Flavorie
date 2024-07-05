import { DeleteIcon } from '@chakra-ui/icons';
import {
    Flex,
    HStack,
    Button, 
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
        console.log('fields', fields);
    }, [fields]);
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
            <HStack mt="8">
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    rounded="md"
                    
                    px={3}
                    py={2}
                    color="white"
                >
                    Save
                </Button>
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
