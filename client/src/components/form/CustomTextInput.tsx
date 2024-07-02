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
  isError?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  fieldprops: Partial<ControllerRenderProps<T, any>>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerProps?: FormControlProps;
  control?: React.ReactNode;
}

const CustomTextInput: React.ForwardRefRenderFunction<HTMLInputElement, CustomInputProps<FieldValues>> = (
  { label, helperText, errorText, isError, leftIcon, rightIcon, containerProps, control, fieldprops, ...props },
  forwardedRef,
) => {
  return (
    <FormControl isInvalid={isError} {...containerProps}>
      <HStack width="100%" justifyContent="space-between" align="center" margin={0} padding={0}>
        <FormLabel fontSize="xl" color={props.color} margin={0} padding={0}>
          {label}
        </FormLabel>
        {control}
      </HStack>
      <FormHelperText>{helperText}</FormHelperText>
      <InputGroup>
        {leftIcon && <InputLeftElement pointerEvents="none" children={leftIcon} />}
        <Input
          {...props}
          type={props.type ?? 'text'}
          variant={props.variant ?? 'outline'}
          {...fieldprops}
          ref={fieldprops?.ref ?? forwardedRef}
        />
        {rightIcon && <InputRightElement pointerEvents="none" children={rightIcon} />}
      </InputGroup>
      <FormErrorMessage>{errorText}</FormErrorMessage>
    </FormControl>
  );
};

export default React.forwardRef(CustomTextInput);
