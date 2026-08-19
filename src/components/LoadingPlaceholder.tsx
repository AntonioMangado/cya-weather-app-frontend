export function LoadingPlaceholder() {
  return (
    <div
      className="weather-results weather-results--loading"
      role="status"
      aria-live="polite"
    >
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">Loading weather…</span>
      <div className="weather-box weather-box--main weather-box--placeholder" />
      <div className="forecast-list">
        <div className="weather-box weather-box--forecast weather-box--placeholder" />
        <div className="weather-box weather-box--forecast weather-box--placeholder" />
        <div className="weather-box weather-box--forecast weather-box--placeholder" />
      </div>
    </div>
  )
}
