import {
  Button,
  HStack,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { LuTrash } from 'react-icons/lu';
import { z } from 'zod';

// ! Finish state prop
// ! Implement UI
// ! Implement Responsiveness
// ! Implement accessibility

const Receipt = z
  .object({
    name: z.string(),
    quantity: z.number().min(0, { message: 'Quantity should be positive' }),
    price: z.coerce.number().min(0, { message: 'Receipt price should be positive' }),
  })
  .strict()
  .required({ name: true, quantity: true, price: true });

const ReceiptField = z.object({
  receipts: z.array(Receipt.required()),
});

type ReceiptFieldType = z.infer<typeof ReceiptField>;

const ReceiptForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ReceiptField),
    defaultValues: {
      receipts: [{ name: '', quantity: 0, price: 0.0 }], // the receipts field is an array of objects
    },
  });

  const watchField = watch('receipts');

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'receipts',
  });
  const [receipts, setReceipts] = useState<ReceiptFieldType>({ receipts: [{ name: '', quantity: 0, price: 0.0 }] });

  const submitReceipts: SubmitHandler<ReceiptFieldType> = (receipts) => {
    setReceipts(receipts);
    console.log(receipts);
  };

  return (
    <form
      onSubmit={handleSubmit(submitReceipts)}
      style={{ width: '100%', display: 'flex', paddingTop: '3rem', justifyContent: 'between' }}
    >
      <VStack spacing={4} justifySelf="start">
        {fields.map((field, index) => (
          <HStack key={field.id}>
            <Controller
              control={control}
              name={`receipts.${index}.name`}
              render={({ field: { ref, ...fieldProps } }) => <Input {...fieldProps} placeholder="Enter your item" />}
            />
            <Controller
              control={control}
              name={`receipts.${index}.quantity`}
              render={({ field: { onChange, ...fieldProps } }) => (
                <NumberInput
                  {...fieldProps}
                  min={0}
                  keepWithinRange={true}
                  onChange={(valueNumber) => onChange(valueNumber)}
                >
                  <NumberInputField {...fieldProps} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <Controller
              control={control}
              name={`receipts.${index}.price`}
              render={({ field: { onChange, ...fieldProps } }) => (
                <NumberInput
                  precision={2}
                  step={0.01}
                  {...fieldProps}
                  min={0.0}
                  keepWithinRange={true}
                  onChange={(valueNumber) => onChange(valueNumber)}
                >
                  <NumberInputField {...fieldProps} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
            <Button onClick={() => remove(index)}>
              <LuTrash />
            </Button>
          </HStack>
        ))}
        <Button onClick={() => append({ name: '', quantity: 0, price: 0.0 })}>Add new receipt</Button>
      </VStack>
      <VStack spacing={4} justifySelf="end">
        <Heading>Order summary</Heading>
        <HStack justifyContent="between">
          <Text>Total items</Text>
          <Text>{fields.length}</Text>
        </HStack>
        <HStack justifyContent="between">
          <Text>Total price</Text>
          <Text>
            {parseFloat(
              watchField
                .reduce((accumulator, field) => {
                  return accumulator + field.price * field.quantity;
                }, 0)
                .toFixed(2),
            )}
          </Text>
        </HStack>
        <Button type="submit" onClick={() => console.log(fields)}>
          Submit changes
        </Button>
      </VStack>
    </form>
  );
};
export default ReceiptForm;
