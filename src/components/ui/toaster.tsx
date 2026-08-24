'use client'

import { createToaster } from '@chakra-ui/react'
import {
  Toaster as ChakraToaster,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastCloseTrigger,
} from '@chakra-ui/react/toast'
import { Stack } from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'bottom',
  pauseOnPageIdle: true,
})

type ToastType = Parameters<Parameters<typeof ChakraToaster>[0]['children']>[0]

export const Toaster = () => {
  return (
    <ChakraToaster toaster={toaster}>
      {(toast: ToastType) => (
        <ToastRoot
          key={toast.id}
          width="auto"
          maxWidth="400px"
          minWidth="300px"
          py="3"
          px="4"
          fontSize="sm"
          borderRadius="md"
          boxShadow="lg"
        >
          <Stack gap="1" flex="1">
            {toast.title && (
              <ToastTitle fontWeight="medium" fontSize="sm">
                {toast.title}
              </ToastTitle>
            )}
            {toast.description && (
              <ToastDescription fontSize="sm" opacity="0.9">
                {toast.description}
              </ToastDescription>
            )}
          </Stack>
          <ToastCloseTrigger />
        </ToastRoot>
      )}
    </ChakraToaster>
  )
}
