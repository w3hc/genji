'use client'

import {
  Container,
  Heading,
  Text,
  useToast,
  Button,
  Box,
  VStack,
  Input,
  FormControl,
  FormLabel,
  Badge,
  HStack,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Spacer,
  Code,
  Textarea,
  useClipboard,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Progress,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
} from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { CopyIcon, CheckIcon, DownloadIcon, DeleteIcon, AttachmentIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

// WebAuthn types
interface WebAuthnUser {
  id: string // Ethereum address
  privateKey?: string // Only included during registration
  username: string
  email: string
  hasAuthenticators: boolean
  authenticatorCount: number
  ethereumAddress: string
}

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

interface WalletInfo {
  address: string
  privateKey: string
}

interface SignatureResponse {
  message: string
  ethereumAddress: string
  signature: string
  recoveredAddress: string
}

// File storage types
interface FileInfo {
  filename: string
  originalName: string
  size: number
  uploadDate: string
  contentType?: string
}

interface UserStorageStats {
  ethereumAddress: string
  fileCount: number
  totalSize: number
  files: FileInfo[]
}

export default function WebAuthnPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<WebAuthnUser | null>(null)
  const [ethereumAddress, setEthereumAddress] = useState('')
  const [username, setUsername] = useState('Michael Jackson')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [lastAction, setLastAction] = useState<string>('')
  const [useUsernameless, setUseUsernameless] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)

  // Message signing state
  const [messageToSign, setMessageToSign] = useState('Hello, this is a test message!')
  const [signatureResult, setSignatureResult] = useState<SignatureResponse | null>(null)

  // File storage state
  const [fileStorageStats, setFileStorageStats] = useState<UserStorageStats | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [isDeletingFile, setIsDeletingFile] = useState<string | null>(null)
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toast = useToast()
  const t = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const bgColor = useColorModeValue('whiteAlpha.100', 'whiteAlpha.50')
  const borderColor = useColorModeValue('#8c1c84', '#8c1c84')

  const API_BASE = process.env.NEXT_PUBLIC_WEBAUTHN_API_URL || 'http://localhost:3000'

  // Clipboard functionality
  const { onCopy: copyAddress, hasCopied: hasCopiedAddress } = useClipboard(
    walletInfo?.address || ''
  )
  const { onCopy: copyPrivateKey, hasCopied: hasCopiedPrivateKey } = useClipboard(
    walletInfo?.privateKey || ''
  )
  const { onCopy: copySignature, hasCopied: hasCopiedSignature } = useClipboard(
    signatureResult?.signature || ''
  )
  const { onCopy: copyRecoveredAddress, hasCopied: hasCopiedRecoveredAddress } = useClipboard(
    signatureResult?.recoveredAddress || ''
  )

  // Load SimpleWebAuthn browser library
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@simplewebauthn/browser/dist/bundle/index.umd.min.js'
    script.async = true
    script.onload = () => {
      console.log('SimpleWebAuthn library loaded successfully')
    }
    script.onerror = () => {
      console.error('Failed to load SimpleWebAuthn library')
      showToast('Error', 'Failed to load WebAuthn library', 'error')
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const showToast = (
    title: string,
    description: string,
    status: 'success' | 'error' | 'info' | 'warning'
  ) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: 'top',
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString()
  }

  // File storage functions
  const loadFileStorageStats = async () => {
    if (!ethereumAddress) {
      showToast('Error', 'Please enter an Ethereum address', 'error')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/store/stats/${ethereumAddress}`)

      if (!response.ok) {
        if (response.status === 404) {
          setFileStorageStats({
            ethereumAddress,
            fileCount: 0,
            totalSize: 0,
            files: [],
          })
          return
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result: ApiResponse<UserStorageStats> = await response.json()

      if (result.success && result.data) {
        setFileStorageStats(result.data)
      } else {
        throw new Error(result.message || 'Failed to load storage stats')
      }
    } catch (error: any) {
      console.error('Load storage stats error:', error)
      showToast('Error', error.message, 'error')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ethereumAddress) {
      showToast('Error', 'Please enter an Ethereum address', 'error')
      return
    }

    setIsUploadingFile(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('ethereumAddress', ethereumAddress)

      // Simulate progress (since we can't track real upload progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch(`${API_BASE}/store/upload`, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
      }

      const result: ApiResponse<FileInfo> = await response.json()

      if (result.success) {
        showToast('Success', `File "${file.name}" uploaded successfully!`, 'success')
        await loadFileStorageStats() // Refresh the file list

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        throw new Error(result.message || 'Upload failed')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      showToast('Upload Failed', error.message, 'error')
    } finally {
      setIsUploadingFile(false)
      setUploadProgress(0)
    }
  }

  const downloadFile = async (filename: string, originalName: string) => {
    if (!ethereumAddress) return

    try {
      const response = await fetch(`${API_BASE}/store/download/${ethereumAddress}/${filename}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = originalName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showToast('Success', `File "${originalName}" downloaded successfully!`, 'success')
    } catch (error: any) {
      console.error('Download error:', error)
      showToast('Download Failed', error.message, 'error')
    }
  }

  const downloadAllFiles = async () => {
    if (!ethereumAddress) return

    setIsDownloadingAll(true)
    try {
      const response = await fetch(`${API_BASE}/store/download-all/${ethereumAddress}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${ethereumAddress}_files.bundle`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showToast('Success', 'All files downloaded successfully!', 'success')
    } catch (error: any) {
      console.error('Download all error:', error)
      showToast('Download Failed', error.message, 'error')
    } finally {
      setIsDownloadingAll(false)
    }
  }

  const deleteFile = async (filename: string, originalName: string) => {
    if (!ethereumAddress) return

    setIsDeletingFile(filename)
    try {
      const response = await fetch(`${API_BASE}/store/file/${ethereumAddress}/${filename}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result: ApiResponse = await response.json()

      if (result.success) {
        showToast('Success', `File "${originalName}" deleted successfully!`, 'success')
        await loadFileStorageStats() // Refresh the file list
      } else {
        throw new Error(result.message || 'Delete failed')
      }
    } catch (error: any) {
      console.error('Delete error:', error)
      showToast('Delete Failed', error.message, 'error')
    } finally {
      setIsDeletingFile(null)
    }
  }

  const register = async () => {
    if (!username) {
      showToast('Error', 'Please enter a username', 'error')
      return
    }

    setIsLoading(true)
    setLastAction('Starting registration...')

    try {
      // Check if SimpleWebAuthn is loaded
      if (!window.SimpleWebAuthnBrowser) {
        throw new Error('WebAuthn library not loaded. Please refresh the page.')
      }

      const { startRegistration } = window.SimpleWebAuthnBrowser

      // Begin registration - API will generate Ethereum address
      const beginResponse = await fetch(`${API_BASE}/webauthn/register/begin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }), // Only username needed now
      })

      if (!beginResponse.ok) {
        const errorText = await beginResponse.text()
        throw new Error(`HTTP ${beginResponse.status}: ${beginResponse.statusText} - ${errorText}`)
      }

      const beginResult: ApiResponse<{
        options: any
        ethereumAddress: string
        privateKey: string
      }> = await beginResponse.json()

      if (!beginResult.success || !beginResult.data) {
        throw new Error(beginResult.message || 'Failed to begin registration')
      }

      const { options, ethereumAddress: newEthereumAddress, privateKey } = beginResult.data

      // Store the generated Ethereum info
      setEthereumAddress(newEthereumAddress)
      setWalletInfo({
        address: newEthereumAddress,
        privateKey: privateKey,
      })

      setLastAction(`Ethereum wallet created: ${newEthereumAddress}. Waiting for authenticator...`)

      // Start WebAuthn registration
      const attResp = await startRegistration(options)

      setLastAction('Verifying registration...')

      // Complete registration using the Ethereum address
      const completeResponse = await fetch(`${API_BASE}/webauthn/register/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ethereumAddress: newEthereumAddress,
          response: attResp,
        }),
      })

      if (!completeResponse.ok) {
        const errorText = await completeResponse.text()
        throw new Error(
          `HTTP ${completeResponse.status}: ${completeResponse.statusText} - ${errorText}`
        )
      }

      const completeResult: ApiResponse<{ user: WebAuthnUser }> = await completeResponse.json()

      if (completeResult.success && completeResult.data?.user) {
        setUser(completeResult.data.user)
        setLastAction('Registration completed successfully!')
        showToast(
          'Success',
          `Passkey registered successfully! Ethereum wallet created: ${newEthereumAddress}`,
          'success'
        )

        // Switch to authenticate tab
        setActiveTab(1)
      } else {
        throw new Error(completeResult.message || 'Registration failed')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      setLastAction(`Registration failed: ${error.message}`)

      // Provide helpful error messages
      if (error.name === 'NotAllowedError') {
        showToast(
          'Registration Cancelled',
          'You cancelled the registration or it timed out. Please try again.',
          'warning'
        )
      } else if (error.name === 'NotSupportedError') {
        showToast('Not Supported', 'WebAuthn is not supported on this device or browser.', 'error')
      } else if (error.name === 'SecurityError') {
        showToast(
          'Security Error',
          'Please ensure you are using HTTPS and the domain is configured correctly.',
          'error'
        )
      } else {
        showToast('Registration Failed', error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Usernameless authentication using resident keys
  const authenticateUsernameless = async () => {
    setIsLoading(true)
    setLastAction('Starting usernameless authentication...')

    try {
      if (!window.SimpleWebAuthnBrowser) {
        throw new Error('WebAuthn library not loaded. Please refresh the page.')
      }

      const { startAuthentication } = window.SimpleWebAuthnBrowser

      // Begin usernameless authentication
      const beginResponse = await fetch(`${API_BASE}/webauthn/authenticate/usernameless/begin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (!beginResponse.ok) {
        const errorText = await beginResponse.text()
        throw new Error(`HTTP ${beginResponse.status}: ${beginResponse.statusText} - ${errorText}`)
      }

      const beginResult: ApiResponse = await beginResponse.json()

      if (!beginResult.success) {
        throw new Error(beginResult.message || 'Failed to begin usernameless authentication')
      }

      const options = beginResult.data?.options
      if (!options) {
        throw new Error('Invalid response: missing options data')
      }

      setLastAction('Waiting for authenticator...')

      // Start WebAuthn authentication
      const authResp = await startAuthentication(options)

      setLastAction('Verifying authentication...')

      // Complete authentication
      const completeResponse = await fetch(
        `${API_BASE}/webauthn/authenticate/usernameless/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            response: authResp,
          }),
        }
      )

      if (!completeResponse.ok) {
        const errorText = await completeResponse.text()
        throw new Error(
          `HTTP ${completeResponse.status}: ${completeResponse.statusText} - ${errorText}`
        )
      }

      const completeResult: ApiResponse<{ user: WebAuthnUser }> = await completeResponse.json()

      if (completeResult.success && completeResult.data?.user) {
        setUser(completeResult.data.user)
        setIsAuthenticated(true)
        setEthereumAddress(completeResult.data.user.ethereumAddress)
        setLastAction('Usernameless authentication successful!')
        showToast('Success', `Welcome back, ${completeResult.data.user.username}!`, 'success')
      } else {
        throw new Error(completeResult.message || 'Authentication failed')
      }
    } catch (error: any) {
      console.error('Usernameless authentication error:', error)
      setLastAction(`Usernameless authentication failed: ${error.message}`)

      if (error.name === 'NotAllowedError') {
        showToast(
          'Authentication Cancelled',
          'You cancelled the authentication or it timed out.',
          'warning'
        )
      } else {
        showToast('Authentication Failed', error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Regular authentication with Ethereum address
  const authenticate = async () => {
    if (!ethereumAddress) {
      showToast('Error', 'Please enter an Ethereum address', 'error')
      return
    }

    setIsLoading(true)
    setLastAction('Authenticating...')

    try {
      if (!window.SimpleWebAuthnBrowser) {
        throw new Error('WebAuthn library not loaded. Please refresh the page.')
      }

      const { startAuthentication } = window.SimpleWebAuthnBrowser

      // Begin authentication
      const beginResponse = await fetch(`${API_BASE}/webauthn/authenticate/begin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ethereumAddress }),
      })

      if (!beginResponse.ok) {
        const errorText = await beginResponse.text()
        throw new Error(`HTTP ${beginResponse.status}: ${beginResponse.statusText} - ${errorText}`)
      }

      const beginResult: ApiResponse = await beginResponse.json()

      if (!beginResult.success) {
        throw new Error(beginResult.message || 'Failed to begin authentication')
      }

      const options = beginResult.data?.options
      if (!options) {
        throw new Error('Invalid response: missing options data')
      }

      setLastAction('Waiting for authenticator...')

      // Start WebAuthn authentication
      const authResp = await startAuthentication(options)

      setLastAction('Verifying authentication...')

      // Complete authentication
      const completeResponse = await fetch(`${API_BASE}/webauthn/authenticate/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ethereumAddress,
          response: authResp,
        }),
      })

      if (!completeResponse.ok) {
        const errorText = await completeResponse.text()
        throw new Error(
          `HTTP ${completeResponse.status}: ${completeResponse.statusText} - ${errorText}`
        )
      }

      const completeResult: ApiResponse<{ user: WebAuthnUser }> = await completeResponse.json()

      if (completeResult.success && completeResult.data?.user) {
        setUser(completeResult.data.user)
        setIsAuthenticated(true)
        setLastAction('Authentication successful!')
        showToast('Success', 'Authentication successful!', 'success')
      } else {
        throw new Error(completeResult.message || 'Authentication failed')
      }
    } catch (error: any) {
      console.error('Authentication error:', error)
      setLastAction(`Authentication failed: ${error.message}`)

      if (error.name === 'NotAllowedError') {
        showToast(
          'Authentication Cancelled',
          'You cancelled the authentication or it timed out.',
          'warning'
        )
      } else if (error.message.includes('User not found')) {
        showToast(
          'User Not Found',
          'No user found with that Ethereum address. Please register first.',
          'error'
        )
      } else {
        showToast('Authentication Failed', error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getUserInfo = async () => {
    if (!ethereumAddress) {
      showToast('Error', 'Please enter an Ethereum address', 'error')
      return
    }

    setIsLoading(true)
    setLastAction('Fetching user data...')

    try {
      const response = await fetch(
        `${API_BASE}/webauthn/user?ethereumAddress=${encodeURIComponent(ethereumAddress)}`
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
      }

      const result: ApiResponse<{ user: WebAuthnUser }> = await response.json()

      if (result.success && result.data?.user) {
        setUser(result.data.user)
        setLastAction('User data fetched successfully')
        showToast('Success', 'User data fetched successfully', 'success')
      } else {
        throw new Error(result.message || 'Failed to get user info')
      }
    } catch (error: any) {
      console.error('Get user error:', error)
      setLastAction(`Query failed: ${error.message}`)

      if (error.message.includes('User not found')) {
        showToast('User Not Found', 'No user found with that Ethereum address.', 'error')
      } else {
        showToast('Query Failed', error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signMessage = async () => {
    if (!messageToSign.trim()) {
      showToast('Error', 'Please enter a message to sign', 'error')
      return
    }

    if (!ethereumAddress) {
      showToast('Error', 'Please enter an Ethereum address', 'error')
      return
    }

    setIsLoading(true)
    setLastAction('Signing message...')

    try {
      const response = await fetch(`${API_BASE}/web3/sign-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ethereumAddress,
          message: messageToSign,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
      }

      const result: ApiResponse<SignatureResponse> = await response.json()

      if (result.success && result.data) {
        setSignatureResult(result.data)
        setLastAction('Message signed successfully!')
        showToast('Success', 'Message signed successfully!', 'success')
      } else {
        throw new Error(result.message || 'Failed to sign message')
      }
    } catch (error: any) {
      console.error('Sign message error:', error)
      setLastAction(`Sign message failed: ${error.message}`)

      if (error.message.includes('User not found')) {
        showToast('User Not Found', 'No user found with that Ethereum address.', 'error')
      } else {
        showToast('Sign Message Failed', error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setWalletInfo(null)
    setSignatureResult(null)
    setFileStorageStats(null)
    setLastAction('Logged out')
    showToast('Info', 'Logged out successfully', 'info')
  }

  const clearForm = () => {
    setEthereumAddress('')
    setUsername('')
    setUser(null)
    setIsAuthenticated(false)
    setWalletInfo(null)
    setSignatureResult(null)
    setFileStorageStats(null)
    setMessageToSign('Hello, this is a test message!')
    setLastAction('')
  }

  return (
    <main>
      <Container maxW="container.lg" py={8} position="relative">
        <VStack spacing={8} align="stretch">
          <header>
            <Heading as="h1" size="xl" mb={2} color="#45a2f8" textAlign="center">
              WebAuthn Playground
            </Heading>
            <Text fontSize="lg" color="gray.400" textAlign="center">
              Passwordless auth for everyone
            </Text>
          </header>

          {/* Authentication Status */}
          {isAuthenticated && user && (
            <Alert status="success" borderRadius="md" bg="green.50" borderColor="green.200">
              <AlertIcon color="green.500" />
              <Box>
                <AlertTitle color="green.800">Successfully Authenticated!</AlertTitle>
                <AlertDescription color="green.700">
                  Welcome back, <strong>{user.username}</strong>
                </AlertDescription>
              </Box>
              <Spacer />
              <Button size="sm" onClick={logout} colorScheme="red">
                Logout
              </Button>
            </Alert>
          )}

          {/* Authentication Mode Toggle */}
          <Box bg={bgColor} p={6} borderRadius="lg" border="2px solid" borderColor={borderColor}>
            <Flex align="center" justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" color="#45a2f8" fontSize="lg">
                  Authentication Mode
                </Text>
                <Text fontSize="sm" color="gray.400">
                  {useUsernameless
                    ? 'One-click authentication using passkeys (recommended)'
                    : 'Traditional authentication requiring Ethereum address input'}
                </Text>
              </VStack>
              <VStack align="end" spacing={2}>
                <HStack>
                  <Text fontSize="sm" color="gray.400">
                    Traditional
                  </Text>
                  <Switch
                    colorScheme="blue"
                    size="lg"
                    isChecked={useUsernameless}
                    onChange={e => setUseUsernameless(e.target.checked)}
                  />
                  <Text fontSize="sm" color="gray.400">
                    Usernameless
                  </Text>
                </HStack>
              </VStack>
            </Flex>
          </Box>

          <Tabs
            variant="enclosed"
            colorScheme="blue"
            index={activeTab}
            onChange={index => setActiveTab(index)}
          >
            <TabList>
              <Tab>Register Passkey</Tab>
              <Tab>Authenticate</Tab>
              <Tab>User Info</Tab>
              <Tab>Sign Message</Tab>
              <Tab>Store Files</Tab>
            </TabList>

            <TabPanels>
              {/* Registration Tab */}
              <TabPanel>
                <VStack spacing={6}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Create Your Passkey</AlertTitle>
                      Register a passkey to enable secure, passwordless authentication.
                    </Box>
                  </Alert>

                  <Box
                    bg={bgColor}
                    p={6}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={borderColor}
                    width="100%"
                  >
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel color="#45a2f8">Username</FormLabel>
                        <Input
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          placeholder="Enter display name (e.g., Michael Jackson)"
                          borderColor={borderColor}
                          _focus={{ borderColor: '#45a2f8', boxShadow: '0 0 0 1px #45a2f8' }}
                        />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          An Ethereum wallet will be automatically generated and used as your unique
                          ID.
                        </Text>
                      </FormControl>
                    </VStack>
                  </Box>

                  <VStack spacing={3} width="100%">
                    <Button
                      onClick={register}
                      isLoading={isLoading}
                      loadingText="Creating Wallet & Passkey..."
                      bg="linear-gradient(135deg, #8c1c84, #45a2f8)"
                      color="white"
                      _hover={{ transform: 'translateY(-2px)', opacity: 0.9 }}
                      width="100%"
                      size="lg"
                      height="60px"
                    >
                      Create Passkey
                    </Button>

                    <Button onClick={clearForm} variant="ghost" size="sm" color="gray.500">
                      Clear Form
                    </Button>
                  </VStack>
                </VStack>
              </TabPanel>

              {/* Authentication Tab */}
              <TabPanel>
                <VStack spacing={6}>
                  {useUsernameless ? (
                    <VStack spacing={6} width="100%">
                      <Alert status="success" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Usernameless Authentication</AlertTitle>
                          <AlertDescription>
                            Click the button below to authenticate without entering credentials.
                            Your device will automatically present available passkeys for this site.
                          </AlertDescription>
                        </Box>
                      </Alert>

                      <Button
                        onClick={authenticateUsernameless}
                        isLoading={isLoading}
                        loadingText="Authenticating..."
                        bg="linear-gradient(135deg, #45a2f8, #8c1c84)"
                        color="white"
                        _hover={{ transform: 'translateY(-2px)', opacity: 0.9 }}
                        width="100%"
                        size="lg"
                        height="60px"
                        fontSize="lg"
                      >
                        Authenticate with Passkey
                      </Button>

                      <Text fontSize="sm" color="gray.500" textAlign="center">
                        No username or password required. Just use your biometric or device PIN.
                      </Text>
                    </VStack>
                  ) : (
                    <VStack spacing={6} width="100%">
                      <Alert status="warning" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Traditional Authentication</AlertTitle>
                          <AlertDescription>
                            Enter your ID (Ethereum address) to authenticate with your registered
                            passkey.
                          </AlertDescription>
                        </Box>
                      </Alert>

                      <Box
                        bg={bgColor}
                        p={6}
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={borderColor}
                        width="100%"
                      >
                        <FormControl>
                          <FormLabel color="#45a2f8">Ethereum Address</FormLabel>
                          <Input
                            value={ethereumAddress}
                            onChange={e => setEthereumAddress(e.target.value)}
                            placeholder="Enter your Ethereum address (0x...)"
                            borderColor={borderColor}
                            _focus={{ borderColor: '#45a2f8', boxShadow: '0 0 0 1px #45a2f8' }}
                          />
                        </FormControl>
                      </Box>

                      <Button
                        onClick={authenticate}
                        isLoading={isLoading}
                        loadingText="Authenticating..."
                        bg="linear-gradient(135deg, #45a2f8, #8c1c84)"
                        color="white"
                        _hover={{ transform: 'translateY(-2px)', opacity: 0.9 }}
                        width="100%"
                        size="lg"
                        height="60px"
                      >
                        Authenticate with Ethereum Address
                      </Button>
                    </VStack>
                  )}
                </VStack>
              </TabPanel>

              {/* User Info Tab */}
              <TabPanel>
                <VStack spacing={6}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>User Information Lookup</AlertTitle>
                      <AlertDescription>
                        Query user information and registered authenticators by Ethereum address.
                      </AlertDescription>
                    </Box>
                  </Alert>

                  <Box
                    bg={bgColor}
                    p={6}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={borderColor}
                    width="100%"
                  >
                    <FormControl>
                      <FormLabel color="#45a2f8">Ethereum Address</FormLabel>
                      <Input
                        value={ethereumAddress}
                        onChange={e => setEthereumAddress(e.target.value)}
                        placeholder="Enter Ethereum address to lookup (0x...)"
                        borderColor={borderColor}
                        _focus={{ borderColor: '#45a2f8', boxShadow: '0 0 0 1px #45a2f8' }}
                      />
                    </FormControl>
                  </Box>

                  <Button
                    onClick={getUserInfo}
                    isLoading={isLoading}
                    loadingText="Loading..."
                    variant="outline"
                    borderColor={borderColor}
                    color="#45a2f8"
                    _hover={{ bg: 'whiteAlpha.100' }}
                    width="100%"
                    size="lg"
                    height="60px"
                  >
                    Get User Information
                  </Button>
                </VStack>
              </TabPanel>

              {/* Sign Message Tab */}
              <TabPanel>
                <VStack spacing={6}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Sign Message</AlertTitle>
                      <AlertDescription>
                        Sign a message using the private key associated with your Ethereum address.
                      </AlertDescription>
                    </Box>
                  </Alert>

                  <Box
                    bg={bgColor}
                    p={6}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={borderColor}
                    width="100%"
                  >
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel color="#45a2f8">Ethereum Address</FormLabel>
                        <Input
                          value={ethereumAddress}
                          onChange={e => setEthereumAddress(e.target.value)}
                          placeholder="Enter your Ethereum address (0x...)"
                          borderColor={borderColor}
                          _focus={{ borderColor: '#45a2f8', boxShadow: '0 0 0 1px #45a2f8' }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color="#45a2f8">Message to Sign</FormLabel>
                        <Textarea
                          value={messageToSign}
                          onChange={e => setMessageToSign(e.target.value)}
                          placeholder="Enter the message you want to sign..."
                          borderColor={borderColor}
                          _focus={{ borderColor: '#45a2f8', boxShadow: '0 0 0 1px #45a2f8' }}
                          rows={3}
                        />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          This message will be signed using your private key.
                        </Text>
                      </FormControl>
                    </VStack>
                  </Box>

                  <Button
                    onClick={signMessage}
                    isLoading={isLoading}
                    loadingText="Signing..."
                    bg="linear-gradient(135deg, #8c1c84, #45a2f8)"
                    color="white"
                    _hover={{ transform: 'translateY(-2px)', opacity: 0.9 }}
                    width="100%"
                    size="lg"
                    height="60px"
                  >
                    Sign Message
                  </Button>

                  {/* Signature Result Display */}
                  {signatureResult && (
                    <Box
                      bg={bgColor}
                      p={6}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="green.500"
                      width="100%"
                    >
                      <VStack spacing={4} align="stretch">
                        <Heading size="md" color="green.500" textAlign="center">
                          Message Signed Successfully!
                        </Heading>

                        <VStack spacing={3} align="stretch">
                          <Box>
                            <HStack justify="space-between" align="center">
                              <Text fontWeight="bold" color="#45a2f8">
                                Original Message:
                              </Text>
                            </HStack>
                            <Box bg="whiteAlpha.50" p={3} borderRadius="md" mt={1}>
                              <Text fontSize="sm" fontFamily="mono" wordBreak="break-word">
                                {signatureResult.message}
                              </Text>
                            </Box>
                          </Box>

                          <Box>
                            <HStack justify="space-between" align="center">
                              <Text fontWeight="bold" color="#45a2f8">
                                Ethereum Address:
                              </Text>
                              <IconButton
                                aria-label="Copy address"
                                icon={hasCopiedRecoveredAddress ? <CheckIcon /> : <CopyIcon />}
                                size="sm"
                                onClick={copyRecoveredAddress}
                                variant="ghost"
                                colorScheme={hasCopiedRecoveredAddress ? 'green' : 'gray'}
                              />
                            </HStack>
                            <Code
                              fontSize="sm"
                              p={2}
                              borderRadius="md"
                              bg="whiteAlpha.50"
                              wordBreak="break-all"
                              display="block"
                            >
                              {signatureResult.ethereumAddress}
                            </Code>
                          </Box>

                          <Box>
                            <HStack justify="space-between" align="center">
                              <Text fontWeight="bold" color="#45a2f8">
                                Signature:
                              </Text>
                              <IconButton
                                aria-label="Copy signature"
                                icon={hasCopiedSignature ? <CheckIcon /> : <CopyIcon />}
                                size="sm"
                                onClick={copySignature}
                                variant="ghost"
                                colorScheme={hasCopiedSignature ? 'green' : 'gray'}
                              />
                            </HStack>
                            <Code
                              fontSize="xs"
                              p={2}
                              borderRadius="md"
                              bg="whiteAlpha.50"
                              wordBreak="break-all"
                              display="block"
                            >
                              {signatureResult.signature}
                            </Code>
                          </Box>

                          <Box>
                            <HStack justify="space-between" align="center">
                              <Text fontWeight="bold" color="#45a2f8">
                                Recovered Address:
                              </Text>
                              <Badge
                                colorScheme={
                                  signatureResult.recoveredAddress.toLowerCase() ===
                                  signatureResult.ethereumAddress.toLowerCase()
                                    ? 'green'
                                    : 'red'
                                }
                                variant="solid"
                              >
                                {signatureResult.recoveredAddress.toLowerCase() ===
                                signatureResult.ethereumAddress.toLowerCase()
                                  ? 'Valid'
                                  : 'Invalid'}
                              </Badge>
                            </HStack>
                            <Code
                              fontSize="sm"
                              p={2}
                              borderRadius="md"
                              bg="whiteAlpha.50"
                              wordBreak="break-all"
                              display="block"
                            >
                              {signatureResult.recoveredAddress}
                            </Code>
                            <Text fontSize="xs" color="gray.500" mt={1}>
                              This address was recovered from the signature and should match your
                              Ethereum address.
                            </Text>
                          </Box>
                        </VStack>

                        <Button
                          onClick={() => setSignatureResult(null)}
                          variant="outline"
                          size="sm"
                          colorScheme="gray"
                        >
                          Clear Result
                        </Button>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </TabPanel>

              {/* Store Files Tab */}
              <TabPanel>
                <VStack spacing={6}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>File Storage</AlertTitle>
                      <AlertDescription>
                        Upload, manage, and download your personal files securely stored with your
                        Ethereum address.
                      </AlertDescription>
                    </Box>
                  </Alert>

                  {/* Ethereum Address Input */}
                  <Box
                    bg={bgColor}
                    p={6}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={borderColor}
                    width="100%"
                  >
                    <HStack spacing={4}>
                      <FormControl flex="1">
                        <FormLabel color="#45a2f8">Ethereum Address</FormLabel>
                        <Input
                          value={ethereumAddress}
                          onChange={e => setEthereumAddress(e.target.value)}
                          placeholder="Enter your Ethereum address (0x...)"
                          borderColor={borderColor}
                          _focus={{ borderColor: '#45a2f8', boxShadow: '0 0 0 1px #45a2f8' }}
                        />
                      </FormControl>
                      <Button
                        onClick={loadFileStorageStats}
                        colorScheme="blue"
                        variant="outline"
                        mt={6}
                        minW="120px"
                      >
                        Load Files
                      </Button>
                    </HStack>
                  </Box>

                  {/* File Upload Section */}
                  <Box
                    bg={bgColor}
                    p={6}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={borderColor}
                    width="100%"
                  >
                    <VStack spacing={4}>
                      <Heading size="md" color="#45a2f8" alignSelf="start">
                        Upload File
                      </Heading>

                      <HStack width="100%" spacing={4}>
                        <Input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          disabled={isUploadingFile || !ethereumAddress}
                          accept=".txt,.json,.csv,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp3,.mp4"
                          bg="whiteAlpha.50"
                          borderColor={borderColor}
                          _focus={{ borderColor: '#45a2f8' }}
                          flex="1"
                        />
                        <Button
                          leftIcon={<AttachmentIcon />}
                          onClick={() => fileInputRef.current?.click()}
                          isDisabled={isUploadingFile || !ethereumAddress}
                          colorScheme="green"
                          minW="120px"
                        >
                          Choose File
                        </Button>
                      </HStack>

                      {isUploadingFile && (
                        <Box width="100%">
                          <Text fontSize="sm" color="gray.500" mb={2}>
                            Uploading file...
                          </Text>
                          <Progress
                            value={uploadProgress}
                            colorScheme="blue"
                            borderRadius="md"
                            bg="whiteAlpha.200"
                          />
                        </Box>
                      )}

                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Supported formats: TXT, JSON, CSV, PDF, DOC, DOCX, JPG, JPEG, PNG, GIF, MP3,
                        MP4 (Max: 10MB)
                      </Text>
                    </VStack>
                  </Box>

                  {/* File Statistics */}
                  {fileStorageStats && (
                    <Box
                      bg={bgColor}
                      p={6}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor={borderColor}
                      width="100%"
                    >
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between" align="center">
                          <Heading size="md" color="#45a2f8">
                            Storage Overview
                          </Heading>
                          <HStack>
                            <Button
                              leftIcon={<DownloadIcon />}
                              onClick={downloadAllFiles}
                              isLoading={isDownloadingAll}
                              loadingText="Downloading..."
                              colorScheme="purple"
                              size="sm"
                              isDisabled={fileStorageStats.fileCount === 0}
                            >
                              Download All
                            </Button>
                            <Button
                              onClick={loadFileStorageStats}
                              colorScheme="blue"
                              variant="outline"
                              size="sm"
                            >
                              Refresh
                            </Button>
                          </HStack>
                        </HStack>

                        <HStack spacing={8}>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.400">
                              Total Files
                            </Text>
                            <Badge colorScheme="blue" fontSize="lg" px={3} py={1}>
                              {fileStorageStats.fileCount}
                            </Badge>
                          </VStack>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.400">
                              Total Size
                            </Text>
                            <Badge colorScheme="green" fontSize="lg" px={3} py={1}>
                              {formatFileSize(fileStorageStats.totalSize)}
                            </Badge>
                          </VStack>
                        </HStack>
                      </VStack>
                    </Box>
                  )}

                  {/* File List Table */}
                  {fileStorageStats && fileStorageStats.files.length > 0 && (
                    <Box
                      bg={bgColor}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor={borderColor}
                      width="100%"
                      overflow="hidden"
                    >
                      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
                        <Heading size="md" color="#45a2f8">
                          Your Files
                        </Heading>
                      </Box>

                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead bg="whiteAlpha.50">
                            <Tr>
                              <Th color="gray.400">File Name</Th>
                              <Th color="gray.400">Size</Th>
                              <Th color="gray.400">Upload Date</Th>
                              <Th color="gray.400">Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {fileStorageStats.files.map(file => (
                              <Tr key={file.filename} _hover={{ bg: 'whiteAlpha.50' }}>
                                <Td>
                                  <VStack align="start" spacing={1}>
                                    <Text fontWeight="medium">{file.originalName}</Text>
                                    <Code fontSize="xs" color="gray.500">
                                      {file.filename}
                                    </Code>
                                  </VStack>
                                </Td>
                                <Td>
                                  <Badge colorScheme="gray" variant="subtle">
                                    {formatFileSize(file.size)}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Text fontSize="sm" color="gray.500">
                                    {formatDate(file.uploadDate)}
                                  </Text>
                                </Td>
                                <Td>
                                  <HStack spacing={2}>
                                    <IconButton
                                      aria-label="Download file"
                                      icon={<DownloadIcon />}
                                      size="sm"
                                      colorScheme="blue"
                                      variant="ghost"
                                      onClick={() => downloadFile(file.filename, file.originalName)}
                                    />
                                    <IconButton
                                      aria-label="Delete file"
                                      icon={
                                        isDeletingFile === file.filename ? (
                                          <Spinner size="sm" />
                                        ) : (
                                          <DeleteIcon />
                                        )
                                      }
                                      size="sm"
                                      colorScheme="red"
                                      variant="ghost"
                                      onClick={() => deleteFile(file.filename, file.originalName)}
                                      isDisabled={isDeletingFile === file.filename}
                                    />
                                  </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  {/* Empty State */}
                  {fileStorageStats && fileStorageStats.files.length === 0 && (
                    <Box
                      bg={bgColor}
                      p={8}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor={borderColor}
                      width="100%"
                      textAlign="center"
                    >
                      <VStack spacing={4}>
                        <AttachmentIcon boxSize={12} color="gray.400" />
                        <VStack spacing={2}>
                          <Text fontSize="lg" fontWeight="bold" color="gray.500">
                            No Files Yet
                          </Text>
                          <Text fontSize="sm" color="gray.400">
                            Upload your first file using the file chooser above.
                          </Text>
                        </VStack>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Wallet Info Display */}
          {walletInfo && (
            <Box bg={bgColor} p={6} borderRadius="lg" border="2px solid" borderColor="orange.500">
              <Heading size="md" mb={4} color="orange.500">
                Generated Wallet Information
              </Heading>
              <Alert status="warning" mb={4} borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Security Warning</AlertTitle>
                  <AlertDescription>
                    Save your private key securely! This is only shown once during registration.
                  </AlertDescription>
                </Box>
              </Alert>
              <VStack align="stretch" spacing={3}>
                <Box>
                  <HStack justify="space-between" align="center">
                    <Text fontWeight="bold" color="#45a2f8">
                      Ethereum Address:
                    </Text>
                    <IconButton
                      aria-label="Copy address"
                      icon={hasCopiedAddress ? <CheckIcon /> : <CopyIcon />}
                      size="sm"
                      onClick={copyAddress}
                      variant="ghost"
                      colorScheme={hasCopiedAddress ? 'green' : 'gray'}
                    />
                  </HStack>
                  <Code
                    fontSize="sm"
                    p={2}
                    borderRadius="md"
                    bg="whiteAlpha.50"
                    wordBreak="break-all"
                    display="block"
                  >
                    {walletInfo.address}
                  </Code>
                </Box>

                <Box>
                  <HStack justify="space-between" align="center">
                    <Text fontWeight="bold" color="#45a2f8">
                      Private Key:
                    </Text>
                    <IconButton
                      aria-label="Copy private key"
                      icon={hasCopiedPrivateKey ? <CheckIcon /> : <CopyIcon />}
                      size="sm"
                      onClick={copyPrivateKey}
                      variant="ghost"
                      colorScheme={hasCopiedPrivateKey ? 'green' : 'gray'}
                    />
                  </HStack>
                  <Code
                    fontSize="xs"
                    p={2}
                    borderRadius="md"
                    bg="whiteAlpha.50"
                    wordBreak="break-all"
                    display="block"
                  >
                    {walletInfo.privateKey}
                  </Code>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Never share your private key with anyone. Store it securely offline.
                  </Text>
                </Box>
              </VStack>
            </Box>
          )}

          {/* User Information Display */}
          {user && (
            <Box bg={bgColor} p={6} borderRadius="lg" border="2px solid" borderColor={borderColor}>
              <Heading size="md" mb={4} color="#45a2f8">
                User Information
              </Heading>
              <VStack align="start" spacing={3}>
                <HStack>
                  <Text fontWeight="bold" minW="140px">
                    Address (ID):
                  </Text>
                  <Code fontFamily="mono" fontSize="sm">
                    {user.ethereumAddress}
                  </Code>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="140px">
                    Username:
                  </Text>
                  <Text>{user.username}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="140px">
                    Email:
                  </Text>
                  <Text>{user.email || 'Not set'}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="140px">
                    Authenticators:
                  </Text>
                  <Badge
                    colorScheme={user.hasAuthenticators ? 'green' : 'red'}
                    variant="solid"
                    px={3}
                    py={1}
                  >
                    {user.authenticatorCount} registered
                  </Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="140px">
                    Status:
                  </Text>
                  <Badge
                    colorScheme={isAuthenticated ? 'green' : 'gray'}
                    variant="outline"
                    px={3}
                    py={1}
                  >
                    {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </Badge>
                </HStack>
              </VStack>
            </Box>
          )}

          {/* Status Display */}
          {lastAction && (
            <Box bg={bgColor} p={4} borderRadius="md" border="1px solid" borderColor={borderColor}>
              <Text fontSize="sm" color="gray.300">
                <strong>Status:</strong> {lastAction}
              </Text>
            </Box>
          )}

          <Divider borderColor={borderColor} />

          {/* Navigation and Info */}
          <VStack spacing={4}>
            <nav aria-label="Main Navigation">
              <Link href="/" style={{ color: '#45a2f8', textDecoration: 'underline' }}>
                ← Back to Home
              </Link>
            </nav>

            <Box textAlign="center" fontSize="sm" color="gray.500">
              <Text>
                WebAuthn + Ethereum Integration with File Storage. Current API: {API_BASE}
              </Text>
              <Text mt={1}>
                Each passkey registration creates a new Ethereum wallet and personal file storage
              </Text>
              <Text mt={1}>Supported browsers: Chrome 67+, Firefox 60+, Safari 14+, Edge 18+</Text>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </main>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SimpleWebAuthnBrowser: any
  }
}
