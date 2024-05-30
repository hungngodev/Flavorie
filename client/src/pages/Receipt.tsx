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
import { Focus } from 'lucide-react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import ReceiptField from '../components/ingredients/ReceiptField';
import ReceiptForm from '../components/ingredients/ReceiptForm';
import { mockReceipts } from '../components/ingredients/MockReceipt';

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

const ReceiptFieldObject = z.object({
  receipts: z.array(ReceiptObject),
});

type ReceiptFieldType = z.infer<typeof ReceiptFieldObject>;

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
                  items: receipt['potential_matches'] ?? [],
                },
              };
            })
          : [{ name: '', quantity: '0', price: '0.0', suggested: { display: false, items: [] } }],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: 'receipts',
  });

  // this function handles the submission of the form
  const submitReceipts: SubmitHandler<ReceiptFieldType> = (receiptResponse) => {
    // console.log(receiptResponse);
    // actual submit logic will be added later
  };

  // these functions change individual fields in the form
  const removeField = (index: number) => {
    remove(index);
  };

  const updateField = (index: number, watch: any, fields: any) => {
    update(index, {
      name: watch(`receipts.${index}.name`),
      quantity: watch(`receipts.${index}.quantity`),
      price: watch(`receipts.${index}.price`),
      suggested: {
        display: !fields[index].suggested.display,
        items: watch(`receipts.${index}.suggested.items`),
      },
    });
  };

  const appendField = () => {
    append({
      name: '',
      quantity: '0',
      price: '0.0',
      suggested: { display: false, items: [] },
    });
  };

  return (
    <Stack
      width="100%"
      height="100%"
      position="sticky"
      alignItems="flex-start"
      direction={{ base: 'column', md: 'row' }}
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

      <Card
        height="fit-content"
        position="sticky"
        top={0}
        paddingInline={6}
        paddingBlock={4}
        minWidth={{ base: '100%', md: '37%' }}
      >
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
