'use client'
import { ReactNode } from 'react'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

interface Props {
  children?: ReactNode
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''
const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL || 'https://sepolia.gateway.tenderly.co'

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  chainName: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: endpoint,
  blockExplorerUrl: 'https://sepolia.etherscan.io',
}

const metadata = {
  name: 'Genji',
  description: 'Next.js + Web3 Modal + Ethers.js + Chakra UI',
  url: 'https://genji.netlify.app',
  icons: ['./favicon.ico'],
}

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: 11155111, // Sepolia
  rpcUrl: endpoint,
  auth: {
    email: true,
    // socials: ['google', 'x', 'github', 'discord', 'apple'],
    socials: ['google'],
    showWallets: true,
    walletFeatures: true,
  },
})

createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: 'dark',
  themeVariables: {},
})

export function Web3Modal({ children }: Props) {
  return <div>{children}</div>
}
