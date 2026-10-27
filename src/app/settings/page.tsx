'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Box,
  Heading,
  VStack,
  Text,
  Code,
  TabsRoot,
  TabsList,
  TabsContent,
  TabsTrigger,
  useDisclosure,
  HStack,
  SimpleGrid,
  Icon,
  ListRoot,
  ListItem,
  Badge,
  Link as ChakraLink,
  Flex,
  CloseButton,
  Textarea,
  Image,
} from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { Dialog, Portal } from '@/components/ui/dialog'
import { toaster } from '@/components/ui/toaster'
import { MdDelete, MdCheckCircle, MdWarning, MdInfo, MdDownload, MdLock } from 'react-icons/md'
import {
  FiShield,
  FiCheckCircle,
  FiCloud,
  FiUsers,
  FiKey,
  FiDownload,
  FiHardDrive,
  FiUpload,
  FiClock,
  FiUserPlus,
} from 'react-icons/fi'
import { AuthenticationError, PrfUnsupportedError, SyncBootstrapError } from 'w3pk'
import { useW3PK, isUserCancelledError } from '@/context/W3PK'
import { useTranslation } from '@/hooks/useTranslation'
import Spinner from '@/components/Spinner'
import PasswordModal from '@/components/PasswordModal'
import SyncImport from '@/components/SyncImport'
import { CodeBlock } from '@/components/CodeBlock'
import { detectBrowser, isWebAuthnAvailable } from '@/utils/browserDetection'
import { brandColors } from '@/theme'
import { BuildVerification } from '@/components/BuildVerification'
import {
  inspectLocalStorage,
  formatValue,
  maskSensitiveData,
  clearLocalStorageItem,
  type LocalStorageItem,
} from '@/utils/storageInspection'
import { QRCodeSVG } from 'qrcode.react'
import {
  SliderRoot,
  SliderLabel,
  SliderValueText,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from '@/components/ui/slider'

interface StoredAccount {
  username: string
  ethereumAddress: string
  id: string
  displayName?: string
}

const SettingsPage = () => {
  const t = useTranslation()
  const [backupStatus, setBackupStatus] = useState<string | null>(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [evictionRisk, setEvictionRisk] = useState(false)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showRestorePasswordModal, setShowRestorePasswordModal] = useState(false)
  const [selectedBackupFile, setSelectedBackupFile] = useState<string | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  const [restoreUsername, setRestoreUsername] = useState('')
  const [needsUsernameForRestore, setNeedsUsernameForRestore] = useState(false)
  const [isRestoreUsernameInvalid, setIsRestoreUsernameInvalid] = useState(false)
  const [accounts, setAccounts] = useState<StoredAccount[]>([])
  const [accountToDelete, setAccountToDelete] = useState<StoredAccount | null>(null)
  const { open: isOpen, onOpen, onClose } = useDisclosure()

  const [localStorageData, setLocalStorageData] = useState<LocalStorageItem[]>([])
  const [isInspectingLocalStorage, setIsInspectingLocalStorage] = useState(false)
  const [showLocalStorageModal, setShowLocalStorageModal] = useState(false)

  const [index0Address, setIndex0Address] = useState<string>('')
  const [mainAddress, setMainAddress] = useState<string>('')
  const [openbarAddress, setOpenbarAddress] = useState<string>('')
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [isExportingSync, setIsExportingSync] = useState(false)
  const [syncQrCode, setSyncQrCode] = useState<string | null>(null)
  const [showSyncPasswordModal, setShowSyncPasswordModal] = useState(false)

  // Persistent session duration state
  const [persistentSessionDays, setPersistentSessionDays] = useState<number>(() => {
    if (typeof window === 'undefined') return 7
    const stored = localStorage.getItem('persistentSessionDuration')
    const days = stored ? parseInt(stored, 10) : 7
    return days >= 1 && days <= 30 ? days : 7
  })

  // Pending logout/login cycle scheduled after a duration change; kept in a ref
  // so a new change cancels the previous cycle instead of stacking logins
  const sessionRelogTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fires on every step while dragging: only update the displayed value
  const handleSessionDurationChange = (details: { value: number[] }) => {
    setPersistentSessionDays(details.value[0])
  }

  // Fires once when the user releases the slider: persist and re-login.
  // The re-login matters beyond applying the new duration: the persistent
  // session blob is encrypted under a key from the WebAuthn PRF extension,
  // and only a real (prompted) login can re-key it.
  const handleSessionDurationChangeEnd = (details: { value: number[] }) => {
    const days = details.value[0]
    setPersistentSessionDuration(days)

    if (sessionRelogTimeoutRef.current) {
      clearTimeout(sessionRelogTimeoutRef.current)
    }

    // Wait 3 seconds then logout and login to apply the new duration
    sessionRelogTimeoutRef.current = setTimeout(() => {
      logout()
      // Wait a bit for logout to complete, then trigger login
      sessionRelogTimeoutRef.current = setTimeout(async () => {
        sessionRelogTimeoutRef.current = null
        try {
          await login()
        } catch (error) {
          // User cancelled login, that's okay
          console.log('Login cancelled by user')
        }
      }, 500)
    }, 3000)
  }

  // Social Recovery state
  const [guardianName, setGuardianName] = useState<string>('')
  const [guardianEmail, setGuardianEmail] = useState<string>('')
  const [guardiansList, setGuardiansList] = useState<Array<{ name: string; email?: string }>>([])
  const [threshold, setThreshold] = useState<number>(3)
  const [socialRecoveryConfig, setSocialRecoveryConfig] = useState<any>(null)
  const [selectedGuardianForInvite, setSelectedGuardianForInvite] = useState<any>(null)
  const [guardianInvite, setGuardianInvite] = useState<any>(null)

  // Recovery state
  const [recoveryShares, setRecoveryShares] = useState<string[]>([])
  const [currentShareInput, setCurrentShareInput] = useState<string>('')
  const [isRecovering, setIsRecovering] = useState(false)
  const [showRecoverySection, setShowRecoverySection] = useState(false)

  // Registration state
  const {
    open: isRegisterModalOpen,
    onOpen: onRegisterModalOpen,
    onClose: onRegisterModalClose,
  } = useDisclosure()
  const [registerUsername, setRegisterUsername] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegisterUsernameInvalid, setIsRegisterUsernameInvalid] = useState(false)

  const {
    isAuthenticated,
    user,
    getBackupStatus,
    createBackup,
    exportForSync,
    syncWalletWithPasskey,
    restoreFromBackup,
    registerWithBackupFile,
    login,
    logout,
    register,
    deriveWallet,
    setupSocialRecovery,
    getSocialRecoveryConfig,
    generateGuardianInvite,
    recoverFromGuardians,
    clearSocialRecoveryConfig,
    setPersistentSessionDuration,
    hasPersistentSession,
  } = useW3PK()

  // null = unknown, true = a persistent session blob exists, false = none —
  // when authenticated and false, the authenticator likely lacks WebAuthn
  // PRF support and "Remember Me" is unavailable on this device
  const [persistentSessionStored, setPersistentSessionStored] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    let cancelled = false
    hasPersistentSession()
      .then(stored => {
        if (!cancelled) setPersistentSessionStored(stored)
      })
      .catch(() => {
        if (!cancelled) setPersistentSessionStored(null)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const validateUsername = (input: string): boolean => {
    if (!input.trim()) {
      return true
    }

    const trimmedInput = input.trim()

    // Check overall format and length (3-50 chars)
    // Alphanumeric, underscore, and hyphen allowed
    // Must start and end with alphanumeric
    const formatValid =
      /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/.test(trimmedInput) &&
      trimmedInput.length >= 3 &&
      trimmedInput.length <= 50

    return formatValid
  }

  const handleRegister = async () => {
    if (!registerUsername.trim()) {
      toaster.create({
        title: t.header.usernameRequiredTitle,
        description: t.header.usernameRequiredDescription,
        type: 'warning',
        duration: 3000,
      })
      setIsRegisterUsernameInvalid(true)
      return
    }

    const isValid = validateUsername(registerUsername)
    if (!isValid) {
      setIsRegisterUsernameInvalid(true)
      return
    }

    setIsRegisterUsernameInvalid(false)

    try {
      setIsRegistering(true)
      console.log('[Settings] Starting registration for:', registerUsername.trim())

      // Add timeout to prevent infinite loading
      const registrationPromise = register(registerUsername.trim())
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Registration timeout after 60 seconds')), 60000)
      )

      await Promise.race([registrationPromise, timeoutPromise])

      console.log('[Settings] Registration completed successfully')
      setRegisterUsername('')
      onRegisterModalClose()

      toaster.create({
        title: t.settings.registrationSuccessTitle,
        description: t.settings.registrationSuccessDescription,
        type: 'success',
        duration: 5000,
      })
    } catch (error: any) {
      console.error('[Settings] Registration failed:', error)

      // Show user-friendly error message
      toaster.create({
        title: t.settings.registrationFailedTitle,
        description: error.message || t.settings.registrationFailedDefaultDescription,
        type: 'error',
        duration: 8000,
      })
    } finally {
      console.log('[Settings] Cleaning up registration state')
      setIsRegistering(false)
    }
  }

  const handleRegisterModalClose = () => {
    setRegisterUsername('')
    setIsRegisterUsernameInvalid(false)
    onRegisterModalClose()
  }

  const handleInspectLocalStorage = async () => {
    setIsInspectingLocalStorage(true)
    try {
      const data = await inspectLocalStorage()
      setLocalStorageData(data)

      toaster.create({
        title: t.settings.localStorageInspectedTitle,
        description: t.settings.localStorageInspectedDescription(data.length),
        type: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error inspecting localStorage:', error)
      toaster.create({
        title: t.settings.genericErrorTitle,
        description: t.settings.failedInspectLocalStorage,
        type: 'error',
        duration: 3000,
      })
    } finally {
      setIsInspectingLocalStorage(false)
    }
  }

  const handleClearLocalStorageItem = async (key: string) => {
    const success = clearLocalStorageItem(key)
    if (success) {
      const updatedData = localStorageData.filter(item => item.key !== key)
      setLocalStorageData(updatedData)

      toaster.create({
        title: t.settings.itemClearedTitle,
        description: t.settings.itemClearedDescription(key),
        type: 'success',
        duration: 2000,
      })
    } else {
      toaster.create({
        title: t.settings.genericErrorTitle,
        description: t.settings.failedClearItem(key),
        type: 'error',
        duration: 3000,
      })
    }
  }

  const loadAccounts = useCallback(() => {
    try {
      const storedAccounts: StoredAccount[] = []

      // Only show the current logged-in user
      if (user) {
        storedAccounts.push({
          username: user.username,
          ethereumAddress: user.ethereumAddress,
          id: user.id,
          displayName: user.displayName,
        })
      }

      setAccounts(storedAccounts)
    } catch (error) {
      console.error('Error loading accounts:', error)
    }
  }, [user])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAccounts()
  }, [loadAccounts])

  useEffect(() => {
    const isValid = validateUsername(registerUsername)
    if (!isValid) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsRegisterUsernameInvalid(false)
  }, [registerUsername])

  useEffect(() => {
    const loadAddressesAndStatus = async () => {
      if (!isAuthenticated || !user) return

      if (deriveWallet && !isLoadingAddresses && !index0Address) {
        setIsLoadingAddresses(true)
        try {
          setIndex0Address(user.ethereumAddress)

          const mainWallet = await deriveWallet('STANDARD', 'MAIN')
          setMainAddress(mainWallet.address)

          const openbarWallet = await deriveWallet('YOLO', 'OPENBAR')
          setOpenbarAddress(openbarWallet.address)
        } catch (error) {
          console.error('Failed to load addresses:', error)
          toaster.create({
            title: t.settings.errorLoadingAddressesTitle,
            description: (error as Error).message || t.settings.failedDeriveAddresses,
            type: 'error',
            duration: 5000,
          })
        } finally {
          setIsLoadingAddresses(false)
        }
      }

      if (getBackupStatus && !backupStatus && !isCheckingStatus) {
        setIsCheckingStatus(true)
        try {
          const statusObject = await getBackupStatus()

          if (
            statusObject &&
            statusObject.securityScore &&
            typeof statusObject.securityScore.total === 'number'
          ) {
            const scoreValue = statusObject.securityScore.total
            const scoreLevel = statusObject.securityScore.level || 'unknown'
            const statusString = `Security Score: ${scoreValue}/100 (Level: ${scoreLevel})`
            setBackupStatus(statusString)
            setEvictionRisk(statusObject.evictionRisk)
          }
        } catch (error) {
          console.error('Error loading backup status:', error)
          toaster.create({
            title: t.settings.errorLoadingBackupStatusTitle,
            description: (error as Error).message || t.settings.failedCheckSecurityStatus,
            type: 'error',
            duration: 5000,
          })
        } finally {
          setIsCheckingStatus(false)
        }
      }
    }

    loadAddressesAndStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user])

  useEffect(() => {
    if (!isAuthenticated || !getSocialRecoveryConfig) return
    const config = getSocialRecoveryConfig()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocialRecoveryConfig(config)
  }, [isAuthenticated, getSocialRecoveryConfig])

  const handleDeleteAccount = (account: StoredAccount) => {
    setAccountToDelete(account)
    onOpen()
  }

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage)
        const keysToRemove: string[] = []

        keys.forEach(key => {
          try {
            const value = localStorage.getItem(key)
            if (value) {
              if (
                value.includes(accountToDelete.ethereumAddress) ||
                value.includes(accountToDelete.username) ||
                value.includes(accountToDelete.id)
              ) {
                keysToRemove.push(key)
              }
            }
          } catch (e) {
            // Skip this key
          }
        })

        keysToRemove.forEach(key => {
          localStorage.removeItem(key)
        })

        toaster.create({
          title: t.settings.accountRemovedTitle,
          description: t.settings.accountRemovedDescription(accountToDelete.username),
          type: 'success',
          duration: 3000,
        })

        // If we deleted the current user's account, log them out
        if (user && user.ethereumAddress === accountToDelete.ethereumAddress) {
          toaster.create({
            title: t.settings.loggingOutTitle,
            description: t.settings.loggingOutDescription,
            type: 'info',
            duration: 2000,
          })
          setTimeout(() => {
            logout()
          }, 2000)
        }

        loadAccounts()
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toaster.create({
        title: t.settings.genericErrorTitle,
        description: t.settings.failedRemoveAccount,
        type: 'error',
        duration: 5000,
      })
    } finally {
      setAccountToDelete(null)
      onClose()
    }
  }

  const handleRestoreBackup = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json,.enc'
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      try {
        const textContent = await file.text()

        try {
          JSON.parse(textContent)
          setSelectedBackupFile(textContent)
          setShowRestorePasswordModal(true)
          return
        } catch (jsonError) {}

        setSelectedBackupFile(textContent)
        setShowRestorePasswordModal(true)
      } catch (error) {
        toaster.create({
          title: t.settings.errorReadingFileTitle,
          description: (error as Error).message || t.settings.failedReadBackupFile,
          type: 'error',
          duration: 5000,
        })
      }
    }
    fileInput.click()
  }

  const handleRestorePasswordSubmit = async (password: string) => {
    setShowRestorePasswordModal(false)

    if (!selectedBackupFile) {
      toaster.create({
        title: t.settings.noBackupFileSelectedTitle,
        type: 'error',
        duration: 3000,
      })
      return
    }

    setIsRestoring(true)
    try {
      let backupToRestore = selectedBackupFile

      try {
        const backupObj = JSON.parse(selectedBackupFile)

        if (backupObj['recovery-phrase.txt.enc']) {
          const encryptedContent = backupObj['recovery-phrase.txt.enc']
          backupToRestore = encryptedContent
        } else if (!backupObj.version && (backupObj.encrypted || backupObj.mnemonic)) {
          toaster.create({
            title: t.settings.incompatibleBackupTitle,
            description: t.settings.incompatibleBackupDescription,
            type: 'warning',
            duration: 8000,
          })
          setIsRestoring(false)
          return
        }
      } catch (e) {}

      if (!isAuthenticated) {
        // Restore into a passkey that already synced to this device; when
        // there is none, or the backup can't name it, register a new one
        try {
          const result = await syncWalletWithPasskey(backupToRestore, password)
          toaster.create({
            title: t.settings.walletRestoredTitle,
            description: t.settings.walletRestoredDescription(
              `${result.ethereumAddress.slice(0, 6)}...${result.ethereumAddress.slice(-4)}`
            ),
            type: 'success',
            duration: 5000,
          })
          setSelectedBackupFile(null)
          return
        } catch (error) {
          if (
            !(error instanceof SyncBootstrapError) &&
            !(error instanceof AuthenticationError) &&
            !isUserCancelledError(error)
          ) {
            toaster.create({
              title: t.settings.syncImportErrorTitle,
              description: (error as Error).message || t.settings.unexpectedErrorDescription,
              type: 'error',
              duration: 5000,
            })
            return
          }
        }

        setNeedsUsernameForRestore(true)
        setIsRestoring(false)

        // Store password for later use
        ;(window as any)._restorePassword = password
        ;(window as any)._restoreBackup = backupToRestore
        return
      }

      // If authenticated, restore and overwrite existing credentials
      const result = await restoreFromBackup(backupToRestore, password)

      toaster.create({
        title: t.settings.walletRestoredTitle,
        description: t.settings.walletRestoredDescription(
          `${result.ethereumAddress.slice(0, 6)}...${result.ethereumAddress.slice(-4)}`
        ),
        type: 'success',
        duration: 5000,
      })

      setSelectedBackupFile(null)
    } catch (error) {
      // Error toast shown in restoreFromBackup
    } finally {
      setIsRestoring(false)
    }
  }

  const handleRestoreWithUsername = async () => {
    if (!restoreUsername.trim()) {
      toaster.create({
        title: t.header.usernameRequiredTitle,
        description: t.settings.usernameRequiredRestoreDescription,
        type: 'warning',
        duration: 3000,
      })
      setIsRestoreUsernameInvalid(true)
      return
    }

    if (!validateUsername(restoreUsername)) {
      setIsRestoreUsernameInvalid(true)
      return
    }

    setIsRestoring(true)
    setNeedsUsernameForRestore(false)

    try {
      const password = (window as any)._restorePassword
      const backupData = (window as any)._restoreBackup

      if (!password || !backupData) {
        throw new Error('Missing restore data')
      }

      const result = await registerWithBackupFile(backupData, password, restoreUsername.trim())

      toaster.create({
        title: t.settings.walletRestoredRegisteredTitle,
        description: t.settings.walletRestoredRegisteredDescription(
          `${result.address.slice(0, 6)}...${result.address.slice(-4)}`
        ),
        type: 'success',
        duration: 5000,
      })

      // Clear temporary data
      delete (window as any)._restorePassword
      delete (window as any)._restoreBackup
      setSelectedBackupFile(null)
      setRestoreUsername('')
    } catch (error) {
      // Error toast shown in registerWithBackupFile
    } finally {
      setIsRestoring(false)
    }
  }

  const handleRestoreModalClose = () => {
    setShowRestorePasswordModal(false)
    setSelectedBackupFile(null)
  }

  if (!isAuthenticated || !getBackupStatus || !createBackup) {
    const browserInfo = detectBrowser()
    const webAuthnAvailable = isWebAuthnAvailable()

    let alertStatus: 'info' | 'warning' | 'error' = 'warning'
    if (browserInfo.warningLevel === 'error') alertStatus = 'error'
    else if (browserInfo.warningLevel === 'warning') alertStatus = 'warning'
    else if (browserInfo.warningLevel === 'info') alertStatus = 'info'

    return (
      <>
        <VStack gap={8} align="stretch" py={20}>
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              {t.settings.title}
            </Heading>
            <Text fontSize="xl" color="gray.400" maxW="2xl" mx="auto">
              {t.settings.loginRequired}
            </Text>
          </Box>

          <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
            <HStack mb={4}>
              <Icon as={MdInfo} color={brandColors.primary} boxSize={6} />
              <Heading size="md">{t.settings.browserInfoHeading}</Heading>
            </HStack>
            <VStack align="stretch" gap={3}>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">
                  {t.settings.browserLabel}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="white">
                  {browserInfo.name}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">
                  {t.settings.versionLabel}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="white">
                  {browserInfo.fullVersion || browserInfo.version}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">
                  {t.settings.osLabel}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="white">
                  {browserInfo.os}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">
                  {t.settings.webauthnSupportLabel}
                </Text>
                <Badge colorPalette={webAuthnAvailable ? 'green' : 'red'}>
                  {webAuthnAvailable ? t.settings.available : t.settings.notAvailable}
                </Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">
                  {t.settings.compatibilityLabel}
                </Text>
                <Badge
                  colorPalette={
                    browserInfo.isSupported && !browserInfo.hasKnownIssues
                      ? 'green'
                      : browserInfo.hasKnownIssues
                        ? 'yellow'
                        : 'red'
                  }
                >
                  {browserInfo.isSupported && !browserInfo.hasKnownIssues
                    ? t.settings.fullySupported
                    : browserInfo.hasKnownIssues
                      ? t.settings.knownIssues
                      : t.settings.notSupported}
                </Badge>
              </HStack>
            </VStack>
          </Box>

          {browserInfo.recommendation && (
            <Box
              p={4}
              bg={
                alertStatus === 'error'
                  ? 'red.900/90'
                  : alertStatus === 'warning'
                    ? 'yellow.900/90'
                    : 'blue.900/90'
              }
              borderRadius="lg"
            >
              <Box fontSize="sm">
                <Text fontWeight="bold" mb={1}>
                  {alertStatus === 'error'
                    ? t.settings.browserNotSupportedTitle
                    : alertStatus === 'warning'
                      ? t.settings.knownIssuesTitle
                      : t.settings.recommendationTitle}
                </Text>
                <Text fontSize="sm">{browserInfo.recommendation}</Text>
              </Box>
            </Box>
          )}

          {!webAuthnAvailable && (
            <Box p={4} bg="red.900/90" borderRadius="lg">
              <Box fontSize="sm">
                <Text fontWeight="bold" mb={1}>
                  {t.settings.webauthnNotAvailableTitle}
                </Text>
                <Text fontSize="sm">{t.settings.webauthnNotAvailableText}</Text>
                <ListRoot gap={1} mt={2} ml={4} fontSize="xs">
                  <ListItem>{t.settings.browserChrome}</ListItem>
                  <ListItem>{t.settings.browserFirefox}</ListItem>
                  <ListItem>{t.settings.browserSafari}</ListItem>
                  <ListItem>{t.settings.browserEdge}</ListItem>
                  <ListItem>{t.settings.browserSamsung}</ListItem>
                </ListRoot>
              </Box>
            </Box>
          )}

          {browserInfo.os === 'Android' && (
            <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
              <Heading size="sm" mb={3} color={brandColors.primary}>
                {t.settings.androidRecommendedHeading}
              </Heading>
              <ListRoot gap={2} fontSize="sm">
                <ListItem>
                  <HStack>
                    <Icon
                      as={browserInfo.name === 'Samsung Internet' ? MdCheckCircle : MdInfo}
                      color={browserInfo.name === 'Samsung Internet' ? 'green.400' : 'gray.400'}
                    />
                    <Text color="gray.300">{t.settings.samsungInternetNote}</Text>
                  </HStack>
                </ListItem>
                <ListItem>
                  <HStack>
                    <Icon
                      as={browserInfo.name === 'Chrome' ? MdCheckCircle : MdInfo}
                      color={browserInfo.name === 'Chrome' ? 'green.400' : 'gray.400'}
                    />
                    <Text color="gray.300">{t.settings.chromeNote}</Text>
                  </HStack>
                </ListItem>
                <ListItem>
                  <HStack>
                    <Icon
                      as={browserInfo.name === 'Edge' ? MdCheckCircle : MdInfo}
                      color={browserInfo.name === 'Edge' ? 'green.400' : 'gray.400'}
                    />
                    <Text color="gray.300">{t.settings.edgeNote}</Text>
                  </HStack>
                </ListItem>
                <ListItem>
                  <HStack>
                    <Icon as={MdWarning} color="yellow.400" />
                    <Text color="gray.300">{t.settings.firefoxMobileNote}</Text>
                  </HStack>
                </ListItem>
              </ListRoot>
            </Box>
          )}

          <BuildVerification />

          <SyncImport />

          {/* Restore from Backup - Available without authentication */}
          <Box
            id="restore-backup"
            bg="gray.900"
            p={6}
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.700"
          >
            <HStack mb={4}>
              <Icon as={FiUpload} color={brandColors.primary} boxSize={6} />
              <Heading size="md">{t.settings.restoreBackupHeading}</Heading>
            </HStack>
            <Text fontSize="sm" color="gray.400" mb={4}>
              {t.settings.restoreBackupDescription}
            </Text>
            <Text fontSize="sm" color="gray.400" mb={4}>
              {t.settings.restoreBackupSyncHint}
            </Text>
            <Button
              bg={brandColors.primary}
              color="white"
              _hover={{ bg: brandColors.secondary }}
              onClick={handleRestoreBackup}
              loading={isRestoring}
              spinner={<Spinner size="200px" />}
              loadingText={t.settings.restoringText}
              disabled={isRestoring}
              width="full"
            >
              <Icon as={FiUpload} mr={2} />
              {t.settings.restoreBackupButton}
            </Button>
          </Box>

          {/* Register a new account */}
          {/* <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
            <HStack mb={4}>
              <Icon as={FiUserPlus} color={brandColors.primary} boxSize={6} />
              <Heading size="md">Register a new account</Heading>
            </HStack>
            <Text fontSize="sm" color="gray.400" mb={4}>
              Create a new Web3 passkey account. Each account is secured with your device&apos;s
              biometric authentication or PIN, and has its own Ethereum wallet.
            </Text>
            <Button
              bg={brandColors.primary}
              color="white"
              _hover={{
                bg: brandColors.secondary,
              }}
              onClick={onRegisterModalOpen}
              width="full"
            >
              <Icon as={FiUserPlus} />
              Register
            </Button>
          </Box> */}

          <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
            <Heading size="sm" mb={3} color={brandColors.primary}>
              {t.settings.debugStorageHeading}
            </Heading>
            <Text fontSize="sm" color="gray.400" mb={4}>
              {t.settings.debugStorageDescription}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Button
                onClick={handleInspectLocalStorage}
                loading={isInspectingLocalStorage}
                loadingText={t.settings.inspectingText}
                variant="outline"
                colorPalette="purple"
                size="sm"
              >
                <Icon as={FiHardDrive} mr={2} />
                {t.settings.inspectLocalStorageButton}
              </Button>
            </SimpleGrid>
          </Box>

          {localStorageData.length > 0 && (
            <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="purple.600">
              <HStack mb={4} justify="space-between">
                <HStack>
                  <Icon as={FiHardDrive} color={brandColors.primary} boxSize={6} />
                  <Heading size="md">{t.settings.localStorageResultsHeading}</Heading>
                </HStack>
                <Badge colorPalette="purple">
                  {t.settings.itemsCount(localStorageData.length)}
                </Badge>
              </HStack>
              <VStack align="stretch" gap={3}>
                {localStorageData.map((item, index) => (
                  <Box
                    key={index}
                    bg="gray.950"
                    p={4}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={item.type.startsWith('w3pk') ? 'purple.700' : 'gray.800'}
                  >
                    <VStack align="stretch" gap={2}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" fontWeight="bold" color="white" flex={1}>
                          {item.key}
                        </Text>
                        <HStack gap={2}>
                          {item.encrypted && (
                            <Badge colorPalette="orange" fontSize="xs">
                              {t.settings.encryptedBadge}
                            </Badge>
                          )}
                          <Badge
                            colorPalette={item.type.startsWith('w3pk') ? 'purple' : 'gray'}
                            fontSize="xs"
                          >
                            {item.type}
                          </Badge>
                          <IconButton
                            aria-label={t.settings.clearItemAria}
                            size="xs"
                            colorPalette="red"
                            variant="ghost"
                            onClick={() => handleClearLocalStorageItem(item.key)}
                          >
                            <MdDelete />
                          </IconButton>
                        </HStack>
                      </HStack>

                      {item.parsedValue && (
                        <Box bg="black" p={3} borderRadius="md" overflowX="auto">
                          <CodeBlock>
                            {formatValue(maskSensitiveData(item.key, item.parsedValue))}
                          </CodeBlock>
                        </Box>
                      )}

                      {!item.parsedValue && (
                        <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                          {item.value}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>

        <PasswordModal
          isOpen={showRestorePasswordModal}
          onClose={handleRestoreModalClose}
          onSubmit={handleRestorePasswordSubmit}
          title={t.settings.restoreBackupModalTitle}
          description={t.settings.restoreBackupModalDescription}
        />

        {/* Registration Modal - Available without authentication */}
        <Dialog.Root
          open={isRegisterModalOpen}
          onOpenChange={(e: { open: boolean }) => (e.open ? null : handleRegisterModalClose())}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content p={6}>
                <Dialog.Header>
                  <Dialog.Title>{t.header.registerTitle}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body pt={4}>
                  <VStack gap={4}>
                    <Text fontSize="sm" color="gray.400">
                      {t.header.walletInfoText}{' '}
                      <ChakraLink
                        href={
                          'https://github.com/w3hc/w3pk/blob/main/src/auth/register.ts#L17-L102'
                        }
                        color={brandColors.accent}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        w3pk
                      </ChakraLink>
                      .
                    </Text>
                    <Field invalid={isRegisterUsernameInvalid} label={t.header.usernameLabel}>
                      <Input
                        id="username-input"
                        aria-describedby={
                          isRegisterUsernameInvalid && registerUsername.trim()
                            ? 'username-error'
                            : undefined
                        }
                        aria-invalid={
                          isRegisterUsernameInvalid && registerUsername.trim() ? true : undefined
                        }
                        value={registerUsername}
                        onChange={e => setRegisterUsername(e.target.value)}
                        placeholder={t.header.usernamePlaceholder}
                        pl={3}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && registerUsername.trim()) {
                            handleRegister()
                          }
                        }}
                      />
                      {isRegisterUsernameInvalid && registerUsername.trim() && (
                        <Field.ErrorText id="username-error">
                          {t.header.usernameError}
                        </Field.ErrorText>
                      )}
                    </Field>
                  </VStack>
                </Dialog.Body>

                <Dialog.Footer gap={3} pt={6}>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">{t.common.cancel}</Button>
                  </Dialog.ActionTrigger>
                  <Button
                    colorPalette="blue"
                    onClick={handleRegister}
                    disabled={!registerUsername.trim()}
                  >
                    {isRegistering && <Spinner size="42px" />}
                    {!isRegistering && t.header.createAccount}
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        <PasswordModal
          isOpen={showRestorePasswordModal}
          onClose={handleRestoreModalClose}
          onSubmit={handleRestorePasswordSubmit}
          title={t.settings.restoreBackupModalTitle}
          description={t.settings.restoreBackupModalDescription}
        />

        {/* Username Modal for Restore when no credentials exist */}
        <Dialog.Root
          open={needsUsernameForRestore}
          onOpenChange={(e: { open: boolean }) =>
            e.open
              ? null
              : (() => {
                  setNeedsUsernameForRestore(false)
                  setRestoreUsername('')
                  setSelectedBackupFile(null)
                  delete (window as any)._restorePassword
                  delete (window as any)._restoreBackup
                })()
          }
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content p={6}>
                <Dialog.Header>
                  <Dialog.Title>{t.settings.chooseUsernameModalTitle}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body pt={4}>
                  <VStack gap={4}>
                    <Text fontSize="sm" color="gray.400">
                      {t.settings.chooseUsernameModalDescription}
                    </Text>
                    <Field invalid={isRestoreUsernameInvalid} label={t.header.usernameLabel}>
                      <Input
                        id="restore-username-input"
                        aria-describedby={
                          isRestoreUsernameInvalid && restoreUsername.trim()
                            ? 'restore-username-error'
                            : undefined
                        }
                        placeholder={t.header.usernamePlaceholder}
                        value={restoreUsername}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setRestoreUsername(e.target.value)
                          setIsRestoreUsernameInvalid(false)
                        }}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleRestoreWithUsername()
                          }
                        }}
                        autoFocus
                        disabled={isRestoring}
                      />
                      {isRestoreUsernameInvalid && restoreUsername.trim() && (
                        <Text id="restore-username-error" fontSize="sm" color="red.400" mt={1}>
                          {t.settings.usernameFormatError}
                        </Text>
                      )}
                    </Field>
                  </VStack>
                </Dialog.Body>
                <Dialog.Footer pt={4}>
                  <Dialog.CloseTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={isRestoring}
                      onClick={() => {
                        setNeedsUsernameForRestore(false)
                        setRestoreUsername('')
                        setSelectedBackupFile(null)
                        delete (window as any)._restorePassword
                        delete (window as any)._restoreBackup
                      }}
                    >
                      {t.common.cancel}
                    </Button>
                  </Dialog.CloseTrigger>
                  <Button
                    bg={brandColors.primary}
                    color="white"
                    _hover={{ bg: brandColors.secondary }}
                    onClick={handleRestoreWithUsername}
                    loading={isRestoring}
                    loadingText={t.settings.restoringRegisteringText}
                    disabled={isRestoring || !restoreUsername.trim()}
                  >
                    {t.settings.restoreRegisterButton}
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </>
    )
  }

  const handleGetBackupStatus = async () => {
    setIsCheckingStatus(true)
    setBackupStatus(null)
    try {
      const statusObject = await getBackupStatus()

      if (
        statusObject &&
        statusObject.securityScore &&
        typeof statusObject.securityScore.total === 'number'
      ) {
        const scoreValue = statusObject.securityScore.total
        const scoreLevel = statusObject.securityScore.level || 'unknown'
        const statusString = `Security Score: ${scoreValue}/100 (Level: ${scoreLevel})`
        setBackupStatus(statusString)
        setEvictionRisk(statusObject.evictionRisk)
      } else {
        setBackupStatus('Error: Unexpected status data format.')
      }

      toaster.create({
        title: t.settings.backupStatusRetrievedTitle,
        type: 'info',
        duration: 3000,
      })
    } catch (error) {
      toaster.create({
        title: t.settings.errorRetrievingStatusTitle,
        description: (error as Error).message || t.settings.unexpectedErrorDescription,
        type: 'error',
        duration: 5000,
      })
      setBackupStatus(null)
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    try {
      setShowPasswordModal(true)
    } catch (error) {
      console.error('Error creating backup:', error)
      toaster.create({
        title: t.settings.errorCreatingBackupTitle,
        description: (error as Error).message || t.settings.unexpectedErrorDescription,
        type: 'error',
        duration: 5000,
      })
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handlePasswordSubmit = async (password: string) => {
    setShowPasswordModal(false)

    try {
      const backupBlob = await createBackup(password)

      let fileExtension = '.json'
      let mimeType = 'application/json'

      try {
        const fullText = await backupBlob.text()
        JSON.parse(fullText)
        fileExtension = '.json'
        mimeType = 'application/json'

        const jsonBlob = new Blob([fullText], { type: mimeType })

        const link = document.createElement('a')
        link.href = URL.createObjectURL(jsonBlob)
        link.download = `w3pk_backup_${user?.username || 'user'}_${new Date().toISOString().slice(0, 10)}${fileExtension}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(backupBlob)
        link.download = `w3pk_backup_${user?.username || 'user'}_${new Date().toISOString().slice(0, 10)}${fileExtension}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      toaster.create({
        title: t.settings.backupCreatedTitle,
        type: 'success',
        duration: 3000,
      })
    } catch (error) {
      toaster.create({
        title: t.settings.errorCreatingBackupTitle,
        description: (error as Error).message || t.settings.unexpectedErrorDescription,
        type: 'error',
        duration: 5000,
      })
    }
  }

  const handleModalClose = () => {
    setShowPasswordModal(false)
  }

  const handleExportForSync = async (password?: string) => {
    setShowSyncPasswordModal(false)
    setIsExportingSync(true)
    try {
      const { blob, filename, qrCode } = await exportForSync(password)

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

      setSyncQrCode(qrCode ?? null)
      toaster.create({
        title: t.settings.syncExportedTitle,
        description: password ? t.settings.syncExportedPasswordDescription : undefined,
        type: 'success',
        duration: 5000,
      })
    } catch (error) {
      if (error instanceof PrfUnsupportedError) {
        setShowSyncPasswordModal(true)
      }
    } finally {
      setIsExportingSync(false)
    }
  }

  const handleAddGuardian = () => {
    if (!guardianName.trim()) {
      toaster.create({
        title: t.settings.invalidInputTitle,
        description: t.settings.guardianNameRequiredDescription,
        type: 'error',
        duration: 3000,
      })
      return
    }

    setGuardiansList([
      ...guardiansList,
      { name: guardianName.trim(), email: guardianEmail.trim() || undefined },
    ])
    setGuardianName('')
    setGuardianEmail('')
  }

  const handleRemoveGuardian = (index: number) => {
    setGuardiansList(guardiansList.filter((_, i) => i !== index))
  }

  const handleSetupSocialRecovery = async () => {
    if (guardiansList.length < 2) {
      toaster.create({
        title: t.settings.notEnoughGuardiansTitle,
        description: t.settings.notEnoughGuardiansDescription,
        type: 'error',
        duration: 3000,
      })
      return
    }

    if (threshold > guardiansList.length) {
      toaster.create({
        title: t.settings.invalidThresholdTitle,
        description: t.settings.invalidThresholdDescription,
        type: 'error',
        duration: 3000,
      })
      return
    }

    try {
      const guardians = await setupSocialRecovery(guardiansList, threshold)
      const config = getSocialRecoveryConfig()
      setSocialRecoveryConfig(config)

      toaster.create({
        title: t.settings.socialRecoveryConfiguredTitle,
        description: t.settings.socialRecoveryConfiguredDescription(
          threshold,
          guardiansList.length
        ),
        type: 'success',
        duration: 5000,
      })
    } catch (error) {
      console.error('Error setting up social recovery:', error)
    }
  }

  const handleGenerateInvite = async (guardian: any) => {
    try {
      const invite = await generateGuardianInvite(guardian)
      setSelectedGuardianForInvite(guardian)
      setGuardianInvite(invite)
    } catch (error) {
      console.error('Error generating guardian invite:', error)
    }
  }

  const handleDownloadInvite = () => {
    if (!guardianInvite) return

    const blob = new Blob([guardianInvite.explainer + '\n\n' + guardianInvite.shareCode], {
      type: 'text/plain',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `guardian-invite-${selectedGuardianForInvite?.name || 'guardian'}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClearSocialRecovery = () => {
    clearSocialRecoveryConfig()
    setSocialRecoveryConfig(null)
  }

  const handleAddRecoveryShare = () => {
    if (!currentShareInput.trim()) {
      toaster.create({
        title: t.settings.invalidInputTitle,
        description: t.settings.pleasePasteShareDescription,
        type: 'error',
        duration: 3000,
      })
      return
    }

    try {
      // Validate JSON format
      const parsed = JSON.parse(currentShareInput)
      if (!parsed.share || !parsed.guardianId) {
        throw new Error('Invalid share format')
      }

      // Check for duplicates
      const isDuplicate = recoveryShares.some(share => {
        const existingParsed = JSON.parse(share)
        return existingParsed.guardianId === parsed.guardianId
      })

      if (isDuplicate) {
        toaster.create({
          title: t.settings.duplicateShareTitle,
          description: t.settings.duplicateShareDescription,
          type: 'warning',
          duration: 3000,
        })
        return
      }

      setRecoveryShares([...recoveryShares, currentShareInput])
      setCurrentShareInput('')

      toaster.create({
        title: t.settings.shareAddedTitle,
        description: t.settings.shareAddedDescription(
          parsed.guardianName || t.settings.guardianFallback
        ),
        type: 'success',
        duration: 2000,
      })
    } catch (error) {
      toaster.create({
        title: t.settings.invalidShareFormatTitle,
        description: t.settings.invalidShareFormatDescription,
        type: 'error',
        duration: 3000,
      })
    }
  }

  const handleRemoveRecoveryShare = (index: number) => {
    setRecoveryShares(recoveryShares.filter((_, i) => i !== index))
  }

  const handleRecoverWallet = async () => {
    if (recoveryShares.length < 2) {
      toaster.create({
        title: t.settings.notEnoughSharesTitle,
        description: t.settings.notEnoughSharesDescription,
        type: 'error',
        duration: 3000,
      })
      return
    }

    setIsRecovering(true)
    try {
      // Step 1: Recover the encrypted backup file from guardian shares
      const { backupFileJson, ethereumAddress } = await recoverFromGuardians(recoveryShares)

      // Step 2: Prompt for password to decrypt the backup file
      const password = window.prompt(t.settings.recoveryPasswordPrompt)

      if (!password) {
        toaster.create({
          title: t.passwordModal.passwordRequiredTitle,
          description: t.settings.passwordRequiredRecoveryDescription,
          type: 'error',
          duration: 3000,
        })
        setIsRecovering(false)
        return
      }

      // Step 3: Prompt for username for the new passkey registration
      const username = window.prompt(
        t.settings.recoveryUsernamePrompt(
          `${ethereumAddress.slice(0, 6)}...${ethereumAddress.slice(-4)}`
        )
      )

      if (!username) {
        toaster.create({
          title: t.header.usernameRequiredTitle,
          description: t.settings.usernameRequiredRecoveryDescription,
          type: 'error',
          duration: 3000,
        })
        setIsRecovering(false)
        return
      }

      // Step 4: Register with the recovered backup file
      const result = await registerWithBackupFile(backupFileJson, password, username)

      toaster.create({
        title: t.settings.walletRecoveredTitle,
        description: t.settings.walletRecoveredDescription(
          `${result.address.slice(0, 6)}...${result.address.slice(-4)}`
        ),
        type: 'success',
        duration: 8000,
      })

      // Clear recovery state
      setRecoveryShares([])
      setCurrentShareInput('')
      setShowRecoverySection(false)
    } catch (error) {
      console.error('Recovery error:', error)
      // Error toast already shown in recoverFromGuardians or registerWithBackupFile
    } finally {
      setIsRecovering(false)
    }
  }

  const handleUploadShareFile = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.txt,.json'
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      try {
        const textContent = await file.text()

        // Try to extract JSON from the file
        // Guardian files contain both explainer text and JSON
        const jsonMatch = textContent.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          setCurrentShareInput(jsonMatch[0])
        } else {
          setCurrentShareInput(textContent)
        }

        toaster.create({
          title: t.settings.fileLoadedTitle,
          description: t.settings.fileLoadedDescription,
          type: 'info',
          duration: 3000,
        })
      } catch (error) {
        toaster.create({
          title: t.settings.errorReadingFileTitle,
          description: (error as Error).message || t.settings.failedReadGuardianFile,
          type: 'error',
          duration: 3000,
        })
      }
    }
    fileInput.click()
  }

  return (
    <>
      <VStack gap={8} align="stretch" py={20}>
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            {t.settings.title}
          </Heading>
          <Text fontSize="xl" color="gray.400" maxW="2xl" mx="auto">
            {t.settings.subtitle}
          </Text>
        </Box>

        <TabsRoot colorPalette="gray" variant="plain" size="md" defaultValue="accounts">
          <TabsList
            bg="transparent"
            p={0}
            borderRadius="none"
            gap={0}
            border="none"
            borderBottom="1px solid"
            borderColor="gray.800"
            flexWrap={{ base: 'wrap', md: 'nowrap' }}
          >
            <TabsTrigger
              value="accounts"
              px={{ base: 4, md: 5 }}
              py={3}
              borderRadius="none"
              fontWeight="normal"
              transition="all 0.2s"
              fontSize={{ base: 'sm', md: 'sm' }}
              color="gray.500"
              position="relative"
              _selected={{
                color: 'white',
                fontWeight: 'medium',
                _after: {
                  content: '""',
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  bg: brandColors.primary,
                },
              }}
              _hover={{
                color: 'gray.300',
              }}
            >
              {t.settings.tabAccounts}
            </TabsTrigger>
            <TabsTrigger
              value="backup"
              px={{ base: 4, md: 5 }}
              py={3}
              borderRadius="none"
              fontWeight="normal"
              transition="all 0.2s"
              fontSize={{ base: 'sm', md: 'sm' }}
              color="gray.500"
              position="relative"
              _selected={{
                color: 'white',
                fontWeight: 'medium',
                _after: {
                  content: '""',
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  bg: brandColors.primary,
                },
              }}
              _hover={{
                color: 'gray.300',
              }}
            >
              {t.settings.tabBackup}
            </TabsTrigger>
            <TabsTrigger
              value="sync"
              px={{ base: 4, md: 5 }}
              py={3}
              borderRadius="none"
              fontWeight="normal"
              transition="all 0.2s"
              fontSize={{ base: 'sm', md: 'sm' }}
              color="gray.500"
              position="relative"
              _selected={{
                color: 'white',
                fontWeight: 'medium',
                _after: {
                  content: '""',
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  bg: brandColors.primary,
                },
              }}
              _hover={{
                color: 'gray.300',
              }}
            >
              {t.settings.tabSync}
            </TabsTrigger>
            <TabsTrigger
              value="recovery"
              px={{ base: 4, md: 5 }}
              py={3}
              borderRadius="none"
              fontWeight="normal"
              transition="all 0.2s"
              fontSize={{ base: 'sm', md: 'sm' }}
              color="gray.500"
              position="relative"
              _selected={{
                color: 'white',
                fontWeight: 'medium',
                _after: {
                  content: '""',
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  bg: brandColors.primary,
                },
              }}
              _hover={{
                color: 'gray.300',
              }}
            >
              {t.settings.tabRecovery}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" pt={8}>
            <VStack gap={6} align="stretch">
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  {t.settings.currentAccountHeading}
                </Heading>
                <Text fontSize="md" color="gray.400" mb={6}>
                  {t.settings.currentAccountDescription}
                </Text>
              </Box>

              {accounts.length === 0 ? (
                <Box
                  bg="gray.900"
                  p={8}
                  borderRadius="lg"
                  textAlign="center"
                  border="1px solid"
                  borderColor="gray.700"
                >
                  <Text color="gray.400">{t.settings.noAccounts}</Text>
                </Box>
              ) : (
                accounts.map(account => (
                  <Box
                    key={account.ethereumAddress}
                    bg="gray.900"
                    p={6}
                    borderRadius="lg"
                    border={
                      user?.ethereumAddress === account.ethereumAddress
                        ? `2px solid ${brandColors.primary}`
                        : '1px solid'
                    }
                    borderColor={
                      user?.ethereumAddress === account.ethereumAddress
                        ? brandColors.primary
                        : 'gray.700'
                    }
                  >
                    <HStack justify="space-between" align="start">
                      <Box flex={1} minW={0}>
                        <HStack mb={3}>
                          <Text fontSize="lg" fontWeight="bold" color="white">
                            {account.displayName || account.username}
                          </Text>
                          {user?.ethereumAddress === account.ethereumAddress && (
                            <Badge colorPalette="purple">{t.settings.currentBadge}</Badge>
                          )}
                        </HStack>
                        <Text fontSize="sm" color="gray.400" mb={2}>
                          {t.settings.usernameLabel(account.username)}
                        </Text>
                        <Code
                          fontSize="xs"
                          bg="gray.800"
                          color="gray.300"
                          p={2}
                          borderRadius="md"
                          display="block"
                          wordBreak="break-all"
                          overflowWrap="break-word"
                        >
                          {account.ethereumAddress}
                        </Code>
                      </Box>
                      <IconButton
                        aria-label={t.settings.deleteAccountAria}
                        colorPalette="red"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAccount(account)}
                        flexShrink={0}
                      >
                        <MdDelete />
                      </IconButton>
                    </HStack>
                  </Box>
                ))
              )}

              {/* Keep my session alive */}
              <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <HStack mb={4}>
                  <Icon as={FiClock} color={brandColors.primary} boxSize={6} />
                  <Heading size="md">{t.settings.sessionHeading}</Heading>
                </HStack>
                <Text fontSize="sm" color="gray.400" mb={6}>
                  {t.settings.sessionDescription}
                </Text>
                {isAuthenticated && persistentSessionStored === false && (
                  <Box p={3} bg="yellow.900/90" borderRadius="md" mb={6}>
                    <Text fontSize="xs" color="gray.200">
                      {t.settings.noStoredSessionText}
                    </Text>
                  </Box>
                )}
                <SliderRoot
                  value={[persistentSessionDays]}
                  onValueChange={handleSessionDurationChange}
                  onValueChangeEnd={handleSessionDurationChangeEnd}
                  min={1}
                  max={30}
                  step={1}
                  width="full"
                >
                  <HStack justify="space-between" mb={2}>
                    <SliderLabel fontSize="sm" fontWeight="medium">
                      {t.settings.sessionDurationLabel}
                    </SliderLabel>
                    <SliderValueText fontSize="sm" fontWeight="bold" color={brandColors.accent}>
                      {t.settings.dayLabel(persistentSessionDays)}
                    </SliderValueText>
                  </HStack>
                  <SliderControl>
                    <SliderTrack bg="gray.700" height="8px">
                      <SliderRange bg={brandColors.primary} />
                    </SliderTrack>
                    <SliderThumb
                      index={0}
                      boxSize="20px"
                      bg={brandColors.accent}
                      border="3px solid"
                      borderColor="gray.800"
                      _focus={{ boxShadow: `0 0 0 3px ${brandColors.primary}40` }}
                    />
                  </SliderControl>
                </SliderRoot>
                <HStack justify="space-between" mt={2} fontSize="xs" color="gray.500">
                  <Text>{t.settings.oneDayLabel}</Text>
                  <Text>{t.settings.thirtyDaysLabel}</Text>
                </HStack>
                <Box p={3} bg="blue.900/90" borderRadius="md" mt={4}>
                  <Text fontSize="xs" color="gray.300">
                    <strong>{t.settings.sessionHowItWorksTitle}</strong>{' '}
                    {t.settings.sessionHowItWorksText}
                  </Text>
                </Box>
              </Box>

              {/* Register a new account */}
              {/* <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <HStack mb={4}>
                  <Icon as={FiUserPlus} color={brandColors.primary} boxSize={6} />
                  <Heading size="md">Register a new account</Heading>
                </HStack>
                <Text fontSize="sm" color="gray.400" mb={4}>
                  Create a new Web3 passkey account. Each account is secured with your device&apos;s
                  biometric authentication or PIN, and has its own Ethereum wallet.
                </Text>
                <Button
                  bg={brandColors.primary}
                  color="white"
                  _hover={{
                    bg: brandColors.secondary,
                  }}
                  onClick={onRegisterModalOpen}
                  width="full"
                >
                  <Icon as={FiUserPlus} />
                  Register
                </Button>
              </Box> */}

              {/* W3PK Build Verification */}
              <BuildVerification />
            </VStack>
          </TabsContent>

          <TabsContent value="backup" pt={8}>
            <VStack gap={8} align="stretch">
              {/* Header */}
              <Box>
                <Heading size="lg" mb={4}>
                  {t.settings.walletBackupHeading}
                </Heading>
                <Text color="gray.400" mb={6}>
                  {t.settings.walletBackupDescription}
                </Text>
              </Box>

              {/* Current User Info */}
              <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <HStack mb={4}>
                  <Icon as={FiShield} color={brandColors.primary} boxSize={6} />
                  <Heading size="md">{t.settings.currentAccountBackupHeading}</Heading>
                </HStack>
                <VStack align="stretch" gap={3}>
                  <HStack>
                    <Text fontSize="sm" color="gray.400">
                      {t.settings.loggedInAsLabel}
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="white">
                      {user?.displayName || user?.username}
                    </Text>
                  </HStack>

                  {isLoadingAddresses ? (
                    <HStack justify="center" py={2}>
                      <Spinner size="sm" />
                      <Text fontSize="xs" color="gray.400">
                        {t.settings.loadingAddressesText}
                      </Text>
                    </HStack>
                  ) : (
                    <>
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          {t.settings.index0Label}
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
                          {index0Address || t.settings.loadingText}
                        </Code>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          {t.settings.mainAddressLabel}
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
                          {mainAddress || t.settings.loadingText}
                        </Code>
                      </Box>
                    </>
                  )}
                </VStack>
              </Box>

              {/* Security Score */}
              <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <HStack mb={4}>
                  <Icon as={FiCheckCircle} color={brandColors.primary} boxSize={6} />
                  <Heading size="md">{t.settings.securityStatusHeading}</Heading>
                </HStack>
                {isCheckingStatus ? (
                  <HStack justify="center" py={4}>
                    <Spinner size="sm" />
                    <Text color="gray.400" fontSize="sm">
                      {t.settings.checkingStatusText}
                    </Text>
                  </HStack>
                ) : (
                  <Text color="gray.300" fontSize="lg">
                    {backupStatus || t.settings.loadingText}
                  </Text>
                )}
                {evictionRisk && (
                  <Text color="orange.300" fontSize="sm" mt={3}>
                    {t.settings.evictionRiskWarning}
                  </Text>
                )}
              </Box>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                <Box
                  bg="gray.900"
                  p={6}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.700"
                  _hover={{ borderColor: brandColors.primary, transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <Icon as={MdInfo} color={brandColors.primary} boxSize={6} mb={3} />
                  <Heading size="sm" mb={3}>
                    {t.settings.refreshHeading}
                  </Heading>
                  <Text fontSize="sm" color="gray.400" mb={4}>
                    {t.settings.refreshDescription}
                  </Text>
                  <Button
                    bg={brandColors.primary}
                    color="white"
                    _hover={{ bg: brandColors.secondary }}
                    onClick={handleGetBackupStatus}
                    loading={isCheckingStatus}
                    spinner={<Spinner size="50px" />}
                    loadingText={t.settings.checkingText}
                    disabled={isCheckingStatus || isCreatingBackup || isRestoring}
                    width="full"
                  >
                    {t.settings.refreshButton}
                  </Button>
                </Box>

                <Box
                  bg="gray.900"
                  p={6}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.700"
                  _hover={{ borderColor: brandColors.primary, transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <Icon as={MdDownload} color={brandColors.primary} boxSize={6} mb={3} />
                  <Heading size="sm" mb={3}>
                    {t.settings.createHeading}
                  </Heading>
                  <Text fontSize="sm" color="gray.400" mb={4}>
                    {t.settings.createDescription}
                  </Text>
                  <Button
                    bg={brandColors.primary}
                    color="white"
                    _hover={{ bg: brandColors.secondary }}
                    onClick={handleCreateBackup}
                    loading={isCreatingBackup}
                    spinner={<Spinner size="50px" />}
                    loadingText={t.settings.creatingText}
                    disabled={isCheckingStatus || isCreatingBackup || isRestoring}
                    width="full"
                  >
                    {t.settings.createButton}
                  </Button>
                </Box>

                <Box
                  bg="gray.900"
                  p={6}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.700"
                  _hover={{ borderColor: brandColors.primary, transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <Icon as={FiUpload} color={brandColors.primary} boxSize={6} mb={3} />
                  <Heading size="sm" mb={3}>
                    {t.settings.restoreHeadingCard}
                  </Heading>
                  <Text fontSize="sm" color="gray.400" mb={4}>
                    {t.settings.restoreDescriptionCard}
                  </Text>
                  <Button
                    bg={brandColors.primary}
                    color="white"
                    _hover={{ bg: brandColors.secondary }}
                    onClick={handleRestoreBackup}
                    loading={isRestoring}
                    spinner={<Spinner size="50px" />}
                    loadingText={t.settings.restoringText}
                    disabled={isCheckingStatus || isCreatingBackup || isRestoring}
                    width="full"
                  >
                    {t.settings.restoreButtonCard}
                  </Button>
                </Box>
              </SimpleGrid>

              <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <Heading size="sm" mb={4} color={brandColors.primary}>
                  {t.settings.aboutBackupHeading}
                </Heading>
                <VStack align="stretch" gap={3} fontSize="sm" color="gray.400">
                  <Text>{t.settings.aboutBackupPara1}</Text>
                  <Text>{t.settings.aboutBackupPara2}</Text>
                  <Text>{t.settings.aboutBackupPara3}</Text>
                  <Box p={4} bg="yellow.900/90" mt={2}>
                    <Text fontSize="xs">{t.settings.aboutBackupWarning}</Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </TabsContent>

          <TabsContent value="recovery" pt={8}>
            <VStack gap={8} align="stretch">
              <Box>
                <Heading size="lg" mb={4}>
                  {t.settings.socialRecoveryHeading}
                </Heading>
                <Text color="gray.400" mb={6}>
                  {t.settings.socialRecoveryDescription}
                </Text>
              </Box>

              <SimpleGrid columns={{ base: 1 }} gap={6}>
                {!socialRecoveryConfig ? (
                  <>
                    {/* Setup Social Recovery */}
                    <Box
                      bg="gray.900"
                      p={6}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.700"
                    >
                      <HStack mb={4}>
                        <Icon as={FiShield} color={brandColors.primary} boxSize={6} />
                        <Heading size="md">{t.settings.setupHeading}</Heading>
                      </HStack>
                      <Text fontSize="sm" color="gray.400" mb={6}>
                        {t.settings.setupDescription(threshold, guardiansList.length)}
                      </Text>

                      {/* Add Guardian Form */}
                      <VStack align="stretch" gap={4} mb={6}>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>
                            {t.settings.guardianNameLabel}
                          </Text>
                          <input
                            type="text"
                            value={guardianName}
                            onChange={e => setGuardianName(e.target.value)}
                            placeholder="Julien"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #4A5568',
                              background: '#1A202C',
                              color: 'white',
                              fontSize: '14px',
                            }}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>
                            {t.settings.guardianEmailLabel}
                          </Text>
                          <input
                            type="email"
                            value={guardianEmail}
                            onChange={e => setGuardianEmail(e.target.value)}
                            placeholder="julien@strat.cc"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #4A5568',
                              background: '#1A202C',
                              color: 'white',
                              fontSize: '14px',
                            }}
                          />
                        </Box>
                        <Button
                          onClick={handleAddGuardian}
                          colorPalette="purple"
                          size="sm"
                          width="fit-content"
                        >
                          {t.settings.addGuardianButton}
                        </Button>
                      </VStack>

                      {/* Guardians List */}
                      {guardiansList.length > 0 && (
                        <Box mb={6}>
                          <Text fontSize="sm" fontWeight="medium" mb={3}>
                            {t.settings.guardiansListHeading(guardiansList.length)}
                          </Text>
                          <VStack align="stretch" gap={2}>
                            {guardiansList.map((guardian, index) => (
                              <Box
                                key={index}
                                p={3}
                                bg="gray.950"
                                borderRadius="md"
                                border="1px solid"
                                borderColor="gray.800"
                              >
                                <HStack justify="space-between">
                                  <Box>
                                    <Text fontSize="sm" fontWeight="bold">
                                      {guardian.name}
                                    </Text>
                                    {guardian.email && (
                                      <Text fontSize="xs" color="gray.400">
                                        {guardian.email}
                                      </Text>
                                    )}
                                  </Box>
                                  <IconButton
                                    aria-label={t.settings.removeGuardianAria}
                                    size="xs"
                                    colorPalette="red"
                                    variant="ghost"
                                    onClick={() => handleRemoveGuardian(index)}
                                  >
                                    <MdDelete />
                                  </IconButton>
                                </HStack>
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      )}

                      {/* Threshold Selector */}
                      {guardiansList.length >= 2 && (
                        <Box mb={6}>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>
                            {t.settings.thresholdLabel(threshold, guardiansList.length)}
                          </Text>
                          <Text fontSize="xs" color="gray.400" mb={3}>
                            {t.settings.thresholdDescription}
                          </Text>
                          <input
                            type="range"
                            min="2"
                            max={guardiansList.length}
                            value={threshold}
                            onChange={e => setThreshold(parseInt(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </Box>
                      )}

                      {/* Setup Button */}
                      <Button
                        onClick={handleSetupSocialRecovery}
                        bg={brandColors.primary}
                        color="white"
                        _hover={{ bg: brandColors.secondary }}
                        disabled={guardiansList.length < 2}
                        width="full"
                      >
                        {t.settings.setupSocialRecoveryButton(threshold, guardiansList.length)}
                      </Button>
                    </Box>

                    {/* Info Box */}
                    <Box p={4} bg="blue.900/90" borderRadius="lg">
                      <Text fontSize="sm">
                        {t.settings.howItWorksRecoveryInfo(guardiansList.length, threshold)}
                      </Text>
                    </Box>

                    {/* Recover Wallet Section */}
                    <Box
                      bg="gray.900"
                      p={6}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="orange.700"
                    >
                      <HStack mb={4} justify="space-between">
                        <HStack>
                          <Icon as={FiKey} color="orange.400" boxSize={6} />
                          <Heading size="md">{t.settings.recoverWalletHeading}</Heading>
                        </HStack>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowRecoverySection(!showRecoverySection)}
                        >
                          {showRecoverySection ? t.settings.hideButton : t.settings.showButton}
                        </Button>
                      </HStack>

                      {showRecoverySection && (
                        <VStack align="stretch" gap={4}>
                          <Text fontSize="sm" color="gray.400">
                            {t.settings.recoverDescription}
                          </Text>

                          {/* Share Input */}
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={2}>
                              {t.settings.shareCodeLabel}
                            </Text>
                            <Textarea
                              placeholder={t.settings.sharePlaceholder}
                              value={currentShareInput}
                              onChange={e => setCurrentShareInput(e.target.value)}
                              minH="100px"
                              fontFamily="monospace"
                              fontSize="sm"
                              bg="gray.950"
                              borderColor="gray.700"
                              _focus={{ borderColor: brandColors.primary }}
                            />
                          </Box>

                          {/* Action Buttons */}
                          <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                            <Button
                              onClick={handleAddRecoveryShare}
                              colorPalette="purple"
                              size="sm"
                            >
                              {t.settings.addShareButton}
                            </Button>
                            <Button
                              onClick={handleUploadShareFile}
                              variant="outline"
                              colorPalette="purple"
                              size="sm"
                            >
                              <Icon as={FiUpload} mr={2} />
                              {t.settings.uploadFileButton}
                            </Button>
                            <Button
                              onClick={() => {
                                setRecoveryShares([])
                                setCurrentShareInput('')
                              }}
                              variant="outline"
                              colorPalette="gray"
                              size="sm"
                            >
                              {t.settings.clearAllButton}
                            </Button>
                          </SimpleGrid>

                          {/* Collected Shares List */}
                          {recoveryShares.length > 0 && (
                            <Box>
                              <Text fontSize="sm" fontWeight="medium" mb={3}>
                                {t.settings.collectedSharesHeading(recoveryShares.length)}
                              </Text>
                              <VStack align="stretch" gap={2}>
                                {recoveryShares.map((share, index) => {
                                  try {
                                    const parsed = JSON.parse(share)
                                    return (
                                      <Box
                                        key={index}
                                        p={3}
                                        bg="gray.950"
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="purple.800"
                                      >
                                        <HStack justify="space-between">
                                          <Box>
                                            <Text fontSize="sm" fontWeight="bold">
                                              {parsed.guardianName || t.settings.guardianFallback}{' '}
                                              {t.settings.shareIndexLabel(
                                                parsed.guardianIndex || index + 1
                                              )}
                                            </Text>
                                            <Text fontSize="xs" color="gray.400">
                                              {t.settings.addedAtLabel(
                                                new Date().toLocaleTimeString()
                                              )}
                                            </Text>
                                          </Box>
                                          <IconButton
                                            aria-label={t.settings.removeShareAria}
                                            size="xs"
                                            colorPalette="red"
                                            variant="ghost"
                                            onClick={() => handleRemoveRecoveryShare(index)}
                                          >
                                            <MdDelete />
                                          </IconButton>
                                        </HStack>
                                      </Box>
                                    )
                                  } catch {
                                    return (
                                      <Box
                                        key={index}
                                        p={3}
                                        bg="gray.950"
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="red.800"
                                      >
                                        <HStack justify="space-between">
                                          <Text fontSize="sm" color="red.300">
                                            {t.settings.invalidShareLabel(index + 1)}
                                          </Text>
                                          <IconButton
                                            aria-label={t.settings.removeShareAria}
                                            size="xs"
                                            colorPalette="red"
                                            variant="ghost"
                                            onClick={() => handleRemoveRecoveryShare(index)}
                                          >
                                            <MdDelete />
                                          </IconButton>
                                        </HStack>
                                      </Box>
                                    )
                                  }
                                })}
                              </VStack>
                            </Box>
                          )}

                          {/* Recovery Progress */}
                          {recoveryShares.length > 0 && (
                            <Box p={4} bg="purple.900/50" borderRadius="lg">
                              <Text fontSize="sm" fontWeight="medium" mb={2}>
                                {t.settings.progressHeading}
                              </Text>
                              <Text fontSize="xs" color="gray.300">
                                {t.settings.progressText(recoveryShares.length)}
                              </Text>
                            </Box>
                          )}

                          {/* Recover Button */}
                          <Button
                            onClick={handleRecoverWallet}
                            bg="orange.500"
                            color="white"
                            _hover={{ bg: 'orange.600' }}
                            disabled={recoveryShares.length < 2 || isRecovering}
                            loading={isRecovering}
                            spinner={<Spinner size="50px" />}
                            loadingText={t.settings.recoveringText}
                            width="full"
                            size="lg"
                          >
                            <Icon as={FiKey} mr={2} />
                            {t.settings.recoverButton(recoveryShares.length)}
                          </Button>

                          {/* Warning */}
                          <Box p={3} bg="yellow.900/90" borderRadius="md">
                            <Text fontSize="xs" color="gray.300">
                              {t.settings.importantWarning}
                            </Text>
                          </Box>
                        </VStack>
                      )}
                    </Box>
                  </>
                ) : (
                  <>
                    {/* Social Recovery Configured */}
                    <Box
                      bg="gray.900"
                      p={6}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="green.700"
                    >
                      <HStack mb={4}>
                        <Icon as={MdCheckCircle} color="green.400" boxSize={6} />
                        <Heading size="md">{t.settings.activeHeading}</Heading>
                      </HStack>
                      <Text fontSize="sm" color="gray.400" mb={4}>
                        {t.settings.activeDescription(
                          socialRecoveryConfig.threshold,
                          socialRecoveryConfig.totalGuardians
                        )}
                      </Text>

                      {/* Guardians List */}
                      <VStack align="stretch" gap={3} mb={4}>
                        {socialRecoveryConfig.guardians.map((guardian: any, index: number) => (
                          <Box
                            key={guardian.id}
                            p={4}
                            bg="gray.950"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.800"
                          >
                            <HStack justify="space-between" mb={2}>
                              <Box>
                                <HStack>
                                  <Text fontSize="sm" fontWeight="bold">
                                    {guardian.name}
                                  </Text>
                                  <Badge
                                    colorPalette={
                                      guardian.status === 'active'
                                        ? 'green'
                                        : guardian.status === 'pending'
                                          ? 'yellow'
                                          : 'gray'
                                    }
                                    fontSize="xs"
                                  >
                                    {guardian.status}
                                  </Badge>
                                </HStack>
                                {guardian.email && (
                                  <Text fontSize="xs" color="gray.400">
                                    {guardian.email}
                                  </Text>
                                )}
                              </Box>
                              <Button
                                size="xs"
                                onClick={() => handleGenerateInvite(guardian)}
                                colorPalette="purple"
                                px={4}
                                flexShrink={0}
                              >
                                {t.settings.generateInviteButton}
                              </Button>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>

                      {/* Clear Local Storage Button */}
                      <Box p={4} bg="blue.900/90" borderRadius="lg">
                        <VStack gap={3} align="stretch">
                          <Text fontSize="sm" color="gray.300">
                            {t.settings.removeConfigQuestion}
                          </Text>
                          <Button
                            onClick={handleClearSocialRecovery}
                            colorPalette="red"
                            variant="outline"
                            width="full"
                            size="sm"
                          >
                            {t.settings.removeConfigButton}
                          </Button>
                        </VStack>
                      </Box>
                    </Box>

                    {/* Guardian Invite Modal Content */}
                    {guardianInvite && (
                      <Box
                        bg="gray.900"
                        p={6}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="purple.700"
                      >
                        <HStack justify="space-between" mb={4}>
                          <Heading size="md">{t.settings.invitationHeading}</Heading>
                          <CloseButton onClick={() => setGuardianInvite(null)} />
                        </HStack>

                        {/* QR Code */}
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          p={4}
                          bg="white"
                          borderRadius="lg"
                          width="fit-content"
                          mx="auto"
                          mb={4}
                        >
                          <QRCodeSVG
                            value={guardianInvite.shareCode}
                            size={256}
                            level="H"
                            marginSize={4}
                          />
                        </Box>

                        {/* Actions */}
                        <VStack gap={3}>
                          <Button
                            onClick={handleDownloadInvite}
                            bg={brandColors.primary}
                            color="white"
                            _hover={{ bg: brandColors.secondary }}
                            width="full"
                          >
                            <Icon as={FiDownload} mr={2} />
                            {t.settings.downloadInviteButton}
                          </Button>
                          <Text fontSize="xs" color="gray.400" textAlign="center">
                            {t.settings.sendInviteText(selectedGuardianForInvite?.name)}
                          </Text>
                        </VStack>
                      </Box>
                    )}
                  </>
                )}
              </SimpleGrid>
            </VStack>
          </TabsContent>

          <TabsContent value="sync" pt={8}>
            <VStack gap={8} align="stretch">
              <Box>
                <Heading size="lg" mb={4}>
                  {t.settings.deviceSyncHeading}
                </Heading>
                <Text color="gray.400" mb={6}>
                  {t.settings.deviceSyncDescription}
                </Text>
              </Box>

              {/* Sync Export Section */}
              <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <HStack mb={4}>
                  <Icon as={FiKey} color={brandColors.primary} boxSize={6} />
                  <Heading size="md">{t.settings.syncExportHeading}</Heading>
                </HStack>
                <Text fontSize="sm" color="gray.400" mb={4}>
                  {t.settings.syncExportDescription}
                </Text>

                <VStack gap={4} align="stretch">
                  <Button
                    bg={brandColors.primary}
                    color="white"
                    _hover={{ bg: brandColors.secondary }}
                    onClick={() => handleExportForSync()}
                    loading={isExportingSync}
                    width="full"
                  >
                    {t.settings.syncExportButton}
                  </Button>

                  {syncQrCode && (
                    <>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        p={4}
                        bg="white"
                        borderRadius="lg"
                        width="fit-content"
                        mx="auto"
                      >
                        <Image src={syncQrCode} alt={t.settings.syncQrAlt} boxSize="256px" />
                      </Box>
                      <Button variant="outline" onClick={() => setSyncQrCode(null)} width="full">
                        {t.settings.hideQrButton}
                      </Button>
                    </>
                  )}

                  <Box p={4} bg="yellow.900/90" borderRadius="md">
                    <Text fontSize="xs" color="gray.300">
                      {t.settings.syncExportNote}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <SyncImport />

              {/* How Device Sync Works */}
              <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <HStack mb={4}>
                  <Icon as={FiShield} color={brandColors.primary} boxSize={6} />
                  <Heading size="md">{t.settings.syncHowHeading}</Heading>
                </HStack>
                <VStack align="stretch" gap={3} fontSize="sm" color="gray.400">
                  <Text>{t.settings.syncStep1}</Text>
                  <Text>{t.settings.syncStep2}</Text>
                  <Text>{t.settings.syncStep3}</Text>
                </VStack>
              </Box>

              {/* Passkey Platform Sync Info */}
              <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <HStack mb={4}>
                  <Icon as={FiCloud} color={brandColors.primary} boxSize={6} />
                  <Heading size="md">{t.settings.platformSyncHeading}</Heading>
                </HStack>
                <VStack align="stretch" gap={3} fontSize="sm" color="gray.400">
                  <Text>{t.settings.platformSyncIntro}</Text>
                  <ListRoot gap={2} fontSize="sm" variant="plain">
                    <ListItem>
                      <Icon as={MdCheckCircle} color="green.400" mr={2} />
                      {t.settings.appleSyncNote}
                    </ListItem>
                    <ListItem>
                      <Icon as={MdCheckCircle} color="green.400" mr={2} />
                      {t.settings.googleSyncNote}
                    </ListItem>
                    <ListItem>
                      <Icon as={MdWarning} color="yellow.400" mr={2} />
                      {t.settings.windowsSyncNote}
                    </ListItem>
                    <ListItem>
                      <Icon as={MdWarning} color="yellow.400" mr={2} />
                      {t.settings.hardwareSyncNote}
                    </ListItem>
                  </ListRoot>
                  <Box p={3} bg="yellow.900/90" borderRadius="md" mt={2}>
                    <Text fontSize="xs" color="gray.300">
                      {t.settings.crossPlatformNote}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              {/* Best Practices */}
              <Box bg="gray.900" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
                <HStack mb={4}>
                  <Icon as={FiCheckCircle} color={brandColors.primary} boxSize={6} />
                  <Heading size="md">{t.settings.bestPracticesHeading}</Heading>
                </HStack>
                <VStack align="stretch" gap={2} fontSize="sm" color="gray.400">
                  <ListRoot gap={2} variant="plain">
                    <ListItem>
                      <Icon as={MdCheckCircle} color="green.400" mr={2} />
                      {t.settings.practiceBackupFirst}
                    </ListItem>
                    <ListItem>
                      <Icon as={MdCheckCircle} color="green.400" mr={2} />
                      {t.settings.practiceVerifyAddresses}
                    </ListItem>
                    <ListItem>
                      <Icon as={MdCheckCircle} color="green.400" mr={2} />
                      {t.settings.practiceUseDebugTools}
                    </ListItem>
                    <ListItem>
                      <Icon as={MdWarning} color="yellow.400" mr={2} />
                      {t.settings.practiceNeverShareQr}
                    </ListItem>
                    <ListItem>
                      <Icon as={MdInfo} color="blue.400" mr={2} />
                      {t.settings.practiceTreatAsSensitive}
                    </ListItem>
                  </ListRoot>
                </VStack>
              </Box>
            </VStack>
          </TabsContent>
        </TabsRoot>
      </VStack>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={handleModalClose}
        onSubmit={handlePasswordSubmit}
        title={t.settings.createBackupModalTitle}
        description={t.settings.createBackupModalDescription}
      />

      <PasswordModal
        isOpen={showSyncPasswordModal}
        onClose={() => setShowSyncPasswordModal(false)}
        onSubmit={handleExportForSync}
        title={t.settings.syncPasswordModalTitle}
        description={t.settings.syncPasswordModalDescription}
      />

      <PasswordModal
        isOpen={showRestorePasswordModal}
        onClose={handleRestoreModalClose}
        onSubmit={handleRestorePasswordSubmit}
        title={t.settings.restoreBackupModalTitle}
        description={t.settings.restoreBackupModalDescription}
      />

      {/* Username Modal for Restore when no credentials exist */}
      <Dialog.Root
        open={needsUsernameForRestore}
        onOpenChange={(e: { open: boolean }) =>
          e.open
            ? null
            : (() => {
                setNeedsUsernameForRestore(false)
                setRestoreUsername('')
                setSelectedBackupFile(null)
                delete (window as any)._restorePassword
                delete (window as any)._restoreBackup
              })()
        }
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6}>
              <Dialog.Header>
                <Dialog.Title>{t.settings.chooseUsernameModalTitle}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pt={4}>
                <VStack gap={4}>
                  <Text fontSize="sm" color="gray.400">
                    {t.settings.chooseUsernameModalDescription}
                  </Text>
                  <Field invalid={isRestoreUsernameInvalid} label={t.header.usernameLabel}>
                    <Input
                      id="restore-username-input"
                      aria-describedby={
                        isRestoreUsernameInvalid && restoreUsername.trim()
                          ? 'restore-username-error'
                          : undefined
                      }
                      placeholder={t.header.usernamePlaceholder}
                      value={restoreUsername}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setRestoreUsername(e.target.value)
                        setIsRestoreUsernameInvalid(false)
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleRestoreWithUsername()
                        }
                      }}
                      autoFocus
                      disabled={isRestoring}
                    />
                    {isRestoreUsernameInvalid && restoreUsername.trim() && (
                      <Text id="restore-username-error" fontSize="sm" color="red.400" mt={1}>
                        {t.settings.usernameFormatError}
                      </Text>
                    )}
                  </Field>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer pt={4}>
                <Dialog.CloseTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isRestoring}
                    onClick={() => {
                      setNeedsUsernameForRestore(false)
                      setRestoreUsername('')
                      setSelectedBackupFile(null)
                      delete (window as any)._restorePassword
                      delete (window as any)._restoreBackup
                    }}
                  >
                    {t.common.cancel}
                  </Button>
                </Dialog.CloseTrigger>
                <Button
                  bg={brandColors.primary}
                  color="white"
                  _hover={{ bg: brandColors.secondary }}
                  onClick={handleRestoreWithUsername}
                  loading={isRestoring}
                  loadingText={t.settings.restoringRegisteringText}
                  disabled={isRestoring || !restoreUsername.trim()}
                >
                  {t.settings.restoreRegisterButton}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={isOpen}
        onOpenChange={(e: { open: boolean }) => (e.open ? null : onClose())}
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6}>
              <Dialog.Header>
                <Dialog.Title>{t.settings.removeAccountModalTitle}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pt={4}>
                <VStack gap={4} align="stretch">
                  <Text>{t.settings.removeAccountConfirm(accountToDelete?.username ?? '')}</Text>
                  <Box bg="red.900" p={3} borderRadius="md">
                    <Text fontSize="sm" color="red.200">
                      {t.settings.removeAccountWarning}
                    </Text>
                  </Box>
                  {user?.ethereumAddress === accountToDelete?.ethereumAddress && (
                    <Box bg="orange.900" p={3} borderRadius="md">
                      <Text fontSize="sm" color="orange.200">
                        {t.settings.removeAccountLoggedOutNote}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Dialog.Body>

              <Dialog.Footer gap={3} pt={6}>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">{t.common.cancel}</Button>
                </Dialog.ActionTrigger>
                <Button
                  bg={brandColors.accent}
                  color="white"
                  _hover={{ bg: '#3690e0' }}
                  onClick={confirmDeleteAccount}
                >
                  {t.settings.removeAccountButton}
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={showLocalStorageModal}
        onOpenChange={(e: { open: boolean }) => (e.open ? null : setShowLocalStorageModal(false))}
        size="xl"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6}>
              <Dialog.Header>
                <Dialog.Title>
                  <HStack>
                    <Icon as={FiHardDrive} />
                    <Text>{t.settings.localStorageModalTitle}</Text>
                  </HStack>
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pt={4}>
                <VStack align="stretch" gap={4}>
                  <Text fontSize="sm" color="gray.400">
                    {t.settings.foundItemsText(localStorageData.length)}
                  </Text>

                  {localStorageData.length === 0 ? (
                    <Box bg="gray.900" p={4} borderRadius="md" textAlign="center">
                      <Text color="gray.500">{t.settings.noDataFound}</Text>
                    </Box>
                  ) : (
                    localStorageData.map((item, index) => (
                      <Box
                        key={index}
                        bg="gray.900"
                        p={4}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={item.type.startsWith('w3pk') ? 'purple.600' : 'gray.700'}
                      >
                        <VStack align="stretch" gap={2}>
                          <HStack justify="space-between">
                            <Text fontSize="sm" fontWeight="bold" color="white">
                              {item.key}
                            </Text>
                            <HStack gap={2}>
                              {item.encrypted && (
                                <Badge colorPalette="orange" fontSize="xs">
                                  {t.settings.encryptedBadge}
                                </Badge>
                              )}
                              <Badge
                                colorPalette={item.type.startsWith('w3pk') ? 'purple' : 'gray'}
                                fontSize="xs"
                              >
                                {item.type}
                              </Badge>
                            </HStack>
                          </HStack>

                          {item.parsedValue && (
                            <Box bg="gray.950" p={3} borderRadius="md" overflowX="auto">
                              <CodeBlock>
                                {formatValue(maskSensitiveData(item.key, item.parsedValue))}
                              </CodeBlock>
                            </Box>
                          )}

                          {!item.parsedValue && (
                            <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                              {item.value}
                            </Text>
                          )}
                        </VStack>
                      </Box>
                    ))
                  )}
                </VStack>
              </Dialog.Body>
              <Dialog.Footer gap={3} pt={6}>
                <Button onClick={() => setShowLocalStorageModal(false)}>{t.common.close}</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}

export default SettingsPage
