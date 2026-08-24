import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings | Genji',
  description: 'Manage your accounts, backups, and recovery options for your w3pk wallet.',

  openGraph: {
    title: 'Settings | Genji',
    description: 'Manage your accounts, backups, and recovery options for your w3pk wallet.',
    siteName: 'Genji',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Manage your accounts, backups, and recovery options for your w3pk wallet.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Settings | Genji',
    description: 'Manage your accounts, backups, and recovery options for your w3pk wallet.',
    images: ['/huangshan.png'],
    creator: '@julienbrg',
  },
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
