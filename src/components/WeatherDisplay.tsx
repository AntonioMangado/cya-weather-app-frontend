import type { ForecastDay } from '@/types/weather'
import { WeatherBox } from './WeatherBox'

interface WeatherDisplayProps {
  forecast: ForecastDay[]
}

export function WeatherDisplay({ forecast }: WeatherDisplayProps) {
  const [today, ...upcoming] = forecast

  if (!today) {
    return null
  }

  return (
    <div className="weather-results">
      <WeatherBox day={today} variant="main" />
      <div className="forecast-list">
        {upcoming.map((day) => (
          <WeatherBox key={day.date} day={day} variant="forecast" />
        ))}
      </div>
    </div>
  )
}
