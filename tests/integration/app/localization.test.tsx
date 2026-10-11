import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { App } from '../../../src/app/App'

describe('Localization & Text Direction Regressions (T043)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.lang = 'en'
    document.documentElement.dir = 'ltr'
  })

  it('switches shell direction and language between English and Arabic', () => {
    render(<App />)

    // Initial state is English LTR
    expect(document.documentElement.lang).toBe('en')
    expect(document.documentElement.dir).toBe('ltr')

    // Find language switcher in primary navigation
    const langBtn = screen.getByRole('button', { name: /switch interface to arabic|تغيير اللغة إلى الإنجليزية/i })
    expect(langBtn).toBeInTheDocument()

    // Toggle to Arabic
    fireEvent.click(langBtn)

    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dir).toBe('rtl')

    // Toggle back to English
    fireEvent.click(langBtn)

    expect(document.documentElement.lang).toBe('en')
    expect(document.documentElement.dir).toBe('ltr')
  })

  it('preserves Arabic Quran text dir="rtl" and English translation dir="ltr" regardless of UI locale', () => {
    window.history.pushState(null, '', '/reader?verse=1:1')
    render(<App />)

    // In English UI
    const arabicElems = screen.getAllByTestId('arabic-text')
    const englishElems = screen.getAllByTestId('english-translation')

    expect(arabicElems[0]).toHaveAttribute('dir', 'rtl')
    expect(arabicElems[0]).toHaveAttribute('lang', 'ar')

    expect(englishElems[0]).toHaveAttribute('dir', 'ltr')
    expect(englishElems[0]).toHaveAttribute('lang', 'en')

    // Switch UI to Arabic
    const langBtn = screen.getByRole('button', { name: /switch interface to arabic|تغيير اللغة إلى الإنجليزية/i })
    fireEvent.click(langBtn)

    // Semantics of parts must NOT change
    expect(arabicElems[0]).toHaveAttribute('dir', 'rtl')
    expect(arabicElems[0]).toHaveAttribute('lang', 'ar')
    expect(englishElems[0]).toHaveAttribute('dir', 'ltr')
    expect(englishElems[0]).toHaveAttribute('lang', 'en')
  })
})
