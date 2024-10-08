/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { QueryClient, useQuery } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import { Focus } from 'lucide-react';
import { useEffect } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Params, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import scanning from '../assets/animations/scanning.json';
import ReceiptField from '../components/ingredients/ReceiptField';
import ReceiptForm from '../components/ingredients/ReceiptForm';
import { NotificationSchema } from '../contexts/NotificationContext';
import useToast from '../hooks/useToast';
import customFetch from '../utils/customFetch';

const receiptDetailQuery = (id: any) => {
    return {
        queryKey: ['receipt', id],
        queryFn: async () => {
            try {
                const response = await customFetch.get(`/user/notifications/${id}`, {
                    withCredentials: true,
                });

                const parsedData = NotificationSchema.safeParse(response.data.currNotification);
                if (parsedData.success) {
                    // setNotificationDetail(parsedData.data);
                    // localStorage.setItem('notificationDetail', JSON.stringify(parsedData.data.message.data));
                    return parsedData.data;
                } else {
                    return null;
                }
            } catch (error) {
                toast.error('Cannot find notification');
                console.log(error);
                return null;
            }
        },
    };
};
// export const scannedReceiptQuery = (id?: any) => {
//     return {
//         queryKey: ['scanned-receipt', id],
//         queryFn: async () => {
//             const receiptResponse = await customFetch.post('/scan-receipt', { id });
//             return receiptResponse;
//         },
//     };
// };

export const loader =
    (queryClient: QueryClient) =>
    async ({ param }: { param: Params }) => {
        queryClient.ensureQueryData(receiptDetailQuery(param));
    };

export const defaultImg =
    'https://img.freepik.com/free-photo/fried-chicken-breast-with-vegetables_140725-4650.jpg?t=st=1717211148~exp=1717214748~hmac=35aff48267e7d35f50f03fdd12473c2606c90b4f0a73eb45e2d4a51cfb44d0d8&w=740';

const ReceiptObject = z
    .object({
        id: z.string().optional(),
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
                    oid: z.coerce.string(),
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
    // _id: z.string(),
    message: z.object({
        title: z.string(),
        data: z.array(ReceiptObject),
    }),

    // message: z.string(),
    // data: z.array(ReceiptObject),
});

export type ReceiptFieldType = z.infer<typeof ReceiptFieldObject>;
export type ReceiptRequest = z.infer<typeof ReceiptRequest>;

const Receipt = () => {
    const { id } = useParams();

    const { data: notificationDetail, status } = useQuery(receiptDetailQuery(id));

    const { notifyError } = useToast();

    // useEffect(() => {
    //     if (id) {
    //         fetchNotificationById(id);
    //     }
    // }, [id]);

    // useEffect(() => {
    //     if (notificationDetail) {
    //         localStorage.setItem('notificationDetail', JSON.stringify(notificationDetail.message.data));
    //     }
    // }, [notificationDetail]);
    // console.log(notificationDetail);
    // console.log(status);
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        // reset,
    } = useForm<ReceiptFieldType>({
        resolver: zodResolver(ReceiptFieldObject),
        defaultValues: {
            receipts: [
                {
                    name: '',
                    image: defaultImg,
                    quantity: '0',
                    price: '0.0',
                    suggested: { display: false, items: [] },
                },
            ],
            //   notificationDetail
            // ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //   notificationDetail.message.data.map((receipt: any) => {
            //       return {
            //           id: receipt['potential_matches'][0]['potential_id'],
            //           name: receipt.name.toLowerCase(),
            //           quantity: receipt.quantity,
            //           image: receipt['potential_matches'][0]['potential_image'],
            //           price: receipt.price,
            //           suggested: {
            //               display: false,
            //               items: receipt['potential_matches'].map((item: any) => ({
            //                   name: item['potential_name'],
            //                   img: item['potential_image'],
            //                   oid: item['potential_id'],
            //               })),
            //           },
            //       };
            //   })
            // : [
            //       {
            //           name: '',
            //           image: defaultImg,
            //           quantity: '0',
            //           price: '0.0',
            //           suggested: { display: false, items: [] },
            //       },
            //   ],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: control,
        name: 'receipts',
    });

    window.onbeforeunload = () => {
        localStorage.setItem('receipts' + id, JSON.stringify(watch('receipts')));
    };
    useEffect(() => {
        if (status === 'success' && notificationDetail) {
            setValue(
                'receipts',
                localStorage.getItem('receipts' + id)
                    ? JSON.parse(localStorage.getItem('receipts' + id) || '')
                    : notificationDetail.message.data.map((receipt: any) => {
                          return {
                              id: receipt['potential_matches'][0]['potential_id'],
                              name: receipt.name.toLowerCase(),
                              quantity: receipt.quantity,
                              image: receipt['potential_matches'][0]['potential_image'],
                              price: receipt.price,
                              suggested: {
                                  display: false,
                                  items: receipt['potential_matches'].map((item: any) => ({
                                      name: item['potential_name'],
                                      img: item['potential_image'],
                                      oid: item['potential_id'],
                                  })),
                              },
                          };
                      }),
            );
        }
    }, [notificationDetail, status]);

    if (status !== 'success') {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Lottie animationData={scanning} style={{ width: '50%', height: '50%' }} />
            </div>
        );
    }
    const transformResponse = (data: ReceiptFieldType) => {
        return data.receipts.map((item) => ({
            itemId: item.id,
            quantity: Number(item.quantity),
            // status: 'leftOver'
            // unit: item.price,
        }));
    };

    // this function handles the submission of the form
    const submitReceipts: SubmitHandler<ReceiptFieldType> = async (receiptResponse) => {
        // localStorage.removeItem('notificationDetail');
        localStorage.removeItem('receipts' + id);
        console.log(receiptResponse);
        const transformData = transformResponse(receiptResponse);
        try {
            const response = await customFetch.patch('/user/leftOver', {
                leftOver: transformData,
            });
            if (response.status === 200) {
                toast.success('Receipt submitted successfully');
            } else {
                notifyError('Error submitting receipt. Please try again');
            }
        } catch (e) {
            console.log(e);
            notifyError('Error submitting receipt. Please try again');
        }
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
            quantity: '1',
            price: '1.0',
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
                FieldComponent={ReceiptField as React.ComponentType}
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
                                        const price = parseFloat(field.price);
                                        const quantity = parseFloat(field.quantity);
                                        if (!isNaN(price) && !isNaN(quantity)) {
                                            return accumulator + price * quantity;
                                        }
                                        return accumulator;
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
