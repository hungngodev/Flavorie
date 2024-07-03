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
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RefObject, useEffect, useRef } from 'react';
import { Control, Controller, FieldArrayWithId } from 'react-hook-form';
import { Cart } from '../../assets/animations';
import { CartData } from '../../pages/Ingredient';
import theme from '../../style/theme';

type CartProps = {
    removeFunction: (index: number) => void;
    onSubmit: (operation: string) => void;
    fields: FieldArrayWithId<CartData, 'cart', 'id'>[];
    control: Control<CartData>;
    lottieCartRef: RefObject<LottieRefCurrentProps>;
    onExitComplete?: () => void;
    height?: string;
    containerHeight?: string;
};

export default function CartToBuy({ removeFunction, onSubmit, fields, control, lottieCartRef, height }: CartProps) {
    const scrollCartRef = useRef<HTMLDivElement>(null);
    function scroll(direction: 'up' | 'down', distance: number) {
        if (scrollCartRef.current) {
            if (direction === 'up') scrollCartRef.current.scrollTop -= distance;
            else scrollCartRef.current.scrollTop += distance;
        }
    }
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
            borderColor={theme.colors.palette_purple}
            flexDir={'column'}
            rounded={'xl'}
            maxH={'85vh'}
            bg={'#fef9ff'}
        >
            <HStack mr="3">
                {/* <IconButton
                    icon={<ChevronUp />}
                    aria-label="left"
                    onClick={() => scroll('up', 100)}
                    variant="solid"
                    bg={theme.colors.palette_indigo}
                    size="xs"
                    height="50%"
                    ml="2"
                /> */}

                <Lottie
                    animationData={Cart}
                    style={{ height: 100 }}
                    loop={false}
                    autoPlay={false}
                    lottieRef={lottieCartRef}
                />

                <button
                    onClick={() => {
                        onSubmit('add');
                        // socket.emit('sendToInstacart', fields);
                        lottieCartRef.current?.playSegments([0, 135]);
                    }}
                    className=" rounded-md bg-indigo-500 p-3 text-white"
                >
                    Save
                </button>
                <button
                    onClick={() => {
                        onSubmit('transfer');
                        // socket.emit('sendToInstacart', fields);
                        lottieCartRef.current?.playSegments([0, 135]);
                    }}
                    className=" rounded-md bg-indigo-500 p-3 text-white"
                >
                    Transfer to Fridge
                </button>
                {/* <IconButton
                    icon={<ChevronDown />}
                    aria-label="right"
                    onClick={() => scroll('down', 100)}
                    variant="solid"
                    bg={theme.colors.palette_indigo}
                    size="xs"
                    height="50%"
                    mr="2"
                /> */}
            </HStack>

            <form
                style={{
                    width: 'full',
                    height: 'full',
                }}
            >
                <VStack
                    ref={scrollCartRef}
                    spacing={8}
                    width={'100%'}
                    height={height ? height : 'full'}
                    px={6}
                    overflowY={'auto'}
                    overflowX={'hidden'}
                    alignItems={'center'}
                    justifyContent={'start'}
                >
                    {fields.map((item, index) => {
                        return (
                            <motion.div key={item.id + index + 'cart'}>
                                <HStack
                                    spacing={6}
                                    key={index}
                                    minWidth={'3rem'}
                                    flexShrink={0}
                                    flexWrap={'wrap'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                >
                                    <Image
                                        src={
                                            item.image.length > 120
                                                ? item.image
                                                : 'https://img.spoonacular.com/ingredients_100x100/' + item.image
                                        }
                                        alt={item.name}
                                        height={'full'}
                                        width={'5vw'}
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
                                                        <Flex
                                                            gap={1}
                                                            borderColor={theme.colors.palette_indigo}
                                                            _active={{ borderColor: theme.colors.palette_purple }}
                                                        >
                                                            <NumberIncrementStepper
                                                                style={{ background: 'transparent', border: 'none' }}
                                                            />
                                                            <NumberInputField
                                                                ref={ref}
                                                                name={restField.name}
                                                                type="number"
                                                                minWidth={'4.5rem'}
                                                            />
                                                            <NumberDecrementStepper
                                                                style={{ background: 'transparent', border: 'none' }}
                                                            />
                                                        </Flex>
                                                    </NumberInput>
                                                </HStack>
                                            )}
                                            name={`cart.${index}.quantity`}
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
                                            bg={theme.colors.palette_indigo}
                                            size="xs"
                                            minWidth={'full'}
                                            variant="solid"
                                            _hover={{ bg: theme.colors.palette_lavender }}
                                            onClick={() => removeFunction(index)}
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
