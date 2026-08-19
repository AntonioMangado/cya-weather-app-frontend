export interface ForecastDay {
  date: string
  maxTempC: number
  minTempC: number
  conditionText: string
  conditionIcon: string
}

export interface Location {
  city: string
  countryInitials: string
}

export interface WeatherResponse {
  location: Location
  forecast: ForecastDay[]
}
