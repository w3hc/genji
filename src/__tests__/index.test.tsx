import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../pages/index'

jest.mock('@reown/appkit/react', () => ({
  useAppKitAccount: () => ({ address: null, isConnected: false, caipAddress: null }),
  useAppKitProvider: () => ({ walletProvider: null }),
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
    expect(screen.getByText(/You can login with your email, Google, or with one of many wallets suported by Reown\./)).toBeInTheDocument()
  })

  it('renders the mint button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: /Mint/i })).toBeInTheDocument()
  })
})
