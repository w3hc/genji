'use client'

import { useState } from 'react'
import { Text, VStack, Flex, List } from '@chakra-ui/react'
import { Dialog, Portal } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { useTranslation } from '@/hooks/useTranslation'
import { brandColors } from '@/theme'

interface HomeScreenChoiceProps {
  isOpen: boolean
  onClose: () => void
  onBackup: () => void
}

export default function HomeScreenChoice({ isOpen, onClose, onBackup }: HomeScreenChoiceProps) {
  const t = useTranslation()
  const [showSteps, setShowSteps] = useState(false)

  const handleClose = () => {
    setShowSteps(false)
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e: { open: boolean }) => !e.open && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={6}>
            <Dialog.Header>
              <Dialog.Title>
                {showSteps ? t.homeScreen.stepsTitle : t.homeScreen.title}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pt={4}>
              {showSteps ? (
                <List.Root as="ol" gap={2} ps={5}>
                  <List.Item>{t.homeScreen.step1}</List.Item>
                  <List.Item>{t.homeScreen.step2}</List.Item>
                  <List.Item>{t.homeScreen.step3}</List.Item>
                </List.Root>
              ) : (
                <VStack align="stretch" gap={4}>
                  <Alert.Root status="warning">
                    <Alert.Indicator />
                    <Alert.Title>{t.backup.iosWarning}</Alert.Title>
                  </Alert.Root>
                  <Text>{t.homeScreen.description}</Text>
                </VStack>
              )}
            </Dialog.Body>
            <Dialog.Footer pt={6}>
              <Flex gap={3} justify="flex-end" wrap="wrap" w="full">
                {showSteps ? (
                  <Button variant="ghost" onClick={() => setShowSteps(false)}>
                    {t.homeScreen.backButton}
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={onBackup}>
                      {t.homeScreen.backupButton}
                    </Button>
                    <Button
                      bg={brandColors.primary}
                      color="white"
                      _hover={{ bg: brandColors.secondary }}
                      onClick={() => setShowSteps(true)}
                    >
                      {t.homeScreen.addButton}
                    </Button>
                  </>
                )}
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
