# genji


### .env.example

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID='88888'  # Get yours at https://cloud.walletconnect.com
NEXT_PUBLIC_RPC_ENDPOINT_URL='https://sepolia.gateway.tenderly.co'
NEXT_PUBLIC_SIGNER_PRIVATE_KEY='88888'
```

### .eslintignore

```
# Ignore everything
# *
```

### .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
}

```

### .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript

*.tsbuildinfo
next-env.d.ts
/.history

# Misc

NOTES.md
```

### .prettierignore

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem
genji_app_description*

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.idea
.vscode

# package manager
pnpm-lock.yaml
package-lock.json
yarn.lock
```

### .prettierrc.json

```json
{
  "trailingComma": "es5",
  "semi": false,
  "singleQuote": true,
  "printWidth": 120,
  "bracketSameLine": true,
  "useTabs": false,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "jsxSingleQuote": false,
  "proseWrap": "preserve",
  "quoteProps": "as-needed",
  "requirePragma": false
}

```

### README.md

```markdown
# Genji

A Next.js Web3 app template.

## Features

- [Next.js](https://nextjs.org/)
- [Reown](https://reown.com/appkit)
- [Ethers.js](https://ethers.org/) (v6)
- [Chakra UI](https://chakra-ui.com/)

View the [Solidity contract](https://github.com/w3hc/w3hc-hardhat-template/blob/main/contracts/Basic.sol) used in the example.

Web app live at [https://genji-app.netlify.app](https://genji-app.netlify.app).

## Install

```bash
pnpm i
```

## Run

Create a `.env` file:

```
cp .env.example .env
```

Add your own keys in the `.env` file (you can get it in your [Wallet Connect dashboard](https://cloud.walletconnect.com)), then:

```bash
pnpm dev
```

## Requirements

Here are the known minimal mobile hardware requirements:

- iOS: Safari 10+ (iOS 10+)
- Android: Chrome 51+ (Android 5.0+)

## Versions

- pnpm `v8.7.5`
- node `v20.9.0`

## Support

You can contact me via [Element](https://matrix.to/#/@julienbrg:matrix.org), [Farcaster](https://warpcast.com/julien-), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discordapp.com/users/julienbrg), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).

## Credits

Special thanks to Wesley ([@wslyvh](https://github.com/wslyvh)) for building [Nexth](https://github.com/wslyvh/nexth). I also want to thank the [Wallet Connect](https://walletconnect.com/) team, [@glitch-txs](https://github.com/glitch-txs) in particular. And of course [@ricmoo](https://github.com/ricmoo) for maintaining [Ethers.js](https://ethers.org/)!

```

### genji_app_description.md

```markdown
# genji


### .env.example

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID='88888'  # Get yours at https://cloud.walletconnect.com
NEXT_PUBLIC_RPC_ENDPOINT_URL='https://sepolia.gateway.tenderly.co'
NEXT_PUBLIC_SIGNER_PRIVATE_KEY='88888'
```

### .eslintignore

```
# Ignore everything
# *
```

### .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
}

```

### .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript

*.tsbuildinfo
next-env.d.ts
/.history

# Misc

NOTES.md
```

### .prettierignore

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem
genji_app_description*

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.idea
.vscode

# package manager
pnpm-lock.yaml
package-lock.json
yarn.lock
```

### .prettierrc.json

```json
{
  "trailingComma": "es5",
  "semi": false,
  "singleQuote": true,
  "printWidth": 120,
  "bracketSameLine": true,
  "useTabs": false,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "jsxSingleQuote": false,
  "proseWrap": "preserve",
  "quoteProps": "as-needed",
  "requirePragma": false
}

```

### README.md

```markdown
# Genji

A Next.js Web3 app template.

## Features

