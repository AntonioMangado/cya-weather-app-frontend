import { useState } from 'react'
import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingPlaceholder } from '@/components/LoadingPlaceholder'
import { SearchBar } from '@/components/SearchBar'
import { WeatherDisplay } from '@/components/WeatherDisplay'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

function App() {
  const [city, setCity] = useState('Madrid')
  const [skipDebounce, setSkipDebounce] = useState(false)
  const debouncedCity = useDebounce(city, skipDebounce ? 0 : 1000)
  const { data, isLoading, error } = useFetch(debouncedCity)

  function handleCityChange(value: string) {
    setSkipDebounce(false)
    setCity(value)
  }

  function handleSubmit() {
    setSkipDebounce(true)
  }

  return (
    <div className="app">
      <SearchBar
        value={city}
        onChange={handleCityChange}
        onSubmit={handleSubmit}
      />
      {isLoading && <LoadingPlaceholder />}
      {!isLoading && error && <ErrorMessage message={error.message} />}
      {!isLoading && !error && data && <WeatherDisplay weather={data} />}
    </div>
  )
}

export default App
