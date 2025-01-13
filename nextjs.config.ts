import type { NextConfig } from 'next'
import type { Configuration as WebpackConfig } from 'webpack'

const nextConfig: NextConfig = {
  webpack: (config: WebpackConfig, { isServer, dev }): WebpackConfig => {
    const optimization = config.optimization || {}
    const splitChunks = optimization.splitChunks || {}
    const cacheGroups = (splitChunks as any).cacheGroups || {}

    config.optimization = {
      ...optimization,
      moduleIds: 'deterministic',
      splitChunks: {
        ...splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...cacheGroups,
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            maxSize: 150000,
          },
        },
      },
    }

    const fallback = config.resolve?.fallback || {}
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...fallback,
        Buffer: require.resolve('buffer/'),
      },
    }

    if (dev) {
      config.cache = {
        type: 'filesystem',
        compression: 'brotli',
        maxGenerations: 1,
      } as WebpackConfig['cache']
    }

    return config
  },
  experimental: {
    optimizePackageImports: ['@reown/appkit', '@walletconnect/universal-provider'],
  },
}

export default nextConfig
