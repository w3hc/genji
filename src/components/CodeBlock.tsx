import { Box } from '@chakra-ui/react'
import { type ReactNode } from 'react'

interface CodeBlockProps {
  children: ReactNode
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <Box
      as="pre"
      margin={0}
      whiteSpace="pre-wrap"
      fontFamily="monospace"
      fontSize="xs"
      overflowX="auto"
    >
      {children}
    </Box>
  )
}
