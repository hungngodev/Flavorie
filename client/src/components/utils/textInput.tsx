import { Input, InputGroup, InputLeftElement, InputRightElement, ResponsiveValue } from '@chakra-ui/react';
import React from 'react';

import { FormControl, FormErrorMessage, FormHelperText, VStack } from '@chakra-ui/react';
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
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      name,
      id,
      inputSize,
      inputStyle,
      inputType,
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
      space,
    },
    forwardedRef,
  ) => {
    return (
      <FormControl isInvalid={!isValid} isDisabled={isDisabled}>
        <InputGroup>
          <VStack spacing={space}>
            {leftElement && <InputLeftElement children={leftElement} />}
            {rightElement && <InputRightElement children={rightElement} />}
            <Input
              focusBorderColor={focusColor ?? 'green.500'}
              errorBorderColor={errorColor ?? 'red.500'}
              name={name}
              id={id}
              type={inputType ?? 'text'}
              size={inputSize ?? 'md'}
              variant={inputStyle ?? 'outline'}
              placeholder={placeHolder}
              onChange={onChange}
              onFocus={onFocus}
              ref={forwardedRef}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
            {!isValid && <FormErrorMessage>{errorText ?? 'Invalid input'}</FormErrorMessage>}
          </VStack>
        </InputGroup>
      </FormControl>
    );
  },
);

export default TextInput;
