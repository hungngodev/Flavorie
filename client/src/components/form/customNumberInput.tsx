import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
} from '@chakra-ui/react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface CustomNumberInputProps<T extends FieldValues> extends NumberInputProps {
  controllerProps: ControllerRenderProps<T, any>;
}

const CustomNumberInput: React.FC<CustomNumberInputProps<any>> = ({ controllerProps, ...props }) => {
  return (
    <NumberInput {...controllerProps} {...props}>
      <NumberInputField {...controllerProps} />
      <NumberInputStepper>
        <NumberIncrementStepper border="none" />
        <NumberDecrementStepper border="none" />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default CustomNumberInput;
