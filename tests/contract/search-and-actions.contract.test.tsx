import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppProviders } from '../../src/app/AppProviders'
import { SearchPage } from '../../src/features/search/SearchPage'
import { formatVerseText, shareVerse } from '../../src/lib/verse-actions'
import type { Verse } from '../../src/types/quran'

describe('Search and Actions Contracts (T029)', () => {
  const sampleVerse: Verse = {
    verseKey: '1:1',
    surahNumber: 1,
    ayahNumber: 1,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    englishTranslation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    juzNumber: 1,
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('prompts for a query without searching when query is empty', () => {
    const handleNavigate = vi.fn()
    render(
      <AppProviders>
        <SearchPage onNavigate={handleNavigate} />
      </AppProviders>
    )

    // Prompt state visible
    expect(screen.getByText(/Begin Your Search|ابدأ البحث/i)).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()

    // Submitting empty form triggers prompt announcement without navigating
    const submitBtn = screen.getByRole('button', { name: /search|بحث/i })
    fireEvent.click(submitBtn)
    expect(handleNavigate).not.toHaveBeenCalled()
  })

  it('retains user query in search input when no results match', () => {
    const handleNavigate = vi.fn()
    render(
      <AppProviders>
        <SearchPage onNavigate={handleNavigate} />
      </AppProviders>
    )

    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'nonexistentterm9999' } })

    const form = screen.getByRole('search')
    fireEvent.submit(form)

    // Query is retained in the input
    expect(input).toHaveValue('nonexistentterm9999')
    // No results state is displayed
    expect(screen.getByText(/No Results Found|لم يتم العثور على نتائج/i)).toBeInTheDocument()
  })

  it('navigates to reader when valid search result is selected', () => {
    const handleNavigate = vi.fn()
    render(
      <AppProviders>
        <SearchPage initialQuery="Merciful" onNavigate={handleNavigate} />
      </AppProviders>
    )

    const firstResult = screen.getByTestId('search-result-1:1')
    expect(firstResult).toBeInTheDocument()

    fireEvent.click(firstResult)
    expect(handleNavigate).toHaveBeenCalledWith({
      route: 'reader',
      verseKey: '1:1',
    })
  })

  it('formatVerseText formats Arabic, translation, and canonical reference', () => {
    const text = formatVerseText(sampleVerse)
    expect(text).toContain('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')
    expect(text).toContain('"In the name of Allah, the Entirely Merciful, the Especially Merciful."')
    expect(text).toContain('— [Quran 1:1]')
  })

  it('shareVerse falls back to clipboard when Web Share API is absent', async () => {
    // Mock navigator without share
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      share: undefined,
      clipboard: {
        writeText: writeTextMock,
      },
    })

    const result = await shareVerse(sampleVerse, 'https://quran.test')
    expect(result.method).toBe('clipboard')
    expect(result.shared).toBe(true)
    expect(writeTextMock).toHaveBeenCalledWith('https://quran.test/reader?verse=1:1')
  })
})
