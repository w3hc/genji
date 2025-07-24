import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@reown/appkit', '@walletconnect/universal-provider'],
  },
  webpack: (config, { isServer }) => {
    // Force all lit packages to resolve to the same version
    config.resolve.alias = {
      ...config.resolve.alias,
      lit: require.resolve('lit'),
      'lit-element': require.resolve('lit-element'),
      'lit-html': require.resolve('lit-html'),
      '@lit/reactive-element': require.resolve('@lit/reactive-element'),
    }

    // Ensure lit packages are treated as external in SSR to prevent hydration issues
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('lit', 'lit-element', 'lit-html', '@lit/reactive-element')
    }

    return config
  },
}

export default nextConfig
