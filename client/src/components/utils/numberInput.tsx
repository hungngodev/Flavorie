import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  ResponsiveValue,
} from '@chakra-ui/react';
import React from 'react';

interface NumberInputProps extends React.ComponentPropsWithRef<'input'> {
  defaultValue?: number;
  maxValue?: number;
  minValue?: number;
  stepValue?: number;
  precisionValue?: number;
  inputSize?: ResponsiveValue<string> | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  allowScroll?: boolean;
  errorText?: string;
  helperText?: string;
  isValid?: boolean;
  isDisabled?: boolean;
  focusColor?: string;
  errorColor?: string;
}

const InputNumber = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      defaultValue,
      maxValue,
      minValue,
      stepValue,
      precisionValue,
      onChange,
      onFocus,
      inputSize,
      allowScroll,
      errorText = 'Input invalid',
      helperText,
      isValid = true,
      isDisabled,
      focusColor,
      errorColor,
    },
    forwardedRef,
  ) => {
    return (
      <FormControl isInvalid={!isValid} isDisabled={isDisabled}>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        <NumberInput
          allowMouseWheel={allowScroll}
          step={stepValue}
          precision={precisionValue}
          defaultValue={defaultValue ?? 0}
          min={minValue}
          max={maxValue}
          size={inputSize}
          isInvalid={!isValid}
          isDisabled={isDisabled}
          focusBorderColor={focusColor ?? 'green.400'}
          errorBorderColor={errorColor ?? 'red.400'}
        >
          <NumberInputField onChange={onChange} onFocus={onFocus} ref={forwardedRef} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        {errorText && <FormErrorMessage>{errorText}</FormErrorMessage>}
      </FormControl>
    );
  },
);

export default InputNumber;
