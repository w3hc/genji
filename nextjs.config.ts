import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@reown/appkit', '@walletconnect/universal-provider'],
  },
}

export default nextConfig
