import React, { useState, useEffect } from 'react'
import { Text, Box, Flex, CloseButton } from '@chakra-ui/react'
import { Dialog, Portal } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ListRoot, ListItem } from '@/components/ui/list'
import { Field } from '@/components/ui/field'
import { MdCheckCircle, MdWarning } from 'react-icons/md'
import { isStrongPassword } from 'w3pk'
import { toaster } from '@/components/ui/toaster'
import { useTranslation } from '@/hooks/useTranslation'

interface PasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (password: string) => void
  title: string
  description: string
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description, // Use the description prop here
}) => {
  const t = useTranslation()
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordStrong, setIsPasswordStrong] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  // Validate password strength in real-time
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPasswordStrong(password ? isStrongPassword(password) : false)
  }, [password])

  const handleSubmit = async () => {
    if (!password.trim()) {
      toaster.create({
        title: t.passwordModal.passwordRequiredTitle,
        description: t.passwordModal.passwordRequiredDescription,
        type: 'warning',
        duration: 3000,
      })
      return
    }

    if (!isPasswordStrong) {
      toaster.create({
        title: t.passwordModal.weakPasswordTitle,
        description: t.passwordModal.weakPasswordDescription,
        type: 'warning',
        duration: 3000,
      })
      return
    }

    setIsSubmitting(true)
    try {
      onSubmit(password)
      setPassword('') // Clear password after successful submission
      setPasswordTouched(false)
    } catch (error) {
      console.error('Error in password modal submit:', error)
      toaster.create({
        title: t.passwordModal.submissionErrorTitle,
        description: (error as Error).message || t.passwordModal.submissionErrorDefaultDescription,
        type: 'error',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
      // Optionally close the modal here if onSubmit handles success/failure states
      // onClose(); // Or let the parent component control closing
    }
  }

  const handleClose = () => {
    setPassword('') // Clear password when closing
    setPasswordTouched(false)
    onClose()
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (!passwordTouched && e.target.value.length > 0) {
      setPasswordTouched(true)
    }
  }

  // w3pk's rules (NIST SP 800-63B): length in code points, no composition rules
  const chars = [...password.normalize('NFC')]
  const hasMinLength = chars.length >= 15 && chars.length <= 256
  const hasNoRepeat = new Set(chars).size > 1

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e: { open: boolean }) => (e.open ? null : handleClose())}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={6}>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pt={4}>
              <Text mb={4}>{description}</Text>
              <Field required invalid={passwordTouched && !isPasswordStrong}>
                <Field.Label htmlFor="password">{t.passwordModal.passwordLabel}</Field.Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.passwordModal.passwordPlaceholder}
                  value={password}
                  onChange={handlePasswordChange}
                  aria-describedby="password-requirements password-status"
                  aria-invalid={passwordTouched && !isPasswordStrong ? true : undefined}
                  autoFocus
                  pl={3}
                />
                {passwordTouched && !isPasswordStrong && (
                  <Field.ErrorText id="password-status">
                    {t.passwordModal.requirementsNotMet}
                  </Field.ErrorText>
                )}
                {passwordTouched && isPasswordStrong && (
                  <Field.HelperText id="password-status" color="green.400">
                    {t.passwordModal.strongPassword}
                  </Field.HelperText>
                )}
              </Field>

              {/* Password Requirements */}
              <Box mt={4} id="password-requirements" aria-live="polite" aria-atomic="false">
                <Text fontSize="sm" fontWeight="bold" mb={2} color="white">
                  {t.passwordModal.mustInclude}
                </Text>
                <Flex align="center" gap={2}>
                  {hasMinLength ? <MdCheckCircle color="green" /> : <MdWarning color="gray" />}
                  {t.passwordModal.reqMinLength}
                  <span className="sr-only">
                    {hasMinLength ? t.passwordModal.satisfied : t.passwordModal.required}
                  </span>
                </Flex>

                <Flex align="center" gap={2}>
                  {hasNoRepeat ? <MdCheckCircle color="green" /> : <MdWarning color="gray" />}
                  {t.passwordModal.reqNoRepeat}
                  <span className="sr-only">
                    {hasNoRepeat ? t.passwordModal.satisfied : t.passwordModal.required}
                  </span>
                </Flex>
                <Flex align="center" gap={2}>
                  {isPasswordStrong ? <MdCheckCircle color="green" /> : <MdWarning color="gray" />}
                  {t.passwordModal.reqNotCommon}
                  <span className="sr-only">
                    {isPasswordStrong ? t.passwordModal.satisfied : t.passwordModal.required}
                  </span>
                </Flex>
              </Box>
            </Dialog.Body>

            <Dialog.Footer gap={3} pt={6}>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{t.common.cancel}</Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="blue"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={!isPasswordStrong}
              >
                {t.passwordModal.submit}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default PasswordModal
