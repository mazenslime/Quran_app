import { describe, it, expect } from 'vitest'
import { searchQuran, findEnglishHighlightRanges } from '../../../src/features/search/quran-search'

describe('Quran Search Unit Tests (T028)', () => {
  it('returns empty results for empty or whitespace query', () => {
    expect(searchQuran('')).toEqual([])
    expect(searchQuran('   ')).toEqual([])
  })

  it('matches Arabic variants ignoring diacritics and retaining canonical text', () => {
    // Search without tashkeel
    const results = searchQuran('الرحمن')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].matchScope).toBe('arabic')
    // Original text retains canonical Uthmani marks and Alif Waslah
    expect(results[0].arabicText).toContain('ٱلرَّحْمَٰنِ')
    // Highlight ranges are derived accurately
    expect(results[0].highlightRanges.length).toBeGreaterThan(0)
    const { start, end } = results[0].highlightRanges[0]
    expect(start).toBeGreaterThanOrEqual(0)
    expect(end).toBeGreaterThan(start)
  })

  it('matches English translation case-insensitively and returns highlight ranges', () => {
    const results = searchQuran('Merciful', { scope: 'english' })
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].matchScope).toBe('english')
    expect(results[0].englishTranslation.toLowerCase()).toContain('merciful')
    expect(results[0].highlightRanges.length).toBeGreaterThan(0)
  })

  it('matches Surah identifiers by number and name', () => {
    // Match by Surah number
    const numResults = searchQuran('112', { scope: 'surah-number' })
    expect(numResults.length).toBe(1)
    expect(numResults[0].surahNumber).toBe(112)
    expect(numResults[0].verseKey).toBe('112:1')

    // Match by Surah English name
    const nameResults = searchQuran('Ikhlas', { scope: 'surah-name' })
    expect(nameResults.length).toBeGreaterThan(0)
    expect(nameResults[0].surahNumber).toBe(112)

    // Match by Surah Arabic name
    const arNameResults = searchQuran('الإخلاص', { scope: 'surah-name' })
    expect(arNameResults.length).toBeGreaterThan(0)
    expect(arNameResults[0].surahNumber).toBe(112)
  })

  it('filters results by match scope', () => {
    const arabicOnly = searchQuran('الله', { scope: 'arabic' })
    expect(arabicOnly.every((r) => r.matchScope === 'arabic')).toBe(true)

    const englishOnly = searchQuran('Lord', { scope: 'english' })
    expect(englishOnly.every((r) => r.matchScope === 'english')).toBe(true)
  })

  it('returns empty array when no results match', () => {
    const noResults = searchQuran('xyznonexistentquery999')
    expect(noResults).toEqual([])
  })

  it('findEnglishHighlightRanges identifies correct start and end indices', () => {
    const text = 'Praise be to Allah, Lord of the worlds'
    const ranges = findEnglishHighlightRanges(text, 'Lord')
    expect(ranges).toEqual([{ start: 20, end: 24 }])
  })
})
