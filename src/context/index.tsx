'use client'

import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import {
  optimism,
  zksync,
  base,
  arbitrum,
  gnosis,
  polygon,
  polygonZkEvm,
  mantle,
  celo,
  avalanche,
  degen,
  sepolia,
  optimismSepolia,
  arbitrumSepolia,
  baseSepolia,
} from '@reown/appkit/networks'
import { type ReactNode, memo } from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

// Use process.env with proper typing for Next.js
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not set')
}

const ethersAdapter = new EthersAdapter()

createAppKit({
  adapters: [ethersAdapter],
  projectId,
  networks: [
    optimism,
    zksync,
    base,
    arbitrum,
    gnosis,
    polygon,
    polygonZkEvm,
    mantle,
    celo,
    avalanche,
    degen,
    sepolia,
    optimismSepolia,
    arbitrumSepolia,
    baseSepolia,
  ],
  defaultNetwork: sepolia,
  metadata: {
    name: 'Genji',
    description: 'Next.js + Web3 Modal + Ethers.js + Chakra UI',
    url: 'https://genji-app.netlify.app',
    icons: ['./favicon.ico'],
  },

  // Wallet configuration to minimize wallet prominence
  featuredWalletIds: [], // Empty array to not feature any specific wallets
  allWallets: 'SHOW', // Can be 'SHOW', 'HIDE', or 'ONLY_MOBILE'

  // Enable Web3 features
  enableEIP6963: true,
  enableCoinbase: true,
  allowUnsupportedChain: false,
  enableWalletConnect: true,
  enableInjected: true,

  // Theme configuration
  themeMode: 'dark',
  themeVariables: {
    '--w3m-z-index': 1000,
  },

  // Features configuration - controls what appears in modal
  features: {
    analytics: true,

    // Email/Social configuration
    email: true, // Enable email login
    socials: ['google', 'farcaster', 'github', 'discord', 'facebook', 'x', 'apple'],
    emailShowWallets: true, // Show wallets on same screen as email/social

    // KEY PROPERTY: Control the order of connection methods
    // Options: 'wallet', 'email', 'social'
    connectMethodsOrder: ['email', 'social', 'wallet'], // This puts email/social at top

    // Disable other features for cleaner email/social focus
    onramp: false,
    swaps: false,
    history: false,

    // Optional: Disable legal checkbox if you want cleaner UI
    legalCheckbox: false,
  },
})

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: '#000000',
        color: 'white',
      },
    },
  },
})

const ContextProvider = memo(function ContextProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
})

export default ContextProvider
