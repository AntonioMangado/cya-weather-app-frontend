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

  it('renders the search bar pre-filled with Madrid', () => {
    render(<App />)
    expect(screen.getByRole('textbox', { name: /city search/i })).toHaveValue(
      'Madrid',
    )
  })

  it('fetches Madrid immediately on first render, with no debounce delay', () => {
    render(<App />)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = fetchMock.mock.calls[0][0] as URL
    expect(url.searchParams.get('city')).toBe('Madrid')
  })

  it('does not fetch a newly typed city before the debounce delay elapses', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Berlin' },
    })
    act(() => {
      vi.advanceTimersByTime(999)
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('fetches the typed city 1 second after the user stops typing', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Berlin' },
    })
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    const url = fetchMock.mock.calls[1][0] as URL
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

  it('shows a distinct message when the city is not found', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          message: 'No weather data found for "Nowhereland"',
        }),
    })
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Nowhereland' },
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No weather data found for "Nowhereland"',
    )
  })

  it('shows a distinct message for a generic failure', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      json: () =>
        Promise.resolve({
          message: "Couldn't process the weather request, try again later",
        }),
    })
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Berlin' },
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      "Couldn't process the weather request, try again later",
    )
  })

  it('does not show the error message while the request is still loading', () => {
    render(<App />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Berlin' },
    })
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders the weather results on a successful request', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve([
          {
            date: '2026-08-19',
            maxTempC: 30,
            minTempC: 18,
            conditionText: 'Sunny',
            conditionIcon: '//cdn/sunny.png',
          },
          {
            date: '2026-08-20',
            maxTempC: 28,
            minTempC: 17,
            conditionText: 'Cloudy',
            conditionIcon: '//cdn/cloudy.png',
          },
          {
            date: '2026-08-21',
            maxTempC: 26,
            minTempC: 16,
            conditionText: 'Rainy',
            conditionIcon: '//cdn/rainy.png',
          },
          {
            date: '2026-08-22',
            maxTempC: 27,
            minTempC: 16,
            conditionText: 'Windy',
            conditionIcon: '//cdn/windy.png',
          },
        ]),
    })
    render(<App />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByRole('img', { name: 'Sunny' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Cloudy' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Rainy' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Windy' })).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
