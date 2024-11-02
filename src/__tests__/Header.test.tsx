import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/Header'
import '@testing-library/jest-dom'

describe('Header', () => {
  it('exists in the document', () => {
    render(<Header />)
    // Basic test to check if header renders at all
    expect(document.querySelector('header')).toBeInTheDocument()
  })
})
