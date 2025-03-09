'use client'

import { Container, Heading, Text, useToast, Button, Tooltip, Box, VStack } from '@chakra-ui/react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, parseEther, formatEther } from 'ethers'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function NewPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [balance, setBalance] = useState<string>('0')

  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const toast = useToast()
  const t = useTranslation()

  useEffect(() => {
    const checkBalance = async () => {
      if (address && walletProvider) {
        try {
          const provider = new BrowserProvider(walletProvider as any)
          const balance = await provider.getBalance(address)
          setBalance(formatEther(balance))
        } catch (error) {
          console.error('Error fetching balance:', error)
        }
      }
    }

    checkBalance()
  }, [address, walletProvider])

  const hasEnoughBalance = Number(balance) >= 0.0001

  return (
    <main>
      <Container maxW="container.sm" py={20}>
        <VStack spacing={6} align="stretch">
          <header>
            <Heading as="h1" size="xl" mb={2}>
              {t.newPage.title}
            </Heading>
            <Text fontSize="lg" color="gray.400">
              {t.newPage.subtitle}
            </Text>
          </header>

          <section aria-label={t.newPage.accountInfo}>
            {isConnected ? (
              <Box bg="whiteAlpha.100" p={4} borderRadius="md">
                <Text>
                  {t.newPage.connectedAddress} {address}
                </Text>
                <Text>
                  {t.newPage.balance} {parseFloat(balance).toFixed(4)} ETH
                </Text>
              </Box>
            ) : (
              <Text>{t.newPage.connectWallet}</Text>
            )}
          </section>

          <section aria-label="Transaction History">
            {txHash && (
              <Box bg="whiteAlpha.100" p={4} borderRadius="md">
                <Text fontSize="sm">
                  {t.newPage.lastTransaction}{' '}
                  <Link
                    href={txLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#45a2f8', textDecoration: 'underline' }}
                  >
                    {txHash}
                  </Link>
                </Text>
              </Box>
            )}
          </section>

          <nav aria-label="Main Navigation">
            <Link href="/" style={{ color: '#45a2f8', textDecoration: 'underline' }}>
              {t.newPage.backHome}
            </Link>
          </nav>
        </VStack>
      </Container>
    </main>
  )
}
