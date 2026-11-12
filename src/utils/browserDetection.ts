/**
 * Browser detection utility
 * Names the browser, version and OS for display. Passkey support comes from
 * getAuthenticatorCapabilities(), not from versions.
 */

export interface BrowserInfo {
  name: string
  version: string
  fullVersion: string
  os: string
  hasKnownIssues: boolean
  recommendation?: string
}

const BROWSERS: { name: string; test: (ua: string) => boolean; version: RegExp }[] = [
  {
    name: 'Samsung Internet',
    test: ua => ua.includes('SamsungBrowser'),
    version: /SamsungBrowser\/([\d.]+)/,
  },
  {
    name: 'Firefox Mobile',
    test: ua => ua.includes('Firefox') && (ua.includes('Android') || ua.includes('Mobile')),
    version: /Firefox\/([\d.]+)/,
  },
  {
    name: 'Chrome',
    test: ua => ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR'),
    version: /Chrome\/([\d.]+)/,
  },
  { name: 'Edge', test: ua => ua.includes('Edg'), version: /Edg\/([\d.]+)/ },
  {
    name: 'Safari',
    test: ua => ua.includes('Safari') && !ua.includes('Chrome'),
    version: /Version\/([\d.]+)/,
  },
  { name: 'Firefox', test: ua => ua.includes('Firefox'), version: /Firefox\/([\d.]+)/ },
  {
    name: 'Opera',
    test: ua => ua.includes('OPR') || ua.includes('Opera'),
    version: /(?:OPR|Opera)\/([\d.]+)/,
  },
]

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
      hasKnownIssues: false,
    }
  }

  const userAgent = navigator.userAgent
  let os = 'Unknown'

  if (isIOS()) os = 'iOS'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('Win')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'

  const browser = BROWSERS.find(b => b.test(userAgent))
  const fullVersion = (browser && userAgent.match(browser.version)?.[1]) || 'Unknown'
  const name = browser?.name ?? 'Unknown'

  // Firefox Mobile has known issues with passkey persistence
  const hasKnownIssues = name === 'Firefox Mobile'

  return {
    name,
    version: fullVersion.split('.')[0],
    fullVersion,
    os,
    hasKnownIssues,
    recommendation: hasKnownIssues
      ? 'Firefox Mobile has known issues with passkey persistence. Consider using Samsung Internet or Chrome instead.'
      : undefined,
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

let cachedCapabilities: Promise<AuthenticatorCapabilities> | undefined

/**
 * What this browser can use to create and use a passkey. Prefers
 * PublicKeyCredential.getClientCapabilities(), where an absent key means
 * "unknown", and falls back to older APIs and a user-agent rule. Never throws.
 */
export function getAuthenticatorCapabilities(): Promise<AuthenticatorCapabilities> {
  cachedCapabilities ??= readAuthenticatorCapabilities()
  return cachedCapabilities
}

async function readAuthenticatorCapabilities(): Promise<AuthenticatorCapabilities> {
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
    knownCapability(capabilities, 'hybridTransport') ?? (isFirefoxOnLinux() ? false : 'unknown')

  const prf = knownCapability(capabilities, 'extension:prf') ?? 'unknown'

  const tier: AuthenticatorTier = platformAuthenticator
    ? 'full'
    : hybridTransport === false
      ? 'security-key-only'
      : 'hybrid-only'

  return { platformAuthenticator, hybridTransport, prf, tier }
}

export type AuthenticatorHint =
  'noPlatformAuthenticatorHint' | 'phoneKeyHint' | 'securityKeyOnlyHint' | 'webauthnUnsupportedHint'

/** The header.* translation key explaining a tier, or null when nothing needs saying */
export function getAuthenticatorHint(
  capabilities: AuthenticatorCapabilities
): AuthenticatorHint | null {
  switch (capabilities.tier) {
    case 'full':
      return null
    case 'hybrid-only':
      return capabilities.hybridTransport === true ? 'phoneKeyHint' : 'noPlatformAuthenticatorHint'
    case 'security-key-only':
      return 'securityKeyOnlyHint'
    case 'unsupported':
      return 'webauthnUnsupportedHint'
  }
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
