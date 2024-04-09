'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  chainName: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://ethereum-sepolia.publicnode.com',
}

const metadata = {
  name: 'Genji',
  description: 'Next.js + Web3 Modal + Ethers.js + Chakra UI',
  url: 'https://genji.netlify.app',
  icons: ['./public/favicon.ico'],
}

const ethersConfig = defaultConfig({
  metadata,
  enableEmail: true,
})

createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
})

export function Web3Modal({ children }) {
  return children
}
