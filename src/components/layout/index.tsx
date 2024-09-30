import { AppKit } from '../../context/appkit'
import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import { Header } from './Header'

interface Props {
  children?: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <AppKit>
      <Box margin="0 auto" minH="100vh">
        <Header />
        <Container maxW="container.lg">{children}</Container>
      </Box>
    </AppKit>
  )
}
