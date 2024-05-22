import {
  Button,
  Divider,
  HStack,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Focus, PenLine, Search, Trash, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import mockReceipts from './mockReceipts';

const Receipt = z
  .object({
    name: z.string(),
    quantity: z.coerce.string(),
    price: z.coerce.string(),
    suggested: z.object({
      display: z.boolean(),
      items: z.array(z.coerce.string()),
    }),
  })
  .strict()
  .required();

const ReceiptField = z.object({
  receipts: z.array(Receipt),
});

type ReceiptFieldType = z.infer<typeof ReceiptField>;

const ReceiptForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ReceiptFieldType>({
    resolver: zodResolver(ReceiptField),
    defaultValues: {
      receipts:
        mockReceipts?.data?.length > 0
          ? mockReceipts.data.map((receipt: any) => {
              return {
                name: receipt.name.toLowerCase(),
                quantity: receipt.quantity,
                price: receipt.price,
                suggested: {
                  display: false,
                  items: receipt['potential_matches'] ?? [''],
                },
              };
            })
          : [{ name: '', quantity: '0', price: '0.0', suggested: { display: false, items: [''] } }],
    },
  });

  const watchField = watch('receipts');

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'receipts',
  });
  useEffect(() => {
    console.log(fields);
  }, [fields]);

  const submitReceipts: SubmitHandler<ReceiptFieldType> = (receiptResponse) => {
    console.log(receiptResponse);
  };

  return (
    <form
      onSubmit={handleSubmit(submitReceipts)}
      style={{
        gap: '1.25rem',
        overflow: 'auto',
        height: '100dvh',
        display: 'flex',
        paddingBlock: '2.75rem',
        paddingInline: '2rem',
        justifyContent: 'space-evenly',
        width: '100%',
        backgroundColor: '#F7FAFC',
        flexWrap: 'wrap',
      }}
    >
      <VStack
        flex={4}
        backgroundColor="whiteAlpha.700"
        spacing={2}
        alignItems="flex-start"
        justifySelf="start"
        boxShadow="base"
        height="fit-content"
        rounded="md"
        paddingBlock={3}
        paddingInline={6}
      >
        <Heading fontSize="3xl" color="teal" fontWeight="semibold" alignSelf="start">
          Items
        </Heading>
        {fields.map((field, index) => (
          <HStack width="100%" marginBlock={14} key={field.id}>
            <VStack width="100%" alignItems="start">
              <HStack>
                <Controller
                  control={control}
                  name={`receipts.${index}.name`}
                  render={({ field: { ref, ...fieldProps } }) => (
                    <VStack width="fit-content" alignItems="start">
                      <Text>Name</Text>
                      <Input
                        borderRadius="md"
                        paddingX="0.95em"
                        {...fieldProps}
                        placeholder="Enter your item"
                        variant="flushed"
                        onChange={(val) => fieldProps.onChange(val)}
                      />
                      {fields[index].suggested.display && (
                        <Menu>
                          <MenuButton as={Button} arial-label="options" rightIcon={<Search />}>
                            Suggestions
                          </MenuButton>
                          <MenuList>
                            {fields[index].suggested.items.map((suggest: string) => {
                              return (
                                <MenuItem
                                  key={suggest}
                                  onClick={() => {
                                    fieldProps.onChange(suggest);
                                  }}
                                >
                                  {suggest}
                                </MenuItem>
                              );
                            })}
                          </MenuList>
                        </Menu>
                      )}
                    </VStack>
                  )}
                />
              </HStack>
              <HStack maxWidth="65%" alignSelf="start">
                <Controller
                  control={control}
                  name={`receipts.${index}.quantity`}
                  render={({ field: { onChange, ...fieldProps } }) => (
                    <VStack alignItems="start">
                      <Text>Quantity</Text>
                      <NumberInput
                        {...fieldProps}
                        min={0}
                        keepWithinRange={true}
                        onChange={(valueString) => onChange(Number(valueString))}
                        borderRadius="md"
                        color="blackAlpha.600"
                      >
                        <NumberInputField {...fieldProps} />
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
                      <Text>Price</Text>
                      <NumberInput
                        precision={2}
                        step={0.01}
                        min={0.0}
                        keepWithinRange={true}
                        onChange={(valueString) => onChange(Number(valueString))}
                        borderRadius="md"
                        color="blackAlpha.600"
                        {...fieldProps}
                      >
                        <NumberInputField {...fieldProps} />
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
            <VStack alignSelf="stretch" justifyContent="space-between">
              <Text alignSelf="end" fontSize="xl" fontWeight="semibold" color="blackAlpha.900">
                ${(parseFloat(watchField[index].price) * parseFloat(watchField[index].quantity)).toFixed(2) || 0}
              </Text>
              <HStack>
                <Button
                  color="blackAlpha.700"
                  letterSpacing="-0.005em"
                  fontWeight="semibold"
                  leftIcon={<Trash />}
                  onClick={() => {
                    remove(index);
                    console.log(fields);
                  }}
                  variant="ghost"
                >
                  Delete
                </Button>
                <Button
                  color="blackAlpha.700"
                  letterSpacing="-0.005em"
                  fontWeight="semibold"
                  leftIcon={fields[index].suggested.display ? <X /> : <PenLine />}
                  variant="ghost"
                  onClick={() => {
                    const updatedFields = [...fields];
                    updatedFields[index].suggested.display = !updatedFields[index].suggested.display;
                    reset({ receipts: updatedFields });
                  }}
                >
                  {fields[index].suggested.display ? 'Close' : 'Update'}
                </Button>
              </HStack>
            </VStack>
          </HStack>
        ))}
        <Button
          colorScheme="teal"
          letterSpacing="-0.005em"
          fontWeight="semibold"
          onClick={() => {
            append({
              name: '',
              quantity: '0',
              price: '0.0',
              suggested: { display: false, items: [''] },
            });
          }}
        >
          Add new receipt
        </Button>
      </VStack>

      <VStack
        backgroundColor="whiteAlpha.700"
        spacing={6}
        alignItems="start"
        position="sticky"
        top={0}
        boxShadow="base"
        rounded="md"
        height="fit-content"
        paddingBlock={6}
        paddingInline={8}
        flex={1}
        minWidth="35%"
      >
        <Heading fontSize="2xl" color="teal" fontWeight="semibold">
          Order summary
        </Heading>
        <Divider />

        <HStack width="100%" justifyContent="space-between">
          <Text fontWeight="semibold" color="blackAlpha.700">
            Total items
          </Text>
          <Text color="blackAlpha.600">{fields.length}</Text>
        </HStack>
        <HStack justifyContent="space-between" width="100%">
          <Text fontWeight="semibold" color="blackAlpha.700">
            Total price
          </Text>
          <Text color="blackAlpha.600">
            ${' '}
            {parseFloat(
              watchField
                .reduce((accumulator, field) => {
                  return accumulator + parseFloat(field.price) * parseFloat(field.quantity);
                }, 0)
                .toFixed(2),
            )}
          </Text>
        </HStack>

        <Divider />

        <Button letterSpacing="-0.005em" fontWeight="semibold" width="100%" type="submit" colorScheme="teal">
          Submit changes
        </Button>
        <Button letterSpacing="-0.005em" fontWeight="semibold" width="100%" leftIcon={<Focus />} variant="outline">
          Return to scanner
        </Button>
      </VStack>
    </form>
  );
};

export default ReceiptForm;
