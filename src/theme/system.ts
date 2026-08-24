import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { brandColors } from './index'

// Custom configuration extending Chakra defaults
const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          primary: { value: brandColors.primary },
          secondary: { value: brandColors.secondary },
          accent: { value: brandColors.accent },
        },
      },
      spacing: {
        sectionPadding: { value: '5rem' }, // py={20} equivalent
        containerPadding: { value: '1rem' },
      },
      sizes: {
        spinnerSize: { value: '20px' }, // Default spinner size
      },
    },
    semanticTokens: {
      colors: {
        'brand.primary': {
          value: { base: brandColors.primary, _dark: brandColors.primary },
        },
        'brand.secondary': {
          value: { base: brandColors.secondary, _dark: brandColors.secondary },
        },
        'brand.accent': {
          value: { base: brandColors.accent, _dark: brandColors.accent },
        },
      },
    },
  },
})

// Create a system merging default config with custom config
export const system = createSystem(defaultConfig, customConfig)
