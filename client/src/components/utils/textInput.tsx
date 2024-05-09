import {
  FormControlProps,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ResponsiveValue,
} from '@chakra-ui/react';
import React from 'react';

import { FormControl, FormErrorMessage, FormHelperText } from '@chakra-ui/react';

interface TextInputProps extends React.ComponentPropsWithRef<'input'> {
  name?: string;
  id?: string;
  inputStyle?: 'outline' | 'unstyled' | 'flushed' | 'filled';
  inputType?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  inputSize?: ResponsiveValue<string> | undefined;
  placeHolder?: string;
  errorText?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  isValid?: boolean;
  isDisabled?: boolean;
  focusColor?: string;
  errorColor?: string;
  space?:
    | ResponsiveValue<
        number | (string & {}) | '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset' | 'auto'
      >
    | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  props?: Omit<FormControlProps, 'isInvalid' | 'isDisabled' | 'size'>;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      name,
      id,
      inputSize,
      inputStyle = 'outline',
      inputType = 'text',
      placeHolder,
      errorText,
      helperText,
      leftElement,
      rightElement,
      onChange,
      onFocus,
      focusColor,
      errorColor,
      isValid = true,
      isDisabled,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <FormControl isInvalid={!isValid} isDisabled={isDisabled} {...props} size="auto">
        {helperText && <FormHelperText display="block">{helperText}</FormHelperText>}
        <InputGroup height="100%">
          {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
          {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
          <Input
            focusBorderColor={focusColor ?? 'green.500'}
            errorBorderColor={errorColor ?? 'red.500'}
            name={name}
            id={id}
            type={inputType ?? 'text'}
            size={inputSize}
            variant={inputStyle ?? 'outline'}
            placeholder={placeHolder}
            onChange={onChange}
            onFocus={onFocus}
            ref={forwardedRef}
            as="input"
            height={inputSize ? undefined : '100%'}
            width="100%"
          />
        </InputGroup>

        {!isValid && <FormErrorMessage display="block">{errorText ?? 'Invalid input'}</FormErrorMessage>}
      </FormControl>
    );
  },
);

export default TextInput;
