'use client'

import { IconButton as ChakraIconButton } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const IconButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof ChakraIconButton>
>((props, ref) => {
  const minPadding = 2
  const paddingX = props.px !== undefined ? Math.max(Number(props.px), minPadding) : minPadding

  return <ChakraIconButton ref={ref} {...props} px={paddingX} />
})

IconButton.displayName = 'IconButton'
