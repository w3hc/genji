/**
 * Custom hook for accessing translations based on current language
 */

'use client'

import { useLanguage } from '@/context/LanguageContext'
import { getTranslations } from '@/translations'

/**
 * Hook that provides access to translations based on the current language
 * @returns Translation object for the current language
 */
export function useTranslation() {
  const { language } = useLanguage()
  return getTranslations(language)
}
