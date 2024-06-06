import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import React from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface CustomInputProps<T extends FieldValues> extends InputProps {
  isInValid?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  fieldProps: ControllerRenderProps<T, any>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerProps?: FormControlProps;
  control?: React.ReactNode;
}

const CustomTextInput: React.ForwardRefRenderFunction<HTMLInputElement, CustomInputProps<FieldValues>> = (
  { label, helperText, errorText, isInValid, leftIcon, rightIcon, containerProps, control, ...props },
  forwardedRef,
) => {
  return (
    <FormControl isInvalid={isInValid} {...containerProps}>
      <HStack width="100%" justifyContent="space-between" align="center">
        <FormLabel>{label}</FormLabel>
        {control}
      </HStack>
      <FormHelperText>{helperText}</FormHelperText>
      <InputGroup>
        {leftIcon && <InputLeftElement pointerEvents="none" children={leftIcon} />}
        <Input ref={forwardedRef} {...props} type={props.type ?? 'text'} variant={props.variant ?? 'outline'} />
        {rightIcon && <InputRightElement pointerEvents="none" children={rightIcon} />}
      </InputGroup>
      <FormErrorMessage>{errorText}</FormErrorMessage>
    </FormControl>
  );
};

export default React.forwardRef(CustomTextInput);
