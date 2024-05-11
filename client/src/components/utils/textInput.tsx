import {
  FormControlProps,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ResponsiveValue,
  Text,
} from '@chakra-ui/react';
import React from 'react';

interface TextInputProps extends React.ComponentPropsWithRef<'input'> {
  name?: string;
  id?: string;
  inputStyle?: 'outline' | 'unstyled' | 'flushed' | 'filled';
  inputType?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  inputSize?: ResponsiveValue<string> | undefined;
  placeHolder?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
  focusColor?: string;
  errorColor?: string;
  helperText?: string;
  errorText?: string;
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
      leftElement,
      rightElement,
      onChange,
      onFocus,
      focusColor,
      errorColor,
      isInvalid = false,
      isDisabled,
      errorText,
      helperText,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <InputGroup display="flex" flexDirection="column" gap={2}>
        {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
        {helperText && <Text color="gray.500">{helperText}</Text>}
        <Input
          isInvalid={isInvalid}
          {...props}
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
        />
        {isInvalid && (
          <Text fontWeight={600} color="red.400">
            {errorText ?? 'Invalid input'}
          </Text>
        )}
      </InputGroup>
    );
  },
);

export default TextInput;
