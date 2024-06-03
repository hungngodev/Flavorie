import { Button, HStack, IconButton, Image, Text, VStack, Divider, Grid, GridItem, FormControl, FormLabel } from '@chakra-ui/react';
import { ArrowLeftRight, X, PenLine } from 'lucide-react';
import { Controller, FieldPath, Path } from 'react-hook-form';
import { ZodType, z } from 'zod';
import CustomMenu from '../form/CustomMenu';
import CustomNumberInput from '../form/CustomNumberInput';
import CustomTextInput from '../form/CustomTextInput';
import { ReceiptFormProps } from './ReceiptForm';
import { Select, ChakraStylesConfig } from "chakra-react-select"
import { ArrowForwardIcon, DeleteIcon } from "@chakra-ui/icons"
import { useDebouncedCallback } from 'use-debounce';
const menuStyles: ChakraStylesConfig = {
  container: (baseStyles, state) => ({
    ...baseStyles,
    width: "100%",
  }),
  indicatorsContainer: (baseStyles, state) => ({
    backgroundColor: "transparent",
    background: "transparent",
  }),
  indicatorSeparator: (baseStyles, state) => ({
    backgroundColor: "gray.600",
  }),
  dropdownIndicator: (baseStyles, state) => ({
    backgroundColor: "transparent",
  })
}

interface OptionType {
  label: string;
  value: any;
}
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

  const updateReceipt = useDebouncedCallback((val: any) => {
    console.log(val);
  }, 300)

  const Options: OptionType[] = []
  field.suggested.items.map((item: any) => {
    Options.push({ label: item, value: item })
  })
  const Suggestions = {
    label: `${field.suggested.items.length} suggestions for ${watch(`receipts.${index}.name` as Path<z.infer<T>>)}:` as string,
    options: Options,
  }
  return (
    <Grid templateAreas={`
        "divider divider divider"
        "image text cost"
        "image number button"
    `}
      templateColumns={`1fr 5fr 1fr`}
      gap={6}
      paddingBottom={6}
    >
      <GridItem area={"divider"}><Divider /></GridItem>
      <GridItem area={"image"}>
        <Image
          aspectRatio="1/1"
          alignSelf="flex-start"
          borderRadius="lg"
          width="100%"
          src={field.image}
          alt="receipt image"
        />
      </GridItem>
      <GridItem area={"text"} >
        <HStack alignItems="start" justifyContent="space-evenly" gap={4} width="100%">
          <Controller
            control={control}
            name={`receipts.${index}.name` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => (
              <CustomTextInput
                fieldProps={fieldProps}
                label="Name"
                value={watch(`receipts.${index}.name` as Path<z.infer<T>>)}
                isDisabled={!field.suggested.display}
                _disabled={{ color: "blackAlpha.700", borderColor: "gray.200", borderRadius: "md" }}
                width="min-content"
                borderRadius="md"
                onChange={(value) => {
                  fieldProps.onChange(value)
                  updateReceipt(value.target.value)
                }}
              />
            )}
          />
          <ArrowLeftRight size={60} strokeWidth={1} />
          <Controller
            control={control}
            name={`receipts.${index}.name` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => {
              return (
                <FormControl>
                  <FormLabel color="blackAlpha.700">Suggest</FormLabel>
                  <Select
                    options={[Suggestions]} // Fix: Convert Suggestions object into an array
                    onChange={(newValue: any) => {
                      fieldProps.onChange(newValue?.value);
                    }}
                    chakraStyles={menuStyles}

                  />
                </FormControl>
              )
            }}
          />
        </HStack>
      </GridItem>
      <GridItem area={"number"}  >
        <HStack width="100%" justifyContent="start" gap={4}>
          <Controller
            control={control}
            name={`receipts.${index}.quantity` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => (
              <CustomNumberInput
                fieldProps={fieldProps}
                value={watch(`receipts.${index}.quantity` as Path<z.infer<T>>)}
                onChange={(valueString) => {
                  fieldProps.onChange(Number(valueString))
                }}
                label="Quantity"
                min={0}
                keepWithinRange={true}
                fontWeight="semibold"
              />
            )}
          />
          <Controller
            control={control}
            name={`receipts.${index}.price` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => (
              <CustomNumberInput
                fieldProps={fieldProps}
                value={watch(`receipts.${index}.price` as Path<z.infer<T>>)}
                onChange={(valueString) => fieldProps.onChange(Number(valueString))}
                label="Price"
                min={0}
                step={0.01}
                keepWithinRange={true}
                fontWeight="semibold"
              />
            )}
          />
        </HStack>
      </GridItem>
      <GridItem area={"cost"}>
        <Text textAlign="right" fontSize="lg" fontWeight="semibold" color="blackAlpha.900">
          $
          {(
            parseFloat(watch(`receipts.${index}.price` as Path<z.infer<T>>)) *
            parseFloat(watch(`receipts.${index}.quantity` as Path<z.infer<T>>))
          ).toFixed(2) || '0.00'}
          <Text as="span" color="blackAlpha.800">
            /total
          </Text>
        </Text>
      </GridItem>
      <GridItem area={"button"}>
        <HStack gap={2} height="100%" alignItems="end">
          <Button
            variant="ghost"
            aria-label="delete-button"
            children="Remove"
            onClick={() => {
              remove(index);
            }}
            size="sm"
            leftIcon={<DeleteIcon strokeWidth={1} />}
          />
          <Button
            aria-label="update-button"
            borderRadius="lg"
            children={field.suggested.display ? 'Cancel' : 'Update'}
            color="whiteAlpha.900"
            backgroundColor="teal.500"
            _hover={{ backgroundColor: "teal.600" }}
            onClick={() => {
              update(index, watch, fields);
            }}
            size="sm"
            leftIcon={field.suggested.display ? <X strokeWidth={1} /> : <PenLine strokeWidth={1} />}
          />
        </HStack>
      </GridItem>
    </Grid>

  )
}
export default ReceiptField;
