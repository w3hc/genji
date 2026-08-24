'use client'

import { NumberInput as ChakraNumberInput } from '@chakra-ui/react'
import { forwardRef } from 'react'

const NumberInputField = forwardRef<HTMLInputElement, any>((props, ref) => {
  return (
    <ChakraNumberInput.Input
      ref={ref}
      pl={3}
      pr={3}
      py={2}
      bg="gray.900"
      borderColor="gray.600"
      borderWidth="1px"
      _hover={{ borderColor: 'gray.500' }}
      _focus={{
        borderColor: '#45a2f8',
        boxShadow: '0 0 0 1px #45a2f8',
        bg: 'gray.800',
      }}
      _placeholder={{ color: 'gray.500' }}
      {...props}
    />
  )
})

NumberInputField.displayName = 'NumberInputField'

export const NumberInput = {
  Root: ChakraNumberInput.Root,
  Label: ChakraNumberInput.Label,
  Field: NumberInputField,
  Control: ChakraNumberInput.Control,
  IncrementTrigger: ChakraNumberInput.IncrementTrigger,
  DecrementTrigger: ChakraNumberInput.DecrementTrigger,
  Scrubber: ChakraNumberInput.Scrubber,
  ValueText: ChakraNumberInput.ValueText,
}
