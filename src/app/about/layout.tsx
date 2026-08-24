import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About w3pk',
  description: 'Passwordless Web3 authentication SDK with encrypted wallets and privacy features.',

  openGraph: {
    title: 'About w3pk',
    description:
      'Passwordless Web3 authentication SDK with encrypted wallets and privacy features.',
    siteName: 'Genji',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Passwordless Web3 authentication SDK with encrypted wallets and privacy features.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'About w3pk | Genji',
    description:
      'Passwordless Web3 authentication SDK with encrypted wallets and privacy features.',
    images: ['/huangshan.png'],
    creator: '@julienbrg',
  },
}

export default function Web3Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
