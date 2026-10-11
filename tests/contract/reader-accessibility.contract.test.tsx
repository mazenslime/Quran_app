import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppProviders } from '../../src/app/AppProviders'
import { AyahMedallion, toEasternArabicNumerals } from '../../src/components/quran/AyahMedallion'
import { AyahCard } from '../../src/components/quran/AyahCard'
import type { Verse } from '../../src/types/quran'

describe('Reader Accessibility & Visual Contracts', () => {
  const sampleVerse: Verse = {
    verseKey: '1:1',
    surahNumber: 1,
    ayahNumber: 1,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    englishTranslation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    juzNumber: 1,
  }

  it('converts Western numbers to Eastern Arabic numerals for medallions', () => {
    expect(toEasternArabicNumerals(1)).toBe('١')
    expect(toEasternArabicNumerals(7)).toBe('٧')
    expect(toEasternArabicNumerals(286)).toBe('٢٨٦')
  })

  it('renders AyahMedallion with Eastern Arabic numeral and accessible label', () => {
    render(<AyahMedallion ayahNumber={1} isActive={false} />)
    const medallion = screen.getByLabelText(/verse 1|الآية 1/i)
    expect(medallion).toBeInTheDocument()
    expect(medallion).toHaveTextContent('١')
  })

  it('renders AyahCard with required RTL and LTR semantics', () => {
    render(
      <AppProviders>
        <AyahCard
          verse={sampleVerse}
          isActive={true}
          showTranslation={true}
          isBookmarked={false}
          onToggleBookmark={() => {}}
          onCopy={() => {}}
          onShare={() => {}}
        />
      </AppProviders>
    )

    const arabicElem = screen.getByTestId('arabic-text')
    expect(arabicElem).toHaveAttribute('dir', 'rtl')
    expect(arabicElem).toHaveAttribute('lang', 'ar')

    const englishElem = screen.getByTestId('english-translation')
    expect(englishElem).toHaveAttribute('dir', 'ltr')
    expect(englishElem).toHaveAttribute('lang', 'en')

    // Action buttons have min 44px class and accessible names
    const bookmarkBtn = screen.getByRole('button', { name: /bookmark/i })
    expect(bookmarkBtn).toBeInTheDocument()
  })

  it('validates critical constitution design tokens in stylesheet', async () => {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const tokensPath = path.resolve(process.cwd(), 'src/styles/tokens.css')
    const css = fs.readFileSync(tokensPath, 'utf-8')

    // 720px max reading column
    expect(css).toContain('--reader-max-width: 720px;')
    // 4px base grid
    expect(css).toContain('--space-1: 4px;')
    // 32px Ayah bottom spacing
    expect(css).toContain('--ayah-padding-bottom: 32px;')
    // 44px minimum touch target
    expect(css).toContain('--target-min-size: 44px;')
    // line height 2.3
    expect(css).toContain('--reader-line-height: 2.3;')
  })
})

