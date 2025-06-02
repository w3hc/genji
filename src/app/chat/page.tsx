'use client'

import { Container, Text, Button, VStack, Box, useToast, Image, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [showInput, setShowInput] = useState(true)

  const toast = useToast()
  const t = useTranslation()

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    setShowInput(false)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      setResponse(data.response)
    } catch (error) {
      console.error('Chat error:', error)
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : "Échec de l'envoi du message",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })

      setShowInput(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetChat = () => {
    setMessage('')
    setResponse('')
    setShowInput(true)
    setIsLoading(false)
  }

  return (
    <main>
      <Container
        maxW="container.sm"
        py={20}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={6} align="stretch" width="100%">
          <Box bg="whiteAlpha.100" p={6} borderRadius="md" minH="200px">
            {showInput && !isLoading && !response && (
              <VStack spacing={4}>
                <Input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message ici..."
                  size="lg"
                  bg="whiteAlpha.200"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px #805AD5',
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  bg="blue.600"
                  color="white"
                  _hover={{
                    bg: 'purple.700',
                  }}
                  size="lg"
                  width="full"
                  isDisabled={!message.trim()}
                >
                  Envoyer
                </Button>
              </VStack>
            )}

            {isLoading && (
              <Box display="flex" justifyContent="center" alignItems="center" minH="150px">
                <Image src="/loader.svg" alt="Loading..." width="159px" height="150px" />
              </Box>
            )}

            {response && !isLoading && (
              <VStack spacing={4} align="stretch">
                <Box
                  bg="blue.900"
                  p={4}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="purple.600"
                >
                  <Text fontSize="lg" color="white">
                    {response}
                  </Text>
                </Box>
                <Button onClick={resetChat} variant="outline" colorScheme="purple" size="sm">
                  Nouveau message
                </Button>
              </VStack>
            )}
          </Box>
        </VStack>
      </Container>
    </main>
  )
}
