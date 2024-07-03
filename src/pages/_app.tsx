import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Seo } from '../components/layout/Seo'
import { ERC20_CONTRACT_ADDRESS } from '../utils/erc20'
import { useIsMounted } from '../hooks/useIsMounted'
import ErrorBoundary from '../components/layout/ErrorBoundary'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log('contract address:', ERC20_CONTRACT_ADDRESS)
  }, [])
  const isMounted = useIsMounted()

  return (
    <>
      <ErrorBoundary>
        <ChakraProvider>
          <Seo />
          {isMounted && (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </ChakraProvider>
      </ErrorBoundary>
    </>
  )
}
