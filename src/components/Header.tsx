'use client'

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useDisclosure,
  VStack,
  Link as ChakraLink,
  CloseButton,
} from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem } from '@/components/ui/menu'
import { Dialog, Portal } from '@/components/ui/dialog'
import Link from 'next/link'
import { HiMenu } from 'react-icons/hi'
import LanguageSelector from './LanguageSelector'
import Spinner from './Spinner'
import { useTranslation } from '@/hooks/useTranslation'
import { useW3PK, isNoPasskeyError } from '@/context/W3PK'
import { useState, useEffect } from 'react'
import { FaGithub } from 'react-icons/fa'
import { toaster } from '@/components/ui/toaster'
import { brandColors } from '@/theme'

export default function Header() {
  const { isAuthenticated, login, register, logout, hasLocalCredentials } = useW3PK()
  const t = useTranslation()
  const { open: isOpen, onOpen, onClose } = useDisclosure()
  const [username, setUsername] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false)

  const [scrollPosition, setScrollPosition] = useState(0)

  const shouldSlide = scrollPosition > 0
  const leftSlideValue = shouldSlide ? 2000 : 0
  const rightSlideValue = shouldSlide ? 2000 : 0

  const GitHubIcon = FaGithub

  const spinStyles = `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .spin-icon {
      animation: spin 8s linear infinite;
      display: inline-flex;
    }
  `

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const validateUsername = (input: string): boolean => {
    if (!input.trim()) {
      return true
    }

    const trimmedInput = input.trim()

    // Check overall format and length (3-50 chars)
    // Alphanumeric, underscore, and hyphen allowed
    // Must start and end with alphanumeric
    const formatValid =
      /^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/.test(trimmedInput) &&
      trimmedInput.length >= 3 &&
      trimmedInput.length <= 50

    return formatValid
  }

  const handleLogin = async () => {
    /**
     * Login Workflow:
     * 1. Existing persistent sessions are restored by the W3PK context on mount
     * 2. If no passkey was ever registered on this device, open the
     *    registration modal directly — calling login() with no local
     *    credential would make the browser show its cross-device
     *    "scan this QR code" dialog instead of failing
     * 3. Otherwise login() prompts for the passkey; if it turns out to be
     *    unavailable after all, fall back to the registration modal
     */
    try {
      if (!(await hasLocalCredentials())) {
        onOpen()
        return
      }
      await login()
    } catch (error) {
      if (isNoPasskeyError(error)) {
        toaster.create({
          title: t.header.noAccountFoundTitle,
          description: t.header.noAccountFoundDescription,
          type: 'info',
          duration: 4000,
        })
        onOpen()
      }
      // Other errors (user cancelled, timeout, etc.) are already handled
      // by the login() function in the W3PK context
    }
  }

  const handleRegister = async () => {
    if (!username.trim()) {
      toaster.create({
        title: t.header.usernameRequiredTitle,
        description: t.header.usernameRequiredDescription,
        type: 'warning',
        duration: 3000,
      })
      setIsUsernameInvalid(true)
      return
    }

    const isValid = validateUsername(username)
    if (!isValid) {
      // toast({
      //   title: 'Invalid Username',
      //   description:
      //     'Username must be 3-50 characters long and contain only letters, numbers, underscores, and hyphens. It must start and end with a letter or number.',
      //   status: 'error',
      //   duration: 5000,
      //   isClosable: true,
      // })
      setIsUsernameInvalid(true)
      return
    }

    setIsUsernameInvalid(false)

    try {
      setIsRegistering(true)
      // register() handles its own timeout and error/success toasts
      await register(username.trim())
      setUsername('')
      onClose()
    } catch (error) {
      console.error('[Header] Registration failed:', error)
    } finally {
      setIsRegistering(false)
    }
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    if (validateUsername(value)) {
      setIsUsernameInvalid(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const handleModalClose = () => {
    setUsername('')
    setIsUsernameInvalid(false)
    onClose()
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: spinStyles }} />
      <Box as="header" py={4} position="fixed" w="100%" top={0} zIndex={10} overflow="visible">
        <Container maxW="100%" px={{ base: 4, md: 6 }} overflow="visible">
          <Flex
            as="nav"
            aria-label={t.header.mainNavAriaLabel}
            justify="space-between"
            align="center"
            overflow="visible"
          >
            <Box
              transform={`translateX(-${leftSlideValue}px)`}
              transition="transform 0.5s ease-in-out"
              suppressHydrationWarning
            >
              <Flex align="center" gap={3}>
                <Flex align="center" gap={5}>
                  <Link href="/">
                    <Heading as="h3" size="md" textAlign="center">
                      Genji
                    </Heading>
                  </Link>

                  <Box className="spin-icon">
                    <Link href="https://github.com/w3hc/genji" target={'_blank'}>
                      <GitHubIcon size={20} />
                    </Link>
                  </Box>
                </Flex>
              </Flex>
            </Box>

            <Flex
              gap={2}
              align="center"
              transform={`translateX(${rightSlideValue}px)`}
              transition="transform 0.5s ease-in-out"
              suppressHydrationWarning
            >
              {!isAuthenticated ? (
                <Button
                  bg={brandColors.primary}
                  color="white"
                  _hover={{
                    bg: brandColors.secondary,
                  }}
                  onClick={handleLogin}
                  size="xs"
                  px={4}
                >
                  {t.common.login}
                </Button>
              ) : (
                <>
                  {/* <Box>
                    <Text fontSize="sm" color="gray.300">
                      {user?.displayName || user?.username}
                    </Text>
                  </Box> */}
                  <Button
                    bg={brandColors.primary}
                    color="white"
                    _hover={{
                      bg: brandColors.secondary,
                    }}
                    onClick={handleLogout}
                    size="xs"
                    ml={4}
                    px={4}
                  >
                    {t.common.logout}
                  </Button>
                </>
              )}
              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton aria-label={t.header.optionsAriaLabel} variant="ghost" size="sm">
                    <HiMenu />
                  </IconButton>
                </MenuTrigger>
                <Portal>
                  <MenuPositioner>
                    <MenuContent minWidth="auto">
                      <Link href="/about" color="white">
                        <MenuItem value="about" fontSize="md" px={4} py={3}>
                          {t.navigation.about}
                        </MenuItem>
                      </Link>
                      <Link href="/settings" color="white">
                        <MenuItem value="settings" fontSize="md" px={4} py={3}>
                          {t.navigation.settings}
                        </MenuItem>
                      </Link>
                    </MenuContent>
                  </MenuPositioner>
                </Portal>
              </MenuRoot>
              <LanguageSelector />
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Registration Modal */}
      <Dialog.Root
        open={isOpen}
        onOpenChange={(e: { open: boolean }) => (e.open ? null : handleModalClose())}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6}>
              <Dialog.Header>
                <Dialog.Title>{t.header.registerTitle}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pt={4}>
                <VStack gap={4}>
                  <Text fontSize="sm" color="gray.400">
                    {t.header.walletInfoText}{' '}
                    <ChakraLink
                      href={'https://github.com/w3hc/w3pk/blob/main/src/auth/register.ts#L17-L102'}
                      color={brandColors.accent}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      w3pk
                    </ChakraLink>
                    .
                  </Text>
                  <Field invalid={isUsernameInvalid} label={t.header.usernameLabel}>
                    <Input
                      id="username-input"
                      aria-describedby={
                        isUsernameInvalid && username.trim() ? 'username-error' : undefined
                      }
                      aria-invalid={isUsernameInvalid && username.trim() ? true : undefined}
                      value={username}
                      onChange={e => handleUsernameChange(e.target.value)}
                      placeholder={t.header.usernamePlaceholder}
                      pl={3}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && username.trim()) {
                          handleRegister()
                        }
                      }}
                    />
                    {isUsernameInvalid && username.trim() && (
                      <Field.ErrorText id="username-error">
                        {t.header.usernameError}
                      </Field.ErrorText>
                    )}
                  </Field>{' '}
                  <ChakraLink
                    as={Link}
                    href="/settings#restore-backup"
                    onClick={handleModalClose}
                    fontSize="sm"
                    color={brandColors.accent}
                    alignSelf="flex-start"
                  >
                    {t.header.alreadyRegisteredLink}
                  </ChakraLink>
                </VStack>
              </Dialog.Body>

              <Dialog.Footer gap={3} pt={6}>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">{t.common.cancel}</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="blue" onClick={handleRegister} disabled={!username.trim()}>
                  {isRegistering && <Spinner size="50px" />}
                  {!isRegistering && t.header.createAccount}
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
