import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading, Box, Link, Icon, Button, MenuList, MenuItem, Menu, MenuButton, IconButton } from '@chakra-ui/react'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { HeadingComponent } from './HeadingComponent'
import { SITE_NAME } from '../../utils/config'
import { FaGithub } from 'react-icons/fa'
import { Web3Modal } from '../../context/web3modal'
import { HamburgerIcon } from '@chakra-ui/icons'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''

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
        <w3m-button />
        {/* <w3m-network-button /> */}{' '}
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
