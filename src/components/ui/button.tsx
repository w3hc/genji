'use client'

import { Button as ChakraButton, Spinner as ChakraSpinner } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const Button = forwardRef<HTMLButtonElement, React.ComponentProps<typeof ChakraButton>>(
  (props, ref) => {
    const minPadding = 6
    const paddingX = props.px !== undefined ? Math.max(Number(props.px), minPadding) : minPadding

    // Use custom spinner with proper size
    const spinner = props.spinner || <ChakraSpinner size="sm" />

    return <ChakraButton ref={ref} {...props} px={paddingX} spinner={spinner} />
  }
)

Button.displayName = 'Button'
