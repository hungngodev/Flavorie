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
  NumberInputStepper,
  VStack,
} from '@chakra-ui/react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RefObject, useRef } from 'react';
import { Control, Controller, FieldArrayWithId } from 'react-hook-form';
import { Cart } from '../../assets/animations';
import { CartData } from '../../pages/Ingredient';

type CartProps = {
  removeFunction: (index: number) => void;
  onSubmit: () => void;
  fields: FieldArrayWithId<CartData, 'cart', 'id'>[];
  control: Control<CartData>;
  lottieCartRef: RefObject<LottieRefCurrentProps>;
};

export default function CartToBuy({ removeFunction, onSubmit, fields, control, lottieCartRef }: CartProps) {
  const scrollCartRef = useRef<HTMLDivElement>(null);
  function scroll(direction: 'up' | 'down', distance: number) {
    if (scrollCartRef.current) {
      if (direction === 'up') scrollCartRef.current.scrollTop -= distance;
      else scrollCartRef.current.scrollTop += distance;
    }
  }
  return (
    <Flex
      marginTop={'4vh'}
      alignItems={'center'}
      width={'80%'}
      height={'full'}
      gap={10}
      border="2px solid"
      borderColor="black"
      flexDir={'column'}
      rounded={'xl'}
      padding={4}
      maxH={'80vh'}
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
            onSubmit();
            lottieCartRef.current?.playSegments([0, 135]);
          }}
        >
          <Lottie
            animationData={Cart}
            style={{ height: 100 }}
            loop={false}
            autoPlay={false}
            lottieRef={lottieCartRef}
          />
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

      <form>
        <VStack spacing={8} height={'50vh'} overflowY={'auto'} overflowX={'hidden'}>
          {fields.map((item, index) => {
            return (
              <HStack spacing={4} key={index} minWidth={'3rem'} flexShrink={0}>
                <Image src={item.image} alt={item.name} height={'10vh'} width={'9vh'} rounded={'xl'} />
                <Flex direction={'column'} justifyContent={'center'} gap={2} width={'5vw'}>
                  <Controller
                    render={({ field: { ref, ...restField } }) => (
                      <HStack spacing={4}>
                        <NumberInput
                          allowMouseWheel
                          {...restField}
                          min={1}
                          max={50}
                          size="sm"
                          format={(n) => (typeof n === 'string' ? parseInt(n) : n)}
                        >
                          <NumberInputField ref={ref} name={restField.name} type="number" />
                          <NumberInputStepper flexDir={'row'} marginRight={'5px'} padding={'1px'}>
                            <NumberIncrementStepper style={{ background: 'transparent' }} />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
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
                    colorScheme="pink"
                    size="xs"
                    variant="solid"
                    onClick={() => removeFunction(index)}
                  />
                </Flex>
              </HStack>
            );
          })}
        </VStack>
      </form>
    </Flex>
  );
}
