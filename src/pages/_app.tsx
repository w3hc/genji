import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { DefaultSeo } from 'next-seo'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SOCIAL_TWITTER } from '../utils/config'
import { ERC20_CONTRACT_ADDRESS } from '../utils/erc20'
import { useIsMounted } from '../hooks/useIsMounted'
import ErrorBoundary from '../components/ErrorBoundary'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log('contract address:', ERC20_CONTRACT_ADDRESS)
  }, [])
  const isMounted = useIsMounted()

  return (
    <>
      <DefaultSeo
        titleTemplate={`%s | ${SITE_NAME}`}
        defaultTitle={SITE_NAME}
        description={SITE_DESCRIPTION}
        canonical={SITE_URL}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: SITE_URL,
          siteName: SITE_NAME,
          title: SITE_NAME,
          description: SITE_DESCRIPTION,
          images: [
            {
              url: `${SITE_URL}/huangshan.png`,
              width: 1200,
              height: 630,
              alt: SITE_NAME,
            },
          ],
        }}
        twitter={{
          handle: `@${SOCIAL_TWITTER}`,
          site: `@${SOCIAL_TWITTER}`,
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
          },
        ]}
      />
      <ErrorBoundary>
        <ChakraProvider>
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
