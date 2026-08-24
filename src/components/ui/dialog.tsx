'use client'

import { Dialog as ChakraDialog, Portal } from '@chakra-ui/react'
import { forwardRef } from 'react'

const DialogContent = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <ChakraDialog.Content
      ref={ref}
      p={{ base: 4, md: 6 }}
      m={{ base: 4, md: 6 }}
      maxW={{ base: 'calc(100vw - 2rem)', md: 'md' }}
      borderRadius="lg"
      boxShadow="xl"
      {...props}
    />
  )
})

DialogContent.displayName = 'DialogContent'

const DialogPositioner = forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <ChakraDialog.Positioner
      ref={ref}
      display="flex"
      alignItems={{ base: 'flex-start', md: 'center' }}
      justifyContent="center"
      pt={{ base: '20vh', md: 0 }}
      {...props}
    />
  )
})

DialogPositioner.displayName = 'DialogPositioner'

export const Dialog = {
  Root: ChakraDialog.Root,
  Trigger: ChakraDialog.Trigger,
  Backdrop: ChakraDialog.Backdrop,
  Positioner: DialogPositioner,
  Content: DialogContent,
  Header: ChakraDialog.Header,
  Title: ChakraDialog.Title,
  Description: ChakraDialog.Description,
  Body: ChakraDialog.Body,
  Footer: ChakraDialog.Footer,
  CloseTrigger: ChakraDialog.CloseTrigger,
  ActionTrigger: ChakraDialog.ActionTrigger,
}

export { Portal }
