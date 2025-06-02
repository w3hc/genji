import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscribe | Genji',
  description: 'Subscribe to Genji for $1 per month',

  openGraph: {
    title: 'Subscribe | Genji',
    description: 'Subscribe to Genji for $1 per month',
    url: 'https://genji-app.netlify.app/subscribe',
    siteName: 'Genji',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Genji Web3 Application - Subscription',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Subscribe | Genji',
    description: 'Subscribe to Genji for $1 per month',
    images: ['/huangshan.png'],
  },
}

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
