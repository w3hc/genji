'use client'

import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import Link from 'next/link'

export default function SubscribePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { address, isConnected } = useAppKitAccount()
  const toast = useToast()

  const handleSubscribe = async () => {
    if (!isConnected) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      // Call the API route to create a Stripe checkout session
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Subscription error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start subscription',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={20}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            Subscribe to Genji
          </Heading>
          <Text fontSize="lg" color="gray.400">
            Get unlimited access to premium features
          </Text>
        </Box>

        <Card borderWidth="1px" borderRadius="lg" overflow="hidden" variant="elevated">
          <CardHeader bg="purple.700" py={4}>
            <Heading size="md" textAlign="center">
              Monthly Subscription
            </Heading>
          </CardHeader>
          <CardBody py={6}>
            <VStack spacing={4} align="center">
              <Heading as="h3" size="2xl">
                $1{' '}
                <Text as="span" fontSize="md" color="gray.400">
                  /month
                </Text>
              </Heading>
              <Text>Access to all Genji features</Text>
              <Text>Premium support</Text>
              <Text>Early access to new updates</Text>
            </VStack>
          </CardBody>
          <CardFooter justifyContent="center" bg="gray.800" py={6}>
            <Button
              colorScheme="purple"
              onClick={handleSubscribe}
              isLoading={isLoading}
              loadingText="Connecting to Stripe..."
              size="lg"
              width={['full', 'auto']}
            >
              Subscribe
            </Button>
          </CardFooter>
        </Card>

        <Box textAlign="center" mt={4}>
          <Link href="/" style={{ color: '#45a2f8', textDecoration: 'underline' }}>
            Back to Home
          </Link>
        </Box>
      </VStack>
    </Container>
  )
}
