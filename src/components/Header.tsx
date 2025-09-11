'use client'

import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react'
import { useAppKit } from '@reown/appkit/react'
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import Link from 'next/link'
import { HamburgerIcon } from '@chakra-ui/icons'
import LanguageSelector from './LanguageSelector'
import { useTranslation } from '@/hooks/useTranslation'
import { useState, useEffect } from 'react'
import { FaGithub } from 'react-icons/fa'

export default function Header() {
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const t = useTranslation()

  const [scrollPosition, setScrollPosition] = useState(0)

  const shouldSlide = scrollPosition > 0
  const leftSlideValue = shouldSlide ? 2000 : 0
  const rightSlideValue = shouldSlide ? 2000 : 0

  const GitHubIcon = FaGithub

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleConnect = () => {
    try {
      // Explicitly open the Connect view only when button is clicked
      open({ view: 'Connect' })
    } catch (error) {
      console.error('Connection error:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      // Clear any stored connection data to prevent auto-reconnection
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wagmi.wallet')
        localStorage.removeItem('wagmi.store')
        localStorage.removeItem('@w3m/wallet_id')
        localStorage.removeItem('@w3m/connected_connector')
      }
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  return (
    <Box as="header" py={4} position="fixed" w="100%" top={0} zIndex={10}>
      <Flex justify="space-between" align="center" px={4}>
        <Box transform={`translateX(-${leftSlideValue}px)`} transition="transform 0.5s ease-in-out">
          <Flex align="center" gap={3}>
            <Link href="/">
              <Heading as="h3" size="md" textAlign="center">
                Genji
              </Heading>
            </Link>
            <IconButton
              as="a"
              href="https://github.com/w3hc/genji"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              icon={<GitHubIcon />}
              variant="ghost"
              size="sm"
              color="white"
              _hover={{ color: 'white', bg: 'transparent' }}
            />
          </Flex>
        </Box>

        <Flex
          gap={2}
          align="center"
          transform={`translateX(${rightSlideValue}px)`}
          transition="transform 0.5s ease-in-out"
        >
          {!isConnected ? (
            <Button
              bg="#8c1c84"
              color="white"
              _hover={{
                bg: '#6d1566',
              }}
              onClick={handleConnect}
              size="sm"
              // Add explicit prevention of auto-trigger
              onMouseEnter={undefined}
              onFocus={undefined}
            >
              {t.common.login}
            </Button>
          ) : (
            <>
              <Box transform="scale(0.85)" transformOrigin="right center"></Box>
              <Button
                bg="#8c1c84"
                color="white"
                _hover={{
                  bg: '#6d1566',
                }}
                onClick={handleDisconnect}
                size="sm"
                ml={4}
              >
                {t.common.logout}
              </Button>
            </>
          )}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="ghost"
              size="sm"
            />
            <MenuList minWidth="180px" px={2}>
              <Link href="/new" color="white">
                <MenuItem fontSize="md" px={4} py={3}>
                  {t.navigation.newPage}
                </MenuItem>
              </Link>
              <Link href="/wallet" color="white">
                <MenuItem fontSize="md" px={4} py={3}>
                  {t.navigation.walletGenerator}
                </MenuItem>
              </Link>
              <Link href="/subscribe" color="white">
                <MenuItem fontSize="md" px={4} py={3}>
                  Subscribe
                </MenuItem>
              </Link>
              <Link href="/webauthn" color="white">
                <MenuItem fontSize="md" px={4} py={3}>
                  WebAuthn
                </MenuItem>
              </Link>
            </MenuList>
          </Menu>
          <LanguageSelector />
        </Flex>
      </Flex>
    </Box>
  )
}
