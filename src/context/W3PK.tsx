'use client'

/**
 * W3PK Context Provider
 *
 * For integration guidelines and detailed documentation,
 * please visit: https://w3pk.w3hc.org/docs#integration-guidelines
 */

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import {
  createWeb3Passkey,
  getCurrentBuildHash,
  verifyBuildHash,
  // AI Inspection feature (disabled)
  // inspect,
  // inspectNow,
  SocialRecoveryManager,
} from 'w3pk'
import { toaster } from '@/components/ui/toaster'

type SecurityMode = 'PRIMARY' | 'STRICT' | 'STANDARD' | 'YOLO'

interface SecurityScore {
  total: number
  level: string
  nextMilestone?: string
  breakdown?: Record<string, number>
}

interface PasskeySync {
  enabled: boolean
  deviceCount: number
}

interface RecoveryPhrase {
  verified: boolean
}

interface BackupStatus {
  securityScore: SecurityScore
  passkeySync?: PasskeySync
  recoveryPhrase?: RecoveryPhrase
  backupExists?: boolean
}

interface W3pkUser {
  id: string
  username: string
  displayName: string
  ethereumAddress: string
  credentialId: string
}

interface DerivedWallet {
  address: string
  privateKey?: string
  publicKey?: string
}

interface Guardian {
  id: string
  name: string
  email?: string
  phone?: string
  shareEncrypted: string
  status: 'pending' | 'active' | 'revoked'
  addedAt: string
  lastVerified?: string
}

interface GuardianInvite {
  guardianId: string
  shareCode: string
  explainer: string
}

interface SocialRecoveryConfig {
  threshold: number
  totalGuardians: number
  guardians: Guardian[]
  createdAt: string
  ethereumAddress: string
}

interface StealthAddressResult {
  stealthAddress: string
  ephemeralPublicKey: string
  viewTag: string
}

type Transaction = {
  to: string
  value?: bigint
  data?: string
  chainId: number
  gasLimit?: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  nonce?: number
}

type SignMessageOptions = {
  mode?: SecurityMode
  tag?: string
  requireAuth?: boolean
  origin?: string
  signingMethod?: 'EIP191' | 'SIWE' | 'EIP712' | 'rawHash'
  eip712Domain?: object
  eip712Types?: object
  eip712PrimaryType?: string
}

type TxOptions = {
  mode?: SecurityMode
  tag?: string
  requireAuth?: boolean
  origin?: string
  rpcUrl?: string
}

type TxResponse = {
  hash: string
  from: string
  chainId: number
  mode: string
  tag: string
  origin: string
}

interface W3pkType {
  isAuthenticated: boolean
  user: W3pkUser | null
  isLoading: boolean
  login: () => Promise<void>
  register: (username: string) => Promise<void>
  logout: () => Promise<void>
  signMessage: (message: string, options?: SignMessageOptions) => Promise<string | null>
  sendTransaction: (tx: Transaction, options?: TxOptions) => Promise<TxResponse>
  deriveWallet: (
    mode?: string,
    tag?: string,
    options?: { requireAuth?: boolean; origin?: string }
  ) => Promise<DerivedWallet>
  getAddress: (mode?: string, tag?: string) => Promise<string>
  getBackupStatus: () => Promise<BackupStatus>
  createBackup: (password: string) => Promise<Blob>
  restoreFromBackup: (
    backupData: string,
    password: string
  ) => Promise<{ mnemonic: string; ethereumAddress: string }>
  registerWithBackupFile: (
    backupData: string,
    password: string,
    username: string
  ) => Promise<{ address: string; username: string }>
  setupSocialRecovery: (
    guardians: { name: string; email?: string; phone?: string }[],
    threshold: number,
    password?: string
  ) => Promise<Guardian[]>
  getSocialRecoveryConfig: () => SocialRecoveryConfig | null
  generateGuardianInvite: (guardian: Guardian) => Promise<GuardianInvite>
  recoverFromGuardians: (
    shareData: string[]
  ) => Promise<{ backupFileJson: string; ethereumAddress: string }>
  clearSocialRecoveryConfig: () => void
  getStealthKeys: () => Promise<any>
  generateStealthAddressFor: (recipientMetaAddress: string) => Promise<StealthAddressResult>
  /** Update the "Remember Me" window; applies at the next real (prompted) login */
  setPersistentSessionDuration: (days: number) => void
  /**
   * Whether a persistent session blob exists in IndexedDB. When the user is
   * authenticated but this is false, the authenticator lacks WebAuthn PRF
   * support and w3pk keeps sessions in memory only (no "Remember Me").
   */
  hasPersistentSession: () => Promise<boolean>
  /**
   * Whether at least one passkey was registered on this device. Check this
   * before calling login(): with no local credential, the WebAuthn prompt
   * falls back to the browser's cross-device (QR code) dialog instead of
   * failing, so the caller should offer registration directly.
   */
  hasLocalCredentials: () => Promise<boolean>
}

