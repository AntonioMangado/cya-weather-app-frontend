import { useState } from 'react'
import { LoadingPlaceholder } from '@/components/LoadingPlaceholder'
import { SearchBar } from '@/components/SearchBar'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

function App() {
  const [city, setCity] = useState('')
  const debouncedCity = useDebounce(city)
  const { isLoading } = useFetch(debouncedCity)

  return (
    <div>
      <SearchBar value={city} onChange={setCity} />
      {isLoading && <LoadingPlaceholder />}
    </div>
  )
}

export default App
