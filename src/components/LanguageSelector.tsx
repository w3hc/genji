'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Language } from '@/utils/i18n'
import { IconButton, Menu, MenuButton, MenuList, MenuItem, Text, Flex, Box } from '@chakra-ui/react'
import { MdLanguage } from 'react-icons/md'

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang)
  }

  const languageInfo = [
    { code: 'en', name: 'English', speakers: '~1.5 billion speakers' },
    { code: 'zh', name: '中文', speakers: '~1.1 billion speakers' },
    { code: 'hi', name: 'हिन्दी', speakers: '~650 million speakers' },
    { code: 'es', name: 'Español', speakers: '~550 million speakers' },
    { code: 'fr', name: 'Français', speakers: '~300 million speakers' },
    { code: 'ar', name: 'العربية', speakers: '~280 million speakers' },
    { code: 'bn', name: 'বাংলা', speakers: '~270 million speakers' },
    { code: 'ru', name: 'Русский', speakers: '~260 million speakers' },
    { code: 'pt', name: 'Português', speakers: '~250 million speakers' },
    { code: 'ur', name: 'اردو', speakers: '~230 million speakers' },
  ]

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Select language"
        icon={<MdLanguage size="1.2em" />}
        variant="ghost"
        size="sm"
      />
      <MenuList maxH="300px" overflowY="auto">
        {languageInfo.map(({ code, name, speakers }) => (
          <MenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            bg={language === code ? 'whiteAlpha.200' : undefined}
            _hover={{ bg: 'whiteAlpha.300' }}
          >
            <Flex align="center" justify="space-between" width="100%">
              <Box>
                <Text display="inline">{name}</Text>
                <Text fontSize="xs" color="gray.400" ml={2} display="inline">
                  {speakers}
                </Text>
              </Box>
              {language === code && (
                <Text fontSize="sm" color="green.300" ml={2}>
                  ✓
                </Text>
              )}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default LanguageSelector
