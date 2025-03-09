/**
 * i18n utility for language detection and translation support
 * This file provides functions for detecting user language and managing translations
 */

// Define supported languages in order of number of speakers
export const SUPPORTED_LANGUAGES = {
  en: 'English', // ~1.5 billion speakers
  zh: '中文', // Mandarin Chinese, ~1.1 billion speakers
  hi: 'हिन्दी', // Hindi, ~650 million speakers
  es: 'Español', // Spanish, ~550 million speakers
  fr: 'Français', // French, ~300 million speakers
  ar: 'العربية', // Arabic, ~280 million speakers
  bn: 'বাংলা', // Bengali, ~270 million speakers
  ru: 'Русский', // Russian, ~260 million speakers
  pt: 'Português', // Portuguese, ~250 million speakers
  ur: 'اردو', // Urdu, ~230 million speakers
}

export type Language = keyof typeof SUPPORTED_LANGUAGES

export const DEFAULT_LANGUAGE: Language = 'en'

export function detectUserLanguage(): Language {
  if (typeof window === 'undefined' || !navigator || !navigator.language) {
    return DEFAULT_LANGUAGE // Default for server-side rendering or if browser detection fails
  }

  try {
    // Get browser language
    const browserLang = navigator.language.split('-')[0]

    // Check if browser language is supported
    if (browserLang in SUPPORTED_LANGUAGES) {
      return browserLang as Language
    }
  } catch (error) {
    console.warn('Error detecting browser language:', error)
  }

  // Fall back to default language
  return DEFAULT_LANGUAGE
}

/**
 * Validates if a language code is supported
 * @param lang Language code to validate
 * @returns Boolean indicating if language is supported
 */
export function isValidLanguage(lang: string): lang is Language {
  return lang in SUPPORTED_LANGUAGES
}

/**
 * Gets a safe language code, falling back to default if necessary
 * @param lang Language code to validate
 * @returns Valid language code
 */
export function getSafeLanguage(lang: string | undefined): Language {
  if (!lang || !isValidLanguage(lang)) {
    return DEFAULT_LANGUAGE
  }
  return lang
}
