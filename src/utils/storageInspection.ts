/**
 * Storage inspection utilities for w3pk
 * Allows debugging and inspection of localStorage, where w3pk keeps all its data
 */

export interface LocalStorageItem {
  key: string
  value: string
  parsedValue?: any
  type:
    | 'w3pk_credential'
    | 'w3pk_credential_index'
    | 'w3pk_wallet'
    | 'w3pk_session'
    | 'w3pk_backup'
    | 'w3pk_auth_state'
    | 'other_w3pk'
    | 'other'
  encrypted?: boolean
}

/**
 * Inspects localStorage for w3pk-related data
 */
export async function inspectLocalStorage(): Promise<LocalStorageItem[]> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return []
  }

  const items: LocalStorageItem[] = []
  const keys = Object.keys(localStorage)

  for (const key of keys) {
    try {
      const value = localStorage.getItem(key) || ''
      let parsedValue: any = undefined
      let type: LocalStorageItem['type'] = 'other'
      let encrypted = false

      // Categorize the key
      if (key.startsWith('w3pk_credential_') && key !== 'w3pk_credential_index') {
        type = 'w3pk_credential'
        encrypted = true
      } else if (key === 'w3pk_credential_index') {
        type = 'w3pk_credential_index'
      } else if (key.startsWith('w3pk_wallet_')) {
        type = 'w3pk_wallet'
        encrypted = true
      } else if (key.startsWith('w3pk_session_')) {
        type = 'w3pk_session'
        encrypted = true
      } else if (key === 'w3pk_backups' || key === 'w3pk_backup_verifications') {
        type = 'w3pk_backup'
      } else if (key === 'w3pk_auth_state') {
        type = 'w3pk_auth_state'
      } else if (key.includes('w3pk') || key.includes('passkey')) {
        type = 'other_w3pk'
      }

      // Try to parse as JSON
      try {
        parsedValue = JSON.parse(value)
      } catch (e) {
        // Not JSON, leave as undefined
      }

      items.push({
        key,
        value: value.length > 200 ? value.substring(0, 200) + '...' : value,
        parsedValue,
        type,
        encrypted,
      })
    } catch (error) {
      console.error(`Error inspecting localStorage key ${key}:`, error)
    }
  }

  // Sort by type, then by key
  items.sort((a, b) => {
    if (a.type !== b.type) {
      const typeOrder = [
        'w3pk_credential_index',
        'w3pk_auth_state',
        'w3pk_credential',
        'w3pk_wallet',
        'w3pk_session',
        'w3pk_backup',
        'other_w3pk',
        'other',
      ]
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
    }
    return a.key.localeCompare(b.key)
  })

  return items
}

/**
 * Formats a value for display
 */
export function formatValue(value: any): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  try {
    return JSON.stringify(value, null, 2)
  } catch (e) {
    return String(value)
  }
}

/**
 * Masks sensitive data in a value
 */
export function maskSensitiveData(key: string, value: any): any {
  const sensitiveKeys = [
    'privateKey',
    'mnemonic',
    'seed',
    'secret',
    'password',
    'encryptedMnemonic',
    'signature',
  ]

  if (typeof value === 'object' && value !== null) {
    const masked: any = Array.isArray(value) ? [] : {}
    for (const k in value) {
      if (sensitiveKeys.some(sk => k.toLowerCase().includes(sk.toLowerCase()))) {
        masked[k] = '[MASKED]'
      } else if (typeof value[k] === 'object') {
        masked[k] = maskSensitiveData(k, value[k])
      } else {
        masked[k] = value[k]
      }
    }
    return masked
  }

  // Check if the key itself is sensitive
  if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
    return '[MASKED]'
  }

  return value
}

/**
 * Clears a single localStorage item
 */
export function clearLocalStorageItem(key: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error clearing localStorage item ${key}:`, error)
    return false
  }
}

/**
 * Clears all w3pk-related data from localStorage
 */
export function clearAllW3pkLocalStorage(): { cleared: string[]; failed: string[] } {
  const cleared: string[] = []
  const failed: string[] = []

  if (typeof window === 'undefined' || !window.localStorage) {
    return { cleared, failed }
  }

  const keys = Object.keys(localStorage)
  const w3pkKeys = keys.filter(key => key.includes('w3pk') || key.includes('passkey'))

  for (const key of w3pkKeys) {
    try {
      localStorage.removeItem(key)
      cleared.push(key)
    } catch (error) {
      console.error(`Error clearing localStorage key ${key}:`, error)
      failed.push(key)
    }
  }

  return { cleared, failed }
}
