import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WeatherBox } from './WeatherBox'
import type { ForecastDay, Location } from '@/types/weather'

const day: ForecastDay = {
  date: '2026-08-19',
  maxTempC: 30.4,
  minTempC: 17.6,
  conditionText: 'Sunny',
  conditionIcon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
}

const location: Location = { city: 'Madrid', countryInitials: 'SP' }

describe('WeatherBox', () => {
  it('displays the date, rounded max/min temps, and the condition icon', () => {
    render(<WeatherBox day={day} variant="main" />)

    expect(screen.getByText('Wed, Aug 19')).toBeInTheDocument()
    expect(screen.getByText('Max: 30°C')).toBeInTheDocument()
    expect(screen.getByText('Min: 18°C')).toBeInTheDocument()

    const icon = screen.getByRole('img', { name: 'Sunny' })
    expect(icon).toHaveAttribute('src', day.conditionIcon)
  })

  it('displays the city and country initials when a location is given', () => {
    render(<WeatherBox day={day} variant="main" location={location} />)
    expect(screen.getByText('Madrid, SP')).toBeInTheDocument()
  })

  it('omits the location line when none is given', () => {
    render(<WeatherBox day={day} variant="forecast" />)
    expect(screen.queryByText(/SP/)).not.toBeInTheDocument()
  })

  it('applies the given variant class', () => {
    const { container, rerender } = render(
      <WeatherBox day={day} variant="main" />,
    )
    expect(container.firstChild).toHaveClass('weather-box--main')

    rerender(<WeatherBox day={day} variant="forecast" />)
    expect(container.firstChild).toHaveClass('weather-box--forecast')
  })
})
