import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Genji',
  description: 'Next.js + Web3 Modal + Ethers.js + Chakra UI',

  keywords: ['Web3', 'Next.js', 'Ethereum', 'DApp', 'Blockchain', 'Wallet'],
  authors: [{ name: 'Julien', url: 'https://github.com/julienbrg' }],

  openGraph: {
    title: 'Genji',
    description: 'Next.js + Web3 Modal + Ethers.js + Chakra UI',
    url: 'https://genji-app.netlify.app',
    siteName: 'Genji',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Genji Web3 Application',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Genji',
    description: 'Next.js + Web3 Modal + Ethers.js + Chakra UI',
    images: ['/huangshan.png'],
    creator: '@julienbrg',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'your-google-site-verification',
  },
}
