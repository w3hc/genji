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
  Icon,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

// WebAuthn types
interface WebAuthnUser {
  id: string
  username: string
  email: string
  hasAuthenticators: boolean
  authenticatorCount: number
}

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export default function WebAuthnPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<WebAuthnUser | null>(null)
  const [userId, setUserId] = useState('user123')
  const [username, setUsername] = useState('john_doe')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [lastAction, setLastAction] = useState<string>('')
  const [useUsernameless, setUseUsernameless] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const toast = useToast()
  const t = useTranslation()

  const bgColor = useColorModeValue('whiteAlpha.100', 'whiteAlpha.50')
  const borderColor = useColorModeValue('#8c1c84', '#8c1c84')

  const API_BASE = process.env.NEXT_PUBLIC_WEBAUTHN_API_URL || 'http://localhost:3000'

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

  const register = async () => {
    if (!userId || !username) {
      showToast('Error', 'Please enter both User ID and Username', 'error')
      return
    }

    setIsLoading(true)
    setLastAction('Registering...')

    try {
      // Check if SimpleWebAuthn is loaded
      if (!window.SimpleWebAuthnBrowser) {
        throw new Error('WebAuthn library not loaded. Please refresh the page.')
      }

      const { startRegistration } = window.SimpleWebAuthnBrowser

      // Begin registration
      const beginResponse = await fetch(`${API_BASE}/webauthn/register/begin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, username }),
      })

      if (!beginResponse.ok) {
        const errorText = await beginResponse.text()
        throw new Error(`HTTP ${beginResponse.status}: ${beginResponse.statusText} - ${errorText}`)
      }

      const beginResult: ApiResponse = await beginResponse.json()

      if (!beginResult.success) {
        throw new Error(beginResult.message || 'Failed to begin registration')
      }

      const options = beginResult.data?.options
      if (!options) {
        throw new Error('Invalid response: missing options data')
      }

      setLastAction('Waiting for authenticator...')

      // Start WebAuthn registration
      const attResp = await startRegistration(options)

      setLastAction('Verifying registration...')

      // Complete registration
      const completeResponse = await fetch(`${API_BASE}/webauthn/register/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
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
          'Passkey registered successfully! You can now use usernameless authentication.',
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

      // First, get authentication options from server for usernameless auth
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

      // Start WebAuthn authentication with empty allowCredentials (for discoverable credentials)
      const authResp = await startAuthentication(options)

      setLastAction('Verifying authentication...')

      // Complete authentication - the server will identify the user from the credential
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
        setUserId(completeResult.data.user.id) // Auto-fill the discovered user ID
        setUsername(completeResult.data.user.username) // Auto-fill the discovered username
        setLastAction('Usernameless authentication successful!')
        showToast('Success', `Welcome back, ${completeResult.data.user.username}!`, 'success')
      } else {
        throw new Error(completeResult.message || 'Authentication failed')
      }
    } catch (error: any) {
      console.error('Usernameless authentication error:', error)
      setLastAction(`Usernameless authentication failed: ${error.message}`)

      // Provide helpful error messages
      if (error.name === 'NotAllowedError') {
        showToast(
          'Authentication Cancelled',
          'You cancelled the authentication or it timed out.',
          'warning'
        )
      } else if (error.message.includes('404')) {
        showToast(
          'Feature Not Available',
          'Usernameless authentication is not yet implemented on the server. Please use traditional authentication.',
          'info'
        )
        setUseUsernameless(false) // Switch to traditional mode
      } else if (error.name === 'SecurityError') {
        showToast(
          'Security Error',
          'Please ensure you are using HTTPS and the domain is configured correctly.',
          'error'
        )
      } else {
        showToast('Authentication Failed', error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Regular authentication with userId
  const authenticate = async () => {
    if (!userId) {
      showToast('Error', 'Please enter User ID', 'error')
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
        body: JSON.stringify({ userId }),
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
          userId,
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

      // Provide helpful error messages
      if (error.name === 'NotAllowedError') {
        showToast(
          'Authentication Cancelled',
          'You cancelled the authentication or it timed out.',
          'warning'
        )
      } else if (error.message.includes('User not found')) {
        showToast('User Not Found', 'No user found with that ID. Please register first.', 'error')
      } else {
        showToast('Authentication Failed', error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getUserInfo = async () => {
    if (!userId) {
      showToast('Error', 'Please enter User ID', 'error')
      return
    }

    setIsLoading(true)
    setLastAction('Fetching user data...')

    try {
      const response = await fetch(`${API_BASE}/webauthn/user?userId=${encodeURIComponent(userId)}`)

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
        showToast('User Not Found', 'No user found with that ID.', 'error')
      } else {
        showToast('Query Failed', error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setLastAction('Logged out')
    showToast('Info', 'Logged out successfully', 'info')
  }

  const clearForm = () => {
    setUserId('')
    setUsername('')
    setUser(null)
    setIsAuthenticated(false)
    setLastAction('')
  }

  return (
    <main>
      <Container maxW="container.lg" py={8} position="relative">
        {/* Floating logout button */}
        {isAuthenticated && (
          <Button
            onClick={logout}
            variant="outline"
            borderColor="red.400"
            color="red.400"
            _hover={{ bg: 'red.50' }}
            size="sm"
            position="absolute"
            top={4}
            right={4}
            zIndex={10}
          >
            Logout
          </Button>
        )}

        <VStack spacing={8} align="stretch">
          <header>
            <Heading as="h1" size="xl" mb={2} color="#45a2f8" textAlign="center">
              WebAuthn Authentication Demo
            </Heading>
            <Text fontSize="lg" color="gray.400" textAlign="center">
              Secure passwordless authentication using FIDO2/WebAuthn standards
            </Text>
          </header>

          {/* Authentication Status */}
          {isAuthenticated && user && (
            <Alert status="success" borderRadius="md" bg="green.50" borderColor="green.200">
              <AlertIcon color="green.500" />
              <Box>
                <AlertTitle color="green.800">Successfully Authenticated!</AlertTitle>
                <AlertDescription color="green.700">
                  Welcome back, <strong>{user.username}</strong> (ID: {user.id})
                </AlertDescription>
              </Box>
              <Spacer />
              <Button size="sm" onClick={logout} variant="outline" colorScheme="green">
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
                    : 'Traditional authentication requiring User ID input'}
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
              <Tab>1. Register Passkey</Tab>
              <Tab>2. Authenticate</Tab>
              <Tab>3. User Info</Tab>
            </TabList>

            <TabPanels>
              {/* Registration Tab */}
              <TabPanel>
                <VStack spacing={6}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>First Time Setup</AlertTitle>
                      <AlertDescription>
                        Register a passkey to enable secure, passwordless authentication. This will
                        create a resident key that can be used for usernameless login.
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
                        <FormLabel color="#45a2f8">User ID</FormLabel>
                        <Input
                          value={userId}
                          onChange={e => setUserId(e.target.value)}
                          placeholder="Enter unique user ID (e.g., user123)"
                          borderColor={borderColor}
                          _focus={{ borderColor: '#45a2f8', boxShadow: '0 0 0 1px #45a2f8' }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color="#45a2f8">Username</FormLabel>
                        <Input
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          placeholder="Enter display name (e.g., john_doe)"
                          borderColor={borderColor}
                          _focus={{ borderColor: '#45a2f8', boxShadow: '0 0 0 1px #45a2f8' }}
                        />
                      </FormControl>
                    </VStack>
                  </Box>

                  <VStack spacing={3} width="100%">
                    <Button
                      onClick={register}
                      isLoading={isLoading}
                      loadingText="Registering..."
                      bg="linear-gradient(135deg, #8c1c84, #45a2f8)"
                      color="white"
                      _hover={{ transform: 'translateY(-2px)', opacity: 0.9 }}
                      width="100%"
                      size="lg"
                      height="60px"
                    >
                      Register Passkey
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
                        🔐 Authenticate with Passkey
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
                            Enter your User ID to authenticate with your registered passkey.
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
                          <FormLabel color="#45a2f8">User ID</FormLabel>
                          <Input
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                            placeholder="Enter your user ID (e.g., user123)"
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
                        Authenticate with User ID
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
                        Query user information and registered authenticators by User ID.
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
                      <FormLabel color="#45a2f8">User ID</FormLabel>
                      <Input
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        placeholder="Enter user ID to lookup (e.g., user123)"
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
            </TabPanels>
          </Tabs>

          {/* User Information Display */}
          {user && (
            <Box bg={bgColor} p={6} borderRadius="lg" border="2px solid" borderColor={borderColor}>
              <Heading size="md" mb={4} color="#45a2f8">
                User Information
              </Heading>
              <VStack align="start" spacing={3}>
                <HStack>
                  <Text fontWeight="bold" minW="120px">
                    ID:
                  </Text>
                  <Text fontFamily="mono">{user.id}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">
                    Username:
                  </Text>
                  <Text>{user.username}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">
                    Email:
                  </Text>
                  <Text>{user.email}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="120px">
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
                  <Text fontWeight="bold" minW="120px">
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
              <Text>WebAuthn requires HTTPS in production. Current API: {API_BASE}</Text>
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
