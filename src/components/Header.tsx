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
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { useAppKit } from '@reown/appkit/react'
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import Link from 'next/link'
import { HamburgerIcon } from '@chakra-ui/icons'
import LanguageSelector from './LanguageSelector'
import { useTranslation } from '@/hooks/useTranslation'
import { useState, useEffect } from 'react'
import { buildDetector, type BuildStatus } from '@/utils/buildDetector'

export default function Header() {
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const t = useTranslation()

  const [scrollPosition, setScrollPosition] = useState(0)
  const [buildId, setBuildId] = useState<string | null>(null)
  const [buildStatus, setBuildStatus] = useState<BuildStatus | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const shouldSlide = scrollPosition > 0
  const leftSlideValue = shouldSlide ? 2000 : 0
  const rightSlideValue = shouldSlide ? 2000 : 0

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Wait for client-side hydration
    const initializeBuildId = async () => {
      const id = await buildDetector.getShortBuildId()
      console.log('Build ID extracted:', id) // Debug log
      setBuildId(id)

      // Check build status on mount
      if (id) {
        checkBuildStatus()
      }
    }

    // Small delay to ensure DOM is ready
    setTimeout(initializeBuildId, 100)
  }, [])

  const checkBuildStatus = async () => {
    setIsChecking(true)
    try {
      const status = await buildDetector.checkIfUpToDate('w3hc', 'genji')
      console.log('status:', status)
      setBuildStatus(status)
    } catch (error) {
      console.warn('Failed to check build status:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const getBuildStatusColor = () => {
    if (!buildStatus) return 'gray.400'
    return buildStatus.isUpToDate ? 'green.400' : 'orange.400'
  }

  const getBuildStatusIcon = () => {
    if (isChecking) return '⏳'
    if (!buildStatus) return '❓'
    return buildStatus.isUpToDate ? '✅' : '⚠️'
  }

  const getBuildTooltip = () => {
    if (isChecking) return 'Checking build status...'
    if (!buildStatus) return `Build ID: ${buildDetector.getBuildId()}`

    const status = buildStatus.isUpToDate ? 'Up to date' : 'Update available'
    const latest = buildStatus.latestCommit
    console.log('buildStatus.currentBuildId:', buildStatus.currentBuildId)
    return `${status}\nCurrent: ${buildStatus.currentBuildId}\nLatest: ${latest?.message} (${latest?.author})`
  }

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
        <Box transform={`translateX(-${leftSlideValue}px)`} transition="transform 0.5s ease-in-out">
          <Flex align="center" gap={3}>
            <Link href="/">
              <Heading as="h3" size="md" textAlign="center">
                Genji
              </Heading>
            </Link>
            {buildId ? (
              <Tooltip label={getBuildTooltip()} hasArrow whiteSpace="pre-line">
                <Text
                  fontSize="xs"
                  color={getBuildStatusColor()}
                  fontFamily="mono"
                  cursor="pointer"
                  onClick={checkBuildStatus}
                  _hover={{ opacity: 0.8 }}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  lineHeight="1"
                  height="fit-content"
                  alignSelf="center"
                >
                  <span>{getBuildStatusIcon()}</span>
                  {buildId}
                </Text>
              </Tooltip>
            ) : (
              <Text
                fontSize="xs"
                color="gray.600"
                fontFamily="mono"
                lineHeight="1"
                height="fit-content"
                alignSelf="center"
              >
                dev
              </Text>
            )}
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
            <MenuList>
              <Link href="/new" color="white">
                <MenuItem fontSize="md">{t.navigation.newPage}</MenuItem>
              </Link>
              <Link href="/wallet" color="white">
                <MenuItem fontSize="md">{t.navigation.walletGenerator}</MenuItem>
              </Link>
              <Link href="/referral" color="white">
                <MenuItem fontSize="md">{t.navigation.referral}</MenuItem>
              </Link>
              <Link href="/subscribe" color="white">
                <MenuItem fontSize="md">Subscribe</MenuItem>
              </Link>
              <Link href="/chat" color="white">
                <MenuItem fontSize="md">Chat</MenuItem>
              </Link>
            </MenuList>
          </Menu>
          <LanguageSelector />
        </Flex>
      </Flex>
    </Box>
  )
}
