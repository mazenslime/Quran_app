import { describe, it, expect } from 'vitest'
import {
  getAllSurahs,
  getSurahByNumber,
  getAllJuzs,
  getJuzByNumber,
  getVerseByKey,
  parseVerseKey,
  isValidVerseKey,
  getVersesBySurah,
  getVersesByJuz,
  getAdjacentVerses,
  resolveSafeLocation,
} from '../../../src/content/selectors'

describe('Content Selectors', () => {
  it('retrieves all 114 Surahs and supports all three browse orders', () => {
    const mushafSurahs = getAllSurahs('mushaf')
    expect(mushafSurahs).toHaveLength(114)
    expect(mushafSurahs[0].number).toBe(1)
    expect(mushafSurahs[113].number).toBe(114)

    const revelationSurahs = getAllSurahs('revelation')
    expect(revelationSurahs).toHaveLength(114)
    // First revealed was Al-Alaq (Surah 96)
    expect(revelationSurahs[0].number).toBe(96)
    expect(revelationSurahs[0].revelationOrder).toBe(1)

    const juzSurahs = getAllSurahs('juz')
    expect(juzSurahs).toHaveLength(114)
  })

  it('retrieves Surah by number and handles invalid numbers', () => {
    const fatihah = getSurahByNumber(1)
    expect(fatihah).toBeDefined()
    expect(fatihah?.englishName).toBe('Al-Faatiha')
    expect(fatihah?.verseCount).toBe(7)

    const invalid = getSurahByNumber(115)
    expect(invalid).toBeUndefined()
  })

  it('retrieves verse by key and handles invalid keys', () => {
    const verse = getVerseByKey('1:1')
    expect(verse).toBeDefined()
    expect(verse?.verseKey).toBe('1:1')
    expect(verse?.arabicText).toBeDefined()

    const invalid = getVerseByKey('999:999')
    expect(invalid).toBeUndefined()
  })

  it('retrieves all 30 Juzs with valid start verse keys', () => {
    const allJuz = getAllJuzs()
    expect(allJuz).toHaveLength(30)
    expect(allJuz[0].number).toBe(1)
    expect(allJuz[0].startVerseKey).toBe('1:1')
    expect(allJuz[1].number).toBe(2)
    expect(allJuz[1].startVerseKey).toBe('2:142')

    const invalidJuz = getJuzByNumber(31)
    expect(invalidJuz).toBeUndefined()
  })

  it('parses and validates verse keys accurately', () => {
    expect(parseVerseKey('1:1')).toEqual({ surahNumber: 1, ayahNumber: 1 })
    expect(parseVerseKey('114:6')).toEqual({ surahNumber: 114, ayahNumber: 6 })
    expect(parseVerseKey('invalid')).toBeNull()
    expect(parseVerseKey('')).toBeNull()

    expect(isValidVerseKey('1:1')).toBe(true)
    expect(isValidVerseKey('1:7')).toBe(true)
    expect(isValidVerseKey('1:8')).toBe(false)
    expect(isValidVerseKey('114:6')).toBe(true)
    expect(isValidVerseKey('114:7')).toBe(false)
    expect(isValidVerseKey('invalid')).toBe(false)
  })

  it('retrieves verses by Surah and Juz', () => {
    const surah1Verses = getVersesBySurah(1)
    expect(surah1Verses).toHaveLength(7)
    expect(surah1Verses[0].verseKey).toBe('1:1')

    const juz1Verses = getVersesByJuz(1)
    expect(juz1Verses.length).toBeGreaterThan(0)
    expect(juz1Verses[0].verseKey).toBe('1:1')
  })

  it('computes adjacent verses across and within Surahs', () => {
    // Beginning of Quran
    const first = getAdjacentVerses('1:1')
    expect(first.previousVerseKey).toBeNull()
    expect(first.nextVerseKey).toBe('1:2')

    // Transition between Surahs
    const endOfFatihah = getAdjacentVerses('1:7')
    expect(endOfFatihah.previousVerseKey).toBe('1:6')
    expect(endOfFatihah.nextVerseKey).toBe('2:1')

    const startOfBaqarah = getAdjacentVerses('2:1')
    expect(startOfBaqarah.previousVerseKey).toBe('1:7')
    expect(startOfBaqarah.nextVerseKey).toBe('2:2')

    // End of Quran
    const last = getAdjacentVerses('114:6')
    expect(last.previousVerseKey).toBe('114:5')
    expect(last.nextVerseKey).toBeNull()
  })

  it('recovers safely to 1:1 on invalid or unavailable locations', () => {
    const valid = resolveSafeLocation('2:255')
    expect(valid.isFallback).toBe(false)
    expect(valid.verse.verseKey).toBe('2:255')

    const fallbackInvalid = resolveSafeLocation('999:999')
    expect(fallbackInvalid.isFallback).toBe(true)
    expect(fallbackInvalid.verse.verseKey).toBe('1:1')

    const fallbackNull = resolveSafeLocation(null)
    expect(fallbackNull.isFallback).toBe(true)
    expect(fallbackNull.verse.verseKey).toBe('1:1')
  })
})
