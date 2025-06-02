import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat | Genji',
  description: 'Chat with Genji AI assistant',

  openGraph: {
    title: 'Chat | Genji',
    description: 'Chat with Genji AI assistant',
    url: 'https://genji-app.netlify.app/chat',
    siteName: 'Genji',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Genji Web3 Application - Chat',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Chat | Genji',
    description: 'Chat with Genji AI assistant',
    images: ['/huangshan.png'],
  },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
