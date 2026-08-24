import { Flex } from '@chakra-ui/react'
import Spinner from '@/components/Spinner'

export default function Loading() {
  return (
    <Flex align="center" justify="center" minH="60vh">
      <Spinner size={200} />
    </Flex>
  )
}
