interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      className="search-bar"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search for a city..."
      aria-label="City search"
    />
  )
}
