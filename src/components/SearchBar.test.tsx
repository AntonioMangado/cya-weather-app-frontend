import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders the current value', () => {
    render(<SearchBar value="Madrid" onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveValue('Madrid')
  })

  it('calls onChange with the new value as the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<SearchBar value="" onChange={onChange} />)

    await user.type(screen.getByRole('textbox'), 'M')
    expect(onChange).toHaveBeenCalledWith('M')

    rerender(<SearchBar value="M" onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'a')
    expect(onChange).toHaveBeenCalledWith('Ma')
  })
})
