# Genji

A Next.js Web3 app template.

## Features

- ⚡ **React 19** - Latest React with improved performance and hydration
- 🎨 **Chakra UI v2** - Accessible component library
- 🔗 **Web3 Integration** - Wallet connection via Reown AppKit
- 💰 **Ethereum Support** - Send transactions with Ethers.js v6
- 💳 **Stripe Subscriptions** - $1/month subscription system
- 🔐 **Wallet Generator** - Secure local wallet creation and message signing
- 🌍 **Multi-language** - i18n support for 10+ languages
- 📱 **Responsive** - Mobile-first design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Chakra UI v2, Framer Motion 12
- **Web3**: Ethers.js v6, Reown AppKit
- **Backend**: Next.js API routes, Stripe
- **Build**: ESBuild, PNPM

## Requirements

- **Node.js**: 18+ (recommended: 20+)
- **PNPM**: Latest version
- **Environment**: Browser with Web3 wallet support

## Install

```bash
pnpm i
```

## Run

Create a `.env` file:

```bash
cp .env.template .env
```

Add your own keys in the `.env` file:

```env
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id  # Get yours at https://cloud.reown.com/
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then start the development server:

```bash
pnpm dev
```

## Customize Your App

Change the app name and details in these files:

```
package.json                    # name, version, description
src/app/metadata.ts             # title, description, SEO
src/context/index.tsx           # Web3 metadata
src/components/Header.tsx       # Navigation and branding
src/translations/index.ts       # Multi-language content
```

## Configuration

### Web3 Networks

Edit supported networks in `src/context/index.tsx`:

```typescript
networks: [
  sepolia, // Default testnet
  optimism,
  base,
  arbitrum,
  // Add or remove networks as needed
]
```

### Reown AppKit Setup

1. Create an account at [Reown Dashboard](https://cloud.reown.com/)
2. Create a new project
3. Copy your Project ID to `.env`

### Domain Verification

1. Create `.well-known/walletconnect.txt` in your `public` folder
2. Add your verification details from Reown dashboard
3. Ensure it's accessible at: `your-domain/.well-known/walletconnect.txt`

### Stripe Integration

1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Set up webhook endpoints for subscription events
4. Add all keys to your `.env` file

## Key Features Explained

### 🔐 Wallet Generator

- Secure client-side wallet generation
- Encrypted private key storage in IndexedDB
- Message signing and verification
- No private keys leave the browser

### 💳 Subscriptions

- $1/month via Stripe
- Webhook integration for subscription events
- Wallet-based user identification

### 🌍 Internationalization

Supports 10 languages:

English, 中文, हिन्दी, Español, Français, العربية, বাংলা, Русский, Português, اردو

## Development

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

### Format

```bash
pnpm format
```

### Type Check

```bash
npx tsc --noEmit
```

## Deployment

This app can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform supporting Next.js

Make sure to:

1. Set all environment variables
2. Configure domain verification for Reown
3. Set up Stripe webhooks with your production URL

## Architecture

```
src/
├── app/                   # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   └── subscription/  # Stripe integration
│   ├── subscribe/         # Subscription pages
│   └── wallet/            # Wallet generator
├── components/            # Reusable UI components
├── context/               # React contexts (Web3, i18n)
├── hooks/                 # Custom React hooks
├── translations/          # i18n translations
└── utils/                 # Utility functions
    └── i18n.ts            # Internationalization utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Documentation References

- [React 19](https://react.dev/blog/2024/12/05/react-19) - Latest React features
- [Next.js 15](https://nextjs.org/docs) - React framework
- [Chakra UI v2](https://v2.chakra-ui.com/) - UI component library
- [Ethers.js v6](https://docs.ethers.org/v6/) - Ethereum library
- [Reown AppKit](https://reown.com/appkit) - Web3 wallet connection
- [Stripe API](https://stripe.com/docs/api) - Payment processing

## Support

Feel free to reach out to [Julien](https://github.com/julienbrg) on [Farcaster](https://warpcast.com/julien-), [Element](https://matrix.to/#/@julienbrg:matrix.org), [Status](https://status.app/u/iwSACggKBkp1bGllbgM=#zQ3shmh1sbvE6qrGotuyNQB22XU5jTrZ2HFC8bA56d5kTS2fy), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discordapp.com/users/julienbrg), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).

<img src="https://bafkreid5xwxz4bed67bxb2wjmwsec4uhlcjviwy7pkzwoyu5oesjd3sp64.ipfs.w3s.link" alt="built-with-ethereum-w3hc" width="100"/>
