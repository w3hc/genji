import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { brandColors } from '@/theme'
import Link from 'next/link'

export default function NotFound() {
  return (
    <VStack gap={6} align="center" justify="center" minH="60vh" px={4} py={20}>
      <Box textAlign="center">
        <Heading size="2xl" mb={4}>
          404
        </Heading>
        <Heading size="xl" mb={4} color="gray.400">
          Page Not Found
        </Heading>
        <Text fontSize="lg" color="gray.500" mb={6}>
          The page you&apos;re looking for doesn&apos;t exist.
        </Text>
      </Box>

      <Link href="/">
        <Button
          bg={brandColors.primary}
          color="white"
          _hover={{ bg: brandColors.secondary }}
          size="lg"
        >
          Return Home
        </Button>
      </Link>
    </VStack>
  )
}
