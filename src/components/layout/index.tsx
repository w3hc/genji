import { Web3Modal } from '../../context/web3modal'

export default function RootLayout({ children }) {
  return (
    <Web3Modal>{children}</Web3Modal>
  )
}