import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Heading,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClient } from '@tanstack/react-query';
import { Focus } from 'lucide-react';
import { useEffect } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Params } from 'react-router-dom';
import { z } from 'zod';
import { mockReceipts } from '../components/ingredients/MockReceipt';
import ReceiptField from '../components/ingredients/ReceiptField';
import ReceiptForm from '../components/ingredients/ReceiptForm';
import customFetch from '../utils/customFetch';

export const scannedReceiptQuery = (id?: any) => {
  return {
    queryKey: ['scanned-receipt', id],
    queryFn: async () => {
      const receiptResponse = await customFetch.post('/scan-receipt', { id });
      return receiptResponse;
    },
  };
};

export const loader =
  (queryClient: QueryClient) =>
  async ({ param }: { param: Params }) => {
    queryClient.ensureQueryData(scannedReceiptQuery(param));
  };

export const defaultImg =
  'https://img.freepik.com/free-photo/fried-chicken-breast-with-vegetables_140725-4650.jpg?t=st=1717211148~exp=1717214748~hmac=35aff48267e7d35f50f03fdd12473c2606c90b4f0a73eb45e2d4a51cfb44d0d8&w=740';

const ReceiptObject = z
  .object({
    name: z.string(),
    image: z.string(),
    quantity: z.coerce.string(),
    price: z.coerce.string(),
    suggested: z.object({
      display: z.boolean(),
      items: z.array(
        z.object({
          name: z.coerce.string(),
          img: z.coerce.string(),
        }),
      ),
    }),
  })
  .strict()
  .required({
    name: true,
    quantity: true,
    price: true,
    suggested: true,
  });
const ReceiptFieldObject = z.object({
  receipts: z.array(ReceiptObject),
});
const ReceiptRequest = z.object({
  message: z.string(),
  data: z.array(ReceiptObject.extend({ potential_oids: z.array(z.string()) })),
});

export type ReceiptFieldType = z.infer<typeof ReceiptFieldObject>;
export type ReceiptRequest = z.infer<typeof ReceiptRequest>;

const Receipt = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReceiptFieldType>({
    resolver: zodResolver(ReceiptFieldObject),
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
                  items: receipt['potential_matches'].map((item: any) => ({
                    name: item?.name ?? item,
                    img: item?.img ?? defaultImg,
                  })),
                },
              };
            })
          : [{ name: '', image: defaultImg, quantity: '0', price: '0.0', suggested: { display: false, items: [] } }],
    },
  });
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: 'receipts',
  });

  // this function handles the submission of the form
  const submitReceipts: SubmitHandler<ReceiptFieldType> = (receiptResponse) => {
    console.log(receiptResponse);
    // actual submit logic will be added later
  };

  const removeField = (index: number) => {
    remove(index);
  };

  const updateField = (index: number, fields: any, newField?: any) => {
    update(index, {
      ...fields[index],
      ...newField,
    });
  };

  const appendField = () => {
    append({
      name: '',
      image: defaultImg,
      quantity: '0',
      price: '0.0',
      suggested: { display: true, items: [] },
    });
  };

  return (
    <Stack
      width="100%"
      height="100%"
      position="sticky"
      alignItems="flex-start"
      direction={{ base: 'column', md: 'row' }}
      paddingInline={4}
    >
      <ReceiptForm
        fields={fields}
        FieldComponent={ReceiptField as React.ComponentType<any>}
        control={control}
        watch={watch}
        submit={submitReceipts}
        remove={removeField}
        update={updateField}
        append={appendField}
      />

      <Card height="fit-content" position="sticky" top={0} paddingInline={6} paddingBlock={4}>
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
                watch(`receipts`)
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
    </Stack>
  );
};

export default Receipt;