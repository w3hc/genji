import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/pages/index'

describe('Home page', () => {
  it('renders the mint button', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /mint/i })
    expect(button).toBeInTheDocument()
  })
})
