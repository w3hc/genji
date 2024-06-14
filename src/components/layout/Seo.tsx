import React from 'react'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_TWITTER } from '../../utils/config'
import { DefaultSeo } from 'next-seo'

export function Seo() {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL

  return (
    <DefaultSeo
      title={SITE_NAME}
      defaultTitle={SITE_NAME}
      titleTemplate={`${SITE_NAME}`}
      description={SITE_DESCRIPTION}
      defaultOpenGraphImageWidth={762}
      defaultOpenGraphImageHeight={708}
      openGraph={{
        type: 'website',
        siteName: SITE_NAME,
        url: origin,
        images: [
          {
            url: `${origin}/huangshan.png`, // The recommended image ratio for an og:image is 1.91:1 (ie. 1200 x 630)
            alt: `${SITE_NAME} Open Graph Image`,
          },
        ],
      }}
      twitter={{
        handle: `@${SOCIAL_TWITTER}`,
        site: `@${SOCIAL_TWITTER}`,
        cardType: 'summary_large_image',
      }}
    />
  )
}
