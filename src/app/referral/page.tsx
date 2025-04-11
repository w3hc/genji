'use client'

import {
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Box,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useAppKitAccount } from '@reown/appkit/react'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'
import Link from 'next/link'

export default function ReferralPage() {
  const [referralLink, setReferralLink] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { address, isConnected } = useAppKitAccount()
  const toast = useToast()
  const t = useTranslation()

  // Generate referral link when the user is connected
  const generateReferralLink = () => {
    if (!address) {
      toast({
        title: t.common.error,
        description: 'Please connect your wallet first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    // Create referral link with user's address
    const baseUrl = window.location.origin
    const newReferralLink = `${baseUrl}/referral/${address}`

    setTimeout(() => {
      setReferralLink(newReferralLink)
      setIsLoading(false)
    }, 800) // Small delay to show loading state
  }

  // Copy referral link to clipboard
  const copyToClipboard = () => {
    if (!referralLink) return

    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setCopied(true)
        toast({
          title: 'Copied!',
          description: 'Referral link copied to clipboard',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })

        // Reset copy icon after 2 seconds
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      })
      .catch(err => {
        toast({
          title: t.common.error,
          description: 'Failed to copy: ' + err,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      })
  }

  // Auto-detect user address when component mounts
  useEffect(() => {
    if (isConnected && address) {
      // You can auto-generate the link here if you want
      // Uncomment the next line to auto-generate on page load
      // generateReferralLink()
    }
  }, [isConnected, address])

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" mb={2}>
          Invite a friend
        </Heading>
        <Text fontSize="lg" color="gray.400" mb={6}>
          Create your personal referral link and share it with friends
        </Text>

        {!isConnected && (
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            Please connect your wallet to create a referral link
          </Alert>
        )}

        <Button
          onClick={generateReferralLink}
          isLoading={isLoading}
          loadingText="Generating..."
          colorScheme="blue"
          isDisabled={!isConnected}
          size="lg"
          width={['full', 'auto']}
        >
          Create referral link
        </Button>

        {referralLink && (
          <Box mt={4}>
            <Text mb={2} fontWeight="medium">
              Your referral link:
            </Text>
            <InputGroup size="md">
              <Input
                value={referralLink}
                isReadOnly
                pr="4.5rem"
                fontFamily="mono"
                bg="whiteAlpha.100"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={copyToClipboard}
                  aria-label="Copy to clipboard"
                >
                  {copied ? <CheckIcon color="green.500" /> : <CopyIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Text fontSize="sm" mt={2} color="gray.500">
              Share this link with friends to invite them to Genji
            </Text>
          </Box>
        )}

        <Box mt={6}>
          <Link href="/" style={{ color: '#45a2f8', textDecoration: 'underline' }}>
            Back to Home
          </Link>
        </Box>
      </VStack>
    </Container>
  )
}
