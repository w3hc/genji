'use client'
import { ReactNode } from 'react'
import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { sepolia } from '@reown/appkit/networks'

interface Props {
  children?: ReactNode
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const metadata = {
  name: 'Genji',
  description: 'Next.js + Web3 Modal + Ethers.js + Chakra UI',
  url: 'https://genji.netlify.app',
  icons: ['./favicon.ico'],
}

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [sepolia],
  projectId,
  features: {
    analytics: true,
    swaps: true,
    onramp: true,
  },
  defaultNetwork: sepolia,
})

export function AppKit({ children }: Props) {
  return <>{children}</>
}
