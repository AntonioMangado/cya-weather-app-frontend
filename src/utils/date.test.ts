import { describe, expect, it } from 'vitest'
import { formatForecastDate } from './date'

describe('formatForecastDate', () => {
  it('formats an ISO date as a short weekday, month, and day', () => {
    expect(formatForecastDate('2026-08-19')).toBe('Wed, Aug 19')
  })

  it('does not shift the date across a timezone boundary', () => {
    expect(formatForecastDate('2026-01-01')).toBe('Thu, Jan 1')
    expect(formatForecastDate('2026-12-31')).toBe('Thu, Dec 31')
  })
})
