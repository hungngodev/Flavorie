import { Button, HStack, IconButton, Image, Text, VStack } from '@chakra-ui/react';
import { PenLine, Search, Trash, X } from 'lucide-react';
import { Controller, FieldPath, Path } from 'react-hook-form';
import { ZodType, z } from 'zod';
import CustomMenu from '../form/CustomMenu';
import CustomNumberInput from '../form/CustomNumberInput';
import CustomTextInput from '../form/CustomTextInput';
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
      {
        field.image && 
          <Image
          aspectRatio="1/1"
          alignSelf="flex-start"
          borderRadius="lg"
          boxSize="7rem"
          src={field.image}
          alt="receipt image"
        />
      }
      <VStack justifyContent="flex-start" alignItems="flex-start" gap={6} width="100%">
        // row for name and menu
        <HStack>
          <Controller
            control={control}
            name={`receipts.${index}.name` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => (
              <CustomTextInput
                fieldProps={fieldProps}
                onChange={(val) => fieldProps.onChange(val)}
                value={watch(`receipts.${index}.name` as Path<z.infer<T>>)}
                label="Name"
                borderRadius="md"
                placeholder="Enter your item"
                variant="flushed"
                color="blackAlpha.800"
                fontWeight="semibold"
                fontSize="lg"
                width="fit-content"
              />
            )}
          />

          <Controller
            control={control}
            name={`receipts.${index}.name` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => {
              return (
                field.suggested.display && (
                  <CustomMenu
                    label="Suggestions"
                    items={field.suggested.items}
                    field={field}
                    fieldProps={fieldProps}
                    display={
                      <Button leftIcon={<Search />} isDisabled={field.suggested.items.length === 0 ? true : false}>
                        {field.suggested.items.length > 0 ? 'Try these instead!' : "We couldn't find anything yet :("}
                      </Button>
                    }
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
                  value={watch(`receipts.${index}.quantity` as Path<z.infer<T>>)}
                  onChange={(valueString) => fieldProps.onChange(Number(valueString))}
                  min={0}
                  keepWithinRange={true}
                  borderRadius="md"
                  color="blackAlpha.800"
                  fontWeight="semibold"
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
                  value={watch(`receipts.${index}.price` as Path<z.infer<T>>)}
                  onChange={(valueString) => fieldProps.onChange(Number(valueString))}
                  min={0}
                  keepWithinRange={true}
                  borderRadius="md"
                  color="blackAlpha.800"
                  fontWeight="semibold"
                />
              </VStack>
            )}
          />
        </HStack>
      </VStack>
      // column for button and price display
      <VStack justifyContent="space-between" alignItems="flex-end" alignSelf="stretch" gap={6}>
        <Text marginLeft="auto" justifySelf="end" fontSize="lg" fontWeight="semibold" color="blackAlpha.900">
          $
          {(
            parseFloat(watch(`receipts.${index}.price` as Path<z.infer<T>>)) *
            parseFloat(watch(`receipts.${index}.quantity` as Path<z.infer<T>>))
          ).toFixed(2) || '0.00'}
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
