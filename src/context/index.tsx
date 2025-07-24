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
  enableEIP6963: true,
  enableCoinbase: true,
  allowUnsupportedChain: false,
  enableWalletConnect: true,
  enableInjected: true,
  // Add these properties to prevent auto-connection
  // enableOnramp: false,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-z-index': 1000,
  },
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'discord', 'github', 'apple'],
    emailShowWallets: true,
    // Disable features that might trigger auto-connection
    onramp: false,
    swaps: false,
    history: false,
  },
  // Important: Don't include any auto-connection options
  // Remove any connectOnMount, autoConnect, or similar properties
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
