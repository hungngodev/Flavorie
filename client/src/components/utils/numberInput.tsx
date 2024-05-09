import {
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
}

const TextInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ defaultValue, maxValue, minValue, stepValue, precisionValue, onChange, onFocus, size }, forwardedRef) => {
    return (
      <NumberInput
        step={stepValue}
        precision={precisionValue}
        defaultValue={defaultValue ?? 0}
        min={minValue}
        max={maxValue}
      >
        <NumberInputField onChange={onChange} onFocus={onFocus} ref={forwardedRef} size={size} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    );
  },
);

export default TextInput;
