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
import { Plus, Minus } from 'lucide-react';

interface CustomNumberInputProps<T extends FieldValues> extends NumberInputProps {
  inputFieldProps?: NumberInputFieldProps;
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
      <FormLabel color={props.color ?? "blackAlpha.600"}>{label}</FormLabel>
      <FormHelperText>{helperText}</FormHelperText>
      <NumberInput {...props} ref={forwardedRef} variant={props?.variant ?? "ghost"}
        display={props.display ?? "flex"}
        flexDirection={props.flexDirection ?? "row"}
        border={props.border ?? '2px'}
        borderColor={props.borderColor ?? 'gray.200'}
        borderRadius={props.borderRadius ?? "2.55em"}
        paddingX={props.paddingX ?? "0.5em"}
        size={props.size ?? "sm"}
        width={props.width ?? "min-content"}
        minWidth={props.minWidth ?? "8.5em"}>
        <NumberDecrementStepper border="none" children={<Minus />} />
        <NumberInputField {...inputFieldProps} value={props.value}
          textAlign="center"
          padding={inputFieldProps?.padding ?? 0}
          margin={inputFieldProps?.margin ?? 0}
          color={props.color ?? "blackAlpha.700"} />
        <NumberIncrementStepper border="none" children={<Plus />} />
      </NumberInput>
      <FormErrorMessage>{errorText}</FormErrorMessage>
    </FormControl>
  );
};

export default React.forwardRef(InputNumber);
