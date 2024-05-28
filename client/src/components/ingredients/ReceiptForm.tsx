import { Button, Card, CardBody, CardFooter, CardHeader, Heading } from '@chakra-ui/react';
import React from 'react';
import { ArrayPath, Control, FieldArrayWithId, SubmitHandler, UseFormWatch } from 'react-hook-form';
import { ZodType, z } from 'zod';

export interface FieldComponentProps<T extends ZodType<any, any, any>> {
  control: Control<z.infer<T>, any>;
  fields: FieldArrayWithId<z.infer<T>, ArrayPath<T>, 'id'>[];
  submit: SubmitHandler<z.infer<T>>;
  watch: UseFormWatch<z.infer<T>>;
  remove: (arg?: any) => void;
  update: (watch: UseFormWatch<z.infer<T>>, index: number) => void;
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
    <Card flex={4}>
      <CardHeader>
        <Heading fontSize="3xl" color="teal" fontWeight="semibold" alignSelf="start">
          Receipts
        </Heading>
      </CardHeader>
      <CardBody paddingInline={8}>
        <form onSubmit={submit}>
          {fields.map((field, index) => (
            <FieldComponent
              field={field}
              key={index}
              fields={fields}
              index={index}
              control={control}
              submit={submit}
              remove={remove}
              update={update}
              append={append}
              watch={watch}
            />
          ))}
        </form>
      </CardBody>
      <CardFooter>
        <Button
          colorScheme="teal"
          letterSpacing="-0.005em"
          fontWeight="semibold"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            append();
          }}
        >
          Add new receipt
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ReceiptForm;
