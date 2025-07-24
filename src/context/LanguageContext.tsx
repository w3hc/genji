/**
 * Language Context Provider for the application
 * Manages the current language state and provides language switching functionality
 */

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { detectUserLanguage, Language, DEFAULT_LANGUAGE, isValidLanguage } from '@/utils/i18n'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {}, // Default empty function
})

export const useLanguage = () => useContext(LanguageContext)

type LanguageProviderProps = {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with user's detected language or stored preference
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)

  // On initial load, detect user language and check localStorage
  useEffect(() => {
    const initializeLanguage = () => {
      // Check if there's a stored language preference
      const storedLang = localStorage.getItem('userLanguage')

      if (storedLang && isValidLanguage(storedLang)) {
        setLanguageState(storedLang)
        // Update HTML lang attribute and prevent auto-translate
        document.documentElement.lang = storedLang
        document.documentElement.setAttribute('translate', 'no')
      } else {
        // If no stored preference, detect from browser
        const detectedLang = detectUserLanguage()
        setLanguageState(detectedLang)
        localStorage.setItem('userLanguage', detectedLang)
        // Update HTML attributes
        document.documentElement.lang = detectedLang
        document.documentElement.setAttribute('translate', 'no')
      }
    }

    initializeLanguage()
  }, [])

  // Set language and store in localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('userLanguage', lang)
    // Update HTML lang attribute for accessibility and SEO
    document.documentElement.lang = lang
    // Keep translate="no" to prevent Chrome auto-translate interference
    document.documentElement.setAttribute('translate', 'no')
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
