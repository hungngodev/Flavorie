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
import { QueryClient } from '@tanstack/react-query';
import { ChakraStylesConfig, Select } from 'chakra-react-select';
import { Check, MoveRight, Pencil, Trash } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Controller, FieldPath, Path } from 'react-hook-form';
import { Params } from 'react-router-dom';
import { ZodType, z } from 'zod';
import { default as CustomFetch, default as customFetch } from '../../utils/customFetch';
import parseOption, { OptionMenuType } from '../../utils/parseOption';
import CustomNumberInput from '../form/CustomNumberInput';
import CustomTextInput from '../form/CustomTextInput';
import { ReceiptFormProps } from './ReceiptForm';

// ! to be updated later
export const updateSuggestionQuery = (id?: any) => {
  return {
    queryKey: ['update-suggestion', id],
    queryFn: async () => {
      const receiptResponse = await customFetch.post('/update-suggestion', { id });
      return receiptResponse;
    },
  };
};

export const loader =
  (queryClient: QueryClient) =>
  async ({ param }: { param: Params }) => {
    queryClient.ensureQueryData(updateSuggestionQuery(param));
  };

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
  const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});

  const [menuSuggestion, setMenuSuggestion] = useState<OptionMenuType>({
    label:
      `${field.suggested.items.length} suggestions for ${watch(`receipts.${index}.name` as Path<z.infer<T>>)}:` as string,
    options: parseOption(field.suggested.items.map((item: any) => item?.name)),
  });

  const handleSuggestionChange = (newValue: any) => {
    const selectedItem = field.suggested.items.find((item) => item.name === newValue.value);
    update(index, fields, {
      id: selectedItem.oid,
      name: newValue.value,
      image: selectedItem.img,
      suggested: {
        ...field.suggested,
        display: false,
      },
    });
    setMenuSuggestion({
      label: `${selectedItem.name}`,
      options: parseOption(field.suggested.items.map((item: any) => item?.name)),
    });
  };

  const updateReceipt = useCallback(
    (val: string) => {
      if (val === '') {
        return;
      }

      CustomFetch.get(`http://localhost:5100/api/user/ingredients/suggestions?name=${val}`)
        .then((response) => {
          const updateData = response.data.filterSuggestions.map((item: any) => ({
            name: item.name,
            img: 'https://img.spoonacular.com/ingredients_250x250/' + item.img,
          }));

          setMenuSuggestion({
            label: `${updateData.length} suggestions for ${val}:`,
            options: parseOption(updateData),
          });

          update(index, fields, {
            name: val,
            suggested: {
              display: true,
              items: updateData,
            },
          });
        })
        .catch((error) => console.log(error));
    },
    [index, fields, update],
  );

  const toggleChange = useCallback(() => {
    const currentDisplay = watch(`receipts.${index}.suggested.display` as Path<z.infer<T>>);
    const inputValue = watch(`receipts.${index}.name` as Path<z.infer<T>>);

    if (currentDisplay && isEditing[index]) {
      updateReceipt(inputValue);
      setIsEditing((prev) => ({ ...prev, [index]: false }));
    } else {
      setIsEditing((prev) => ({ ...prev, [index]: true }));
    }
    update(index, fields, {
      suggested: {
        ...watch(`receipts.${index}.suggested` as Path<z.infer<T>>),
        display: !currentDisplay,
      },
    });
  }, [watch, index, update, fields, updateReceipt, isEditing]);

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
          src={watch(`receipts.${index}.suggested.items.img` as Path<z.infer<T>>) ?? field?.image}
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
                onChange={(e) => {
                  update(index, fields, { name: e.target.value });
                  updateReceipt(e.target.value);
                }}
                onBlur={(e) => {
                  toggleChange();
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
                      onClick={toggleChange}
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
            render={({ field }) => {
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
                    value={
                      menuSuggestion.options.find((option) => option.value === field.value) || menuSuggestion.options[0]
                    }
                    options={[menuSuggestion]}
                    onChange={(newValue: any) => {
                      field.onChange(newValue.value);
                      handleSuggestionChange(newValue);
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
