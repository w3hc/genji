'use client'

import { Heading, Text, Box, VStack, HStack, Flex, Link, Icon, List } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { brandColors } from '@/theme'
import { FaGithub, FaNpm } from 'react-icons/fa'
import { useState } from 'react'
import { toaster } from '@/components/ui/toaster'
import { useTranslation } from '@/hooks/useTranslation'

export default function About() {
  const t = useTranslation()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      toaster.create({
        title: t.about.invalidEmailTitle,
        description: t.about.invalidEmailDescription,
        type: 'error',
        duration: 3000,
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toaster.create({
          title: t.about.subscribeSuccessTitle,
          description: t.about.subscribeSuccessDescription,
          type: 'success',
          duration: 3000,
        })
        setEmail('')
      } else {
        throw new Error('Subscription failed')
      }
    } catch (error) {
      toaster.create({
        title: t.about.subscribeErrorTitle,
        description: t.about.subscribeErrorDescription,
        type: 'error',
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <VStack gap={8} align="stretch" py={20}>
      <Heading size="xl" textAlign="center">
        {t.about.headingPrefix}{' '}
        <Text as="span" color={brandColors.accent}>
          w3pk
        </Text>
      </Heading>

      <Text fontSize="lg">
        {t.about.introPart1}{' '}
        <Link
          href="https://github.com/w3hc/genji"
          target="_blank"
          rel="noopener noreferrer"
          color={brandColors.accent}
          _hover={{ color: '#3691e7' }}
        >
          Genji
        </Link>{' '}
        {t.about.introPart2}
      </Text>

      {/* Email Subscription Box */}
      <Box p={6} borderRadius="lg" bg="gray.900" borderWidth="1px" borderColor="gray.700">
        <Text fontSize="sm" color="gray.300" mb={4}>
          {t.about.emailBoxText}
        </Text>
        <HStack gap={3}>
          <Input
            placeholder={t.about.emailPlaceholder}
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
            bg="gray.800"
            borderColor="gray.600"
            pl={3}
            _hover={{ borderColor: 'gray.500' }}
            _focus={{
              borderColor: brandColors.accent,
              boxShadow: `0 0 0 1px ${brandColors.accent}`,
            }}
          />
          <Button
            onClick={handleEmailSubmit}
            loading={isSubmitting}
            bg={brandColors.accent}
            color="white"
            _hover={{ bg: '#3691e7' }}
            _active={{ bg: '#2780d6' }}
            px={8}
          >
            {t.about.subscribeButton}
          </Button>
        </HStack>
      </Box>

      <Box pt={6} pb={12}>
        {/* Social Links */}
        <HStack mt={20} gap={6} justify="center" py={4} borderColor="gray.800">
          <Link
            href="https://github.com/w3hc/w3pk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.about.githubAriaLabel}
          >
            <Flex
              align="center"
              gap={3}
              px={6}
              py={3}
              borderRadius="md"
              bg="gray.800"
              minW="140px"
              justify="center"
              _hover={{
                bg: 'gray.700',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(69, 162, 248, 0.3)',
              }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Icon as={FaGithub} boxSize={6} color={brandColors.accent} />
              <Text fontSize="md" fontWeight="medium">
                {t.about.githubLabel}
              </Text>
            </Flex>
          </Link>

          <Link
            href="https://www.npmjs.com/package/w3pk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.about.npmAriaLabel}
          >
            <Flex
              align="center"
              gap={3}
              px={6}
              py={3}
              borderRadius="md"
              bg="gray.800"
              minW="140px"
              justify="center"
              _hover={{
                bg: 'gray.700',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(140, 28, 132, 0.3)',
              }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Icon as={FaNpm} boxSize={6} color={brandColors.primary} />
              <Text fontSize="md" fontWeight="medium">
                {t.about.npmLabel}
              </Text>
            </Flex>
          </Link>
        </HStack>
      </Box>

      {/* Code Showcase */}
      <Box mt={3} borderRadius="3xl" overflow="hidden" position="relative">
        <Box bg="gray.900" p={12} fontFamily="monospace" fontSize="md">
          <Text color="#ffffff" mb={1}>
            <Text as="span" color="#ffffff">
              import
            </Text>{' '}
            {'{ '}
            <Text as="span" color={brandColors.accent}>
              createWeb3Passkey
            </Text>
            {' }'}{' '}
            <Text as="span" color="#ffffff">
              from
            </Text>{' '}
            <Text as="span" color={brandColors.primary}>
              &apos;w3pk&apos;
            </Text>
          </Text>
          <Text mb={2}>&nbsp;</Text>
          <Text color="#ffffff" mb={2}>
            <Text as="span" color="#ffffff">
              const
            </Text>{' '}
            <Text as="span" color={brandColors.accent}>
              w3pk
            </Text>{' '}
            <Text as="span" color="#9ca3af">
              =
            </Text>{' '}
            <Text as="span" color={brandColors.accent}>
              createWeb3Passkey
            </Text>
            <Text as="span" color="#ffffff">
              ()
            </Text>
          </Text>
          <Text mb={2}>&nbsp;</Text>
          <Text color="#6b7280" mb={1}>
            {t.about.codeRegisterComment}
          </Text>
          <Text color="#ffffff" mb={1}>
            <Text as="span" color="#ffffff">
              await
            </Text>{' '}
            <Text as="span" color={brandColors.accent}>
              w3pk
            </Text>
            <Text as="span" color="#ffffff">
              .
            </Text>
            <Text as="span" color={brandColors.accent}>
              register
            </Text>
            <Text as="span" color="#ffffff">
              ({'{'}
            </Text>
          </Text>
          <Text color="#ffffff" ml={4} mb={1}>
            <Text as="span" color="#ffffff">
              username
            </Text>
            <Text as="span" color="#9ca3af">
              :{' '}
            </Text>
            <Text as="span" color={brandColors.primary}>
              &apos;alice&apos;
            </Text>
          </Text>
          <Text color="#9ca3af" ml={4} mb={1}></Text>
          <Text color="#ffffff" mb={2}>
            {'}'})
          </Text>
          <Text mb={2}>&nbsp;</Text>
          <Text color="#6b7280" mb={1}>
            {t.about.codeLoginComment}
          </Text>
          <Text color="#ffffff" mb={1}>
            <Text as="span" color="#ffffff">
              await
            </Text>{' '}
            <Text as="span" color={brandColors.accent}>
              w3pk
            </Text>
            <Text as="span" color="#ffffff">
              .
            </Text>
            <Text as="span" color={brandColors.accent}>
              login
            </Text>
            <Text as="span" color="#ffffff">
              ()
            </Text>
          </Text>
          <Text mb={2}>&nbsp;</Text>
          <Text color="#6b7280" mb={1}>
            {t.about.codeLogoutComment}
          </Text>
          <Text color="#ffffff">
            <Text as="span" color="#ffffff">
              await
            </Text>{' '}
            <Text as="span" color={brandColors.accent}>
              w3pk
            </Text>
            <Text as="span" color="#ffffff">
              .
            </Text>
            <Text as="span" color={brandColors.accent}>
              logout
            </Text>
            <Text as="span" color="#ffffff">
              ()
            </Text>
          </Text>
        </Box>
      </Box>

      {/* Features List */}
      <Box mt={12}>
        <Heading size="xl" mb={6}>
          {t.about.featuresHeading}
        </Heading>
        <List.Root
          gap={2}
          fontSize="lg"
          pl={6}
          css={{
            '& li::marker': {
              color: brandColors.primary,
            },
          }}
        >
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature1}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature2}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature3}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature4}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature5}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature6}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature7}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature8}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature9}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature10}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature11}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature12}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature13}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature14}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature15}
          </List.Item>
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature16}
          </List.Item>
          {/* AI Inspection feature (disabled)
          <List.Item
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: brandColors.accent }}
          >
            {t.about.feature17}
          </List.Item>
          */}
        </List.Root>
      </Box>
    </VStack>
  )
}
