import React from 'react'
import { render, screen } from '../utils/test-utils'
import { Header } from '@/components/Header'
import '@testing-library/jest-dom'

describe('Header', () => {
  it('exists in the document', () => {
    render(<Header />)
    expect(document.querySelector('header')).toBeInTheDocument()
  })
})
