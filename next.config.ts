import type { NextConfig } from 'next'

// Content-Security-Policy, defense-in-depth for the deployment.
// 'unsafe-inline' in script-src is required by Next.js inline bootstrap
// scripts (pages are statically prerendered, so per-request nonces are not
// available); 'wasm-unsafe-eval' and blob: workers are required by the
// zero-knowledge tooling bundled with w3pk (snarkjs/circomlibjs).
// connect-src is limited to the origins the app can actually contact:
// same-origin (including the /api routes), the public Optimism RPC used by
// the opt-in build verification, and the endpoints referenced by the w3pk
// library.
// 'unsafe-eval' is added in development only: React's development build
// uses eval() for debugging features (it never does in production).
const isDev = process.env.NODE_ENV === 'development'

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://mainnet.optimism.io https://chainid.network https://rukh.w3hc.org",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
