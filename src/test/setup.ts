import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  localStorage.clear()
})
Object.defineProperty(window, 'scrollTo', { writable: true, value: () => {} })
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
})
