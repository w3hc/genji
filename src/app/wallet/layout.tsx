import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Message Signer | Genji',
  description: 'Securely sign and verify Ethereum messages with your wallet',

  openGraph: {
    title: 'Message Signer | Genji',
    description: 'Securely sign and verify Ethereum messages with your wallet',
    url: 'https://genji-app.netlify.app/wallet',
    siteName: 'Genji',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Genji Web3 Application - Message Signer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Message Signer | Genji',
    description: 'Securely sign and verify Ethereum messages with your wallet',
    images: ['/huangshan.png'],
  },
}

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
