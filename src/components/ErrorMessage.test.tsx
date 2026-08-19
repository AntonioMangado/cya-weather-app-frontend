import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ErrorMessage } from './ErrorMessage'

describe('ErrorMessage', () => {
  it('renders the given message as an alert', () => {
    render(<ErrorMessage message="City not found" />)
    expect(screen.getByRole('alert')).toHaveTextContent('City not found')
  })
})
