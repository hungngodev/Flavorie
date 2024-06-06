import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import { ChakraStylesConfig, Select } from 'chakra-react-select';
import { MoveRight, Pencil, Trash } from 'lucide-react';
import { Controller, FieldPath, Path } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { ZodType, z } from 'zod';
import CustomNumberInput from '../form/CustomNumberInput';
import CustomTextInput from '../form/CustomTextInput';
import { ReceiptFormProps } from './ReceiptForm';

const menuStyles: ChakraStylesConfig = {
  container: (baseStyles, state) => ({
    ...baseStyles,
    width: '100%',
    border: 'none',
  }),
  control: (baseStyles, state) => ({
    ...baseStyles,
    border: 'none',
  }),
  indicatorsContainer: (baseStyles, state) => ({
    backgroundColor: 'transparent',
    background: 'transparent',
  }),
  indicatorSeparator: (baseStyles, state) => ({
    backgroundColor: 'gray.600',
  }),
  dropdownIndicator: (baseStyles, state) => ({
    backgroundColor: 'transparent',
  }),
  valueContainer: (baseStyles, state) => ({
    ...baseStyles,
    border: 'none',
    paddingInline: '0',
  }),
};

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
  }, 300);

  const Options: OptionType[] = [];
  field.suggested.items.map((item: any) => {
    Options.push({ label: item, value: item });
  });
  const Suggestions = {
    label:
      `${field.suggested.items.length} suggestions for ${watch(`receipts.${index}.name` as Path<z.infer<T>>)}:` as string,
    options: Options,
  };
  return (
    <Grid
      templateAreas={`
        "divider divider divider"
        "image text cost"
        "image number button"
    `}
      templateColumns={`1fr 6fr 2fr`}
      gap={6}
      paddingBottom={6}
    >
      <GridItem area={'divider'}>
        <Divider />
      </GridItem>
      <GridItem area={'image'}>
        <Image
          aspectRatio="1/1"
          alignSelf="flex-start"
          borderRadius="lg"
          width="90%"
          src={field.image}
          alt="receipt image"
        />
      </GridItem>
      <GridItem area={'text'}>
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
                width="100%"
                borderRadius="md"
                autoFocus={field.suggested.display}
                backgroundColor={field.suggested.display ? 'gray.50' : 'transparent'}
                paddingInline={0}
                variant="ghost"
                onChange={(value) => {
                  fieldProps.onChange(value);
                  updateReceipt(value.target.value);
                }}
                control={
                  <IconButton
                    aria-label="edit-name"
                    backgroundColor="transparent"
                    icon={<Pencil />}
                    onClick={() => {
                      update(index, watch, fields);
                    }}
                    padding={1}
                    rounded="full"
                    size="sm"
                    color="blackAlpha.700"
                  />
                }
                containerProps={{
                  backgroundColor: !field.suggested.display ? 'gray.50' : 'transparent',
                  border: '1px',
                  borderColor: 'gray.200',
                  borderRadius: 'md',
                  paddingInline: '0.95em',
                  paddingBlock: '0.75em',
                }}
              />
            )}
          />
          <Icon as={MoveRight} alignSelf="center" boxSize={6} color="gray.500" />
          <Controller
            control={control}
            name={`receipts.${index}.name` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => {
              return (
                <FormControl
                  border="1px"
                  borderRadius="md"
                  borderColor="gray.200"
                  paddingInline="0.95em"
                  paddingBlock="0.75em"
                >
                  <FormLabel color="blackAlpha.700">Suggest</FormLabel>
                  <Select
                    options={[Suggestions]} // Fix: Convert Suggestions object into an array
                    onChange={(newValue: any) => {
                      fieldProps.onChange(newValue?.value);
                    }}
                    chakraStyles={menuStyles}
                  />
                </FormControl>
              );
            }}
          />
        </HStack>
      </GridItem>
      <GridItem area={'number'}>
        <HStack width="100%" justifyContent="start">
          <Controller
            control={control}
            name={`receipts.${index}.quantity` as FieldPath<z.infer<T>>}
            render={({ field: { ...fieldProps } }) => (
              <CustomNumberInput
                fieldProps={fieldProps}
                value={watch(`receipts.${index}.quantity` as Path<z.infer<T>>)}
                onChange={(valueString) => {
                  fieldProps.onChange(Number(valueString));
                }}
                label="Quantity"
                min={0}
                keepWithinRange={true}
                fontWeight="semibold"
                width="min-content"
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
                width="min-content"
              />
            )}
          />
        </HStack>
      </GridItem>
      <GridItem area={'cost'}>
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
      <GridItem area={'button'}>
        <HStack gap={2} height="100%" alignItems="end" justify="end">
          <Button
            variant="ghost"
            aria-label="delete-button"
            children="Remove"
            onClick={() => {
              remove(index);
            }}
            size="sm"
            fontWeight="semibold"
            color="blackAlpha.700"
            leftIcon={<Trash strokeWidth={1} />}
          />
          {/* <Button
            aria-label="update-button"
            borderRadius="lg"
            children={field.suggested.display ? 'Cancel' : 'Update'}
            color="whiteAlpha.900"
            backgroundColor="teal.500"
            _hover={{ backgroundColor: 'teal.600' }}
            onClick={() => {
              update(index, watch, fields);
            }}
            size="sm"
            leftIcon={field.suggested.display ? <X strokeWidth={1} /> : <PenLine strokeWidth={1} />}
          /> */}
        </HStack>
      </GridItem>
    </Grid>
  );
}
export default ReceiptField;
