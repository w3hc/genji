import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Page | Genji',
  description: 'Unleash your imagination in this new page!',

  openGraph: {
    title: 'New Page | Genji',
    description: 'Unleash your imagination in this new page!',
    url: 'https://genji-app.netlify.app/new',
    siteName: 'Genji',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Genji Web3 Application - New Page',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'New Page | Genji',
    description: 'Unleash your imagination in this new page!',
    images: ['/huangshan.png'],
  },
}

export default function NewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
