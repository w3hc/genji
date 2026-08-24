'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Language } from '@/utils/i18n'
import { Text, Flex, Box, Portal } from '@chakra-ui/react'
import { IconButton } from '@/components/ui/icon-button'
import { MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem } from '@/components/ui/menu'
import { MdLanguage } from 'react-icons/md'

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang)
  }

  const languageInfo = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ru', name: 'Русский' },
    { code: 'pt', name: 'Português' },
    { code: 'ur', name: 'اردو' },
  ]

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton aria-label="Select language" variant="ghost" size="sm">
          <MdLanguage size="1.2em" />
        </IconButton>
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent maxH="300px" overflowY="auto" minWidth="auto">
            {languageInfo.map(({ code, name }) => (
              <MenuItem
                key={code}
                value={code}
                onClick={() => handleLanguageChange(code as Language)}
                bg={language === code ? 'whiteAlpha.200' : undefined}
                _hover={{ bg: 'whiteAlpha.300' }}
              >
                <Flex align="center" justify="space-between">
                  <Box>
                    <Text display="inline">{name}</Text>
                  </Box>
                  {language === code && (
                    <Text fontSize="sm" color="green.300" ml={2}>
                      ✓
                    </Text>
                  )}
                </Flex>
              </MenuItem>
            ))}
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  )
}

export default LanguageSelector
