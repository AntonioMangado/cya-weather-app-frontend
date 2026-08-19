import { useState } from 'react'
import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingPlaceholder } from '@/components/LoadingPlaceholder'
import { SearchBar } from '@/components/SearchBar'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

function App() {
  const [city, setCity] = useState('')
  const debouncedCity = useDebounce(city)
  const { isLoading, error } = useFetch(debouncedCity)

  return (
    <div>
      <SearchBar value={city} onChange={setCity} />
      {isLoading && <LoadingPlaceholder />}
      {!isLoading && error && <ErrorMessage message={error.message} />}
    </div>
  )
}

export default App
