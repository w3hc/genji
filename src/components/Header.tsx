'use client'

import {
  Box,
  Button,
  Flex,
  Image,
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

export default function Header() {
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    try {
      open({ view: 'Connect' })
    } catch (error) {
      console.error('Connection error:', error)
    }
  }

  const handleDisconnect = () => {
    try {
      disconnect()
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  return (
    <Box as="header" py={4} position="fixed" w="100%" top={0} zIndex={10}>
      <Flex justify="space-between" align="center" px={4}>
        <Link href="/">
          <Heading as="h3" size="md" textAlign="center">
            Genji
          </Heading>
        </Link>
        <Flex gap={2} align="center">
          {!isConnected ? (
            <Button
              bg="#8c1c84"
              color="white"
              _hover={{
                bg: '#6d1566',
              }}
              onClick={handleConnect}
              size="sm"
            >
              Login
            </Button>
          ) : (
            <>
              <Box transform="scale(0.85)" transformOrigin="right center">
                <appkit-network-button />
              </Box>
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
                Logout
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
            <MenuList>
              <Link href="/new" color="white">
                <MenuItem fontSize="md">New page</MenuItem>
              </Link>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  )
}
