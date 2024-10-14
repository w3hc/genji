import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from '../components/layout/Header'

// Mock the useWeb3Modal hook
jest.mock('@web3modal/ethers/react', () => ({
  useWeb3Modal: () => ({ open: jest.fn() }),
  useWeb3ModalAccount: () => ({ isConnected: false }),
  useDisconnect: () => ({ disconnect: jest.fn() }),
}))

describe('Header', () => {
  it('renders the site name', () => {
    render(<Header />)
    const siteName = screen.getByText('Genji')
    expect(siteName).toBeInTheDocument()
  })

  it('renders the login button when not connected', () => {
    render(<Header />)
    const loginButton = screen.getByText('Login')
    expect(loginButton).toBeInTheDocument()
  })

  // Add more tests here
})
