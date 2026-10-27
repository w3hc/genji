/**
 * A sync link carries a PRF sync file in the URL fragment, which browsers
 * never send to the server: scanning its QR code opens Settings with the
 * file loaded. Only the file's passkey decrypts it.
 */

import { arrayBufferToBase64Url, base64UrlToArrayBuffer } from 'w3pk'

const SYNC_PREFIX = '#sync='

// Byte-mode capacity of a version 40 QR code at error correction level L
const QR_MAX_BYTES = 2953

export function buildSyncLink(syncData: string, origin: string): string {
  const bytes = new TextEncoder().encode(syncData)
  return `${origin}/settings${SYNC_PREFIX}${arrayBufferToBase64Url(bytes)}`
}

export function fitsInQrCode(link: string): boolean {
  return link.length <= QR_MAX_BYTES
}

let pendingSyncData: string | null | undefined
const listeners = new Set<() => void>()

/**
 * Reads the sync file from the page's `#sync=` fragment once, and removes
 * it from the address bar so it doesn't stay in the browser history. Later
 * calls return the same file until clearPendingSyncLink(), since the
 * component that shows it can remount when the session restores.
 */
export function takePendingSyncLink(): string | null {
  if (typeof window === 'undefined') return null
  if (pendingSyncData === undefined) {
    pendingSyncData = readSyncLink(window.location.hash)
    if (pendingSyncData) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }
  return pendingSyncData
}

export function clearPendingSyncLink(): void {
  pendingSyncData = null
  listeners.forEach(listener => listener())
}

export function subscribePendingSyncLink(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Returns the sync file from a `#sync=` fragment, or null when the
 * fragment is absent or isn't a JSON sync file
 */
export function readSyncLink(hash: string): string | null {
  if (!hash.startsWith(SYNC_PREFIX)) return null
  try {
    const syncData = new TextDecoder().decode(
      base64UrlToArrayBuffer(hash.slice(SYNC_PREFIX.length))
    )
    JSON.parse(syncData)
    return syncData
  } catch {
    return null
  }
}
