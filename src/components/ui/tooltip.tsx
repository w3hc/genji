'use client'

import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface TooltipProps {
  children?: React.ReactNode
  content?: React.ReactNode
  showArrow?: boolean
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  disabled?: boolean
  positioning?: any
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  const { showArrow, children, portalled = true, content, disabled, portalRef, ...rest } = props

  if (disabled) return <>{children}</>

  return (
    <ChakraTooltip.Root {...rest} positioning={{ ...rest.positioning }} disabled={disabled}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content ref={ref}>
            {showArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  )
})

Tooltip.displayName = 'Tooltip'
