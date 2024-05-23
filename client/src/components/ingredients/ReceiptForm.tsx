import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Heading,
  IconButton,
  Image,
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
import React, { useRef } from 'react';
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
    reset,
    resetField,
    trigger,
    setValue,
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
                  items: receipt['potential_matches'] ?? [],
                },
              };
            })
          : [{ name: '', quantity: '0', price: '0.0', suggested: { display: false, items: [] } }],
    },
  });

  const watchField = watch('receipts');

  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: 'receipts',
  });

  const formRef = useRef<HTMLFormElement>(null);

  const submitReceipts: SubmitHandler<ReceiptFieldType> = (receiptResponse) => {
    console.log(receiptResponse);
  };

  return (
    <Box
      backgroundColor="gray.50"
      display="flex"
      flexDirection={['column', 'column', 'row']}
      justifyContent="space-evenly"
      paddingBlock={8}
      paddingInline={[0, 0, 2, 4, 4]}
      gap={4}
    >
      <Card flex={4} maxWidth={['100%', '100%', '80%', '60%']}>
        <CardHeader>
          <Heading fontSize="3xl" color="teal" fontWeight="semibold" alignSelf="start">
            Receipts
          </Heading>
        </CardHeader>
        <CardBody paddingInline={8}>
          <form ref={formRef} onSubmit={handleSubmit(submitReceipts)}>
            {fields.map((field, index) => (
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
                            value={watch(`receipts.${index}.name`)}
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
                                <MenuButton
                                  arial-label="options"
                                  color="blackAlpha.600"
                                  fontWeight="semibold"
                                  fontSize="lg"
                                >
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
                                          <Text
                                            color="blackAlpha.800"
                                            fontWeight="semibold"
                                            marginInline={2}
                                            fontSize="lg"
                                          >
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
                            <NumberInputField
                              {...fieldProps}
                              value={watch(`receipts.${index}.quantity`)}
                              fontSize="lg"
                            />
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
                            <NumberInputField {...fieldProps} value={watch(`receipts.${index}.price`)} fontSize="lg" />
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
                    ${(parseFloat(watchField[index].price) * parseFloat(watchField[index].quantity)).toFixed(2) || 0}
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
                        console.log(fields);
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
                        update(index, {
                          name: watch(`receipts.${index}.name`),
                          quantity: watch(`receipts.${index}.quantity`),
                          price: watch(`receipts.${index}.price`),
                          suggested: {
                            display: !fields[index].suggested.display,
                            items: fields[index].suggested.items,
                          },
                        });
                      }}
                      size="md"
                    />
                  </HStack>
                </VStack>
              </HStack>
            ))}
          </form>
        </CardBody>
        <CardFooter>
          <Button
            colorScheme="teal"
            letterSpacing="-0.005em"
            fontWeight="semibold"
            onClick={() => {
              append({
                name: '',
                quantity: '0',
                price: '0.0',
                suggested: { display: false, items: [] },
              });
            }}
          >
            Add new receipt
          </Button>
        </CardFooter>
      </Card>

      <Card height="fit-content" position="sticky" top={0} paddingInline={6} paddingBlock={4} minWidth="35%">
        <CardHeader>
          <Heading fontSize="3xl" color="teal" fontWeight="semibold" alignSelf="start">
            Summary
          </Heading>
        </CardHeader>

        <CardBody fontSize="lg">
          <HStack width="100%" justifyContent="space-between">
            <Text fontWeight="semibold" color="blackAlpha.700">
              Items
            </Text>
            <Text fontWeight="semibold" color="blackAlpha.900">
              {fields.length}
            </Text>
          </HStack>
          <HStack width="100%" justifyContent="space-between">
            <Text fontWeight="semibold" color="blackAlpha.700">
              Cost
            </Text>
            <Text fontWeight="semibold" color="blackAlpha.900">
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
        </CardBody>

        <Divider />

        <CardFooter>
          <VStack width="100%">
            <Button
              fontSize="lg"
              letterSpacing="-0.005em"
              fontWeight="semibold"
              width="100%"
              type="submit"
              colorScheme="teal"
              onClick={handleSubmit(submitReceipts)}
            >
              Submit changes
            </Button>
            <Button
              letterSpacing="-0.005em"
              fontWeight="semibold"
              width="100%"
              leftIcon={<Focus />}
              variant="outline"
              fontSize="lg"
            >
              Return to scanner
            </Button>
          </VStack>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default ReceiptForm;
