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
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { LuTrash } from 'react-icons/lu';
import { z } from 'zod';
import { mockReceipts } from './mockReceipt';

const pricingSchema = z.string().refine(
  (val) => {
    const pattern = /^\$\d+\.\d{2}$/;
    const isValidFormat = pattern.test(val);

    const price = parseFloat(val.slice(1));
    const isValidPrice = price >= 0.01;

    return isValidFormat && isValidPrice;
  },
  { message: 'Expected price format of $x.xx, with a minimum price of $0.01' },
);
const quantitySchema = z.string().refine(
  (val) => {
    const price = parseInt(val);
    return price >= 1;
  },
  { message: 'You should have at least one product' },
);

const Receipt = z
  .object({
    name: z.string(),
    price: pricingSchema,
    quantity: quantitySchema,
  })
  .strict();

const ReceiptRequired = Receipt.required({ name: true, price: true, quantity: true });
type ReceiptType = z.infer<typeof ReceiptRequired>;

const ReceiptForm: React.FC = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(ReceiptRequired),
    defaultValues: {
      receipts: [{ name: '', price: '', quantity: '' }], // the receipts field is an array of objects
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control, // hook the field array to react hook form
    name: 'receipts', // name of the field that is an array in the form
  });

  const submitReceipts = (data: any) => {
    console.log(data);
  };
  const [receipts, setReceipts] = useState<ReceiptType[]>(mockReceipts.receipts);

  return (
    <form onSubmit={handleSubmit(submitReceipts)}>
      <HStack width="100%" justify="between">
        <VStack spacing={4} justifySelf="start">
          {fields.map((field, index) => (
            <HStack key={field.id}>
              <Controller
                render={({ field: { ref, ...fieldProps } }) => <Input {...fieldProps} ref={ref} />}
                control={control}
                name={`receipts.${index}.name`}
              />
              <Controller
                render={({ field: { ref, ...fieldProps } }) => (
                  <NumberInput>
                    <NumberInputField {...fieldProps} ref={ref} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
                control={control}
                name={`receipts.${index}.quantity`}
              />
              <Controller
                render={({ field: { ref, ...fieldProps } }) => (
                  <NumberInput>
                    <NumberInputField {...fieldProps} ref={ref} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
                control={control}
                name={`receipts.${index}.price`}
              />
              <Button onClick={() => remove(index)}>
                <LuTrash />
              </Button>
            </HStack>
          ))}
          <Button onClick={() => append({ name: '', quantity: '1', price: '0.00' })}>Add new receipt</Button>
        </VStack>
        <VStack spacing={4} justifySelf="end">
          <Heading>Order summary</Heading>
          <HStack justifyContent="between">
            <Text>Total items</Text>
            <Text>{0}</Text>
          </HStack>
          <HStack justifyContent="between">
            <Text>Total price</Text>
            <Text>$12.25</Text>
          </HStack>
          <Button type="submit" onClick={handleSubmit(submitReceipts)}>
            Submit changes
          </Button>
        </VStack>
      </HStack>
    </form>
  );
};
export default ReceiptForm;
