'use client'

import { useState } from 'react'
import { Text, VStack, Flex, CloseButton } from '@chakra-ui/react'
import { Dialog, Portal } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { toaster } from '@/components/ui/toaster'
import PasswordModal from '@/components/PasswordModal'
import { useW3PK } from '@/context/W3PK'
import { useTranslation } from '@/hooks/useTranslation'
import { isIOS } from '@/utils/evictionRisk'
import { brandColors } from '@/theme'

function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

export default function BackupStep() {
  const t = useTranslation()
  const { user, backupPrompt, closeBackupPrompt, skipBackup, createBackup } = useW3PK()
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handlePasswordSubmit = async (password: string) => {
    setShowPasswordModal(false)
    try {
      const blob = await createBackup(password)
      const date = new Date().toISOString().slice(0, 10)
      downloadBlob(
        new Blob([await blob.text()], { type: 'application/json' }),
        `w3pk_backup_${user?.username || 'user'}_${date}.json`
      )
      toaster.create({ title: t.backup.backupCreatedTitle, type: 'success', duration: 3000 })
    } catch (error) {
      toaster.create({
        title: t.backup.backupFailedTitle,
        description: (error as Error).message,
        type: 'error',
        duration: 5000,
      })
    }
  }

  const { blocking } = backupPrompt

  return (
    <>
      <Dialog.Root
        open={backupPrompt.open && !showPasswordModal}
        onOpenChange={(e: { open: boolean }) => (e.open ? null : closeBackupPrompt())}
        closeOnInteractOutside={!blocking}
        closeOnEscape={!blocking}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6}>
              <Dialog.Header>
                <Dialog.Title>{t.backup.title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pt={4}>
                <VStack align="stretch" gap={4}>
                  <Text>{t.backup.description}</Text>
                  {blocking && (
                    <Alert.Root status="warning">
                      <Alert.Indicator />
                      <Alert.Title>{t.backup.safariWarning}</Alert.Title>
                    </Alert.Root>
                  )}
                  {blocking && isIOS() && (
                    <Text fontSize="sm" color="gray.400">
                      {t.backup.homeScreenHint}
                    </Text>
                  )}
                </VStack>
              </Dialog.Body>
              <Dialog.Footer pt={6}>
                <Flex gap={3} justify="flex-end" wrap="wrap" w="full">
                  {blocking ? (
                    <Button variant="ghost" onClick={skipBackup}>
                      {t.backup.skipButton}
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={closeBackupPrompt}>
                      {t.backup.laterButton}
                    </Button>
                  )}
                  <Button
                    bg={brandColors.primary}
                    color="white"
                    _hover={{ bg: brandColors.secondary }}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    {t.backup.downloadButton}
                  </Button>
                </Flex>
              </Dialog.Footer>
              {!blocking && (
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              )}
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        title={t.backup.passwordModalTitle}
        description={t.backup.passwordModalDescription}
      />
    </>
  )
}
