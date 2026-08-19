import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn().mockReturnValue(new Promise(() => {}))
    vi.stubGlobal('fetch', fetchMock)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('renders the search bar', () => {
    render(<App />)
    expect(screen.getByRole('textbox', { name: /city search/i })).toBeInTheDocument()
  })

  it('does not fetch before the debounce delay elapses', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Berlin' },
    })
    act(() => {
      vi.advanceTimersByTime(999)
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('fetches the typed city 1 second after the user stops typing', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Berlin' },
    })
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = fetchMock.mock.calls[0][0] as URL
    expect(url.searchParams.get('city')).toBe('Berlin')
  })
})
