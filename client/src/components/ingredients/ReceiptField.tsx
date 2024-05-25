import {
  HStack,
  IconButton,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { PenLine, Trash } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { ZodType } from 'zod';
import { ReceiptFormProps } from './ReceiptForm';
interface ReceiptFieldProps<T extends ZodType<any, any, any>> extends ReceiptFormProps<T> {
  index: number;
}

function ReceiptField<T extends ZodType<any, any, any>>({
  control,
  index,
  remove,
  update,
  append,
  fields,
}: ReceiptFieldProps<T>) {
  console.log(fields);
  return (
    <HStack width="100%" marginTop={12} gap={6} justifyContent="stretch">
      <Image
        alignSelf="flex-start"
        borderRadius="lg"
        boxSize="7rem"
        src="https://img.freepik.com/free-vector/hand-drawn-flat-design-turkish-food-illustration_23-2149276733.jpg?w=826&t=st=1716431567~exp=1716432167~hmac=6eca3d748ea3362697544328f767549b297318ada51b416c2f8eabe4ed0b155f"
      />
      <VStack justifyContent="flex-start" alignItems="space-between" gap={6} width="100%">
        <HStack alignItems="space-between" minWidth="fit-content">
          <Controller
            control={control}
            name={`receipts.${index}.name`}
            render={({ field: { ref, ...fieldProps } }) => (
              <VStack width="fit-content" alignItems="start" minWidth="max-content">
                <Text color="blackAlpha.600" fontWeight="semibold">
                  Name
                </Text>
                <Input
                  borderRadius="md"
                  {...fieldProps}
                  value={fields[index].name}
                  placeholder="Enter your item"
                  variant="flushed"
                  onChange={(val) => fieldProps.onChange(val)}
                  color="blackAlpha.800"
                  fontWeight="semibold"
                  fontSize="lg"
                />
              </VStack>
            )}
          />
          {fields[index].suggested.display && (
            <Controller
              control={control}
              name={`receipts.${index}.name`}
              render={({ field: { ...fieldProps } }) => {
                return (
                  <VStack justifyContent="flex-start" alignItems="start" gap={6}>
                    <Text color="blackAlpha.600" fontWeight="semibold">
                      Suggestions
                    </Text>
                    <Menu>
                      <MenuButton arial-label="options" color="blackAlpha.600" fontWeight="semibold" fontSize="lg">
                        <HStack>
                          <Search />
                          <Text>Not what you're looking for?</Text>
                        </HStack>
                      </MenuButton>
                      <MenuList>
                        {fields[index].suggested.items.length > 0 ? (
                          fields[index].suggested.items?.map((suggest: string) => {
                            return (
                              <MenuItem
                                key={suggest}
                                onClick={() => {
                                  fieldProps.onChange(suggest);
                                }}
                              >
                                <Image
                                  borderRadius="lg"
                                  boxSize="5rem"
                                  src="https://img.freepik.com/free-vector/hand-drawn-flat-design-turkish-food-illustration_23-2149276733.jpg?w=826&t=st=1716431567~exp=1716432167~hmac=6eca3d748ea3362697544328f767549b297318ada51b416c2f8eabe4ed0b155f"
                                />
                                <Text color="blackAlpha.800" fontWeight="semibold" marginInline={2} fontSize="lg">
                                  {suggest}
                                </Text>
                              </MenuItem>
                            );
                          })
                        ) : (
                          <MenuItem>
                            <Text color="blackAlpha.800" fontWeight="semibold" marginInline={2} fontSize="lg">
                              Oops nothing matches
                            </Text>
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </VStack>
                );
              }}
            />
          )}
        </HStack>
        <HStack maxWidth="40%">
          <Controller
            control={control}
            name={`receipts.${index}.quantity`}
            render={({ field: { onChange, ...fieldProps } }) => (
              <VStack alignItems="start">
                <Text color="blackAlpha.600" fontWeight="semibold">
                  Quantity
                </Text>
                <NumberInput
                  {...fieldProps}
                  min={0}
                  keepWithinRange={true}
                  onChange={(valueString) => onChange(Number(valueString))}
                  borderRadius="md"
                  color="blackAlpha.800"
                  fontWeight="semibold"
                >
                  <NumberInputField {...fieldProps} fontSize="lg" />
                  <NumberInputStepper>
                    <NumberIncrementStepper border="none" />
                    <NumberDecrementStepper border="none" />
                  </NumberInputStepper>
                </NumberInput>
              </VStack>
            )}
          />
          <Controller
            control={control}
            name={`receipts.${index}.price`}
            render={({ field: { onChange, ...fieldProps } }) => (
              <VStack alignItems="start">
                <Text color="blackAlpha.600" fontWeight="semibold">
                  Price
                </Text>
                <NumberInput
                  precision={2}
                  step={0.01}
                  min={0.0}
                  keepWithinRange={true}
                  onChange={(valueString) => onChange(Number(valueString))}
                  borderRadius="md"
                  color="blackAlpha.800"
                  fontWeight="semibold"
                  {...fieldProps}
                >
                  <NumberInputField {...fieldProps} fontSize="lg" />
                  <NumberInputStepper>
                    <NumberIncrementStepper border="none" />
                    <NumberDecrementStepper border="none" />
                  </NumberInputStepper>
                </NumberInput>
              </VStack>
            )}
          />
        </HStack>
      </VStack>

      <VStack justifyContent="space-between" alignItems="flex-end" alignSelf="stretch" gap={6}>
        <Text marginLeft="auto" justifySelf="end" fontSize="lg" fontWeight="semibold" color="blackAlpha.900">
          ${(parseFloat(fields[index].price) * parseFloat(fields[index].quantity)).toFixed(2) || 0}
          <Text as="span" color="blackAlpha.600">
            /total
          </Text>
        </Text>
        <HStack gap={4}>
          <IconButton
            aria-label="delete-button"
            color="red.600"
            backgroundColor="red.100"
            borderRadius="lg"
            icon={<Trash />}
            onClick={() => {
              remove(index);
            }}
            size="md"
          />
          <IconButton
            aria-label="update-button"
            borderRadius="lg"
            color="teal.600"
            backgroundColor="teal.50"
            icon={fields[index].suggested.display ? <X /> : <PenLine />}
            onClick={() => {
              update();
            }}
            size="md"
          />
        </HStack>
      </VStack>
    </HStack>
  );
}
export default ReceiptField;
