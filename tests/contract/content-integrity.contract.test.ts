import { describe, it, expect } from 'vitest'
import { quranBundle, manifest, surahs, juzs, verses } from '../../src/content/quran-bundle'
import { validateQuranBundle } from '../../src/content/validate-content'

describe('Content Integrity and Bundle Contract', () => {
  it('validates the complete bundle with zero errors', () => {
    const result = validateQuranBundle(quranBundle)
    expect(result.errors).toEqual([])
    expect(result.valid).toBe(true)
    expect(result.stats?.surahCount).toBe(114)
    expect(result.stats?.juzCount).toBe(30)
    expect(result.stats?.verseCount).toBe(6236)
    expect(verses.length).toBe(6236)
  })

  it('validates manifest provenance and attribution', () => {
    expect(manifest.version).toBe('1.0.0')
    expect(manifest.licence).toBeTruthy()
    expect(manifest.attribution).toContain('Tanzil')
    expect(manifest.attribution).toContain('Saheeh International')
    expect(manifest.contentHash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('validates 114 Surahs with bounds and classifications', () => {
    expect(surahs).toHaveLength(114)
    const numbers = surahs.map((s) => s.number)
    expect(Math.min(...numbers)).toBe(1)
    expect(Math.max(...numbers)).toBe(114)

    for (const surah of surahs) {
      expect(['makki', 'madani']).toContain(surah.revelationPlace)
      expect(surah.verseCount).toBeGreaterThan(0)
    }
  })

  it('validates 30 Juzs with start positions', () => {
    expect(juzs).toHaveLength(30)
    expect(juzs[0].startVerseKey).toBe('1:1')
    expect(juzs[1].startVerseKey).toBe('2:142')
  })

  it('detects invalid bundle data correctly', () => {
    const corruptedBundle = {
      ...quranBundle,
      surahs: [{ ...surahs[0], verseCount: 999 }],
    }
    const result = validateQuranBundle(corruptedBundle as any)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})
