import { HStack, IconButton, Image, Input, InputGroup, InputLeftElement, Text, VStack } from '@chakra-ui/react';
import { PenLine, Search, Trash, X } from 'lucide-react';
import { Controller, FieldPath, Path } from 'react-hook-form';
import { ZodType, z } from 'zod';
import { CustomMenu, CustomNumberInput } from '../form/index';
import { ReceiptFormProps } from './ReceiptForm';

interface ReceiptFieldProps<T extends ZodType<any, any, any>> extends ReceiptFormProps<T> {
  index: number;
  field: z.infer<T>;
}

function ReceiptField<T extends ZodType<any, any, any>>({
  control,
  index,
  remove,
  update,
  fields,
  field,
  watch,
}: ReceiptFieldProps<T>) {
  return (
    <HStack width="100%" marginTop={12} gap={6} justifyContent="stretch">
      <Image
        alignSelf="flex-start"
        borderRadius="lg"
        boxSize="7rem"
        src="https://img.freepik.com/free-vector/hand-drawn-flat-design-turkish-food-illustration_23-2149276733.jpg?w=826&t=st=1716431567~exp=1716432167~hmac=6eca3d748ea3362697544328f767549b297318ada51b416c2f8eabe4ed0b155f"
      />
      <VStack justifyContent="flex-start" alignItems="space-between" gap={6} width="100%">
        // row for name and menu
        <HStack alignItems="space-between" minWidth="max-content">
          <Controller
            control={control}
            name={`receipts.${index}.name` as FieldPath<z.infer<T>>}
            render={({ field: { ref, ...fieldProps } }) => (
              <VStack width="fit-content" alignItems="start" minWidth="max-content">
                <Text color="blackAlpha.600" fontWeight="semibold">
                  Name
                </Text>
                <Input
                  borderRadius="md"
                  {...fieldProps}
                  value={watch(`receipts.${index}.name` as Path<z.infer<T>>)}
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

          <Controller
            control={control}
            name={`receipts.${index}.name` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => {
              return (
                field.suggested.display && (
                  <CustomMenu
                    title="Suggestions"
                    display={
                      <div>
                        {field.suggested.items.length > 0 ? (
                          <InputGroup>
                            <InputLeftElement>
                              <Search />
                            </InputLeftElement>
                            <Input placeholder="Try these instead!" />
                          </InputGroup>
                        ) : (
                          <Text>We couldn't find anything yet :(</Text>
                        )}
                      </div>
                    }
                    items={field.suggested.items}
                    field={field}
                    fieldProps={fieldProps}
                  />
                )
              );
            }}
          />
        </HStack>
        // row for quantity and price
        <HStack maxWidth="40%">
          <Controller
            control={control}
            name={`receipts.${index}.quantity` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => (
              <VStack alignItems="start">
                <Text color="blackAlpha.600" fontWeight="semibold">
                  Quantity
                </Text>
                <CustomNumberInput
                  fieldProps={fieldProps}
                  min={0}
                  keepWithinRange={true}
                  onChange={(valueString) => fieldProps.onChange(Number(valueString))}
                  borderRadius="md"
                  color="blackAlpha.800"
                  fontWeight="semibold"
                  value={watch(`receipts.${index}.quantity` as Path<z.infer<T>>)}
                />
              </VStack>
            )}
          />
          <Controller
            control={control}
            name={`receipts.${index}.price` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => (
              <VStack alignItems="start">
                <Text color="blackAlpha.600" fontWeight="semibold">
                  Price
                </Text>
                <CustomNumberInput
                  fieldProps={fieldProps}
                  min={0}
                  keepWithinRange={true}
                  onChange={(valueString) => fieldProps.onChange(Number(valueString))}
                  borderRadius="md"
                  color="blackAlpha.800"
                  fontWeight="semibold"
                  value={watch(`receipts.${index}.price` as Path<z.infer<T>>)}
                />
              </VStack>
            )}
          />
        </HStack>
      </VStack>
      // column for button and price display
      <VStack justifyContent="space-between" alignItems="flex-end" alignSelf="stretch" gap={6}>
        <Text marginLeft="auto" justifySelf="end" fontSize="lg" fontWeight="semibold" color="blackAlpha.900">
          ${(parseFloat(field.price) * parseFloat(field.quantity)).toFixed(2) || 0}
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
            icon={field.suggested.display ? <X /> : <PenLine />}
            onClick={() => {
              update(index, watch, fields);
            }}
            size="md"
          />
        </HStack>
      </VStack>
    </HStack>
  );
}
export default ReceiptField;
