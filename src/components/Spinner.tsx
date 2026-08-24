'use client'

import { Box } from '@chakra-ui/react'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

interface SpinnerProps {
  size?: string | number
}

export default function Spinner({ size = '32px' }: SpinnerProps) {
  const t = useTranslation()

  // Convert size to a numeric value
  const getSizeNum = (s: string | number): number => {
    if (typeof s === 'number') return s

    // Handle named sizes
    const namedSizes: Record<string, number> = {
      sm: 24,
      md: 32,
      lg: 48,
      xl: 64,
    }

    if (namedSizes[s]) return namedSizes[s]

    // Parse pixel values (e.g., "16px" or "16")
    const parsed = parseInt(s, 10)
    return isNaN(parsed) ? 32 : parsed // fallback to 32 if parsing fails
  }

  const sizeNum = getSizeNum(size)

  return (
    <Box role="status" aria-live="polite" display="inline-block">
      <Image
        src="/loader.svg"
        alt=""
        aria-hidden="true"
        width={sizeNum}
        height={sizeNum}
        style={{ display: 'block' }}
      />
      <span className="sr-only">{t.common.srLoadingText}</span>
    </Box>
  )
}
