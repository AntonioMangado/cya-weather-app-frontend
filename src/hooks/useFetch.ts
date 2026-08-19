import { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/config/api'
import type { ForecastDay } from '@/types/weather'

export interface FetchError {
  status: number
  message: string
}

interface UseFetchResult {
  data: ForecastDay[] | null
  isLoading: boolean
  error: FetchError | null
}

export function useFetch(city: string): UseFetchResult {
  const [data, setData] = useState<ForecastDay[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<FetchError | null>(null)

  useEffect(() => {
    if (!city) {
      return
    }

    const controller = new AbortController()

    async function fetchForecast() {
      setIsLoading(true)
      setError(null)

      try {
        const url = new URL('/weather', API_BASE_URL)
        url.searchParams.set('city', city)

        const response = await fetch(url, { signal: controller.signal })
        const body: unknown = await response.json()

        if (!response.ok) {
          if (!controller.signal.aborted) {
            const message =
              typeof body === 'object' && body && 'message' in body
                ? String((body as { message: unknown }).message)
                : 'Request failed'
            setError({ status: response.status, message })
            setData(null)
          }
          return
        }

        if (!controller.signal.aborted) {
          setData(body as ForecastDay[])
        }
      } catch {
        if (!controller.signal.aborted) {
          setError({ status: 0, message: 'Network error' })
          setData(null)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void fetchForecast()

    return () => controller.abort()
  }, [city])

  return { data, isLoading, error }
}
