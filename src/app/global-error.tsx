'use client'

/**
 * Replaces the root layout when it crashes (ContextProvider, W3pkProvider),
 * which src/app/error.tsx can't catch. Plain inline styles and no Chakra:
 * the providers may be what failed.
 */

import { useEffect, useSyncExternalStore, type CSSProperties } from 'react'
import { getTranslations } from '@/translations'
import { DEFAULT_LANGUAGE, detectUserLanguage, isValidLanguage, type Language } from '@/utils/i18n'

const RTL_LANGUAGES: Language[] = ['ar', 'ur']

function readLanguage(): Language {
  try {
    const stored = window.localStorage.getItem('userLanguage')
    if (stored && isValidLanguage(stored)) return stored
  } catch {
    // Storage blocked: fall back to the browser language
  }
  return detectUserLanguage()
}

const subscribeNever = () => () => {}

function getDigest(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'digest' in error) {
    const { digest } = error as { digest: unknown }
    if (typeof digest === 'string') return digest
  }
  return undefined
}

const buttonStyle: CSSProperties = {
  padding: '10px 20px',
  border: 0,
  borderRadius: 6,
  background: '#8c1c84',
  color: '#fff',
  fontSize: 16,
  cursor: 'pointer',
}

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const language = useSyncExternalStore(subscribeNever, readLanguage, () => DEFAULT_LANGUAGE)

  useEffect(() => {
    console.error('Root layout error:', error)
  }, [error])

  const t = getTranslations(language)
  const digest = getDigest(error)

  return (
    <html lang={language} dir={RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          boxSizing: 'border-box',
          background: '#0a0a0a',
          color: '#f5f5f5',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        <title>{t.globalError.title}</title>
        <main role="alert">
          <h1 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 600 }}>
            {t.globalError.title}
          </h1>
          <p style={{ margin: '0 0 24px', maxWidth: 480, fontSize: 16, color: '#bdbdbd' }}>
            {t.globalError.body}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <button type="button" style={buttonStyle} onClick={() => retry()}>
              {t.globalError.tryAgain}
            </button>
            <button type="button" style={buttonStyle} onClick={() => window.location.reload()}>
              {t.compat.reload}
            </button>
          </div>
          {digest && (
            <p style={{ marginTop: 24, fontSize: 12, color: '#8a8a8a' }}>
              {t.globalError.errorId} {digest}
            </p>
          )}
        </main>
      </body>
    </html>
  )
}
