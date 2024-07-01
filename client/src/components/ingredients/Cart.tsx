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
import { RefObject, useRef } from 'react';
import { Control, Controller, FieldArrayWithId } from 'react-hook-form';
import { Cart } from '../../assets/animations';
import { useAuth } from '../../hooks';
import { CartData } from '../../pages/Ingredient';
import socket from '../../socket/socketio';

type CartProps = {
  removeFunction: (index: number) => void;
  onSubmit: () => void;
  fields: FieldArrayWithId<CartData, 'cart', 'id'>[];
  control: Control<CartData>;
  lottieCartRef: RefObject<LottieRefCurrentProps>;
  onExitComplete?: () => void;
};

export default function CartToBuy({ removeFunction, onSubmit, fields, control, lottieCartRef }: CartProps) {
  const auth = useAuth();
  const scrollCartRef = useRef<HTMLDivElement>(null);
  function scroll(direction: 'up' | 'down', distance: number) {
    if (scrollCartRef.current) {
      if (direction === 'up') scrollCartRef.current.scrollTop -= distance;
      else scrollCartRef.current.scrollTop += distance;
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
      height={'full'}
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

        <Lottie animationData={Cart} style={{ height: 100 }} loop={false} autoPlay={false} lottieRef={lottieCartRef} />

        <button
          onClick={() => {
            onSubmit();
            socket.emit('sendToInstacart', fields);
            lottieCartRef.current?.playSegments([0, 135]);
          }}
        >
          send to instacart
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
          {fields.map((item, index) => {
            return (
              <motion.div key={item.id + index + 'cart'}>
                <HStack spacing={6} key={index} minWidth={'3rem'} flexShrink={0}>
                  <Image
                    src={'https://img.spoonacular.com/ingredients_100x100/' + item.image}
                    alt={item.name}
                    height={'full'}
                    width={'6vw'}
                    rounded={'xl'}
                  />
                  <Flex direction={'column'} justifyContent={'center'} alignItems={'center'} gap={2} width={'5vw'}>
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
                              <NumberIncrementStepper style={{ background: 'transparent', border: 'none' }} />
                              <NumberInputField ref={ref} name={restField.name} type="number" minWidth={'4.5rem'} />
                              <NumberDecrementStepper style={{ background: 'transparent', border: 'none' }} />
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
        </VStack>
      </form>
    </Flex>
  );
}
