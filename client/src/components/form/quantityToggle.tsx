import { Button, HStack, NumberInput, NumberInputField, NumberInputFieldProps, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'
import React from 'react'

interface QuantityToggleProps extends NumberInputFieldProps {
  props?: any
}

const QuantityToggle: React.FC<QuantityToggleProps> = ({ props }) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 0,
  })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <NumberInput { ...props }>
      <NumberInputField { ...props } {...input} />
      <NumberInputStepper>
        <NumberIncrementStepper {...inc} />
        <NumberDecrementStepper {...dec} />
      </NumberInputStepper>
    </NumberInput>
  )
}

export default QuantityToggle