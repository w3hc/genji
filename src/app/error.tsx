'use client'

import { useEffect } from 'react'
import { Box, Heading, Text, VStack, Code } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { brandColors } from '@/theme'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <VStack gap={6} align="center" justify="center" minH="60vh" px={4}>
      <Box textAlign="center">
        <Heading size="xl" mb={4} color="red.400">
          Something went wrong!
        </Heading>
        <Text fontSize="lg" color="gray.400" mb={6}>
          We apologize for the inconvenience. An error occurred while processing your request.
        </Text>
      </Box>

      {error.message && (
        <Box
          bg="red.900/20"
          border="1px solid"
          borderColor="red.700"
          p={4}
          borderRadius="md"
          maxW="600px"
          w="full"
        >
          <Text fontSize="sm" fontWeight="bold" color="red.300" mb={2}>
            Error Details:
          </Text>
          <Code
            display="block"
            whiteSpace="pre-wrap"
            p={3}
            borderRadius="md"
            bg="red.950"
            color="red.200"
            fontSize="xs"
          >
            {error.message}
          </Code>
          {error.digest && (
            <Text fontSize="xs" color="gray.500" mt={2}>
              Error ID: {error.digest}
            </Text>
          )}
        </Box>
      )}

      <Button
        bg={brandColors.primary}
        color="white"
        _hover={{ bg: brandColors.secondary }}
        onClick={reset}
        size="lg"
      >
        Try Again
      </Button>

      <Text fontSize="sm" color="gray.500">
        If the problem persists, please refresh the page or{' '}
        <Text as="span" color={brandColors.accent} textDecoration="underline">
          contact support
        </Text>
        .
      </Text>
    </VStack>
  )
}
