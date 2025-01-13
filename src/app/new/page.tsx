'use client'

import { Container, Text, useToast, Button, Tooltip } from '@chakra-ui/react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, parseEther, formatEther } from 'ethers'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NewPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [balance, setBalance] = useState<string>('0')

  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const toast = useToast()

  useEffect(() => {}, [address, walletProvider])

  const hasEnoughBalance = Number(balance) >= 0.0001

  return (
    <Container maxW="container.sm" py={20}>
      <Text mb={4}>Hello new page!</Text>
    </Container>
  )
}
