'use client'

import { useState, useSyncExternalStore } from 'react'
import { Box, Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react'
import { FiDownload } from 'react-icons/fi'
import { AuthenticationError, PrfUnsupportedError, SyncBootstrapError } from 'w3pk'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import PasswordModal from '@/components/PasswordModal'
import { useW3PK, isUserCancelledError } from '@/context/W3PK'
import { useTranslation } from '@/hooks/useTranslation'
import { brandColors } from '@/theme'
import {
  clearPendingSyncLink,
  subscribePendingSyncLink,
  takePendingSyncLink,
} from '@/utils/syncLink'

type Translations = ReturnType<typeof useTranslation>

function syncErrorMessage(error: unknown, t: Translations): string {
  if (error instanceof SyncBootstrapError) {
    switch (error.reason) {
      case 'CREDENTIAL_MISMATCH':
        return t.settings.syncErrorCredentialMismatch
      case 'PUBLIC_KEY_MISMATCH':
        return t.settings.syncErrorPublicKeyMismatch
      default:
        return t.settings.syncErrorUnsupportedBackup
    }
  }
  if (error instanceof PrfUnsupportedError) return t.settings.syncErrorPrfUnsupported
  if (error instanceof AuthenticationError) return t.settings.syncErrorNoPasskey
  return error instanceof Error ? error.message : t.settings.unexpectedErrorDescription
}

export default function SyncImport() {
  const t = useTranslation()
  const { importFromSync, syncWalletWithPasskey } = useW3PK()
  const [isImporting, setIsImporting] = useState(false)
  const [passwordFile, setPasswordFile] = useState<string | null>(null)
  const linkSyncData = useSyncExternalStore(
    subscribePendingSyncLink,
    takePendingSyncLink,
    () => null
  )

  const runImport = async (operation: () => Promise<{ ethereumAddress: string }>) => {
    setIsImporting(true)
    try {
      const { ethereumAddress } = await operation()
      clearPendingSyncLink()
      toaster.create({
        title: t.settings.syncImportedTitle,
        description: `${ethereumAddress.slice(0, 6)}...${ethereumAddress.slice(-4)}`,
        type: 'success',
        duration: 5000,
      })
    } catch (error) {
      if (!isUserCancelledError(error)) {
        toaster.create({
          title: t.settings.syncImportErrorTitle,
          description: syncErrorMessage(error, t),
          type: 'error',
          duration: 8000,
        })
      }
    } finally {
      setIsImporting(false)
    }
  }

  const handleChooseFile = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'
    fileInput.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const syncData = await file.text()
      let encryptionMethod: string | undefined
      try {
        encryptionMethod = JSON.parse(syncData).encryptionMethod
      } catch {
        toaster.create({
          title: t.settings.syncImportErrorTitle,
          description: t.settings.syncErrorInvalidFile,
          type: 'error',
          duration: 5000,
        })
        return
      }

      if (encryptionMethod === 'prf') {
        await runImport(() => importFromSync(syncData))
      } else {
        setPasswordFile(syncData)
      }
    }
    fileInput.click()
  }

  const handlePasswordSubmit = async (password: string) => {
    const syncData = passwordFile
    setPasswordFile(null)
    if (syncData) await runImport(() => syncWalletWithPasskey(syncData, password))
  }

  return (
    <Box
      id="sync-import"
      bg="gray.900"
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.700"
    >
      <HStack mb={4}>
        <Icon as={FiDownload} color={brandColors.primary} boxSize={6} />
        <Heading size="md">{t.settings.syncImportHeading}</Heading>
      </HStack>
      <Text fontSize="sm" color="gray.400" mb={4}>
        {t.settings.syncImportDescription}
      </Text>
      {linkSyncData && (
        <VStack align="stretch" gap={3} mb={4} p={4} bg="blue.900/90" borderRadius="md">
          <Text fontSize="sm" color="gray.200">
            {t.settings.syncLinkReady}
          </Text>
          {/* Safari only allows the passkey prompt after a tap */}
          <Button
            bg={brandColors.primary}
            color="white"
            _hover={{ bg: brandColors.secondary }}
            onClick={() => runImport(() => importFromSync(linkSyncData))}
            loading={isImporting}
            width="full"
          >
            {t.settings.syncLinkButton}
          </Button>
          <Button variant="ghost" size="sm" onClick={clearPendingSyncLink} disabled={isImporting}>
            {t.common.cancel}
          </Button>
        </VStack>
      )}
      <Button
        bg={brandColors.primary}
        color="white"
        _hover={{ bg: brandColors.secondary }}
        onClick={handleChooseFile}
        loading={isImporting}
        width="full"
      >
        {t.settings.syncImportButton}
      </Button>

      <PasswordModal
        isOpen={passwordFile !== null}
        onClose={() => setPasswordFile(null)}
        onSubmit={handlePasswordSubmit}
        title={t.settings.syncImportPasswordTitle}
        description={t.settings.syncImportPasswordDescription}
      />
    </Box>
  )
}
