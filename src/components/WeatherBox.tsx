import type { ForecastDay, Location } from '@/types/weather'
import { formatForecastDate } from '@/utils/date'

interface WeatherBoxProps {
  day: ForecastDay
  variant: 'main' | 'forecast'
  location?: Location
}

export function WeatherBox({ day, variant, location }: WeatherBoxProps) {
  return (
    <div className={`weather-box weather-box--${variant}`}>
      {location && (
        <p className="weather-box__location">
          {location.city}, {location.countryInitials}
        </p>
      )}
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
