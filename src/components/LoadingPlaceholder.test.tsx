import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoadingPlaceholder } from './LoadingPlaceholder'

describe('LoadingPlaceholder', () => {
  it('announces the loading state', () => {
    render(<LoadingPlaceholder />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders one main placeholder box and three forecast placeholder boxes', () => {
    const { container } = render(<LoadingPlaceholder />)

    expect(
      container.querySelectorAll('.weather-box--main.weather-box--placeholder'),
    ).toHaveLength(1)
    expect(
      container.querySelectorAll(
        '.weather-box--forecast.weather-box--placeholder',
      ),
    ).toHaveLength(3)
  })
})
