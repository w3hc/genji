import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading, Box, Link, Icon, Button, MenuList, MenuItem, Menu, MenuButton, IconButton } from '@chakra-ui/react'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { SITE_NAME } from '../../utils/config'
import { FaGithub } from 'react-icons/fa'
import { useWeb3Modal } from '@web3modal/ethers/react'
import { useWeb3ModalAccount, useDisconnect } from '@web3modal/ethers/react'
import { HamburgerIcon } from '@chakra-ui/icons'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''
  const { open } = useWeb3Modal()
  const { isConnected } = useWeb3ModalAccount()
  const { disconnect } = useDisconnect()

  const handleAuth = async () => {
    if (isConnected) {
      await disconnect()
    } else {
      await open()
    }
  }

  return (
    <Flex as="header" className={className} bg={useColorModeValue('gray.100', 'gray.900')} px={4} py={5} mb={8} alignItems="center">
      <LinkComponent href="/">
        <Heading as="h1" size="md">
          {SITE_NAME}
        </Heading>
      </LinkComponent>

      <Spacer />
      <Menu>
        <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} size={'sm'} mr={4} />
        <MenuList>
          <LinkComponent href="/">
            <MenuItem fontSize="md">Home</MenuItem>
          </LinkComponent>
          <LinkComponent href="/new">
            <MenuItem fontSize="md">New</MenuItem>
          </LinkComponent>
        </MenuList>
      </Menu>
      <Flex alignItems="center" gap={4}>
        <Button onClick={handleAuth} colorScheme="blue" size="sm">
          {isConnected ? 'Logout' : 'Login'}
        </Button>
        <Flex alignItems="center">
          <ThemeSwitcher />
          <Box mt={2} ml={4}>
            <Link href="https://github.com/w3hc/genji" isExternal>
              <Icon as={FaGithub} boxSize={5} _hover={{ color: 'blue.500' }} />
            </Link>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}
