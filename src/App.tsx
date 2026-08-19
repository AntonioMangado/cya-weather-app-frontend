import { useState } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { useDebounce } from '@/hooks/useDebounce'
import { useFetch } from '@/hooks/useFetch'

function App() {
  const [city, setCity] = useState('')
  const debouncedCity = useDebounce(city)
  useFetch(debouncedCity)

  return (
    <div>
      <SearchBar value={city} onChange={setCity} />
    </div>
  )
}

export default App
