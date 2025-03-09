import { Inter } from 'next/font/google'
import './globals.css'
import ContextProvider from '@/context'
import Header from '@/components/Header'
import { Box } from '@chakra-ui/react'
import { metadata } from './metadata'
import { LanguageProvider } from '@/context/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export { metadata }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <LanguageProvider>
            <Header />
            <Box pt="72px">{children}</Box>
          </LanguageProvider>
        </ContextProvider>
      </body>
    </html>
  )
}
