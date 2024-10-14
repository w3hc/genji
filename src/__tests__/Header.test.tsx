import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from '../components/layout/Header'

jest.mock('@reown/appkit/react', () => ({
  useAppKitAccount: () => ({ isConnected: false }),
}))

describe('Header', () => {
  it('renders the site name', () => {
    render(<Header />)
    const siteName = screen.getByText('Genji')
    expect(siteName).toBeInTheDocument()
  })
})
