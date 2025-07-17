import type { NextConfig } from 'next'
import type { Configuration as WebpackConfig } from 'webpack'
import { execSync } from 'child_process'

const nextConfig: NextConfig = {
  generateBuildId: async () => {
    try {
      // Use git commit hash as build ID for GitHub matching
      const gitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
      console.log('Using git hash as build ID:', gitHash.substring(0, 8))
      return gitHash
    } catch (error) {
      console.warn('Could not get git hash, using timestamp')
      return `build-${Date.now()}`
    }
  },

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
