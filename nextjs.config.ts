import type { NextConfig } from 'next'
import type { Configuration as WebpackConfig } from 'webpack'
import { execSync } from 'child_process'

const nextConfig: NextConfig = {
  generateBuildId: async () => {
    try {
      // Use git commit hash as build ID for GitHub matching
      const gitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
      const shortHash = gitHash.substring(0, 8)
      console.log('🏗️ Using git hash as build ID:', shortHash, '(full:', gitHash + ')')

      // Return the short hash for better compatibility
      return shortHash
    } catch (error) {
      console.warn('⚠️ Could not get git hash, using timestamp')
      const fallback = `build-${Date.now()}`
      console.log('🏗️ Using fallback build ID:', fallback)
      return fallback
    }
  },

  webpack: (config: WebpackConfig, { buildId, isServer, dev }): WebpackConfig => {
    // Inject build ID into the client-side bundle
    if (!isServer && !dev) {
      config.plugins = config.plugins || []

      // Add a plugin to inject build ID as a global variable
      const webpack = require('webpack')
      config.plugins.push(
        new webpack.DefinePlugin({
          __NEXT_BUILD_ID__: JSON.stringify(buildId),
        })
      )
    }

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

  // Force production build behavior for static paths
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
}

export default nextConfig
