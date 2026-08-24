import { Inter } from 'next/font/google'
import './globals.css'
import ContextProvider from '@/context'
import Header from '@/components/Header'
import { Box, Container } from '@chakra-ui/react'
import { metadata } from './metadata'
import { LanguageProvider } from '@/context/LanguageContext'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export { metadata }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ContextProvider>
          <LanguageProvider>
            <Header />
            <Box as="main" id="main-content" pt="72px">
              <Container
                maxW={{ base: '100%', sm: '640px', md: '768px', lg: '960px', xl: '1024px' }}
                px={{ base: 4, md: 6, lg: 8 }}
                mx="auto"
              >
                {children}
              </Container>
            </Box>
            <Toaster />
          </LanguageProvider>
        </ContextProvider>
      </body>
    </html>
  )
}
