'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  Code,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { MdCheckCircle, MdError, MdInfo } from 'react-icons/md'
import { FiShield, FiExternalLink } from 'react-icons/fi'
import { brandColors } from '@/theme'
import Spinner from '@/components/Spinner'
import { getCurrentBuildHash } from 'w3pk'
import { ethers } from 'ethers'
import packageJson from '../../package.json'

// W3PK Version Registry on OP Mainnet
const REGISTRY_ADDRESS = '0xAF48C2DB335eD5da14A2C36a59Bc34407C63e01a'
const REGISTRY_ABI = [
  'function getLatestRelease() view returns (string version, string cid, uint256 timestamp)',
  'function getCidByVersion(string version) view returns (string)',
]
const OPTIMISM_RPC = 'https://mainnet.optimism.io'

// Get installed w3pk version from package.json
const getInstalledW3pkVersion = (): string => {
  const w3pkVersion = packageJson.dependencies['w3pk'] as string
  return w3pkVersion.replace(/^[~^]/, '') // Remove ^ or ~ prefix
}

export const BuildVerification = () => {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [currentHash, setCurrentHash] = useState<string>('')
  const [trustedHash, setTrustedHash] = useState<string>('')
  const [installedVersion, setInstalledVersion] = useState<string>('')
  const [error, setError] = useState<string>('')
  const hasVerified = useRef(false)

  useEffect(() => {
    if (hasVerified.current) return

    const verifyBuild = async () => {
      hasVerified.current = true
      setIsVerifying(true)
      setError('')

      try {
        // Get current build hash
        const hash = await getCurrentBuildHash()
        setCurrentHash(hash)

        // Get installed w3pk version from package.json
        const version = getInstalledW3pkVersion()
        setInstalledVersion(version)

        // Fetch trusted hash from onchain registry for the installed version
        const provider = new ethers.JsonRpcProvider(OPTIMISM_RPC)
        const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, provider)
        const onchainCid = await registry.getCidByVersion(`v${version}`)
        setTrustedHash(onchainCid)

        // Verify against onchain hash
        const verified = hash === onchainCid
        setIsVerified(verified)

        // Log results to console for manual verification
        console.log('🔐 W3PK Build Verification')
        console.log('═'.repeat(50))
        console.log('Installed version:', version)
        console.log('Current build hash:', hash)
        console.log('Expected hash:    ', onchainCid)
        console.log('Verification:     ', verified ? '✅ VERIFIED' : '❌ FAILED')
        console.log('═'.repeat(50))
        console.log('Registry contract:', REGISTRY_ADDRESS)
        console.log('Network:          OP Mainnet')
        console.log('═'.repeat(50))
        console.log('Verify manually in console:')
        console.log('')
        console.log('  await window.w3pk.getCurrentBuildHash()')
        console.log('')
        // AI Inspection feature (disabled)
        // console.log('Security inspection:')
        // console.log('')
        // console.log('  await window.w3pk.inspectNow()')
        // console.log('  await window.w3pk.inspect()')
        // console.log('')
        console.log('Full SDK available at window.w3pk')
        console.log('═'.repeat(50))
      } catch (err) {
        console.error('Build verification error:', err)
        setError((err as Error).message || 'Failed to verify build')
        setIsVerified(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyBuild()
  }, [])

  return (
    <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor={brandColors.primary}>
      <HStack mb={4} justify="space-between">
        <HStack>
          <Icon as={FiShield} color={brandColors.primary} boxSize={6} />
          <Heading size="md">W3PK Build Verification</Heading>
        </HStack>
        {isVerifying ? (
          <Spinner size="md" />
        ) : isVerified === true ? (
          <Icon as={MdCheckCircle} color="green.400" boxSize={6} />
        ) : (
          <Icon as={MdError} color="red.400" boxSize={6} />
        )}
      </HStack>

      <VStack align="stretch" gap={3}>
        {isVerifying ? (
          <HStack justify="center" py={4}>
            <Spinner size="md" />
            <Text fontSize="sm" color="gray.400">
              Verifying w3pk version...
            </Text>
          </HStack>
        ) : error ? (
          <Box bg="red.900/20" p={4} borderRadius="md" border="1px solid" borderColor="red.800">
            <HStack mb={2}>
              <Icon as={MdError} color="red.400" />
              <Text fontSize="sm" fontWeight="bold" color="red.300">
                Verification Error
              </Text>
            </HStack>
            <Text fontSize="xs" color="red.200">
              {error}
            </Text>
          </Box>
        ) : isVerified === true ? (
          <>
            <Box
              bg="green.900/20"
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor="green.800"
            >
              <HStack mb={2}>
                <Icon as={MdCheckCircle} color="green.400" />
                <Text fontSize="sm" fontWeight="bold" color="green.300">
                  Verified W3PK Version
                </Text>
              </HStack>
              <Text fontSize="xs" color="green.200">
                This app is running a verified and trusted version of W3PK (v{installedVersion}).
                The cryptographic build hash matches the DAO-maintained onchain registry.
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Installed version:
              </Text>
              <Code
                fontSize="xs"
                bg="gray.800"
                color="gray.300"
                px={2}
                py={1}
                display="block"
                wordBreak="break-all"
              >
                {installedVersion}
              </Code>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Current build hash:
              </Text>
              <Code
                fontSize="xs"
                bg="gray.800"
                color="gray.300"
                px={2}
                py={1}
                display="block"
                wordBreak="break-all"
              >
                {currentHash}
              </Code>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Trusted hash (onchain):
              </Text>
              <Code
                fontSize="xs"
                bg="gray.800"
                color="gray.300"
                px={2}
                py={1}
                display="block"
                wordBreak="break-all"
              >
                {trustedHash}
              </Code>
            </Box>
          </>
        ) : (
          <>
            <Box bg="red.900/20" p={4} borderRadius="md" border="1px solid" borderColor="red.800">
              <HStack mb={2}>
                <Icon as={MdError} color="red.400" />
                <Text fontSize="sm" fontWeight="bold" color="red.300">
                  Unverified W3PK Version
                </Text>
              </HStack>
              <Text fontSize="xs" color="red.200">
                Warning: This app is running an unverified version of W3PK (v{installedVersion}).
                The build hash does not match the trusted release. This could indicate a compromised
                package, development version, or tampering.
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Installed version:
              </Text>
              <Code
                fontSize="xs"
                bg="gray.800"
                color="gray.300"
                px={2}
                py={1}
                display="block"
                wordBreak="break-all"
              >
                {installedVersion}
              </Code>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Current build hash:
              </Text>
              <Code
                fontSize="xs"
                bg="gray.800"
                color="red.300"
                px={2}
                py={1}
                display="block"
                wordBreak="break-all"
              >
                {currentHash}
              </Code>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Expected hash (onchain):
              </Text>
              <Code
                fontSize="xs"
                bg="gray.800"
                color="gray.300"
                px={2}
                py={1}
                display="block"
                wordBreak="break-all"
              >
                {trustedHash}
              </Code>
            </Box>
          </>
        )}

        <Box bg="gray.800/50" p={3} borderRadius="md" mt={2}>
          <HStack mb={2}>
            <Icon as={MdInfo} color={brandColors.primary} boxSize={4} />
            <Text fontSize="xs" fontWeight="bold" color="gray.300">
              Why This Matters
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.400" mb={2}>
            This verification ensures you&apos;re running an authentic, unmodified version of W3PK
            by comparing its cryptographic hash against the DAO-maintained onchain registry on OP
            Mainnet. This protects you from supply chain attacks, compromised packages, and
            unauthorized modifications.
          </Text>
          <VStack align="stretch" gap={1} mb={0}>
            <ChakraLink
              href="https://github.com/w3hc/w3pk/blob/main/docs/BUILD_VERIFICATION.md"
              target="_blank"
              rel="noopener noreferrer"
              fontSize="xs"
              color={brandColors.primary}
              _hover={{ color: brandColors.secondary, textDecoration: 'underline' }}
              display="inline-flex"
              alignItems="center"
              gap={1}
            >
              Learn more or verify manually
              <Icon as={FiExternalLink} boxSize={3} />
            </ChakraLink>
            <Text fontSize="xs" color="gray.500" fontStyle="italic">
              Verification results are logged to the browser console (F12)
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}
