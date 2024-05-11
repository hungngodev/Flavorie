import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  ResponsiveValue,
  Stack,
  StyleProps,
  Text,
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
  isInvalid?: boolean;
  isDisabled?: boolean;
  focusColor?: string;
  errorColor?: string;
  props?: StyleProps;
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
      isInvalid = false,
      isDisabled,
      focusColor,
      errorColor,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <Stack direction="column" width={props['width'] ?? 'full'}>
        {helperText && <Text color="gray.500">{helperText}</Text>}
        <NumberInput
          allowMouseWheel={allowScroll}
          step={stepValue}
          precision={precisionValue}
          defaultValue={defaultValue ?? 0}
          min={minValue}
          max={maxValue}
          size={inputSize}
          isInvalid={isInvalid}
          isDisabled={isDisabled}
          focusBorderColor={focusColor ?? 'green.400'}
          errorBorderColor={errorColor ?? 'red.400'}
          color={props['color']}
          width="full"
          display="flex"
          flexDirection="column"
        >
          <NumberInputField onChange={onChange} onFocus={onFocus} ref={forwardedRef} {...props} />
          <NumberInputStepper>
            <NumberIncrementStepper color={props['color']} />
            <NumberDecrementStepper color={props['color']} />
          </NumberInputStepper>
        </NumberInput>
        {isInvalid && <Text color="red.500">{errorText}</Text>}
      </Stack>
    );
  },
);

export default InputNumber;
