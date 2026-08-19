import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFetch } from './useFetch'
import type { ForecastDay } from '@/types/weather'

describe('useFetch', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts in a loading state with no data or error', () => {
    fetchMock.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useFetch('Madrid'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('exposes the forecast data on a successful request', async () => {
    const forecast: ForecastDay[] = [
      {
        date: '2026-08-19',
        maxTempC: 30,
        minTempC: 18,
        conditionText: 'Sunny',
        conditionIcon: '//cdn/sunny.png',
      },
    ]
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(forecast),
    })

    const { result } = renderHook(() => useFetch('Madrid'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toEqual(forecast)
    expect(result.current.error).toBeNull()
  })

  it('exposes the backend status and message when the request fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          message: 'No weather data found for "Nowhereland"',
        }),
    })

    const { result } = renderHook(() => useFetch('Nowhereland'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toBeNull()
    expect(result.current.error).toEqual({
      status: 404,
      message: 'No weather data found for "Nowhereland"',
    })
  })

  it('exposes a network error when the request itself fails', async () => {
    fetchMock.mockRejectedValue(new Error('network down'))

    const { result } = renderHook(() => useFetch('Madrid'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toBeNull()
    expect(result.current.error).toEqual({ status: 0, message: 'Network error' })
  })

  it('reuses the same request shape when the city changes', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })

    const { rerender } = renderHook(({ city }) => useFetch(city), {
      initialProps: { city: 'Madrid' },
    })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    rerender({ city: 'Barcelona' })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))

    const firstUrl = fetchMock.mock.calls[0][0] as URL
    const secondUrl = fetchMock.mock.calls[1][0] as URL

    expect(firstUrl.pathname).toBe(secondUrl.pathname)
    expect(firstUrl.searchParams.get('city')).toBe('Madrid')
    expect(secondUrl.searchParams.get('city')).toBe('Barcelona')
  })
})
