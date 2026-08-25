#!/usr/bin/env node

/**
 * Customization script for genji template
 * Removes example pages/routes and customizes the project name
 * Self-destructs after successful completion
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('\n🎨 Genji Customization Tool\n')
  console.log('This will customize your project by:')
  console.log('  • Removing the /about page')
  console.log('  • Removing API routes')
  console.log('  • Removing the docs directory')
  console.log('  • Removing CHANGELOG.md')
  console.log('  • Changing the project name')
  console.log('  • Updating metadata (title, description)')
  console.log('  • Removing deploy.yml workflow')
  console.log('  • Recording the template version in package.json (templateVersion)')
  console.log('  • Updating translations')
  console.log('  • Replacing homepage content')
  console.log('  • Replacing header component')
  console.log('  • Updating settings page metadata')
  console.log('  • Updating README.md')
  console.log('  • Removing this script\n')

  const confirm = await question('Do you want to continue? (y/n): ')
  if (confirm.toLowerCase() !== 'y') {
    console.log('Cancelled.')
    rl.close()
    return
  }

  const projectName = await question('\nEnter your project name: ')
  if (!projectName || projectName.trim() === '') {
    console.log('Error: Project name cannot be empty.')
    rl.close()
    return
  }

  const description = await question('Enter project description (optional): ')

  rl.close()

  console.log('\n🚀 Starting customization...\n')

  // 1. Remove /about page
  console.log('📄 Removing /about page...')
  const aboutDir = path.join(__dirname, 'src/app/about')
  if (fs.existsSync(aboutDir)) {
    fs.rmSync(aboutDir, { recursive: true, force: true })
    console.log('   ✓ Removed src/app/about/')
  }

  // 2. Remove API routes
  console.log('🔌 Removing API routes...')
  const apiDir = path.join(__dirname, 'src/app/api')
  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true })
    console.log('   ✓ Removed src/app/api/')
  }

  // 3. Remove docs directory
  console.log('📚 Removing docs directory...')
  const docsDir = path.join(__dirname, 'docs')
  if (fs.existsSync(docsDir)) {
    fs.rmSync(docsDir, { recursive: true, force: true })
    console.log('   ✓ Removed docs/')
  }

  // 4. Remove CHANGELOG.md
  console.log('📜 Removing CHANGELOG.md...')
  const changelogPath = path.join(__dirname, 'CHANGELOG.md')
  if (fs.existsSync(changelogPath)) {
    fs.unlinkSync(changelogPath)
    console.log('   ✓ Removed CHANGELOG.md')
  }

  // 5. Update package.json
  console.log('📦 Updating package.json...')
  let templateVersion = null
  const packageJsonPath = path.join(__dirname, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    // genji is not published to npm, so its own `version` is the template
    // release number. Record it here as `templateVersion`, which from now on
    // is this project's lineage: `version` is free to move on its own, and
    // the genji-sync skill reads and updates `templateVersion`.
    templateVersion = packageJson.version

    packageJson.name = projectName.toLowerCase().replace(/\s+/g, '-')
    if (description) {
      packageJson.description = description
    }

    // Rebuild so `templateVersion` sits next to `version` rather than being
    // appended after the dependency blocks.
    const ordered = {}
    for (const key of Object.keys(packageJson)) {
      ordered[key] = packageJson[key]
      if (key === 'description') {
        ordered.templateVersion = templateVersion
      }
    }
    if (!ordered.templateVersion) {
      ordered.templateVersion = templateVersion
    }

    // Remove the customize script from package.json
    if (ordered.scripts && ordered.scripts.customize) {
      delete ordered.scripts.customize
      console.log('   ✓ Removed "customize" script from package.json')
    }

    // Remove the postinstall hint so future installs stay silent
    if (ordered.scripts && ordered.scripts.postinstall) {
      delete ordered.scripts.postinstall
      console.log('   ✓ Removed "postinstall" hint from package.json')
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(ordered, null, 2) + '\n')
    console.log(`   ✓ Updated name to "${ordered.name}"`)
    console.log(`   ✓ Recorded templateVersion ${templateVersion}`)
  }

  // 6. Update metadata.ts
  console.log('🏷️  Updating metadata...')
  const metadataPath = path.join(__dirname, 'src/app/metadata.ts')
  if (fs.existsSync(metadataPath)) {
    let metadataContent = fs.readFileSync(metadataPath, 'utf8')
    metadataContent = metadataContent.replace(/Genji/g, projectName)
    if (description) {
      metadataContent = metadataContent.replace(
        /Next\.js Web3 starter with passkey auth/g,
        description
      )
    }
    fs.writeFileSync(metadataPath, metadataContent)
    console.log('   ✓ Updated src/app/metadata.ts')
  }

  // 7. Remove deploy.yml
  console.log('🚫 Removing deploy.yml...')
  const deployYmlPath = path.join(__dirname, '.github/workflows/deploy.yml')
  if (fs.existsSync(deployYmlPath)) {
    fs.unlinkSync(deployYmlPath)
    console.log('   ✓ Removed .github/workflows/deploy.yml')
  }

  // 8. Update translations
  console.log('🌐 Updating translations...')
  const translationsPath = path.join(__dirname, 'src/translations/index.ts')
  if (fs.existsSync(translationsPath)) {
    let content = fs.readFileSync(translationsPath, 'utf8')

    // Remove the 'about' entry from every navigation block (the type
    // declaration and each language's translations). The removal is
    // line-based and touches nothing else, so the file stays
    // prettier-clean (trailing commas and formatting are preserved).
    content = content.replace(/(navigation:\s*\{\n)\s*about:[^\n]*\n/g, '$1')

    fs.writeFileSync(translationsPath, content)
    console.log('   ✓ Updated translations (removed about navigation)')
  }

  // 9. Replace header component
  console.log('📋 Replacing header component...')
  const headerPath = path.join(__dirname, 'src/components/Header.tsx')
  if (fs.existsSync(headerPath)) {
    const newHeaderContent = `'use client'

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
              transform={\`translateX(-\${leftSlideValue}px)\`}
              transition="transform 0.5s ease-in-out"
              suppressHydrationWarning
            >
              <Flex align="center" gap={3}>
                <Link href="/">
                  <Heading as="h3" size="md" textAlign="center">
                    ${projectName}
                  </Heading>
                </Link>
              </Flex>
            </Box>

            <Flex
              gap={2}
              align="center"
              transform={\`translateX(\${rightSlideValue}px)\`}
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
`
    fs.writeFileSync(headerPath, newHeaderContent)
    console.log('   ✓ Replaced header component in src/components/Header.tsx')
  }

  // 10. Update settings page metadata
  console.log('⚙️  Updating settings page metadata...')
  const settingsLayoutPath = path.join(__dirname, 'src/app/settings/layout.tsx')
  if (fs.existsSync(settingsLayoutPath)) {
    let settingsLayoutContent = fs.readFileSync(settingsLayoutPath, 'utf8')
    settingsLayoutContent = settingsLayoutContent.replace(/Genji/g, projectName)
    fs.writeFileSync(settingsLayoutPath, settingsLayoutContent)
    console.log('   ✓ Updated src/app/settings/layout.tsx')
  }

  // 11. Update README.md
  console.log('📝 Updating README.md...')
  const readmePath = path.join(__dirname, 'README.md')
  if (fs.existsSync(readmePath)) {
    const newReadmeContent = `[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)

# ${projectName}

${description || '<DESCRIPTION>'}

## Install

\`\`\`bash
pnpm i
\`\`\`

## Run

\`\`\`bash
pnpm dev
\`\`\`

## Build

\`\`\`bash
pnpm build
\`\`\`

## License

GPL-3.0
`
    fs.writeFileSync(readmePath, newReadmeContent)
    console.log('   ✓ Updated README.md')
  }

  // 12. Replace homepage content
  console.log('🏠 Replacing homepage content...')
  const homepagePath = path.join(__dirname, 'src/app/page.tsx')
  if (fs.existsSync(homepagePath)) {
    const newHomepageContent = `'use client'

import { Text, VStack, Box, Heading } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { useW3PK } from '@/context/W3PK'
import { useTranslation } from '@/hooks/useTranslation'
import { useState, useEffect } from 'react'
import { toaster } from '@/components/ui/toaster'

const shimmerStyles = \`
  @keyframes colorWave {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .shimmer-text {
    background: linear-gradient(120deg, #3182ce 0%, #ffffff 25%, #805ad5 50%, #ffffff 75%, #3182ce 100%);
    background-size: 400% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: colorWave 10s ease-in-out infinite;
  }
\`

export default function Home() {
  const { isAuthenticated, user, login, signMessage, deriveWallet, getAddress } = useW3PK()
  const t = useTranslation()
  const [primaryAddress, setPrimaryAddress] = useState<string>('')
  const [mainAddress, setMainAddress] = useState<string>('')
  const [openbarAddress, setOpenbarAddress] = useState<string>('')
  const [isLoadingMain, setIsLoadingMain] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadAddresses = async () => {
      if (!isAuthenticated || !user) {
        return
      }

      try {
        // Load MAIN address
        if (!mainAddress) {
          setIsLoadingMain(true)
          const mainWallet = await deriveWallet('STANDARD', 'MAIN')
          if (cancelled) return
          setMainAddress(mainWallet.address)
          setIsLoadingMain(false)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load addresses:', error)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMain(false)
        }
      }
    }

    loadAddresses()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, user, mainAddress, openbarAddress, primaryAddress, deriveWallet, getAddress])

  const handleSignMessage = async (addressType: string, address: string) => {
    const message = \`Sign this message from \${addressType} address: \${address}\`

    try {
      const signature = await signMessage(message)
      if (signature) {
        toaster.create({
          title: t.home.messageSignedTitle,
          description: t.home.messageSignedDescription(signature),
          type: 'success',
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Failed to sign message:', error)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <VStack gap={8} align="stretch" py={20}>
        <Box p={6} borderRadius="md" textAlign="center">
          {isAuthenticated ? (
            <>
              <Heading as="h1" size="xl" mb={4}>
                {t.home.title}
              </Heading>
              <Text mb={6} color="gray.400">
                {t.home.subtitle}
              </Text>
              <Box h="20px" />
            </>
          ) : (
            <>
              <Heading as="h1" size="xl" mb={4}>
                {t.home.greeting}
              </Heading>
              <Text mb={6} color="gray.400">
                {t.home.greetingSubtitle}
              </Text>
              <Text fontSize="sm" color="gray.500">
                <Button
                  variant="plain"
                  as="span"
                  color="gray.500"
                  textDecorationStyle="dotted"
                  textUnderlineOffset="3px"
                  cursor="pointer"
                  _hover={{ color: 'gray.300' }}
                  onClick={login}
                  fontSize="sm"
                >
                  {t.common.pleaseLogin}{' '}
                </Button>
              </Text>
            </>
          )}
        </Box>

        {isAuthenticated && user && (
          <>
            <VStack gap={4} align="stretch">
              <Box
                as="span"
                fontSize="xl"
                wordBreak="break-all"
                className="shimmer-text"
                textAlign={'center'}
              >
                {isLoadingMain ? t.common.loading : mainAddress || t.common.notAvailable}
              </Box>
              <Box textAlign="center" mt={10}>
                <VStack gap={3}>
                  <Button
                    colorPalette="blue"
                    onClick={() => handleSignMessage('Hello world!', mainAddress)}
                    disabled={!mainAddress}
                    size="sm"
                  >
                    {t.home.signMessage}
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </>
        )}
      </VStack>
    </>
  )
}
`
    fs.writeFileSync(homepagePath, newHomepageContent)
    console.log('   ✓ Replaced homepage content in src/app/page.tsx')
  }

  // 13. Report the recorded template version (written in step 5)
  if (templateVersion) {
    console.log(`\n📌 Template lineage recorded: templateVersion ${templateVersion}`)
    console.log('   Run /genji-sync later to pull in template updates')
  } else {
    console.log('\n⚠ No version in package.json — templateVersion not recorded')
  }

  // 14. Self-destruct - Remove this script and related files
  console.log('🗑️  Removing customization scripts...')
  const scriptPath = path.join(__dirname, 'customize.js')
  const tsScriptPath = path.join(__dirname, 'customize.ts')
  const testScriptPath = path.join(__dirname, 'test-customize.js')

  setTimeout(() => {
    try {
      if (fs.existsSync(scriptPath)) {
        fs.unlinkSync(scriptPath)
        console.log('   ✓ Removed customize.js')
      }
      if (fs.existsSync(tsScriptPath)) {
        fs.unlinkSync(tsScriptPath)
        console.log('   ✓ Removed customize.ts')
      }
      if (fs.existsSync(testScriptPath)) {
        fs.unlinkSync(testScriptPath)
        console.log('   ✓ Removed test-customize.js')
      }

      console.log('\n✅ Customization complete!\n')
      console.log('Next steps:')
      console.log('  1. Review the changes')
      console.log('  2. Run: pnpm install')
      console.log('  3. Run: pnpm dev')
      console.log('\n💡 Your project is ready to build!\n')
    } catch (error) {
      console.error('Warning: Could not remove script files:', error)
      console.log('\nYou can manually delete customize.js and test-customize.js\n')
    }
  }, 100)
}

main().catch(error => {
  console.error('Error:', error)
  process.exit(1)
})
