interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <form
      className="search-bar-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <input
        type="text"
        className="search-bar"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for a city..."
        aria-label="City search"
      />
    </form>
  )
}