- [Next.js](https://nextjs.org/)
- [Reown](https://reown.com/appkit)
- [Ethers.js](https://ethers.org/) (v6)
- [Chakra UI](https://chakra-ui.com/)

View the [Solidity contract](https://github.com/w3hc/w3hc-hardhat-template/blob/main/contracts/Basic.sol) used in the example.

Web app live at [https://genji-app.netlify.app](https://genji-app.netlify.app).

## Install

```bash
pnpm i
```

## Run

Create a `.env` file:

```
cp .env.example .env
```

Add your own keys in the `.env` file (you can get it in your [Wallet Connect dashboard](https://cloud.walletconnect.com)), then:

```bash
pnpm dev
```

## Requirements

Here are the known minimal mobile hardware requirements:

- iOS: Safari 10+ (iOS 10+)
- Android: Chrome 51+ (Android 5.0+)

## Versions

- pnpm `v8.7.5`
- node `v20.9.0`

## Support

You can contact me via [Element](https://matrix.to/#/@julienbrg:matrix.org), [Farcaster](https://warpcast.com/julien-), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discordapp.com/users/julienbrg), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).

## Credits

Special thanks to Wesley ([@wslyvh](https://github.com/wslyvh)) for building [Nexth](https://github.com/wslyvh/nexth). I also want to thank the [Wallet Connect](https://walletconnect.com/) team, [@glitch-txs](https://github.com/glitch-txs) in particular. And of course [@ricmoo](https://github.com/ricmoo) for maintaining [Ethers.js](https://ethers.org/)!

```

### genji_app_description.md

```markdown

```

### jest.config.ts

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig: Config = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}

export default createJestConfig(customJestConfig)

```

### jest.setup.ts

```typescript
import '@testing-library/jest-dom'

```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

```

### package.json

```json
{
  "name": "genji",
  "description": "A Next.js Web3 app template",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\""
  },
  "dependencies": {
    "@chakra-ui/icons": "^2.1.1",
    "@chakra-ui/next-js": "^2.2.0",
    "@chakra-ui/react": "^2.8.2",
    "@coinbase/wallet-sdk": "4.0.3",
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "@reown/appkit": "^1.1.2",
    "@reown/appkit-adapter-ethers": "^1.1.2",
    "@types/react": "18.3.5",
    "@types/react-dom": "18.3.0",
    "autoprefixer": "10.4.20",
    "eslint": "8.57.1",
    "eslint-config-next": "14.2.7",
    "ethers": "^6.13.2",
    "framer-motion": "^11.7.0",
    "next": "14.2.12",
    "next-seo": "^6.6.0",
    "postcss": "8.4.44",
    "react": "18.3.1",
    "react-device-detect": "^2.2.3",
    "react-dom": "18.3.1",
    "react-icons": "^5.3.0",
    "typescript": "5.5.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@types/jest": "^29.5.13",
    "@types/node": "22.5.2",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.2.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "prettier": "^3.3.3",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.2"
  }
}

```

### pnpm-lock.yaml

```yaml
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    dependencies:
      '@chakra-ui/icons':
        specifier: ^2.1.1
        version: 2.2.4(@chakra-ui/react@2.10.2(@emotion/react@11.13.3(@types/react@18.3.5)(react@18.3.1))(@emotion/styled@11.13.0(@emotion/react@11.13.3(@types/react@18.3.5)(react@18.3.1))(@types/react@18.3.5)(react@18.3.1))(@types/react@18.3.5)(framer-motion@11.11.8(@emotion/is-prop-valid@1.3.1)(react-dom@18.3.1(react@18.3.1))(react@18.3.1))(react-dom@18.3.1(react@18.3.1))(react@18.3.1))(react@18.3.1)
      '@chakra-ui/next-js':
        specifier: ^2.2.0
        version: 2.4.2(@chakra-ui/react@2.10.2(@emotion/react@11.13.3(@types/react@18.3.5)(react@18.3.1))(@emotion/styled@11.13.0(@emotion/react@11.13.3(@types/react@18.3.5)(react@18.3.1))(@types/react@18.3.5)(react@18.3.1))(@types/react@18.3.5)(framer-motion@11.11.8(@emotion/is-prop-valid@1.3.1)(react-dom@18.3.1(react@18.3.1))(react@18.3.1))(react-dom@18.3.1(react@18.3.1))(react@18.3.1))(@emotion/react@11.13.3(@types/react@18.3.5)(react@18.3.1))(next@14.2.12(@babel/core@7.25.8)(babel-plugin-macros@3.1.0)(react-dom@18.3.1(react@18.3.1))(react@18.3.1))(react@18.3.1)
      '@chakra-ui/react':
        specifier: ^2.8.2
        version: 2.10.2(@emotion/react@11.13.3(@types/react@18.3.5)(react@18.3.1))(@emotion/styled@11.13.0(@emotion/react@11.13.3(@types/react@18.3.5)(react@18.3.1))(@types/react@18.3.5)(react@18.3.1))(@types/react@18.3.5)(framer-motion@11.11.8(@emotion/is-prop-valid@1.3.1)(react-dom@18.3.1(react@18.3.1))(react@18.3.1))(react-dom@18.3.1(react@18.3.1))(react@18.3.1)
      '@coinbase/wallet-sdk':
        specifier: 4.0.3
        version: 4.0.3
      '@emotion/react':
        specifier: ^11.13.3
        version: 11.13.3(@types/react@18.3.5)(react@18.3.1)
      '@emotion/styled':
        specifier: ^11.13.0
        version: 11.13.0(@emotion/react@11.13.3(@types/react@18.3.5)(react@18.3.1))(@types/react@18.3.5)(react@18.3.1)
      '@reown/appkit':
        specifier: ^1.1.2
```

[This file was cut: it has more than 500 lines]

```

## public


### public/favicon.ico

```
[This is an image file]
```

### public/huangshan.png

```
[This is an image file]
```

## src


## src/__tests__


### src/__tests__/Header.test.tsx

```
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from '../components/layout/Header'

jest.mock('@reown/appkit/react', () => ({
  useAppKitAccount: () => ({ isConnected: false }),
}))

describe('Header', () => {
  it('renders the site name', () => {
    render(<Header />)
    const siteName = screen.getByText('Genji')
    expect(siteName).toBeInTheDocument()
  })
})

```

### src/__tests__/index.test.tsx

```
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../pages/index'

jest.mock('@reown/appkit/react', () => ({
  useAppKitAccount: () => ({ address: null, isConnected: false, caipAddress: null }),
  useAppKitProvider: () => ({ walletProvider: null }),
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    }
  },
}))

describe('Home page', () => {
  it('renders the login message when not connected', () => {
    render(<Home />)
    expect(
      screen.getByText(/You can login with your email, Google, or with one of many wallets suported by Reown\./)
    ).toBeInTheDocument()
  })

  it('renders the mint button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: /Mint/i })).toBeInTheDocument()
  })
})

```

## src/components


## src/components/layout


### src/components/layout/ErrorBoundary.tsx

```
import React, { ErrorInfo, ReactNode } from 'react'
import { mobileModel, mobileVendor } from 'react-device-detect'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  deviceInfo: string
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, deviceInfo: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, deviceInfo: '' }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  componentDidMount() {
    const deviceInfo = `${mobileVendor} ${mobileModel}`
    this.setState({ deviceInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h3>All apologies, the app is not yet available on this type of device.</h3>
          <br />
          <p>{this.state.deviceInfo}</p>
          <br />
          <p>Thank you for using the app from another device.</p>
          <br />
          <p>
            Feel free to report this to Julien via <a href="https://matrix.to/#/@julienbrg:matrix.org">Element</a>,{' '}
            <a href="https://warpcast.com/julien-">Farcaster</a>, <a href="https://t.me/julienbrg">Telegram</a>,{' '}
            <a href="https://twitter.com/julienbrg">Twitter</a>,{' '}
            <a href="https://discordapp.com/users/julienbrg">Discord</a> or{' '}
            <a href="https://www.linkedin.com/in/julienberanger/">LinkedIn</a>.
          </p>
        </>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

```

### src/components/layout/Head.tsx

```
import React from 'react'
import { default as NextHead } from 'next/head'
import { SITE_URL } from '../../utils/config'

interface Props {
  title?: string
  description?: string
}

export function Head({ title, description }: Props) {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL
  const img = `${origin}/huangshan.png`

  return (
    <NextHead>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={origin} />
      <meta name="twitter:card" content={img} />
      <meta name="twitter:site" content="@W3HC8" />
      <meta name="twitter:title" content="Genji" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </NextHead>
  )
}

```

### src/components/layout/Header.tsx

```
import React from 'react'
import {
  Flex,
  useColorModeValue,
  Spacer,
  Heading,
  Box,
  Link,
  Icon,
  Button,
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  IconButton,
} from '@chakra-ui/react'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { HeadingComponent } from './HeadingComponent'
import { SITE_NAME } from '../../utils/config'
import { FaGithub } from 'react-icons/fa'
import { Web3Modal } from '../../context/web3modal'
import { HamburgerIcon } from '@chakra-ui/icons'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''

  return (
    <Flex
      as="header"
      className={className}
      bg={useColorModeValue('gray.100', 'gray.900')}
      px={4}
      py={5}
      mb={8}
      alignItems="center">
      <LinkComponent href="/">
        <Heading as="h1" size="md">
          {SITE_NAME}
        </Heading>
      </LinkComponent>

      <Spacer />
      <Menu>
        <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} size={'sm'} mr={4} />
        <MenuList>
          <LinkComponent href="/">
            <MenuItem fontSize="md">Home</MenuItem>
          </LinkComponent>
          <LinkComponent href="/new">
            <MenuItem fontSize="md">New</MenuItem>
          </LinkComponent>
        </MenuList>
      </Menu>
      <Flex alignItems="center" gap={4}>
        <w3m-button />
        {/* <w3m-network-button /> */}{' '}
        <Flex alignItems="center">
          <ThemeSwitcher />
          <Box mt={2} ml={4}>
            <Link href="https://github.com/w3hc/genji" isExternal>
              <Icon as={FaGithub} boxSize={5} _hover={{ color: 'blue.500' }} />
            </Link>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

```

### src/components/layout/HeadingComponent.tsx

```
import { ReactNode } from 'react'
import { Heading } from '@chakra-ui/react'

interface Props {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  children: ReactNode
  className?: string
}

export function HeadingComponent(props: Props) {
  const className = props.className ?? ''
  let size
  switch (props.as) {
    case 'h1':
      size = props.size ?? '2xl'
      break
    case 'h2':
      size = props.size ?? 'xl'
      break
    case 'h3':
      size = props.size ?? 'lg'
      break
    case 'h4':
      size = props.size ?? 'md'
      break
    case 'h5':
      size = props.size ?? 'sm'
      break
    case 'h6':
      size = props.size ?? 'xs'
      break
  }

  return (
    <Heading as={props.as} size={size} className={className} mb={2}>
      {props.children}
    </Heading>
  )
}

```

### src/components/layout/LinkComponent.tsx

```
import React, { ReactNode } from 'react'
import NextLink from 'next/link'
import { Link, useColorModeValue } from '@chakra-ui/react'
import { THEME_COLOR_SCHEME } from '../../utils/config'

interface Props {
  href: string
  children: ReactNode
  isExternal?: boolean
  className?: string
}

export function LinkComponent(props: Props) {
  const className = props.className ?? ''
  const isExternal = props.href.match(/^([a-z0-9]*:|.{0})\/\/.*$/) || props.isExternal
  const color = useColorModeValue(`${THEME_COLOR_SCHEME}.600`, `${THEME_COLOR_SCHEME}.400`)

  if (isExternal) {
    return (
      <Link
        className={className}
        _hover={{ color: '#8c1c84' }}
        href={props.href}
        target="_blank"
        rel="noopener noreferrer">
        {props.children}
      </Link>
    )
  }

  return (
    <Link as={NextLink} className={className} _hover={{ color: color }} href={props.href}>
      {props.children}
    </Link>
  )
}

```

### src/components/layout/Seo.tsx

```
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

```

### src/components/layout/ThemeSwitcher.tsx

```
import React from 'react'
import { Box, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

interface Props {
  className?: string
}

export function ThemeSwitcher(props: Props) {
  const className = props.className ?? ''
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box className={className} onClick={toggleColorMode} _hover={{ cursor: 'pointer' }}>
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Box>
  )
}

```

### src/components/layout/index.tsx

```
import { Web3Modal } from '../../context/web3modal'
import { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import { Header } from './Header'

interface Props {
  children?: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <Web3Modal>
      <Box margin="0 auto" minH="100vh">
        <Header />
        <Container maxW="container.lg">{children}</Container>
      </Box>
    </Web3Modal>
  )
}

```

## src/context


### src/context/web3modal.tsx

```
'use client'
import React, { ReactNode, createContext, useContext } from 'react'
import { createAppKit, useAppKitProvider } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import {
  sepolia,
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
} from '@reown/appkit/networks'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// https://docs.reown.com/appkit/react/core/custom-networks

const metadata = {
  name: 'Genji',
  description: 'Next.js + Web3 Modal + Ethers.js + Chakra UI',
  url: 'https://genji.netlify.app',
  icons: ['./favicon.ico'],
}

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [sepolia, optimism, zksync, base, arbitrum, gnosis, polygon, polygonZkEvm, mantle, celo, avalanche, degen],
  defaultNetwork: sepolia,
  projectId,
  features: {
    email: true,
    socials: ['google', 'farcaster', 'github'],
  },
})

const AppKitContext = createContext<ReturnType<typeof useAppKitProvider> | null>(null)

export function Web3Modal({ children }: { children: ReactNode }) {
  const appKitProvider = useAppKitProvider('eip155:11155111' as any)

  return <AppKitContext.Provider value={appKitProvider}>{children}</AppKitContext.Provider>
}

export function useAppKit() {
  const context = useContext(AppKitContext)
  if (!context) {
    throw new Error('useAppKit must be used within a Web3Modal')
  }
  return context
}

```

## src/hooks


### src/hooks/useIsMounted.tsx

```
import { useState, useEffect } from 'react'

export function useIsMounted(): boolean {
  let [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

```

## src/pages


### src/pages/_app.tsx

```
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Seo } from '../components/layout/Seo'
import { ERC20_CONTRACT_ADDRESS } from '../utils/erc20'
import { useIsMounted } from '../hooks/useIsMounted'
import ErrorBoundary from '../components/layout/ErrorBoundary'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log('contract address:', ERC20_CONTRACT_ADDRESS)
  }, [])
  const isMounted = useIsMounted()

  return (
    <>
      <ErrorBoundary>
        <ChakraProvider>
          <Seo />
          {isMounted && (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </ChakraProvider>
      </ErrorBoundary>
    </>
  )
}

```

### src/pages/_document.tsx

```
import { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={'dark'} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

```

## src/pages/api


### src/pages/api/faucet.ts

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { address } = req.body

  if (!address) {
    return res.status(400).json({ message: 'Address is required' })
  }

  try {
    const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
    const pKey = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY

    if (!pKey) {
      throw new Error('Faucet private key is not set')
    }

    const specialSigner = new ethers.Wallet(pKey, customProvider)
    const tx = await specialSigner.sendTransaction({
      to: address,
      value: ethers.parseEther('0.025'),
    })

    let receipt: ethers.TransactionReceipt | null = null
    try {
      receipt = await tx.wait(1)
    } catch (waitError) {
      console.error('Error waiting for transaction:', waitError)
      return res.status(500).json({ message: 'Transaction failed or was reverted' })
    }

    if (receipt === null) {
      return res.status(500).json({ message: 'Transaction was not mined within the expected time' })
    }

    res.status(200).json({
      message: 'Faucet transaction successful',
      txHash: receipt.hash,
    })
  } catch (error) {
    console.error('Faucet error:', error)
    if (error instanceof Error) {
      return res.status(500).json({ message: `Internal server error: ${error.message}` })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

```

### src/pages/index.tsx

```
import * as React from 'react'
import { Text, Button, useToast, Box } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BrowserProvider, Contract, Eip1193Provider, parseEther } from 'ethers'
// import { useAppKitAccount, useAppKitProvider, useWalletInfo } from '@reown/appkit/react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI } from '../utils/erc20'
import { LinkComponent } from '../components/layout/LinkComponent'
import { ethers } from 'ethers'
import { Head } from '../components/layout/Head'
import { SITE_NAME, SITE_DESCRIPTION } from '../utils/config'

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [balance, setBalance] = useState<string>('0')
  const [network, setNetwork] = useState<string>('Unknown')
  // const [loginType, setLoginType] = useState<string>('Not connected')

  const { address, isConnected, caipAddress } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  // const { walletInfo } = useWalletInfo()
  const toast = useToast()

  useEffect(() => {
    if (isConnected) {
      setTxHash(undefined)
      getNetwork()
      // updateLoginType()
      getBal()
      console.log('user address:', address)
      console.log('erc20  contract address:', ERC20_CONTRACT_ADDRESS)
      // console.log('walletInfo:', walletInfo)
    }
  }, [isConnected, address, caipAddress])

  const getBal = async () => {
    if (isConnected && walletProvider) {
      const ethersProvider = new BrowserProvider(walletProvider as any)
      const balance = await ethersProvider.getBalance(address as any)

      const ethBalance = ethers.formatEther(balance)
      console.log('bal:', Number(parseFloat(ethBalance).toFixed(5)))
      setBalance(parseFloat(ethBalance).toFixed(5))
      if (ethBalance !== '0') {
        return Number(ethBalance)
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  const getNetwork = async () => {
    if (walletProvider) {
      const ethersProvider = new BrowserProvider(walletProvider as any)
      const network = await ethersProvider.getNetwork()
      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
      setNetwork(capitalize(network.name))
    }
  }

  // const updateLoginType = async () => {
  //   try {
  //     if (walletInfo != undefined) {
  //       setLoginType(walletInfo.name ? walletInfo.name : 'Unknown')
  //     }
  //   } catch (error) {
  //     console.error('Error getting login type:', error)
  //     setLoginType('Unknown')
  //   }
  // }

  const openEtherscan = () => {
    if (address) {
      const baseUrl =
        caipAddress === 'eip155:11155111:' ? 'https://sepolia.etherscan.io/address/' : 'https://etherscan.io/address/'
      window.open(baseUrl + address, '_blank')
    }
  }

  const faucetTx = async () => {
    try {
      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Faucet request failed')
      }
      return data.txHash
    } catch (error) {
      console.error('Faucet error:', error)
      throw error
    }
  }

  const doSomething = async () => {
    setTxHash(undefined)
    try {
      if (!isConnected) {
        toast({
          title: 'Not connected yet',
          description: 'Please connect your wallet, my friend.',
          status: 'error',
          position: 'bottom',
          variant: 'subtle',
          duration: 9000,
          isClosable: true,
        })
        return
      }
      if (walletProvider) {
        setIsLoading(true)
        setTxHash('')
        setTxLink('')
        const ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider)
        const signer = await ethersProvider.getSigner()

        const erc20 = new Contract(ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI, signer)

        ///// Send ETH if needed /////
        const bal = await getBal()
        console.log('bal:', bal)
        if (bal < 0.025) {
          const faucetTxHash = await faucetTx()
          console.log('faucet tx:', faucetTxHash)
          const bal = await getBal()
          console.log('bal:', bal)
        }
        ///// Call /////
        const call = await erc20.mint(parseEther('10000')) // 0.000804454399826656 ETH // https://sepolia.etherscan.io/tx/0x687e32332965aa451abe45f89c9fefc4b5afe6e99c95948a300565f16a212d7b

        let receipt: ethers.ContractTransactionReceipt | null = null
        try {
          receipt = await call.wait()
        } catch (error) {
          console.error('Error waiting for transaction:', error)
          throw new Error('Transaction failed or was reverted')
        }

        if (receipt === null) {
          throw new Error('Transaction receipt is null')
        }

        console.log('tx:', receipt)
        setTxHash(receipt.hash)
        setTxLink('https://sepolia.etherscan.io/tx/' + receipt.hash)
        setIsLoading(false)
        toast({
          title: 'Successful tx',
          description: 'Well done! 🎉',
          status: 'success',
          position: 'bottom',
          variant: 'subtle',
          duration: 20000,
          isClosable: true,
        })
        await getBal()
      }
    } catch (e) {
      setIsLoading(false)
      console.error('Error in doSomething:', e)
      toast({
        title: 'Woops',
        description: e instanceof Error ? e.message : 'Something went wrong...',
        status: 'error',
        position: 'bottom',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Head title={SITE_NAME} description={SITE_DESCRIPTION} />
      <main>
        {!isConnected ? (
          <>
            <Text>You can login with your email, Google, or with one of many wallets suported by Reown.</Text>
            <br />
          </>
        ) : (
          <Box
            p={4}
            borderWidth={1}
            borderRadius="lg"
            my={2}
            mb={8}
            onClick={openEtherscan}
            cursor="pointer"
            _hover={{ borderColor: 'blue.500', boxShadow: 'md' }}>
            <Text>
              Network: <strong>{network}</strong>
            </Text>
            {/* <Text>
              Login type: <strong>{loginType}</strong>
            </Text> */}
            <Text>
              Balance: <strong>{balance} ETH</strong>
            </Text>
            <Text>
              Address: <strong>{address || 'Not connected'}</strong>
            </Text>
          </Box>
        )}
        <Button
          colorScheme="blue"
          variant="outline"
          type="submit"
          onClick={doSomething}
          isLoading={isLoading}
          loadingText="Minting..."
          spinnerPlacement="end">
          Mint
        </Button>
        {txHash && isConnected && (
          <Text py={4} fontSize="14px" color="#45a2f8">
            <LinkComponent href={txLink ? txLink : ''}>{txHash}</LinkComponent>
          </Text>
        )}{' '}
      </main>
    </>
  )
}

```

## src/pages/new


### src/pages/new/index.tsx

```
import { Text, Button, useToast } from '@chakra-ui/react'

export default function New() {
  return (
    <>
      <main>
        <Text>A brand new page! 😋</Text>
      </main>
    </>
  )
}

```

## src/utils


### src/utils/config.ts

```typescript
import { ThemingProps } from '@chakra-ui/react'
export const SITE_DESCRIPTION = 'W3HC Next.js app template'
export const SITE_NAME = 'Genji'
export const SITE_URL = 'https://genji-app.netlify.app'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'blue'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'w3hc8'
export const SOCIAL_GITHUB = 'w3hc/genji'

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

```

### src/utils/erc20.ts

```typescript
// contract used in the example app: https://github.com/w3hc/w3hc-hardhat-template/
export const ERC20_CONTRACT_ADDRESS = '0xF57cE903E484ca8825F2c1EDc7F9EEa3744251eB' // Sepolia
// export const ERC20_CONTRACT_ADDRESS = '0x80Fae255a5261Ca183668259382A37789e86f92F' // OP Sepolia
export const ERC20_CONTRACT_ABI = <const>[
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_initialSupply',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "noEmit": true,
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"],
  "types": ["jest", "node"],
  "esModuleInterop": true
}

```

## Structure

```
├── .env.example
├── .eslintignore
├── .eslintrc.json
├── .github
    └── workflows
    │   └── run-tests.yml
├── .gitignore
├── .next
├── .prettierignore
├── .prettierrc.json
├── .swc
    └── plugins
    │   └── v7_macos_aarch64_0.106.15
├── .vscode
    ├── extensions.json
    └── settings.json
├── .well-known
    └── walletconnect.txt
├── README.md
├── genji_app_description.md
├── jest.config.ts
├── jest.setup.ts
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── public
    ├── favicon.ico
    └── huangshan.png
├── src
    ├── __tests__
    │   ├── Header.test.tsx
    │   └── index.test.tsx
    ├── components
    │   └── layout
    │   │   ├── ErrorBoundary.tsx
    │   │   ├── Head.tsx
    │   │   ├── Header.tsx
    │   │   ├── HeadingComponent.tsx
    │   │   ├── LinkComponent.tsx
    │   │   ├── Seo.tsx
    │   │   ├── ThemeSwitcher.tsx
    │   │   └── index.tsx
    ├── context
    │   └── web3modal.tsx
    ├── hooks
    │   └── useIsMounted.tsx
    ├── pages
    │   ├── _app.tsx
    │   ├── _document.tsx
    │   ├── api
    │   │   └── faucet.ts
    │   ├── index.tsx
    │   └── new
    │   │   └── index.tsx
    └── utils
    │   ├── config.ts
    │   └── erc20.ts
└── tsconfig.json
```

Timestamp: Nov 02 2024 04:04:09 PM UTC