const W3PK = createContext<W3pkType | null>(null)

export const useW3PK = (): W3pkType => {
  const context = useContext(W3PK)
  if (!context) {
    throw new Error('useW3PK must be used within a W3pkProvider')
  }
  return context
}

interface W3pkProviderProps {
  children: ReactNode
}

const REGISTRATION_TIMEOUT_MS = 45000 // 45 seconds

const SESSIONS_DB_NAME = 'Web3PasskeyPersistentSessions'
const SESSIONS_STORE_NAME = 'sessions'

export function isUserCancelledError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'name' in error && 'message' in error) {
    const err = error as { name: string; message: string }
    return (
      err.name === 'NotAllowedError' ||
      err.message.includes('NotAllowedError') ||
      err.message.includes('timed out') ||
      err.message.includes('not allowed')
    )
  }
  return false
}

export function isRequestPendingError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : ''
  return message.includes('request is already pending')
}

export function isNoPasskeyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : ''
  return (
    message.includes('not available') ||
    message.includes('restore your wallet from a backup') ||
    message.includes('No credentials available') ||
    message.includes('No passkey found')
  )
}

/**
 * SDK errors indicating the session expired and the operation
 * should be retried after a fresh login()
 */
function isAuthRequiredError(error: unknown, extraMatches: string[] = []): boolean {
  if (!(error instanceof Error)) {
    return false
  }
  return ['Not authenticated', 'Must be authenticated', 'login', ...extraMatches].some(match =>
    error.message.includes(match)
  )
}

/**
 * Open the w3pk persistent sessions database, or resolve null if it
 * doesn't exist yet (or IndexedDB is unavailable).
 */
async function openSessionsDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return null
  }

  return new Promise(resolve => {
    const request = indexedDB.open(SESSIONS_DB_NAME)
    request.onerror = () => resolve(null)
    request.onsuccess = event => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(SESSIONS_STORE_NAME)) {
        db.close()
        resolve(null)
        return
      }
      resolve(db)
    }
  })
}

/**
 * Check if any persistent session exists in IndexedDB
 * This allows us to avoid triggering WebAuthn prompt when no session exists
 */
async function checkIndexedDBForPersistentSession(): Promise<boolean> {
  try {
    const db = await openSessionsDB()
    if (!db) {
      return false
    }

    try {
      const countRequest = db
        .transaction([SESSIONS_STORE_NAME], 'readonly')
        .objectStore(SESSIONS_STORE_NAME)
        .count()

      return await new Promise<boolean>(resolve => {
        countRequest.onsuccess = () => resolve(countRequest.result > 0)
        countRequest.onerror = () => resolve(false)
      })
    } finally {
      db.close()
    }
  } catch {
    return false
  }
}

