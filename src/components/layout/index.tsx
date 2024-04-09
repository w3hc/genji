import { Web3Modal } from '../../context/web3modal'
import { ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

export default function RootLayout({ children }: Props) {
  return <Web3Modal>{children}</Web3Modal>
}
