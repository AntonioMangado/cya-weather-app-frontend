import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders the current value', () => {
    render(<SearchBar value="Madrid" onChange={vi.fn()} onSubmit={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveValue('Madrid')
  })

  it('calls onChange with the new value as the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <SearchBar value="" onChange={onChange} onSubmit={vi.fn()} />,
    )

    await user.type(screen.getByRole('textbox'), 'M')
    expect(onChange).toHaveBeenCalledWith('M')

    rerender(<SearchBar value="M" onChange={onChange} onSubmit={vi.fn()} />)
    await user.type(screen.getByRole('textbox'), 'a')
    expect(onChange).toHaveBeenCalledWith('Ma')
  })

  it('calls onSubmit when Enter is pressed in the input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SearchBar value="Madrid" onChange={vi.fn()} onSubmit={onSubmit} />)

    await user.type(screen.getByRole('textbox'), '{Enter}')

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
