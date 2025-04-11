import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'On-chain Referrals',
  description: 'Create and share your personal referral link',

  openGraph: {
    title: 'On-chain Referrals',
    description: 'Create and share your personal referral link',
    url: 'https://genji-app.netlify.app/referral',
    siteName: 'Genji',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Genji Web3 Application - Referrals',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'On-chain Referrals',
    description: 'Create and share your personal referral link',
    images: ['/huangshan.png'],
  },
}

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
