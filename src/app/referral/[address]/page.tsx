'use client'

import {
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Box,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { useAppKit } from '@reown/appkit/react'
import { useAppKitAccount } from '@reown/appkit/react'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'

export default function ReferralLandingPage() {
  const params = useParams()
  const router = useRouter()
  const referrerAddress = params.address as string
  const [isLoading, setIsLoading] = useState(false)

  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()
  const toast = useToast()
  const t = useTranslation()

  // Function to check if user is already registered
  const checkIfAlreadyRegistered = async () => {
    if (!address || !referrerAddress) return false

    try {
      const response = await fetch(`/api/referral/check?address=${address}`, {
        method: 'GET',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check referral status')
      }

      if (data.isRegistered) {
        toast({
          title: 'Already Registered',
          description: `Your wallet is already registered with a referrer`,
          status: 'info',
          duration: 5000,
          isClosable: true,
        })
      }

      return data.isRegistered
    } catch (error) {
      console.error('Referral check error:', error)
      return false
    }
  }

  // Function to register the referral on the blockchain
  const registerReferralOnChain = async () => {
    if (!address || !referrerAddress) return false

    // Check if user is trying to refer themselves
    if (address.toLowerCase() === referrerAddress.toLowerCase()) {
      toast({
        title: 'Self Referral Not Allowed',
        description: 'You cannot invite yourself',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
      return false
    }

    // First check if the user is already registered
    const isAlreadyRegistered = await checkIfAlreadyRegistered()
    if (isAlreadyRegistered) {
      return false
    }

    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referrer: referrerAddress,
          referee: address,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register referral on chain')
      }

      toast({
        title: 'Referral Registered on Chain',
        description: `Transaction Hash: ${data.txHash.substring(0, 10)}...`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Redirect to the main referral page after successful registration
      setTimeout(() => {
        router.push('/referral')
      }, 2000)

      return true
    } catch (error) {
      console.error('Referral registration error:', error)
      toast({
        title: t.common.error,
        description:
          error instanceof Error ? error.message : 'Failed to register referral on chain',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return false
    }
  }

  // Function to handle connect with referral
  const handleConnectWithReferral = async () => {
    try {
      setIsLoading(true)
      // Store the referrer address in localStorage
      localStorage.setItem('referrer', referrerAddress)

      // Open the connect modal
      open({ view: 'Connect' })

      toast({
        title: 'Referral Applied',
        description: `Connected with referral from ${referrerAddress.substring(0, 6)}...${referrerAddress.substring(38)}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Try to register the referral after connection
      if (address) {
        await registerReferralOnChain()
      }
    } catch (error) {
      console.error('Connection error:', error)
      toast({
        title: t.common.error,
        description: 'Failed to connect with referral',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Try to register when the user connects their wallet
  useEffect(() => {
    const attemptRegistration = async () => {
      if (isConnected && address && referrerAddress) {
        await registerReferralOnChain()
      }
    }

    attemptRegistration()
  }, [isConnected, address])

  // Check if the address is valid
  const isValidAddress =
    referrerAddress && referrerAddress.startsWith('0x') && referrerAddress.length === 42

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" mb={2}>
          Welcome to Genji!
        </Heading>

        {isValidAddress ? (
          <>
            <Text fontSize="lg">
              You&apos;ve been invited by{' '}
              <Text as="span" fontWeight="bold" color="blue.400">
                {`${referrerAddress.substring(0, 6)}...${referrerAddress.substring(38)}`}
              </Text>
            </Text>

            <Alert status="info" borderRadius="md">
              <AlertIcon />
              Connect with this referral link to get started
            </Alert>

            {!isConnected ? (
              <Button
                onClick={handleConnectWithReferral}
                isLoading={isLoading}
                loadingText="Connecting..."
                colorScheme="blue"
                size="lg"
                width={['full', 'auto']}
                mt={4}
              >
                Connect Wallet with Referral
              </Button>
            ) : (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                You&apos;re connected! Your referral relationship has been registered.
              </Alert>
            )}
          </>
        ) : (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            Invalid referral link. The address format is incorrect.
          </Alert>
        )}

        <Box mt={6}>
          <Link href="/" style={{ color: '#45a2f8', textDecoration: 'underline' }}>
            Go to Home
          </Link>
        </Box>
      </VStack>
    </Container>
  )
}
