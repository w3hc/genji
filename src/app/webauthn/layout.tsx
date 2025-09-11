import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WebAuthn | Genji',
  description: 'Test WebAuthn biometric login',

  openGraph: {
    title: 'WebAuthn | Genji',
    description: 'Test WebAuthn biometric login',
    url: 'https://genji-app.netlify.app/webauthn',
    siteName: 'Genji',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Test WebAuthn biometric login',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'WebAuthn | Genji',
    description: 'Test WebAuthn biometric login',
    images: ['/huangshan.png'],
  },
}

export default function NewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
