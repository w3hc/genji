/**
 * Storage inspection utilities for w3pk
 * Allows debugging and inspection of localStorage and IndexedDB
 */

export interface LocalStorageItem {
  key: string
  value: string
  parsedValue?: any
  type: 'w3pk_credential' | 'w3pk_credential_index' | 'w3pk_auth_state' | 'other_w3pk' | 'other'
  encrypted?: boolean
}

export interface IndexedDBRecord {
  key: string
  value: any
  store: string
}

export interface IndexedDBInfo {
  name: string
  version: number
  stores: string[]
  records: IndexedDBRecord[]
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
 * Inspects IndexedDB for w3pk-related databases
 */
export async function inspectIndexedDB(): Promise<IndexedDBInfo[]> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return []
  }

  const dbInfos: IndexedDBInfo[] = []

  try {
    // Get all databases
    const databases = await indexedDB.databases()

    for (const dbInfo of databases) {
      if (!dbInfo.name) continue

      // Only inspect w3pk-related databases or all if debugging
      if (
        dbInfo.name.toLowerCase().includes('web3') ||
        dbInfo.name.toLowerCase().includes('passkey') ||
        dbInfo.name.toLowerCase().includes('w3pk')
      ) {
        try {
          const db = await openDatabase(dbInfo.name, dbInfo.version)
          const stores = Array.from(db.objectStoreNames)
          const records: IndexedDBRecord[] = []

          // Read all records from all stores
          for (const storeName of stores) {
            try {
              const storeRecords = await getAllRecordsFromStore(db, storeName)
              records.push(
                ...storeRecords.map(record => ({
                  key: record.key,
                  value: record.value,
                  store: storeName,
                }))
              )
            } catch (error) {
              console.error(`Error reading store ${storeName}:`, error)
            }
          }

          dbInfos.push({
            name: dbInfo.name,
            version: dbInfo.version || 1,
            stores,
            records,
          })

          db.close()
        } catch (error) {
          console.error(`Error opening database ${dbInfo.name}:`, error)
        }
      }
    }
  } catch (error) {
    console.error('Error getting databases:', error)
  }

  return dbInfos
}

/**
 * Opens an IndexedDB database
 */
function openDatabase(name: string, version?: number): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = version ? indexedDB.open(name, version) : indexedDB.open(name)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      // Don't modify the database during inspection
    }
  })
}

/**
 * Gets all records from an IndexedDB object store
 */
function getAllRecordsFromStore(
  db: IDBDatabase,
  storeName: string
): Promise<Array<{ key: string; value: any }>> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const records = request.result || []

        // Get the keys as well
        const keysRequest = store.getAllKeys()
        keysRequest.onsuccess = () => {
          const keys = keysRequest.result || []
          const result = records.map((value, index) => ({
            key: keys[index]?.toString() || index.toString(),
            value,
          }))
          resolve(result)
        }
        keysRequest.onerror = () => {
          // Fallback: use index as key
          const result = records.map((value, index) => ({
            key: index.toString(),
            value,
          }))
          resolve(result)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
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
 * Clears a single record from IndexedDB
 */
export async function clearIndexedDBRecord(
  dbName: string,
  storeName: string,
  key: string
): Promise<boolean> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return false
  }

  try {
    const db = await openDatabase(dbName)
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(key)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })

    db.close()
    return true
  } catch (error) {
    console.error(`Error clearing IndexedDB record ${dbName}/${storeName}/${key}:`, error)
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

/**
 * Clears all w3pk-related IndexedDB databases
 */
export async function clearAllW3pkIndexedDB(): Promise<{ cleared: string[]; failed: string[] }> {
  const cleared: string[] = []
  const failed: string[] = []

  if (typeof window === 'undefined' || !window.indexedDB) {
    return { cleared, failed }
  }

  try {
    const databases = await indexedDB.databases()

    for (const dbInfo of databases) {
      if (!dbInfo.name) continue

      // Only clear w3pk-related databases
      if (
        dbInfo.name.toLowerCase().includes('web3') ||
        dbInfo.name.toLowerCase().includes('passkey') ||
        dbInfo.name.toLowerCase().includes('w3pk')
      ) {
        try {
          await new Promise<void>((resolve, reject) => {
            const request = indexedDB.deleteDatabase(dbInfo.name!)
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
            request.onblocked = () => {
              console.warn(`Deletion of ${dbInfo.name} is blocked`)
              reject(new Error('Deletion blocked'))
            }
          })
          cleared.push(dbInfo.name)
        } catch (error) {
          console.error(`Error clearing IndexedDB ${dbInfo.name}:`, error)
          failed.push(dbInfo.name)
        }
      }
    }
  } catch (error) {
    console.error('Error getting databases:', error)
  }

  return { cleared, failed }
}
