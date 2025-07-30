'use client'

import { Container, Text, useToast, Button, Tooltip } from '@chakra-ui/react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, parseEther, formatEther } from 'ethers'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

const testAddress = '0x502fb0dFf6A2adbF43468C9888D1A26943eAC6D1' // You can change the test address

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [balance, setBalance] = useState<string>('0')

  const { address, isConnected } = useAppKitAccount()
  const { caipNetwork, chainId } = useAppKitNetwork()
  const { walletProvider } = useAppKitProvider('eip155')
  const toast = useToast()
  const t = useTranslation()

  // Only check balance when user is actually connected (not on page load)
  useEffect(() => {
    const checkBalance = async () => {
      // Only proceed if user is connected AND we have a provider
      if (!isConnected || !address || !walletProvider) {
        setBalance('0')
        return
      }

      try {
        const provider = new BrowserProvider(walletProvider as any)
        const balance = await provider.getBalance(address)
        setBalance(formatEther(balance))
      } catch (error) {
        console.error('Error fetching balance:', error)
        // Don't show error toast on page load, just log it
        setBalance('0')
      }
    }

    // Add a small delay to ensure connection is fully established
    if (isConnected && address && walletProvider) {
      const timeoutId = setTimeout(checkBalance, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [address, walletProvider, chainId, isConnected])

  const handleSend = async () => {
    setTxHash('')
    setTxLink('')

    if (!address || !walletProvider) {
      toast({
        title: t.common.error,
        description: t.home.notConnected,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    console.log('Current network:', caipNetwork, 'Chain ID:', chainId)

    setIsLoading(true)
    try {
      const provider = new BrowserProvider(walletProvider as any)

      const network = await provider.getNetwork()
      console.log('Provider network:', network)

      const signer = await provider.getSigner()
      console.log('Signer address:', await signer.getAddress())

      const tx = await signer.sendTransaction({
        to: testAddress,
        value: parseEther('0.00001'),
      })

      const receipt = await tx.wait(1)

      setTxHash(receipt?.hash)

      let explorerUrl = 'https://sepolia.etherscan.io/tx/'
      if (chainId === 11155420) {
        // OP Sepolia
        explorerUrl = 'https://sepolia-optimism.etherscan.io/tx/'
      } else if (chainId === 84532) {
        // Base Sepolia
        explorerUrl = 'https://sepolia.basescan.org/tx/'
      }

      setTxLink(explorerUrl + receipt?.hash)

      toast({
        title: t.common.success,
        description: `${t.home.transactionSuccess}: 0.00001 ETH to ${testAddress}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error: any) {
      console.error('Transaction failed:', error)

      let errorMessage = 'Unknown error occurred'
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.reason) {
        errorMessage = error.reason
      } else if (error?.code) {
        errorMessage = `Error code: ${error.code}`
      }

      toast({
        title: t.home.transactionFailed,
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const hasEnoughBalance = Number(balance) >= 0.00001

  return (
    <Container maxW="container.sm" py={20}>
      <Text mb={4}>{t.home.title} 🌈</Text>

      {/* Debug info - only show when connected */}
      {isConnected && (
        <>
          <Text fontSize="sm" color="gray.500" mb={4}>
            Network: {caipNetwork?.name || 'Unknown'} (Chain ID: {chainId})
          </Text>

          <Text fontSize="sm" color="gray.500" mb={4}>
            Connected wallet address: <strong>{address}</strong>
          </Text>

          <Text fontSize="sm" color="gray.500" mb={4}>
            Balance: {parseFloat(balance).toFixed(5)} ETH
          </Text>

          <Text fontSize="sm" color="gray.500" mb={4}>
            Recipient address: <strong>{testAddress}</strong>
          </Text>
        </>
      )}

      {/* Only show send button when connected */}
      {isConnected && (
        <Tooltip
          label={!hasEnoughBalance ? t.home.insufficientBalance : ''}
          isDisabled={hasEnoughBalance}
          hasArrow
          bg="black"
          color="white"
          borderWidth="1px"
          borderColor="red.500"
          borderRadius="md"
          p={2}
        >
          <Button
            onClick={handleSend}
            isLoading={isLoading}
            loadingText={t.common.loading}
            bg="#45a2f8"
            color="white"
            _hover={{
              bg: '#3182ce',
            }}
            isDisabled={!hasEnoughBalance}
          >
            {t.home.sendEth}
          </Button>
        </Tooltip>
      )}

      {/* Transaction result - only show when there's a transaction */}
      {txHash && isConnected && (
        <Text py={4} fontSize="14px" color="#45a2f8">
          <Link target="_blank" rel="noopener noreferrer" href={txLink ? txLink : ''}>
            {txHash}
          </Link>
        </Text>
      )}
    </Container>
  )
}
