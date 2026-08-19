import { useState } from 'react'
import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingPlaceholder } from '@/components/LoadingPlaceholder'
import { SearchBar } from '@/components/SearchBar'
import { WeatherDisplay } from '@/components/WeatherDisplay'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

function App() {
  const [city, setCity] = useState('Madrid')
  const debouncedCity = useDebounce(city)
  const { data, isLoading, error } = useFetch(debouncedCity)

  return (
    <div className="app">
      <SearchBar value={city} onChange={setCity} />
      {isLoading && <LoadingPlaceholder />}
      {!isLoading && error && <ErrorMessage message={error.message} />}
      {!isLoading && !error && data && <WeatherDisplay forecast={data} />}
    </div>
  )
}

export default App
