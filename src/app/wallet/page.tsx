'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  VStack,
  Text,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Divider,
} from '@chakra-ui/react'
import { Wallet, verifyMessage } from 'ethers'
import { useTranslation } from '@/hooks/useTranslation'

interface WalletData {
  id: number
  address: string
  encryptedPrivateKey: {
    encrypted: number[]
    key: number[]
    iv: number[]
  }
}

interface EncryptedData {
  encrypted: number[]
  key: number[]
  iv: number[]
}

// Inspired by https://x.com/binji_x/status/1893898311117009094
const SecureMessageSigner: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [message, setMessage] = useState<string>('')
  const [signature, setSignature] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [db, setDb] = useState<IDBDatabase | null>(null)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const toast = useToast()
  const t = useTranslation()

  // Initialize IndexedDB
  useEffect(() => {
    const request: IDBOpenDBRequest = indexedDB.open('WalletDB', 1)

    request.onerror = (event: Event) => {
      const target = event.target as IDBOpenDBRequest
      setError(target.error?.message || 'Failed to open database')
      setLoading(false)
    }

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const target = event.target as IDBOpenDBRequest
      const db = target.result
      if (!db.objectStoreNames.contains('wallets')) {
        db.createObjectStore('wallets', { keyPath: 'id' })
      }
    }

    request.onsuccess = (event: Event) => {
      const target = event.target as IDBOpenDBRequest
      setDb(target.result)
      checkWalletExists(target.result)
    }
  }, [])

  // Encrypt private key
  const encryptPrivateKey = async (privateKey: string): Promise<EncryptedData> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(privateKey)

    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
      'encrypt',
      'decrypt',
    ])

    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)

    const exportedKey = await crypto.subtle.exportKey('raw', key)

    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      key: Array.from(new Uint8Array(exportedKey)),
      iv: Array.from(iv),
    }
  }

  // Decrypt private key
  const decryptPrivateKey = async (encryptedData: EncryptedData): Promise<string> => {
    const key = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(encryptedData.key),
      'AES-GCM',
      false,
      ['decrypt']
    )

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      key,
      new Uint8Array(encryptedData.encrypted)
    )

    return new TextDecoder().decode(decrypted)
  }

  // Check if wallet exists
  const flushDatabase = async () => {
    if (!db) {
      toast({
        title: 'Error',
        description: 'Database not initialized',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    try {
      setLoading(true)
      const transaction = db.transaction(['wallets'], 'readwrite')
      const store = transaction.objectStore('wallets')
      await store.clear()
      setWallet(null)
      setSignature('')
      setMessage('')

      toast({
        title: 'Success',
        description: 'Database cleared successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear database'
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const checkWalletExists = async (database: IDBDatabase) => {
    try {
      const transaction = database.transaction(['wallets'], 'readonly')
      const store = transaction.objectStore('wallets')
      const request = store.count()

      request.onsuccess = () => {
        if (request.result > 0) {
          const getRequest = store.get(1) // Get wallet with id 1
          getRequest.onsuccess = (event: Event) => {
            const target = event.target as IDBRequest
            const walletData = target.result as WalletData
            if (walletData) {
              setWallet(walletData)
            }
            setLoading(false)
          }
        } else {
          setLoading(false)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check wallet')
      setLoading(false)
    }
  }

  // Generate new wallet using ethers
  const generateWallet = () => {
    const newWallet = Wallet.createRandom()
    return {
      privateKey: newWallet.privateKey,
      address: newWallet.address,
    }
  }

  // Store wallet
  const createAndStoreWallet = async () => {
    if (!db) {
      toast({
        title: 'Error',
        description: 'Database not initialized',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    try {
      setError('')
      setLoading(true)
      setSignature('') // Clear existing signature when regenerating wallet

      const newWallet = generateWallet()
      const encryptedPrivateKey = await encryptPrivateKey(newWallet.privateKey)

      // Use a single transaction for both operations
      const transaction = db.transaction(['wallets'], 'readwrite')
      const store = transaction.objectStore('wallets')

      // Clear existing wallets
      store.clear()

      // Create wallet data object with all required fields
      const walletData = {
        address: newWallet.address,
        encryptedPrivateKey,
        id: 1, // Adding a consistent ID as the key path
      }

      // Add new wallet
      const request = store.add(walletData)

      request.onsuccess = () => {
        setWallet({
          id: 1,
          address: newWallet.address,
          encryptedPrivateKey,
        })
        toast({
          title: 'Success',
          description: 'New Ethereum wallet created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setLoading(false)
      }

      request.onerror = () => {
        throw new Error('Failed to store wallet')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false)
    }
  }

  // Sign message using ethers
  const signMessage = async () => {
    if (!wallet || !message) return

    try {
      setError('')
      setLoading(true)

      const privateKey = await decryptPrivateKey(wallet.encryptedPrivateKey)
      const signingWallet = new Wallet(privateKey)

      // Sign the message using ethers
      const signature = await signingWallet.signMessage(message)
      setSignature(signature)

      toast({
        title: 'Success',
        description: 'Message signed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign message'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  // Verify signature
  const verifySignature = async () => {
    if (!wallet || !message || !signature) return

    try {
      setIsVerifying(true)
      setError('')

      // Use ethers to verify the signature
      const recoveredAddress = await verifyMessage(message, signature)

      if (recoveredAddress.toLowerCase() === wallet.address.toLowerCase()) {
        toast({
          title: 'Verification Successful',
          description: 'Signature is valid and matches the current wallet address',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Verification Failed',
          description: 'Signature does not match the current wallet address',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify signature'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsVerifying(false)
    }
  }

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>{t.common.error}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!wallet ? (
          <VStack spacing={4}>
            <Alert status="info">
              <AlertIcon />
              <Box>
                <AlertTitle>{t.wallet.noWalletFound}</AlertTitle>
                <AlertDescription>{t.wallet.description}</AlertDescription>
              </Box>
            </Alert>

            <Button
              colorScheme="blue"
              onClick={createAndStoreWallet}
              isLoading={loading}
              loadingText={t.common.loading}
              width="full"
            >
              {t.wallet.createWallet}
            </Button>
          </VStack>
        ) : (
          <VStack spacing={6}>
            <Card width="full">
              <CardHeader>
                <HStack justify="space-between" align="center">
                  <Text fontWeight="bold">{t.wallet.yourAddress}</Text>
                  <HStack spacing={2}>
                    <Button
                      colorScheme="red"
                      onClick={flushDatabase}
                      isLoading={loading}
                      loadingText={t.common.loading}
                      size="sm"
                      variant="outline"
                    >
                      {t.wallet.flushDb}
                    </Button>
                    <Button
                      colorScheme="purple"
                      onClick={createAndStoreWallet}
                      isLoading={loading}
                      loadingText={t.common.loading}
                      size="sm"
                    >
                      {t.wallet.regenerateWallet}
                    </Button>
                  </HStack>
                </HStack>
              </CardHeader>
              <CardBody>
                <Box p={4} bg="gray.800" borderRadius="md" border="1px" borderColor="gray.600">
                  <Text fontFamily="mono" fontSize="md" color="green.300" wordBreak="break-all">
                    {wallet.address}
                  </Text>
                </Box>
              </CardBody>
            </Card>

            <Box width="full">
              <Text mb={2} fontWeight="medium">
                {t.wallet.messageToSign}
              </Text>
              <Textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t.wallet.enterMessage}
                size="md"
                minH="100px"
              />
            </Box>

            <Button
              colorScheme="blue"
              onClick={signMessage}
              isDisabled={!message || loading}
              isLoading={loading}
              loadingText={t.common.loading}
              width="full"
            >
              {t.wallet.signMessage}
            </Button>

            {signature && (
              <Card width="full">
                <CardHeader>
                  <Text fontWeight="bold">{t.wallet.signature}</Text>
                </CardHeader>
                <CardBody>
                  <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">
                    {signature}
                  </Text>
                  <Divider my={4} />
                  <Button
                    colorScheme="green"
                    onClick={verifySignature}
                    isLoading={isVerifying}
                    loadingText={t.common.loading}
                    size="sm"
                    width="full"
                  >
                    {t.wallet.verifySignature}
                  </Button>
                </CardBody>
              </Card>
            )}
          </VStack>
        )}
      </VStack>
    </Container>
  )
}

export default SecureMessageSigner
