'use client'

import { useEffect } from 'react'
import { Box, Heading, Text, VStack, Code } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { brandColors } from '@/theme'
import Link from 'next/link'

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Settings page error:', error)
  }, [error])

  return (
    <VStack gap={6} align="center" justify="center" minH="60vh" px={4} py={20}>
      <Box textAlign="center">
        <Heading size="xl" mb={4} color="orange.400">
          Settings Error
        </Heading>
        <Text fontSize="lg" color="gray.400" mb={6}>
          We encountered an error while loading your settings.
        </Text>
      </Box>

      {error.message && (
        <Box
          bg="orange.900/20"
          border="1px solid"
          borderColor="orange.700"
          p={4}
          borderRadius="md"
          maxW="600px"
          w="full"
        >
          <Text fontSize="sm" fontWeight="bold" color="orange.300" mb={2}>
            Error Details:
          </Text>
          <Code
            display="block"
            whiteSpace="pre-wrap"
            p={3}
            borderRadius="md"
            bg="orange.950"
            color="orange.200"
            fontSize="xs"
          >
            {error.message}
          </Code>
        </Box>
      )}

      <VStack gap={3}>
        <Button
          bg={brandColors.primary}
          color="white"
          _hover={{ bg: brandColors.secondary }}
          onClick={reset}
          size="lg"
        >
          Try Again
        </Button>

        <Link href="/">
          <Button variant="ghost" size="lg">
            Return to Home
          </Button>
        </Link>
      </VStack>
    </VStack>
  )
}
