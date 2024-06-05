import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputFieldProps,
  NumberInputProps,
  NumberInputStepper,
} from '@chakra-ui/react';
import React from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface CustomNumberInputProps<T extends FieldValues> extends NumberInputProps {
  inputFieldProps: NumberInputFieldProps;
  isInValid?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  fieldProps: ControllerRenderProps<T, any>;
}

const InputNumber: React.ForwardRefRenderFunction<HTMLInputElement, CustomNumberInputProps<FieldValues>> = (
  { label, helperText, errorText, isInValid, inputFieldProps, ...props },
  forwardedRef,
) => {
  return (
    <FormControl isInvalid={isInValid}>
      <FormLabel>{label}</FormLabel>
      <FormHelperText>{helperText}</FormHelperText>
      <NumberInput {...props} ref={forwardedRef}>
        <NumberInputField {...inputFieldProps} value={props.value} />
        <NumberInputStepper>
          <NumberIncrementStepper border="none" />
          <NumberDecrementStepper border="none" />
        </NumberInputStepper>
      </NumberInput>
      <FormErrorMessage>{errorText}</FormErrorMessage>
    </FormControl>
  );
};

export default React.forwardRef(InputNumber);