export const W3pkProvider: React.FC<W3pkProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<W3pkUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  const handleAuthStateChanged = useCallback((isAuth: boolean, w3pkUser?: unknown) => {
    if (isAuth && w3pkUser && typeof w3pkUser === 'object') {
      const userObj = w3pkUser as Record<string, string>
      const userData: W3pkUser = {
        id: userObj.id,
        username: userObj.username,
        displayName: userObj.displayName,
        ethereumAddress: userObj.ethereumAddress,
        credentialId: userObj.credentialId,
      }
      setUser(userData)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  // Get persistent session duration from localStorage (default: 7 days)
  const getPersistentSessionDuration = (): number => {
    if (typeof window === 'undefined') return 7
    const stored = localStorage.getItem('persistentSessionDuration')
    const days = stored ? parseInt(stored, 10) : 7
    return days >= 1 && days <= 30 ? days : 7 // Validate between 1-30 days
  }

  const w3pk = useMemo(
    () =>
      createWeb3Passkey({
        stealthAddresses: {},
        onAuthStateChanged: handleAuthStateChanged,
        sessionDuration: 24, // 24 hours session duration
        persistentSession: {
          enabled: true,
          duration: getPersistentSessionDuration() * 24, // Convert days to hours
          requireReauth: false, // Silent session restore (no biometric prompt on page refresh)
          // The session blob is encrypted under a WebAuthn-PRF-derived key,
          // re-keyed at every real (prompted) login — the duration above is
          // the renewal interval. Authenticators without PRF support get
          // in-memory sessions only (w3pk stores no persistent session).
        },
      }),
    [handleAuthStateChanged]
  )

  // Expose w3pk instance to window for console inspection
  useEffect(() => {
    if (typeof window !== 'undefined' && w3pk) {
      ;(window as any).w3pk = {
        ...w3pk,
        getCurrentBuildHash,
        verifyBuildHash,
        // AI Inspection feature (disabled)
        // inspect,
        // inspectNow,
      }
    }
  }, [w3pk])

  useEffect(() => {
    /**
     * Login Workflow - Step 1: Check for existing persistent session
     * This runs automatically on mount to restore the user's session if it exists.
     * This is the first step in the comprehensive login workflow.
     */
    const checkExistingAuth = async (): Promise<void> => {
      if (!isMounted || !w3pk) return

      try {
        // Check for active in-memory session
        if (w3pk.hasActiveSession() && w3pk.user) {
          handleAuthStateChanged(true, w3pk.user)
          return
        }

        // Check if persistent session exists in IndexedDB with timeout for mobile
        const checkPromise = checkIndexedDBForPersistentSession()
        const timeoutPromise = new Promise<boolean>(
          resolve => setTimeout(() => resolve(false), 3000) // 3 second timeout for mobile
        )

        const hasPersistentSession = await Promise.race([checkPromise, timeoutPromise])

        if (hasPersistentSession) {
          // Try to restore from persistent session via login()
          try {
            await w3pk.login()
            // Silent restore succeeded - handleAuthStateChanged called by SDK
          } catch (error) {
            // Silent restore failed - user is logged out
            handleAuthStateChanged(false)
          }
        } else {
          // No persistent session - user is logged out
          handleAuthStateChanged(false)
        }
      } catch {
        handleAuthStateChanged(false)
      }
    }

    checkExistingAuth()
  }, [isMounted, w3pk, handleAuthStateChanged])

  const register = async (username: string): Promise<void> => {
    try {
      setIsLoading(true)
      console.log('[W3PK] Registration initiated for username:', username)

      const registrationPromise = w3pk.register({ username })
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                'Registration timed out. Please try again or check browser console for errors.'
              )
            ),
          REGISTRATION_TIMEOUT_MS
        )
      )

      await Promise.race([registrationPromise, timeoutPromise])

      console.log('[W3PK] Registration successful')

      toaster.create({
        title: 'Done! 🎉',
        description:
          "Your encrypted wallet has been created and stored on your device. Don't forget to back it up!",
        type: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('[W3PK] Registration failed:', error)

      const errorDetails =
        error instanceof Error ? `${error.name}: ${error.message}` : JSON.stringify(error)

      toaster.create({
        title: 'Registration Failed',
        description: errorDetails,
        type: 'error',
        duration: 15000, // Longer duration so you can read it on mobile
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (): Promise<void> => {
    try {
      setIsLoading(true)
      console.log('[W3PK] Login initiated')

      const result = await w3pk.login()
      const hasWallet = w3pk.isAuthenticated
      const displayName = result.displayName || result.username || 'Anon'

      console.log('[W3PK] Login successful:', { hasWallet, displayName })

      toaster.create({
        title: "You're in!",
        description: hasWallet
          ? `Welcome back, ${displayName}!`
          : `Welcome back, ${displayName}! No wallet found on this device.`,
        type: hasWallet ? 'success' : 'warning',
        duration: 5000,
      })
    } catch (error) {
      console.error('[W3PK] Login failed:', error)

      // Silence cancellations, "no passkey on this device" (the Header handles
      // it by offering registration), and duplicate concurrent login attempts —
      // the already-pending request will surface its own outcome
      if (
        !isUserCancelledError(error) &&
        !isNoPasskeyError(error) &&
        !isRequestPendingError(error)
      ) {
        toaster.create({
          title: 'Authentication Failed',
          description: error instanceof Error ? error.message : 'Failed to authenticate with w3pk',
          type: 'error',
          duration: 5000,
        })
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const ensureAuthentication = useCallback(async (): Promise<void> => {
    // If W3PK SDK session is active, we're good
    if (w3pk.hasActiveSession()) {
      return
    }

    // No active session - prompt for login
    // W3PK SDK will handle session creation and management
    await w3pk.login()
  }, [w3pk])

  /**
   * Run an SDK operation, retrying once after a fresh login()
   * if it failed because the session expired
   */
  const runWithAuthRetry = useCallback(
    async <T,>(operation: () => Promise<T>, retryOn?: string[]): Promise<T> => {
      try {
        return await operation()
      } catch (error) {
        if (!isAuthRequiredError(error, retryOn)) {
          throw error
        }
        await w3pk.login()
        return await operation()
      }
    },
    [w3pk]
  )

  /**
   * Full wrapper for wallet operations: requires a logged-in user,
   * ensures an active session, retries once on auth expiry, extends
   * the session on success, and toasts on failure
   */
  const callWithAuthRetry = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      {
        retryOn,
        authPrompt,
        errorTitle,
        fallbackMessage,
      }: { retryOn: string; authPrompt: string; errorTitle: string; fallbackMessage: string }
    ): Promise<T> => {
      if (!user) {
        throw new Error('Not authenticated. Please log in first.')
      }

      try {
        await ensureAuthentication()
        const result = await operation()

        // Extend session after successful operation
        w3pk.extendSession()

        return result
      } catch (error) {
        if (isAuthRequiredError(error, [retryOn])) {
          try {
            await w3pk.login()
            const result = await operation()

            // Extend session after successful retry
            w3pk.extendSession()

            return result
          } catch (retryError) {
            if (!isUserCancelledError(retryError)) {
              toaster.create({
                title: 'Authentication Required',
                description: authPrompt,
                type: 'error',
                duration: 5000,
              })
            }
            throw retryError
          }
        }

        if (!isUserCancelledError(error)) {
          toaster.create({
            title: errorTitle,
            description: error instanceof Error ? error.message : fallbackMessage,
            type: 'error',
            duration: 5000,
          })
        }
        throw error
      }
    },
    [user, w3pk, ensureAuthentication]
  )

  const signMessage = async (
    message: string,
    options?: SignMessageOptions
  ): Promise<string | null> => {
    if (!user) {
      toaster.create({
        title: 'Not Authenticated',
        description: 'Please log in first.',
        type: 'error',
        duration: 3000,
      })
      return null
    }

    try {
      await ensureAuthentication()
      const result = await w3pk.signMessage(message, options as any)

      // Extend session after successful operation for better UX
      w3pk.extendSession()

      return result.signature
    } catch (error) {
      if (!isUserCancelledError(error)) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to sign message with w3pk'

        toaster.create({
          title: 'Signing Failed',
          description: errorMessage,
          type: 'error',
          duration: 5000,
        })
      }
      return null
    }
  }

  const sendTransaction = async (tx: Transaction, options?: TxOptions): Promise<TxResponse> => {
    if (!user) {
      throw new Error('Not authenticated. Please log in first.')
    }

    try {
      await ensureAuthentication()
      const result = await w3pk.sendTransaction(tx, options)

      // Extend session after successful operation
      w3pk.extendSession()

      toaster.create({
        title: 'Transaction Sent',
        description: `Transaction hash: ${result.hash.substring(0, 10)}...`,
        type: 'success',
        duration: 5000,
      })

      return result
    } catch (error) {
      if (!isUserCancelledError(error)) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send transaction'

        toaster.create({
          title: 'Transaction Failed',
          description: errorMessage,
          type: 'error',
          duration: 5000,
        })
      }
      throw error
    }
  }

  const deriveWallet = useCallback(
    (
      mode?: string,
      tag?: string,
      options?: { requireAuth?: boolean; origin?: string }
    ): Promise<DerivedWallet> =>
      callWithAuthRetry(() => w3pk.deriveWallet(mode as any, tag as any, options), {
        retryOn: 'Failed to derive wallet',
        authPrompt: 'Please authenticate to derive addresses',
        errorTitle: 'Derivation Failed',
        fallbackMessage: `Failed to derive wallet (${mode || 'STANDARD'}, ${tag || 'MAIN'})`,
      }),
    [callWithAuthRetry, w3pk]
  )

  const getAddress = useCallback(
    (mode?: string, tag?: string): Promise<string> =>
      callWithAuthRetry(() => w3pk.getAddress(mode as any, tag as any), {
        retryOn: 'Failed to get address',
        authPrompt: 'Please authenticate to get address',
        errorTitle: 'Failed to Get Address',
        fallbackMessage: `Failed to get address (${mode || 'STANDARD'}, ${tag || 'MAIN'})`,
      }),
    [callWithAuthRetry, w3pk]
  )

  const logout = async (): Promise<void> => {
    // The SDK's logout() clears the in-memory session and ALL persistent
    // sessions from IndexedDB. Awaiting it ensures the IndexedDB clear
    // completes before any navigation (interrupted clears used to leave
    // stale sessions behind on mobile)
    try {
      await w3pk.logout()
    } catch (error) {
      // Newer w3pk versions throw if persistent sessions couldn't be
      // cleared; the user is still logged out in memory either way
      console.error('[W3PK] Logout cleanup failed:', error)
      toaster.create({
        title: 'Logout Incomplete',
        description:
          'Your session ended, but stored session data may remain on this device. Please try logging out again.',
        type: 'warning',
        duration: 5000,
      })
    }
  }

  const setPersistentSessionDuration = (days: number): void => {
    localStorage.setItem('persistentSessionDuration', days.toString())
    // Update the live SDK instance so the next (re-)login persists with the
    // new window — without this, the value read at SDK creation would apply
    // only after a full page reload
    w3pk.setPersistentSessionDuration(days * 24)
  }

  const hasPersistentSession = (): Promise<boolean> => {
    return checkIndexedDBForPersistentSession()
  }

  const hasLocalCredentials = async (): Promise<boolean> => {
    // listExistingCredentials() reads the local credential store and
    // returns [] on any storage error, so this never throws
    const credentials = await w3pk.listExistingCredentials()
    return credentials.length > 0
  }

  const getBackupStatus = async (): Promise<BackupStatus> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated. Cannot check backup status.')
    }

    try {
      setIsLoading(true)
      return await runWithAuthRetry(() => w3pk.getBackupStatus())
    } catch (error) {
      if (!isUserCancelledError(error)) {
        toaster.create({
          title: 'Authentication Required',
          description: 'Please authenticate to check backup status',
          type: 'error',
          duration: 5000,
        })
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const createBackup = async (password: string): Promise<Blob> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated. Cannot create backup.')
    }

    try {
      setIsLoading(true)
      const result = await runWithAuthRetry(() => w3pk.createBackupFile('password', password))
      return result.blob
    } catch (error) {
      if (!isUserCancelledError(error)) {
        toaster.create({
          title: 'Authentication Required',
          description: 'Please authenticate to create backup',
          type: 'error',
          duration: 5000,
        })
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const restoreFromBackup = async (
    backupData: string,
    password: string
  ): Promise<{ mnemonic: string; ethereumAddress: string }> => {
    try {
      setIsLoading(true)

      const result = await w3pk.restoreFromBackupFile(backupData, password)

      toaster.create({
        title: 'Backup Restored Successfully!',
        description: `Wallet restored: ${result.ethereumAddress}`,
        type: 'success',
        duration: 5000,
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore from backup'

      toaster.create({
        title: 'Restore Failed',
        description: errorMessage,
        type: 'error',
        duration: 5000,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const registerWithBackupFile = async (
    backupData: string,
    password: string,
    username: string
  ): Promise<{ address: string; username: string }> => {
    try {
      setIsLoading(true)
      console.log('[W3PK] Registration with backup file initiated for username:', username)

      const result = await w3pk.registerWithBackupFile(backupData, password, username)

      console.log('[W3PK] Registration with backup successful')

      toaster.create({
        title: 'Wallet Restored & Registered! 🎉',
        description: `Your wallet has been restored and secured with a new passkey: ${result.address.slice(0, 6)}...${result.address.slice(-4)}`,
        type: 'success',
        duration: 5000,
      })

      return result
    } catch (error) {
      console.error('[W3PK] Registration with backup failed:', error)

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to register with backup file'

      toaster.create({
        title: 'Registration Failed',
        description: errorMessage,
        type: 'error',
        duration: 5000,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Social recovery now uses the w3pk library's SocialRecoveryManager
  // which splits backup files instead of mnemonics for better security

  const setupSocialRecovery = async (
    guardians: { name: string; email?: string; phone?: string }[],
    threshold: number,
    password?: string
  ): Promise<Guardian[]> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated. Cannot setup social recovery.')
    }

    try {
      setIsLoading(true)
      await ensureAuthentication()

      // Prompt user for a password to encrypt the backup file
      // This password will be required when recovering from guardians
      const backupPassword =
        password ||
        window.prompt(
          'Enter a password to encrypt your backup file.\n\n' +
            'IMPORTANT: You will need this password AND guardian shares to recover your wallet.\n' +
            'Store this password securely - guardians do NOT have access to it.'
        )

      if (!backupPassword) {
        throw new Error('Password is required for social recovery setup')
      }

      // Create password-encrypted backup file
      const backupBlob = await w3pk.createBackupFile('password', backupPassword)
      const backupJson = await backupBlob.blob.text()

      // Use w3pk's SocialRecoveryManager to split the backup file
      const guardianObjects = await new SocialRecoveryManager().setupSocialRecovery(
        backupJson,
        user.ethereumAddress,
        guardians,
        threshold
      )

      toaster.create({
        title: 'Social Recovery Configured!',
        description: `Successfully set up ${threshold}-of-${guardians.length} guardian recovery. Remember your password!`,
        type: 'success',
        duration: 5000,
      })

      return guardianObjects
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to setup social recovery'

      toaster.create({
        title: 'Setup Failed',
        description: errorMessage,
        type: 'error',
        duration: 5000,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getSocialRecoveryConfig = (): SocialRecoveryConfig | null => {
    try {
      return new SocialRecoveryManager().getSocialRecoveryConfig()
    } catch {
      return null
    }
  }

  const generateGuardianInvite = async (guardian: Guardian): Promise<GuardianInvite> => {
    try {
      setIsLoading(true)

      const invite = await new SocialRecoveryManager().generateGuardianInvite(guardian)

      toaster.create({
        title: 'Guardian Invitation Generated',
        description: `Invitation ready for ${guardian.name}`,
        type: 'success',
        duration: 3000,
      })

      return invite
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate guardian invite'

      toaster.create({
        title: 'Generation Failed',
        description: errorMessage,
        type: 'error',
        duration: 5000,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const recoverFromGuardians = async (
    shareData: string[]
  ): Promise<{ backupFileJson: string; ethereumAddress: string }> => {
    try {
      setIsLoading(true)

      const { backupFileJson, ethereumAddress } =
        await new SocialRecoveryManager().recoverFromGuardians(shareData)

      toaster.create({
        title: 'Backup File Recovered!',
        description: `Successfully recovered encrypted backup file for ${ethereumAddress.slice(0, 6)}...${ethereumAddress.slice(-4)}. You can now restore your wallet with the password you set during setup.`,
        type: 'success',
        duration: 8000,
      })

      return {
        backupFileJson,
        ethereumAddress,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to recover from guardians'

      toaster.create({
        title: 'Recovery Failed',
        description: errorMessage,
        type: 'error',
        duration: 5000,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const clearSocialRecoveryConfig = (): void => {
    try {
      // Clear from localStorage (both old and new format)
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('w3pk_social_recovery')

        toaster.create({
          title: 'Social Recovery Config Cleared',
          description: 'Guardian shares removed from local storage',
          type: 'success',
          duration: 3000,
        })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to clear social recovery config'

      toaster.create({
        title: 'Clear Failed',
        description: errorMessage,
        type: 'error',
        duration: 3000,
      })
    }
  }

  const getStealthKeys = async (): Promise<any> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated. Cannot get stealth keys.')
    }

    try {
      await ensureAuthentication()

      // Check if stealth module is available
      if (!w3pk.stealth || typeof w3pk.stealth.getKeys !== 'function') {
        throw new Error('Stealth address functionality not available in current w3pk version')
      }

      const keys = await w3pk.stealth.getKeys()
      w3pk.extendSession()
      return keys
    } catch (error) {
      if (!isUserCancelledError(error)) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get stealth keys'
        toaster.create({
          title: 'Failed to Get Stealth Keys',
          description: errorMessage,
          type: 'error',
          duration: 5000,
        })
      }
      throw error
    }
  }

  const generateStealthAddressFor = async (
    recipientMetaAddress: string
  ): Promise<StealthAddressResult> => {
    if (!isAuthenticated || !user) {
      throw new Error('User not authenticated. Cannot generate stealth address.')
    }

    try {
      await ensureAuthentication()

      // Check if stealth module is available
      if (!w3pk.stealth || typeof w3pk.stealth.generateStealthAddress !== 'function') {
        throw new Error('Stealth address functionality not available in current w3pk version')
      }

      // Use the stealth module's generateStealthAddress method
      // Note: This generates a stealth address for the user (sender's perspective)
      const result = await w3pk.stealth.generateStealthAddress()
      w3pk.extendSession()

      return result
    } catch (error) {
      if (!isUserCancelledError(error)) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to generate stealth address'
        toaster.create({
          title: 'Failed to Generate Stealth Address',
          description: errorMessage,
          type: 'error',
          duration: 5000,
        })
      }
      throw error
    }
  }

  return (
    <W3PK.Provider
      value={{
        isAuthenticated: isMounted && isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
        signMessage,
        sendTransaction,
        deriveWallet,
        getAddress,
        getBackupStatus,
        createBackup,
        restoreFromBackup,
        registerWithBackupFile,
        setupSocialRecovery,
        getSocialRecoveryConfig,
        generateGuardianInvite,
        recoverFromGuardians,
        clearSocialRecoveryConfig,
        getStealthKeys,
        generateStealthAddressFor,
        setPersistentSessionDuration,
        hasPersistentSession,
        hasLocalCredentials,
      }}
    >
      {children}
    </W3PK.Provider>
  )
}

// Export w3pk utilities for use in components
export { base64UrlToArrayBuffer, base64UrlDecode, extractRS } from 'w3pk'
