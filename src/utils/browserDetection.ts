/**
 * Browser detection utility
 * Detects browser name, version, and compatibility with WebAuthn/w3pk
 */

export interface BrowserInfo {
  name: string
  version: string
  fullVersion: string
  os: string
  isSupported: boolean
  hasKnownIssues: boolean
  recommendation?: string
  warningLevel: 'none' | 'info' | 'warning' | 'error'
}

/**
 * Detects the current browser and returns detailed information
 */
export function detectBrowser(): BrowserInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      name: 'Unknown',
      version: 'Unknown',
      fullVersion: 'Unknown',
      os: 'Unknown',
      isSupported: false,
      hasKnownIssues: false,
      warningLevel: 'none',
    }
  }

  const userAgent = navigator.userAgent
  let browserName = 'Unknown'
  let version = 'Unknown'
  let fullVersion = 'Unknown'
  let os = 'Unknown'
  let isSupported = true
  let hasKnownIssues = false
  let recommendation: string | undefined
  let warningLevel: 'none' | 'info' | 'warning' | 'error' = 'none'

  // Detect OS
  if (userAgent.includes('Win')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad'))
    os = 'iOS'

  // Detect browser
  // Check for Samsung Internet
  if (userAgent.includes('SamsungBrowser')) {
    browserName = 'Samsung Internet'
    const match = userAgent.match(/SamsungBrowser\/([\d.]+)/)
    if (match) {
      fullVersion = match[1]
      version = fullVersion.split('.')[0]
    }
    // Samsung Internet 11+ is supported (February 2020)
    const versionNum = parseInt(version)
    if (!isNaN(versionNum) && versionNum >= 11) {
      isSupported = true
      hasKnownIssues = false
      warningLevel = 'none'
    } else {
      isSupported = false
      recommendation = 'Please update Samsung Internet to version 11 or higher.'
      warningLevel = 'error'
    }
  }
  // Check for Firefox Mobile
  else if (
    userAgent.includes('Firefox') &&
    (userAgent.includes('Android') || userAgent.includes('Mobile'))
  ) {
    browserName = 'Firefox Mobile'
    const match = userAgent.match(/Firefox\/([\d.]+)/)
    if (match) {
      fullVersion = match[1]
      version = fullVersion.split('.')[0]
    }
    // Firefox Mobile has known issues with passkey persistence
    isSupported = true
    hasKnownIssues = true
    recommendation =
      'Firefox Mobile has known issues with passkey persistence. Consider using Samsung Internet or Chrome instead.'
    warningLevel = 'warning'
  }
  // Check for Chrome (including Chrome on Android)
  else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browserName = 'Chrome'
    const match = userAgent.match(/Chrome\/([\d.]+)/)
    if (match) {
      fullVersion = match[1]
      version = fullVersion.split('.')[0]
    }
    // Chrome 67+ is supported (May 2018)
    const versionNum = parseInt(version)
    if (!isNaN(versionNum) && versionNum >= 67) {
      isSupported = true
      hasKnownIssues = false
      warningLevel = 'none'
    } else {
      isSupported = false
      recommendation = 'Please update Chrome to version 67 or higher.'
      warningLevel = 'error'
    }
  }
  // Check for Edge
  else if (userAgent.includes('Edg')) {
    browserName = 'Edge'
    const match = userAgent.match(/Edg\/([\d.]+)/)
    if (match) {
      fullVersion = match[1]
      version = fullVersion.split('.')[0]
    }
    // Edge 18+ is supported (November 2018)
    const versionNum = parseInt(version)
    if (!isNaN(versionNum) && versionNum >= 18) {
      isSupported = true
      hasKnownIssues = false
      warningLevel = 'none'
    } else {
      isSupported = false
      recommendation = 'Please update Edge to version 18 or higher.'
      warningLevel = 'error'
    }
  }
  // Check for Safari
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserName = 'Safari'
    const match = userAgent.match(/Version\/([\d.]+)/)
    if (match) {
      fullVersion = match[1]
      version = fullVersion.split('.')[0]
    }
    // Safari 14+ is supported (September 2020)
    const versionNum = parseInt(version)
    if (!isNaN(versionNum) && versionNum >= 14) {
      isSupported = true
      hasKnownIssues = false
      warningLevel = 'none'
    } else {
      isSupported = false
      recommendation =
        'Please update Safari to version 14 or higher (requires macOS Big Sur 11.0+ or iOS 14.5+).'
      warningLevel = 'error'
    }
  }
  // Check for Firefox Desktop
  else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox'
    const match = userAgent.match(/Firefox\/([\d.]+)/)
    if (match) {
      fullVersion = match[1]
      version = fullVersion.split('.')[0]
    }
    // Firefox 60+ is supported (May 2018)
    const versionNum = parseInt(version)
    if (!isNaN(versionNum) && versionNum >= 60) {
      isSupported = true
      hasKnownIssues = false
      warningLevel = 'none'
    } else {
      isSupported = false
      recommendation = 'Please update Firefox to version 60 or higher.'
      warningLevel = 'error'
    }
  }
  // Check for Opera
  else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
    browserName = 'Opera'
    const match = userAgent.match(/(?:OPR|Opera)\/([\d.]+)/)
    if (match) {
      fullVersion = match[1]
      version = fullVersion.split('.')[0]
    }
    // Opera 54+ is supported (June 2018)
    const versionNum = parseInt(version)
    if (!isNaN(versionNum) && versionNum >= 54) {
      isSupported = true
      hasKnownIssues = false
      warningLevel = 'none'
    } else {
      isSupported = false
      recommendation = 'Please update Opera to version 54 or higher.'
      warningLevel = 'error'
    }
  }

  return {
    name: browserName,
    version,
    fullVersion,
    os,
    isSupported,
    hasKnownIssues,
    recommendation,
    warningLevel,
  }
}

