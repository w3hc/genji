# Genji - Quick Start Guide

A modern Web3 application template featuring Next.js, Reown, Ethers.js, and Chakra UI.

🔥 [Live Demo](https://genji-app.netlify.app)

## Core Technologies

- 🚀 [Next.js](https://nextjs.org/) - React framework for production
- 🔗 [Reown](https://reown.com/appkit) - Web3 authentication & wallet connections
- ⚡ [Ethers.js](https://ethers.org/) (v6) - Ethereum library
- 💅 [Chakra UI](https://chakra-ui.com/) - Component library
- 🔧 [Example Smart Contract](https://github.com/w3hc/w3hc-hardhat-template/blob/main/contracts/Basic.sol)

## Features

- Multi-wallet support
- Email & social logins (Google, Farcaster, GitHub)
- Multiple network support (Sepolia, Optimism, zkSync, Base, etc.)
- Dark/Light theme
- Built-in faucet API
- TypeScript
- Testing setup with Jest
- ESLint + Prettier config

## Prerequisites

```bash
node -v  # v20.9.0 or later
pnpm -v  # v8.7.5 or later
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/genji.git
cd genji
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment:

```bash
cp .env.example .env
```

4. Configure `.env`:

```
# Get yours at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID='your_project_id'

# RPC endpoint
NEXT_PUBLIC_RPC_ENDPOINT_URL='https://sepolia.gateway.tenderly.co'

# Only needed if using the faucet API
NEXT_PUBLIC_SIGNER_PRIVATE_KEY='your_private_key'
```

5. Start development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` 🚀

## Project Structure

```
src/
├── components/        # UI components
│   ├── Header.tsx    # Main navigation
│   ├── layout/       # Layout components
│   └── ...
├── context/
│   └── web3modal.tsx # Web3 configuration
├── hooks/            # Custom React hooks
├── pages/            # Next.js pages
│   ├── api/         # API routes
│   │   └── faucet.ts
│   └── index.tsx
└── utils/           # Helpers & constants
    ├── config.ts
    └── erc20.ts
```

## Usage Examples

### 1. Connect Wallet

```typescript
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'

export default function YourComponent() {
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')

  if (!isConnected) {
    return <w3m-button /> // Reown connect button
  }

  return <div>Connected: {address}</div>
}
```

### 2. Contract Interaction

```typescript
// Initialize contract
const ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider)
const signer = await ethersProvider.getSigner()
const contract = new Contract(ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI, signer)

// Call contract method
const tx = await contract.mint(parseEther('1000'))
const receipt = await tx.wait()
```

### 3. UI Components

```typescript
import { Button, useToast } from '@chakra-ui/react'

export default function YourComponent() {
  const toast = useToast()

  const handleClick = () => {
    toast({
      title: 'Success!',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  }

  return (
    <Button onClick={handleClick} colorScheme="blue">
      Click me
    </Button>
  )
}
```

## Testing

Run tests:

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
```

## Network Support

The template supports multiple networks. Configure in `src/context/web3modal.tsx`:

```typescript
const networks = [
  sepolia, // Default network
  optimism,
  zksync,
  base,
  arbitrum,
  gnosis,
  polygon,
  polygonZkEvm,
  mantle,
  celo,
  avalanche,
  degen,
]
```

## Browser Support

- iOS: Safari 10+ (iOS 10+)
- Android: Chrome 51+ (Android 5.0+)
- Desktop: Modern browsers

## Customization

### Theme

Modify in `src/utils/config.ts`:

```typescript
export const THEME_COLOR_SCHEME = 'blue'
export const THEME_INITIAL_COLOR = 'system'
```

### Contract Setup

1. Update contract details in `src/utils/erc20.ts`
2. Implement your interaction logic

## Development Commands

```bash
pnpm dev           # Start development server
pnpm build         # Production build
pnpm start         # Start production server
pnpm lint          # Run ESLint
pnpm format        # Format code with Prettier
```

## Support & Resources

- 📘 [Next.js Documentation](https://nextjs.org/docs)
- 🔧 [Reown AppKit Guide](https://reown.com/appkit)
- ⚡ [Ethers.js Documentation](https://docs.ethers.org/v6/)
- 💅 [Chakra UI Components](https://chakra-ui.com/docs/components)

## Contact

Need help? Reach out:

- [Element](https://matrix.to/#/@julienbrg:matrix.org)
- [Farcaster](https://warpcast.com/julien-)
- [Telegram](https://t.me/julienbrg)
- [Twitter](https://twitter.com/julienbrg)
- [Discord](https://discordapp.com/users/julienbrg)
- [LinkedIn](https://www.linkedin.com/in/julienberanger/)
