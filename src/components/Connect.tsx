'use client'

import { Box, Button } from '@chakra-ui/react'
import { useAppKit } from '@reown/appkit/react'

export default function Connect() {
  const { open } = useAppKit()

  const handleConnect = () => {
    open({ view: 'Connect' })
  }

  return (
    <Box>
      <Button colorScheme="blue" onClick={handleConnect} size="sm">
        Login
      </Button>
    </Box>
  )
}
