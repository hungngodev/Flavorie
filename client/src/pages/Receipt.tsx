import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Focus } from 'lucide-react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import ReceiptForm from '../components/ingredients/ReceiptForm';
import mockReceipts from '../components/ingredients/mockReceipts';

const ReceiptObject = z
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
  receipts: z.array(ReceiptObject),
});

type ReceiptFieldType = z.infer<typeof ReceiptField>;

const Receipt = () => {
  const {
    control,
    handleSubmit,
    watch,
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

  const submitReceipts: SubmitHandler<ReceiptFieldType> = (receiptResponse) => {
    console.log(receiptResponse);
  };

  const removeField = (index: number) => {
    remove(index);
  };
  const updateField = (index: number) => {
    update(index, {
      name: watch(`receipts.${index}.name`),
      quantity: watch(`receipts.${index}.quantity`),
      price: watch(`receipts.${index}.price`),
      suggested: {
        display: !fields[index].suggested.display,
        items: fields[index].suggested.items,
      },
    });
  };
  const appendField = (index?: number) => {
    append({
      name: '',
      quantity: '0',
      price: '0.0',
      suggested: { display: false, items: [] },
    });
  };
  return (
    <HStack width="100%" height="100%" position="sticky" alignItems="flex-start">
      <ReceiptForm
        // field={fields}
        // schema={ReceiptField}
        // fieldKey={'receipts'}
        // control={control}
        // submit={submitReceipts}
        // remove={removeField}
        // update={updateField}
        // append={appendField}
      />
    </HStack>
  )
      {/* <Card height="fit-content" position="sticky" top={0} paddingInline={6} paddingBlock={4}>
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
            <Text fontWeight="semibold" color="blackAlpha.900"> */}
              {/* {fields.length} */}
            {/* </Text>
          </HStack>
          <HStack width="100%" justifyContent="space-between">
            <Text fontWeight="semibold" color="blackAlpha.700">
              Cost
            </Text>
            <Text fontWeight="semibold" color="blackAlpha.900"> */}
              {/* ${' '}
              {parseFloat(
                watchField
                  .reduce((accumulator, field) => {
                    return accumulator + parseFloat(field.price) * parseFloat(field.quantity);
                  }, 0)
                  .toFixed(2),
              )} */}
            //   Test
            {/* </Text>
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
    </HStack> */}
  
};
export default Receipt;
