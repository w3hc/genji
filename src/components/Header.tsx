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
import { FaGithub } from 'react-icons/fa'

export default function Header() {
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const t = useTranslation()

  const [scrollPosition, setScrollPosition] = useState(0)
  const [buildId, setBuildId] = useState<string | null>(null)
  const [buildHash, setBuildHash] = useState<string | null>(null)
  const [buildStatus, setBuildStatus] = useState<BuildStatus | null>(null)
  const [isChecking, setIsChecking] = useState(false)

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

  useEffect(() => {
    // Initialize build ID on client-side
    const initializeBuildId = async () => {
      try {
        const id = await buildDetector.getShortBuildId()
        console.log('Build ID extracted:', id)
        setBuildId(id)

        // Check build status on mount
        if (id) {
          checkBuildStatus()
        }
      } catch (error) {
        console.error('Failed to get build ID:', error)
      }
    }

    // Small delay to ensure DOM is ready
    setTimeout(initializeBuildId, 100)
  }, [])

  const checkBuildStatus = async () => {
    setIsChecking(true)
    try {
      // Use the new file hashing method for more accurate comparison
      const status = await buildDetector.checkBuildStatusWithFileHash('w3hc', 'genji')
      console.log('File hash build status:', status)
      setBuildStatus(status)

      // Update the displayed build ID and hash
      if (status?.currentBuildId) {
        const liveBuildId =
          status.currentBuildId.length > 7
            ? status.currentBuildId.slice(0, 7)
            : status.currentBuildId
        setBuildId(liveBuildId)
      }

      if (status?.currentBuildHash) {
        setBuildHash(status.currentBuildHash)
      }
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
    if (isChecking) return 'Checking build status with file hashing...'
    if (!buildStatus) return `Build ID: ${buildId || 'Loading...'}`

    const method = buildStatus.hashMethod || 'unknown'
    const status = buildStatus.isUpToDate ? 'Up to date' : 'Update available'
    const latest = buildStatus.latestCommit

    let tooltip = `${status} (${method})`

    if (buildStatus.currentBuildHash) {
      tooltip += `\nBuild Hash: ${buildStatus.currentBuildHash}`
    }

    if (buildStatus.currentBuildId) {
      tooltip += `\nCommit: ${buildStatus.currentBuildId}`
    }

    if (latest) {
      tooltip += `\nLatest: ${latest.message} (${latest.author})`
    }

    return tooltip
  }

  // Debug function to show file hashes
  const showFileHashes = () => {
    const fileHashes = buildDetector.getFileHashes()
    const hashEntries = Object.entries(fileHashes)

    if (hashEntries.length > 0) {
      console.log('📋 Current file hashes:')
      hashEntries.forEach(([path, hash]) => {
        console.log(`   ${path}: ${hash}`)
      })
    } else {
      console.log('ℹ️ No file hashes available. Click the build ID to calculate them.')
    }
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

  const handleBuildIdClick = () => {
    checkBuildStatus()
    // Also show file hashes in console for debugging
    setTimeout(showFileHashes, 1000)
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
                  onClick={handleBuildIdClick}
                  _hover={{ opacity: 0.8 }}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  lineHeight="1"
                  minHeight="24px"
                  justifyContent="center"
                >
                  <span>{getBuildStatusIcon()}</span>
                  {buildHash ? buildHash : buildId}
                  {buildStatus?.hashMethod === 'file-hash' && '🔒'}
                </Text>
              </Tooltip>
            ) : (
              <Text
                fontSize="xs"
                color="gray.600"
                fontFamily="mono"
                lineHeight="1"
                minHeight="24px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                dev
              </Text>
            )}
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
