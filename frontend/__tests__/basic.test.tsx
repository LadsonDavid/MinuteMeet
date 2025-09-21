import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Basic test to ensure Jest is working
describe('MinuteMeet Frontend', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true)
  })

  it('should have proper test environment', () => {
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
  })
})