/**
 * Checks if WebAuthn is available in the current browser
 */
export function isWebAuthnAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.PublicKeyCredential !== 'undefined'
}

/**
 * Checks if platform authenticator is available (biometric)
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnAvailable()) return false

  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch (error) {
    console.error('Error checking platform authenticator:', error)
    return false
  }
}

export type AuthenticatorTier = 'full' | 'hybrid-only' | 'security-key-only' | 'unsupported'

export interface AuthenticatorCapabilities {
  /** Same-device authenticator with user verification (Touch ID, Windows Hello…) */
  platformAuthenticator: boolean
  /** Phone as a key through a QR code and Bluetooth */
  hybridTransport: boolean | 'unknown'
  /** The PRF extension w3pk needs to encrypt the wallet */
  prf: boolean | 'unknown'
  tier: AuthenticatorTier
}

function isFirefoxOnLinux(): boolean {
  const ua = navigator.userAgent
  return ua.includes('Firefox') && ua.includes('Linux') && !ua.includes('Android')
}

function knownCapability(
  capabilities: Record<string, boolean> | null,
  key: string
): boolean | undefined {
  const value = capabilities?.[key]
  return typeof value === 'boolean' ? value : undefined
}

/**
 * What this browser can use to create and use a passkey. Prefers
 * PublicKeyCredential.getClientCapabilities(), where an absent key means
 * "unknown", and falls back to older APIs and a user-agent rule. Never throws.
 */
export async function getAuthenticatorCapabilities(): Promise<AuthenticatorCapabilities> {
  if (!isWebAuthnAvailable()) {
    return {
      platformAuthenticator: false,
      hybridTransport: false,
      prf: false,
      tier: 'unsupported',
    }
  }

  let capabilities: Record<string, boolean> | null = null
  try {
    if (typeof PublicKeyCredential.getClientCapabilities === 'function') {
      capabilities = await PublicKeyCredential.getClientCapabilities()
    }
  } catch (error) {
    console.warn('Error reading WebAuthn client capabilities:', error)
  }

  const platformAuthenticator =
    knownCapability(capabilities, 'userVerifyingPlatformAuthenticator') ??
    (await isPlatformAuthenticatorAvailable())

  const hybridTransport =
    knownCapability(capabilities, 'hybridTransport') ??
    (capabilities === null && isFirefoxOnLinux() ? false : 'unknown')

  const prf = knownCapability(capabilities, 'extension:prf') ?? 'unknown'

  const tier: AuthenticatorTier = platformAuthenticator
    ? 'full'
    : hybridTransport === false
      ? 'security-key-only'
      : 'hybrid-only'

  return { platformAuthenticator, hybridTransport, prf, tier }
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  // iPadOS reports itself as macOS, but has touch points
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    window.matchMedia?.('(display-mode: standalone)').matches === true
  )
}

/**
 * Whether iOS can wipe the wallet before it is created: in a browser tab
 * (not a Home Screen app) with storage not persisted. Mirrors w3pk's
 * `evictionRisk`, which is only known after registration.
 */
export async function hasIOSEvictionRisk(): Promise<boolean> {
  if (!isIOS() || isStandalone()) return false
  try {
    return !(await navigator.storage?.persisted?.())
  } catch {
    return true
  }
}
