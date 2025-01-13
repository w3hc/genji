'use client'

import { Container, Text, useToast, Button, Tooltip } from '@chakra-ui/react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, parseEther, formatEther } from 'ethers'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [balance, setBalance] = useState<string>('0')

  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const toast = useToast()

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

  const handleSend = async () => {
    setTxHash('')
    setTxLink('')
    if (!address || !walletProvider) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      const provider = new BrowserProvider(walletProvider as any)
      const signer = await provider.getSigner()

      const tx = await signer.sendTransaction({
        to: address,
        value: parseEther('0.0001'),
      })

      const receipt = await tx.wait(1)

      setTxHash(receipt?.hash)
      setTxLink('https://sepolia.etherscan.io/tx/' + receipt?.hash)

      toast({
        title: 'Transaction successful',
        description: `Sent 0.0001 ETH to ${address}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Transaction failed:', error)
      toast({
        title: 'Transaction failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const hasEnoughBalance = Number(balance) >= 0.0001

  return (
    <Container maxW="container.sm" py={20}>
      <Text mb={4}>Hello world!</Text>
      {isConnected && (
        <Tooltip
          label={!hasEnoughBalance ? 'Please connect with an account that has a bit of ETH' : ''}
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
            loadingText="Sending..."
            bg="#45a2f8"
            color="white"
            _hover={{
              bg: '#3182ce',
            }}
            isDisabled={!hasEnoughBalance}
          >
            Send 0.0001 ETH to self
          </Button>
        </Tooltip>
      )}
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
