import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  HStack,
  Textarea,
  TextareaProps,
} from '@chakra-ui/react';
import React from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface CustomTextareaInput<T extends FieldValues> extends TextareaProps {
  isInValid?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  fieldProps: ControllerRenderProps<T, any>;
  containerProps?: FormControlProps;
  control?: React.ReactNode;
}

const CustomTextareaInput: React.ForwardRefRenderFunction<HTMLInputElement, CustomTextareaInput<FieldValues>> = (
  { label, helperText, errorText, isInValid, containerProps, control, fieldProps, ...props },
  forwardedRef,
) => {
  return (
    <FormControl isInvalid={isInValid} {...containerProps}>
      <HStack width="100%" justifyContent="space-between" align="center" margin={0} padding={0}>
        <FormLabel fontSize="xl" color={props.color} margin={0} padding={0}>
          {label}
        </FormLabel>
        {control}
      </HStack>
      <FormHelperText>{helperText}</FormHelperText>
      <Textarea {...fieldProps} ref={forwardedRef} {...props} variant={props.variant ?? 'outline'} />
      <FormErrorMessage>{errorText}</FormErrorMessage>
    </FormControl>
  );
};

export default React.forwardRef(CustomTextareaInput);
