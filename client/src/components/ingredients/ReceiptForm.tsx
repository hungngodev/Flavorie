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
  Divider,
  Select,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useFieldArray, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Trash, Focus } from 'lucide-react';
import { PenLine } from 'lucide-react';

export type ReceiptType = {
  name: string;
  price: string;
  quantity: string;
};
export type MockReceiptType = {
  message:string,
  data:{
    items: ReceiptType[],
    total: string
  }
};
export const mockSuggests = ["chicken", "chicken breast", "chicken egg", "chicken thigh", "chicken wing", "chicken liver", "chicken gizzard", "chicken heart", "chicken drumstick", "chicken neck", "chicken back", "chicken feet", "chicken skin", "chicken wing tip", "chicken wing drumette", "chicken wing flat"]
export const mockReceipts: MockReceiptType = {
  "message": "Image processed successfully",
      "data": {
      "items": [
          {
              "name": "Lorem ipsum",
              "price": "$9.20",
              "quantity": "1"
          },
          {
              "name": "Lorem ipsum dolor sit",
              "price": "$19.20",
              "quantity": "1"
          },
          {
              "name": "Lorem ipsum dolor sit amet",
              "price": "$15.00",
              "quantity": "1"
          },
          {
              "name": "Lorem ipsum",
              "price": "$15.00",
              "quantity": "1"
          },
          {
              "name": "Lorem ipsum dolor sit",
              "price": "$15.00",
              "quantity": "1"
          },
          {
              "name": "Lorem ipsum",
              "price": "$19.20",
              "quantity": "1"
          }
      ],
          "total": "$107.60"
  }
}


const Receipt = z
  .object({
    name: z.string(),
    quantity: z.coerce.string(),
    price: z.coerce.string(),
  })
  .strict()
  .required({ name: true, quantity: true, price: true });

const ReceiptField = z.object({
  receipts: z.array(Receipt.required()),
});

type ReceiptFieldType = z.infer<typeof ReceiptField>;

const ReceiptForm: React.FC = () => {
  const [receipts, setReceipts] = useState<ReceiptFieldType>({
    receipts: mockReceipts.data.items?.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      price: item.price.replace('$', ''),
    })) ?? [{ name: 'test', quantity:"0", price:"0.0" }],
  });

  const [showSelect, setShowSelect] = useState<Array<boolean>>(new Array(receipts.length).fill(false));
  const { 
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ReceiptField),
    defaultValues: {
      receipts:
        receipts.receipts.length > 0
          ? receipts.receipts
          : [{ name: '', quantity: "0", price: "0.0" }],
    },
  });

  const watchField = watch('receipts');

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'receipts',
  });

  

  const submitReceipts: SubmitHandler<ReceiptFieldType> = (receipts) => {
    setReceipts(receipts);
    console.log(receipts);
  };

  return (
    <form
      onSubmit={handleSubmit(submitReceipts)}
      style={{
        gap: "1.25rem",
        overflow: "auto",
        height: "100dvh",
        display: 'flex',
        paddingBlock: '2.75rem',
        paddingInline: "2rem",
        justifyContent: 'space-evenly',
        width: "100%",
        backgroundColor: "#F7FAFC",
        flexWrap: "wrap"
      }}
    >
      <VStack flex={4} backgroundColor="whiteAlpha.700" spacing={2} alignItems="flex-start" justifySelf="start" boxShadow='base' height="fit-content" rounded='md' paddingBlock={3} paddingInline={6}>
        <Heading fontSize="3xl" color="teal" fontWeight="semibold" alignSelf="start">
          Items
        </Heading>
        {fields.map((field, index) => (
          <HStack width="100%" marginBlock={14}>
            <VStack width="100%" alignItems="start">
              <HStack>
              <Controller
                  control={control}
                  name={`receipts.${index}.name`}
                  render={({ field: { ref, ...fieldProps } }) => (
                    <VStack width="fit-content" alignItems="start">
                      <Text>Name</Text>
                      <Input borderRadius="md" paddingX="0.95em" {...fieldProps} placeholder="Enter your item" variant="flushed" />
                    </VStack>
                  )}
                />
              {
                showSelect[index] && (
                  <Controller 
                control={control}
                name={`receipts.${index}.name`}
                render={({ field: { ...fieldProps } }) => (
                  <VStack width="fit-content" alignItems="start">
                    <Text>Suggestions</Text>
                    <Select {...fieldProps} placeholder="Select item" variant="flushed">
                    {mockSuggests.map((suggest, index) => (
                      <option key={index} value={suggest}>{suggest}</option>
                    ))}
                  </Select>
                  </VStack>
                )}
              />
                )
              }
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
                          onChange={(valueNumber) => onChange(Number(valueNumber))}
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
                          onChange={(valueNumber) => onChange(Number(valueNumber))}
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
                <Text alignSelf="end" fontSize="xl" fontWeight="semibold" color="blackAlpha.900">${(parseFloat(watchField[index].price) * parseFloat(watchField[index].quantity)).toFixed(2) || 0}</Text>
                <HStack>
                  <Button color="blackAlpha.700" letterSpacing="-0.005em" fontWeight="semibold" leftIcon={<Trash />} onClick={() => { remove(index) }} variant="ghost">
                    Delete
                  </Button>
                  <Button color="blackAlpha.700" letterSpacing="-0.005em" fontWeight="semibold" leftIcon={<PenLine  />} variant="ghost"  
                  onClick={() => {
                    setShowSelect((prevSelectedSuggestions) => prevSelectedSuggestions.map((selected, i) => i === index ? !selected : selected));
                  }}>
                    Update
                  </Button>
                </HStack>
            </VStack>
          </HStack>
        ))}
        <Button colorScheme="teal" letterSpacing="-0.005em" fontWeight="semibold" onClick={() => append({ name: '', quantity: "0", price: "0.0" })}>Add new receipt</Button>
      </VStack>

      {/* summary card */}
      <VStack backgroundColor="whiteAlpha.700" spacing={6} alignItems="start" position="sticky" top={0} boxShadow='base' rounded="md" height="fit-content" paddingBlock={6} paddingInline={8} flex={1} minWidth="35%">
        <Heading fontSize="2xl" color="teal" fontWeight="semibold">Order summary</Heading>
        <Divider />
       
        <HStack width="100%" justifyContent="space-between">
          <Text fontWeight="semibold" color="blackAlpha.700">Total items</Text>
          <Text color="blackAlpha.600">{fields.length}</Text>
        </HStack>
        <HStack justifyContent="space-between" width="100%">
          <Text fontWeight="semibold" color="blackAlpha.700">Total price</Text>
          <Text color="blackAlpha.600">
              $ {parseFloat(
                watchField
                  .reduce((accumulator, field) => {
                    return accumulator + parseFloat(field.price) * parseFloat(field.quantity);
                  }, 0)
                  .toFixed(2),
              )}
          </Text>
        </HStack>

        <Divider />

        <Button letterSpacing="-0.005em" fontWeight="semibold" width="100%" type="submit" colorScheme='teal'>
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
