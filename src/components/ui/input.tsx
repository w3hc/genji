'use client'

import { Input as ChakraInput } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, React.ComponentProps<typeof ChakraInput>>(
  (props, ref) => {
    return (
      <ChakraInput
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
  }
)

Input.displayName = 'Input'
