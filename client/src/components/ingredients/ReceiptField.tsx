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
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
} from '@chakra-ui/react';
import { ChakraStylesConfig, Select } from 'chakra-react-select';
import { Check, MoveRight, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { Controller, FieldPath, Path } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { ZodType, z } from 'zod';
import CustomFetch from '../../utils/customFetch';
import parseOption, { OptionMenuType } from '../../utils/parseOption';
import CustomNumberInput from '../form/CustomNumberInput';
import CustomTextInput from '../form/CustomTextInput';
import { ReceiptFormProps } from './ReceiptForm';

const mockSuggestionUpdate1 = [
  'mockingredient1',
  'mockingredient2',
  'mockingredient3',
  'mockingredient4',
  'mockingredient5',
];

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
    fontSize: 'xl',
    color: 'blackAlpha.700',
  }),
};

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
  const toggleChange = () => {
    update(index, watch, fields, {
      suggested: {
        display: !watch(`receipts.${index}.suggested.display` as Path<z.infer<T>>),
        items: watch(`receipts.${index}.suggested.items` as Path<z.infer<T>>),
      },
    });
  };

  const [menuSuggestion, setMenuSuggestion] = useState<OptionMenuType>({
    label:
      `${field.suggested.items.length} suggestions for ${watch(`receipts.${index}.name` as Path<z.infer<T>>)}:` as string,
    options: parseOption(field.suggested.items),
  });
  console.log(menuSuggestion);

  const updateReceipt = useDebouncedCallback((val: any) => {
    const updateData: string[] = [];

    const fakeFetch = CustomFetch.get(`https://jsonplaceholder.typicode.com/posts/${Math.floor(Math.random() * 50)}`)
      .then((response) => {
        updateData.push(response.data.title);
        setMenuSuggestion({
          label: `${watch(`receipts.${index}.suggested.items` as Path<z.infer<T>>)} suggestions for ${val}:` as string,
          options: parseOption(updateData),
        });
        update(index, watch, fields, {
          name: val,
          suggested: {
            display: true,
            items: updateData,
          },
        });
      })
      .catch((error) => console.log(error));
  }, 300);

  return (
    <Grid
      templateAreas={`
        "divider divider divider"
        "image text cost"
        "image number button"
    `}
      templateColumns={`1fr 6fr 1fr`}
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
                backgroundColor={field.suggested.display ? 'gray.100' : 'transparent'}
                paddingInline={field.suggested.display ? '0.95em' : '0'}
                paddingBlock={field.suggested.display ? '0.75em' : '0'}
                fontSize="xl"
                variant="ghost"
                onChange={(value) => {
                  fieldProps.onChange(value);
                  updateReceipt(value.target.value);
                }}
                onBlur={() => {
                  updateReceipt(field.name);
                }}
                control={
                  <Tooltip
                    label={
                      watch(`receipts.${index}.suggested.display` as Path<z.infer<T>>)
                        ? 'Save ingredient'
                        : 'Edit ingredient'
                    }
                    margin={0}
                    padding={0}
                  >
                    <IconButton
                      aria-label="edit-name"
                      backgroundColor="transparent"
                      icon={watch(`receipts.${index}.suggested.display` as Path<z.infer<T>>) ? <Check /> : <Pencil />}
                      onClick={() => {
                        toggleChange();
                      }}
                      padding={1}
                      rounded="full"
                      size="sm"
                    />
                  </Tooltip>
                }
                containerProps={{
                  backgroundColor: !field.suggested.display ? 'gray.200' : 'transparent',
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
                  <FormLabel fontSize="xl">Suggest</FormLabel>
                  <Select
                    chakraStyles={menuStyles}
                    selectedOptionColor="teal"
                    defaultValue={menuSuggestion.options[0]}
                    options={[menuSuggestion]}
                    onChange={(newValue: any) => {
                      fieldProps.onChange(newValue?.value);
                    }}
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
        <Stat color="blackAlpha.700" textAlign="right">
          <StatLabel>Total</StatLabel>
          <StatNumber>
            $
            {(
              parseFloat(watch(`receipts.${index}.price` as Path<z.infer<T>>)) *
              parseFloat(watch(`receipts.${index}.quantity` as Path<z.infer<T>>))
            ).toFixed(2)}
          </StatNumber>
        </Stat>
      </GridItem>
      <GridItem area={'button'}>
        <HStack gap={2} height="100%" alignItems="end" justify="end">
          <Tooltip label="Remove ingredient">
            <Button
              variant="ghost"
              aria-label="delete-button"
              children="Remove"
              onClick={() => {
                remove(index);
              }}
              size="md"
              fontWeight="semibold"
              color="blackAlpha.700"
              leftIcon={<Trash strokeWidth={1} />}
            />
          </Tooltip>
        </HStack>
      </GridItem>
    </Grid>
  );
}
export default ReceiptField;
