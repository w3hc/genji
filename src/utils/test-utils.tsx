import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, RenderOptions } from '@testing-library/react'

// Create a custom render function that includes providers
const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return <ChakraProvider>{children}</ChakraProvider>
  }

  return render(ui, { wrapper: AllProviders, ...options })
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
