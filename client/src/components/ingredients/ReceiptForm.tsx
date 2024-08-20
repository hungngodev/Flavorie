import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { ArrayPath, Control, FieldArrayWithId, SubmitHandler, UseFormWatch } from 'react-hook-form';
import { ZodType, z } from 'zod';

export interface FieldComponentProps<T extends ZodType<any, any, any>> {
    control: Control<z.infer<T>, any>; // link the input component to the form
    fields: FieldArrayWithId<z.infer<T>, ArrayPath<T>, 'id'>[]; // array of field objects (include id and actual values)
    submit: SubmitHandler<z.infer<T>>;
    watch: UseFormWatch<z.infer<T>>;
    remove: (arg?: any) => void;
    update: (
        // index: number,
        // watch?: UseFormWatch<z.infer<T>>,
        // fields?: FieldArrayWithId<z.infer<T>, ArrayPath<T>, 'id'>[],
        ...args: any
    ) => void;
    append: (arg?: any) => void;
}

export interface ReceiptFormProps<T extends ZodType<any, any, any>> extends FieldComponentProps<T> {
    FieldComponent: React.ComponentType<any>;
}

function ReceiptForm<T extends ZodType<any, any, any>>({
    control,
    fields,
    FieldComponent,
    submit,
    remove,
    update,
    append,
    watch,
}: ReceiptFormProps<T>): React.ReactNode {
    return (
        <Card flex={4} border="none" boxShadow="none">
            <CardHeader>
                <Heading fontSize="3xl" color="teal" fontWeight="semibold" alignSelf="start">
                    Receipts
                </Heading>
                <Text color="blackAlpha.700">{`We found ${fields.length} matches for your ingredients`}</Text>
            </CardHeader>
            <CardBody paddingInline={8}>
                <form onSubmit={submit}>
                    {fields.map((field, index) => (
                        <FieldComponent
                            control={control}
                            fields={fields}
                            field={field}
                            index={index}
                            key={field.id}
                            submit={submit}
                            remove={remove}
                            update={update}
                            append={append}
                            watch={watch}
                        />
                    ))}
                    <Button type="submit">Submit</Button>
                </form>
            </CardBody>
            <CardFooter>
                <Button
                    colorScheme="teal"
                    letterSpacing="-0.005em"
                    fontWeight="semibold"
                    onClick={() => {
                        append();
                    }}
                >
                    Add new item
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ReceiptForm;
