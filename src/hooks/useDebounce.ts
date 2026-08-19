import { useEffect, useState } from 'react'

const DEBOUNCE_DELAY_MS = 1000

export function useDebounce<T>(value: T, delayMs = DEBOUNCE_DELAY_MS): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => clearTimeout(timeoutId)
  }, [value, delayMs])

  return debouncedValue
}
