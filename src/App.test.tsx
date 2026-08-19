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

  it('shows the loading placeholder while the request is in flight', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Berlin' },
    })
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('hides the loading placeholder as soon as the response arrives', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Berlin' },
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
