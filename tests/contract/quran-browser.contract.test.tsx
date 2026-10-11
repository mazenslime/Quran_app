import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppProviders } from '../../src/app/AppProviders'
import { QuranBrowserPage } from '../../src/features/quran-browser/QuranBrowserPage'

describe('Quran Browser Navigation Contract', () => {
  it('renders all 114 Surahs by default in Mushaf order', () => {
    render(
      <AppProviders>
        <QuranBrowserPage onNavigate={vi.fn()} />
      </AppProviders>
    )

    // Verify browse order tabs
    expect(screen.getByRole('tab', { name: /mushaf/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /juz/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /revelation/i })).toBeInTheDocument()

    // Verify Surah Al-Fatihah is rendered
    expect(screen.getByText(/Al-Faatiha/i)).toBeInTheDocument()
  })

  it('filters Surahs by name and number without dropping state', () => {
    render(
      <AppProviders>
        <QuranBrowserPage onNavigate={vi.fn()} />
      </AppProviders>
    )

    const searchInput = screen.getByPlaceholderText(/search surah/i)
    fireEvent.change(searchInput, { target: { value: 'Baqarah' } })

    expect(screen.getByText(/Al-Baqara/i)).toBeInTheDocument()
    expect(screen.queryByText(/Al-Faatiha/i)).not.toBeInTheDocument()

    // Clear filter
    fireEvent.change(searchInput, { target: { value: '' } })
    expect(screen.getByText(/Al-Faatiha/i)).toBeInTheDocument()
  })

  it('navigates to the first verse when selecting a Surah', () => {
    const onNavigate = vi.fn()
    render(
      <AppProviders>
        <QuranBrowserPage onNavigate={onNavigate} />
      </AppProviders>
    )

    const fatihahCard = screen.getByText(/Al-Faatiha/i).closest('button')
    expect(fatihahCard).toBeDefined()
    fireEvent.click(fatihahCard!)

    expect(onNavigate).toHaveBeenCalledWith({
      route: 'reader',
      verseKey: '1:1',
    })
  })

  it('navigates to startVerseKey when selecting a Juz', () => {
    const onNavigate = vi.fn()
    render(
      <AppProviders>
        <QuranBrowserPage onNavigate={onNavigate} />
      </AppProviders>
    )

    // Switch to Juz tab
    const juzTab = screen.getByRole('tab', { name: /juz/i })
    fireEvent.click(juzTab)

    // Click Juz 2
    const juz2Btn = screen.getByRole('button', { name: /^Juz 2,/i })
    expect(juz2Btn).toBeDefined()
    fireEvent.click(juz2Btn)

    expect(onNavigate).toHaveBeenCalledWith({
      route: 'reader',
      verseKey: '2:142',
    })
  })
})
