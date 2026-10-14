/**
 * Safari wipes script-written storage (localStorage included) after 7 days
 * of use without a visit to the site, unless it runs as a home-screen app
 * or the browser granted persistent storage. Only there is a backup
 * required before the user goes on. Replace with w3pk's `evictionRisk`
 * once it ships (w3hc/w3pk#160).
 */

export function isWebKitBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  // Every iOS browser is WebKit (CriOS, FxiOS, EdgiOS); on desktop, Chromium
  // browsers also say "AppleWebKit", so they are excluded by name
  return /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg\/|OPR|Android/.test(ua)
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
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function hasEvictionRisk(storagePersisted: boolean | null): boolean {
  return storagePersisted !== true && isWebKitBrowser() && !isStandalone()
}
