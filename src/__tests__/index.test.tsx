import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../pages/index'

// Mock the necessary hooks and components
jest.mock('@web3modal/ethers/react', () => ({
  useWeb3ModalProvider: () => ({ walletProvider: null }),
  useWeb3ModalAccount: () => ({ address: null, isConnected: false, chainId: null }),
  useWalletInfo: () => ({ walletInfo: null }),
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    }
  },
}))

describe('Home page', () => {
  it('renders the login message when not connected', () => {
    render(<Home />)
    expect(
      screen.getByText(/You can login with your email, Google, Farcaster, or with one of the 400\+ wallets suported by this app\./)
    ).toBeInTheDocument()
  })

  it('renders the mint button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: /Mint/i })).toBeInTheDocument()
  })
})
