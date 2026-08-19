import type { ForecastDay } from '@/types/weather'
import { formatForecastDate } from '@/utils/date'

interface WeatherBoxProps {
  day: ForecastDay
  variant: 'main' | 'forecast'
}

export function WeatherBox({ day, variant }: WeatherBoxProps) {
  return (
    <div className={`weather-box weather-box--${variant}`}>
      <p className="weather-box__date">{formatForecastDate(day.date)}</p>
      <img
        className="weather-box__icon"
        src={day.conditionIcon}
        alt={day.conditionText}
      />
      <p className="weather-box__temps">
        <span className="weather-box__max-temp">
          Max: {Math.round(day.maxTempC)}°C
        </span>
        <span className="weather-box__min-temp">
          Min: {Math.round(day.minTempC)}°C
        </span>
      </p>
    </div>
  )
}
