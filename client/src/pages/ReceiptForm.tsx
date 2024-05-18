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
  IconButton
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useFieldArray, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Trash, Focus } from 'lucide-react';




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
      style={{ gap: "1.25rem", overflow:"auto", height:"100dvh", display: 'flex', paddingBlock: '2.75rem', paddingInline: "2rem", justifyContent: 'space-evenly', width:"100%", backgroundColor:"#F7FAFC", flexWrap:"wrap"}}
    >
      <VStack flex={4} backgroundColor="whiteAlpha.700" spacing={4} alignItems="flex-start" justifySelf="start" boxShadow='base' height="fit-content"  rounded='md' paddingBlock={3} paddingInline={6}>
        <Heading fontSize="3xl" color="teal" fontWeight="semibold" alignSelf="start" >
          Items
        </Heading>
        {fields.map((field, index) => (

        <VStack width="100%">
          <Divider width="100%" borderColor="gray.500"/>
          <HStack key={field.id} width="100%" justifyContent="space-between" paddingBlock={4}>
          <VStack gap={4}>
            <Controller
              control={control}
              name={`receipts.${index}.name`}
              render={({ field: { ref, ...fieldProps } }) => (<VStack width="100%" alignItems="start">
                <Text>Name</Text>
                <Input borderRadius="md" paddingX="0.95em" {...fieldProps} placeholder="Enter your item" variant="flushed" />
              </VStack>)}
            />

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
                    <NumberInputField {...fieldProps}  />
                    <NumberInputStepper>
                      <NumberIncrementStepper border="none" />
                      <NumberDecrementStepper border="none"  />
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
            <NumberInputField  {...fieldProps}/>
            <NumberInputStepper>
              <NumberIncrementStepper border="none"  />
              <NumberDecrementStepper border="none" />
            </NumberInputStepper>
          </NumberInput>
          </VStack>
        )}
      />
      </HStack>
          </VStack>
          <VStack alignSelf="stretch" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="semibold" color="blackAlpha.700">${(watchField[index].price * watchField[index].quantity).toFixed(2) || 0}</Text>
        <Button color="blackAlpha.600" letterSpacing="-0.005em" fontWeight="semibold" leftIcon={<Trash/>} onClick={()=>{remove(index)}} variant="ghost">
           Delete
        </Button>
          </VStack>
        </HStack>
        </VStack>
        ))}

        <Button colorScheme="teal" letterSpacing="-0.005em" fontWeight="semibold" onClick={() => append({ name: '', quantity: 0, price: 0.0 })}>Add new receipt</Button>
      </VStack>


      <VStack backgroundColor="whiteAlpha.700" spacing={6} alignItems="start" position="sticky" top={0} boxShadow='base' rounded="md" height="fit-content" paddingBlock={6} paddingInline={8} flex={1}>
        <Heading fontSize="2xl" color="teal" fontWeight="semibold" >Order summary</Heading>
        <Divider/>
        <VStack width="100%">
          <HStack width="100%" justifyContent="space-between" >
            <Text fontWeight="semibold" color="blackAlpha.700">Total items</Text>
            <Text color="blackAlpha.600">{fields.length}</Text>
          </HStack>
          <HStack justifyContent="space-between" width="100%">
          <Text fontWeight="semibold" color="blackAlpha.700">Total price</Text>
          <Text color="blackAlpha.600">
            $ {parseFloat(
              watchField
                .reduce((accumulator, field) => {
                  return accumulator + field.price * field.quantity;
                }, 0)
                .toFixed(2),
            )}
          </Text>
        </HStack>
        </VStack>
        <Divider/>
        <VStack width="100%">
        <Button letterSpacing="-0.005em" fontWeight="semibold" width= "100%" type="submit" colorScheme='teal'>
          Submit changes
        </Button>
        <Button letterSpacing="-0.005em" fontWeight="semibold" width="100%" leftIcon={<Focus />} variant="outline">
          Return to scanner
        </Button>
        </VStack>
      </VStack>
    </form>
  );
};
export default ReceiptForm;