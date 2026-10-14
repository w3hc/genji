'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useW3PK } from '@/context/W3PK'
import { useTranslation } from '@/hooks/useTranslation'

export default function BackupBanner() {
  const t = useTranslation()
  const { isAuthenticated, hasBackup, openBackupPrompt } = useW3PK()

  if (!isAuthenticated || hasBackup !== false) return null

  return (
    <Alert.Root status="warning" mt={4} alignItems="center">
      <Alert.Indicator />
      <Alert.Title flex="1">{t.backup.bannerText}</Alert.Title>
      <Button size="sm" variant="outline" onClick={openBackupPrompt}>
        {t.backup.bannerButton}
      </Button>
    </Alert.Root>
  )
}
