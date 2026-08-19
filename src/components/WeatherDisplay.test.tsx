import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WeatherDisplay } from './WeatherDisplay'
import type { ForecastDay } from '@/types/weather'

const forecast: ForecastDay[] = [
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
]

describe('WeatherDisplay', () => {
  it('renders the first day as the main box and the rest as forecast boxes', () => {
    const { container } = render(<WeatherDisplay forecast={forecast} />)

    expect(
      container.querySelectorAll('.weather-box--main'),
    ).toHaveLength(1)
    expect(
      container.querySelectorAll('.weather-box--forecast'),
    ).toHaveLength(3)
    expect(screen.getByRole('img', { name: 'Sunny' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Cloudy' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Rainy' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Windy' })).toBeInTheDocument()
  })

  it('renders nothing when the forecast is empty', () => {
    const { container } = render(<WeatherDisplay forecast={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
