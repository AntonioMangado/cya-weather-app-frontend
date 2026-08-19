import type { WeatherResponse } from '@/types/weather'
import { WeatherBox } from './WeatherBox'

interface WeatherDisplayProps {
  weather: WeatherResponse
}

export function WeatherDisplay({ weather }: WeatherDisplayProps) {
  const [today, ...upcoming] = weather.forecast

  if (!today) {
    return null
  }

  return (
    <div className="weather-results">
      <WeatherBox day={today} variant="main" location={weather.location} />
      <div className="forecast-list">
        {upcoming.map((day) => (
          <WeatherBox key={day.date} day={day} variant="forecast" />
        ))}
      </div>
    </div>
  )
}
