import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppProviders } from '../../../src/app/AppProviders'
import { ReaderPage } from '../../../src/features/reader/ReaderPage'

describe('ReaderPage Integration', () => {
  it('renders verses in sequential order with correct semantics', () => {
    render(
      <AppProviders>
        <ReaderPage initialVerseKey="1:1" onNavigate={vi.fn()} />
      </AppProviders>
    )

    // Verify Surah header
    expect(screen.getByRole('heading', { level: 1, name: /Al-Faatiha/i })).toBeInTheDocument()

    // Verify Arabic text has lang="ar" and dir="rtl"
    const arabicVerses = screen.getAllByTestId('arabic-text')
    expect(arabicVerses[0]).toHaveAttribute('lang', 'ar')
    expect(arabicVerses[0]).toHaveAttribute('dir', 'rtl')

    // Verify translation is visible by default
    const translations = screen.getAllByTestId('english-translation')
    expect(translations[0]).toHaveAttribute('lang', 'en')
    expect(translations[0]).toHaveAttribute('dir', 'ltr')
  })

  it('navigates directly to another verse via verse selector', () => {
    render(
      <AppProviders>
        <ReaderPage initialVerseKey="1:1" onNavigate={vi.fn()} />
      </AppProviders>
    )

    const verseSelect = screen.getByRole('combobox', { name: /select verse|اختر الآية/i })
    fireEvent.change(verseSelect, { target: { value: '1:5' } })

    expect(screen.getByTestId('ayah-card-1:5')).toBeInTheDocument()
  })

  it('supports previous and next navigation controls', () => {
    render(
      <AppProviders>
        <ReaderPage initialVerseKey="1:2" onNavigate={vi.fn()} />
      </AppProviders>
    )

    const prevBtn = screen.getByRole('button', { name: /previous verse|الآية السابقة/i })
    const nextBtn = screen.getByRole('button', { name: /next verse|الآية التالية/i })

    expect(prevBtn).toBeInTheDocument()
    expect(nextBtn).toBeInTheDocument()

    // Click next
    fireEvent.click(nextBtn)
    expect(screen.getByTestId('ayah-card-1:3')).toHaveClass('ayah-card--active')
  })

  it('opens reader settings modal and allows toggling translation', () => {
    render(
      <AppProviders>
        <ReaderPage initialVerseKey="1:1" onNavigate={vi.fn()} />
      </AppProviders>
    )

    const settingsBtn = screen.getByRole('button', { name: /settings|الإعدادات/i })
    fireEvent.click(settingsBtn)

    expect(screen.getByRole('dialog', { name: /reader settings|إعدادات القراءة/i })).toBeInTheDocument()

    // Find show/hide translation checkbox
    const translationToggle = screen.getByRole('checkbox', { name: /translation|الترجمة/i })
    fireEvent.click(translationToggle)

    // Now translations should not be displayed
    expect(screen.queryByTestId('english-translation')).not.toBeInTheDocument()
  })
})

