'use client'

import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <Container maxW="container.sm" py={20}>
      <VStack spacing={8} align="stretch" textAlign="center">
        <Heading as="h1" size="xl">
          Subscription Successful!
        </Heading>

        <Alert
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius="md"
          py={6}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={2} fontSize="lg">
            Thank you for subscribing to Genji
          </AlertTitle>
          <Text>Your subscription is now active and you have access to all premium features.</Text>
          {sessionId && (
            <Text mt={2} fontSize="sm" color="gray.500">
              Session ID: {sessionId}
            </Text>
          )}
        </Alert>

        <Box>
          <Link href="/" passHref>
            <Button colorScheme="blue" size="lg">
              Return to Home
            </Button>
          </Link>
        </Box>
      </VStack>
    </Container>
  )
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <Container maxW="container.sm" py={20}>
          <VStack spacing={8} align="stretch" textAlign="center">
            <Heading as="h1" size="xl">
              Loading...
            </Heading>
          </VStack>
        </Container>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
