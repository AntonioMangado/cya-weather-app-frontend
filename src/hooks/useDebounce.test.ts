import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('madrid'))
    expect(result.current).toBe('madrid')
  })

  it('does not update the value before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'madrid' } },
    )

    rerender({ value: 'barcelona' })
    act(() => {
      vi.advanceTimersByTime(999)
    })

    expect(result.current).toBe('madrid')
  })

  it('updates the value 1 second after the last change', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'madrid' } },
    )

    rerender({ value: 'barcelona' })
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current).toBe('barcelona')
  })

  it('resets the delay when the value changes again before it elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'madrid' } },
    )

    rerender({ value: 'barcelona' })
    act(() => {
      vi.advanceTimersByTime(700)
    })
    rerender({ value: 'seville' })
    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(result.current).toBe('madrid')

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('seville')
  })
})
