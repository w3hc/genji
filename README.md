# Genji

A Next.js Web3 app template.

## Install

```bash
pnpm i
```

## Run

Create a `.env` file:

```
cp .env.template .env
```

Add your own keys in the `.env` file (you can get it in your [Reown dashboard](https://cloud.reown.com/)), then:

```bash
pnpm dev
```

## Customize Your App

Change the app name and details in these files:

```
package.json                    # name, version, description
src/app/metadata.ts             # title, description
src/context/index.tsx           # metadata.name, metadata.description
src/components/Header.tsx       # Heading text
```

### Configure SEO

#### Default SEO (src/app/metadata.ts):

```typescript
export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
  openGraph: {
    title: 'Your App Name',
    description: 'Your app description',
    images: ['/huangshan.png'], // Replace with your image
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your App Name',
    description: 'Your app description',
  },
}
```

#### Page-specific SEO:

Create a `layout.tsx` in your page directory:

```typescript
// src/app/your-page/layout.tsx
export const metadata: Metadata = {
  title: 'Page Title | Your App Name',
  description: 'Page specific description',
  // ... openGraph and Twitter cards
}
```

### Configure Networks

Edit supported networks in `src/context/index.tsx`:

```typescript
networks: [
  sepolia, // Default testnet
  optimism,
  base,
  // Add or remove networks as needed
]
```

### Set Up Reown

1. Create an account at [Reown Dashboard](https://cloud.reown.com/)
2. Create a new project
3. Copy your Project ID
4. Add to `.env`:

```
NEXT_PUBLIC_PROJECT_ID=your_project_id
```

### Domain Verification

1. Create `.well-known/walletconnect.txt` in your `public` folder
2. Add your verification details from Reown dashboard
3. Ensure it's accessible at: `your-domain/.well-known/walletconnect.txt`

### Documentation References

- [Ethers.js `v6`](https://docs.ethers.org/v6/) - Ethereum library
- [Reown AppKit](https://reown.com/appkit) - Web3 authentication
- [Chakra UI](https://chakra-ui.com/docs/components) - UI components
- [Next.js](https://nextjs.org/docs) - React framework

## Support

Feel free to reach out to [Julien](https://github.com/julienbrg) on [Farcaster](https://warpcast.com/julien-), [Element](https://matrix.to/#/@julienbrg:matrix.org), [Status](https://status.app/u/iwSACggKBkp1bGllbgM=#zQ3shmh1sbvE6qrGotuyNQB22XU5jTrZ2HFC8bA56d5kTS2fy), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discordapp.com/users/julienbrg), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).

<img src="https://bafkreid5xwxz4bed67bxb2wjmwsec4uhlcjviwy7pkzwoyu5oesjd3sp64.ipfs.w3s.link" alt="built-with-ethereum-w3hc" width="100"/>
