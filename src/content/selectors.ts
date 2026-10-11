import type { Surah, Juz, Verse, BrowseOrder } from '../types/quran'
import { surahs, juzs, verses } from './quran-bundle'

// Fast index lookups
const surahMap = new Map<number, Surah>(surahs.map((s) => [s.number, s]))
const juzMap = new Map<number, Juz>(juzs.map((j) => [j.number, j]))
const verseMap = new Map<string, Verse>(verses.map((v) => [v.verseKey, v]))

const versesBySurahMap = new Map<number, Verse[]>()
const versesByJuzMap = new Map<number, Verse[]>()

for (const verse of verses) {
  const sList = versesBySurahMap.get(verse.surahNumber) || []
  sList.push(verse)
  versesBySurahMap.set(verse.surahNumber, sList)

  const jList = versesByJuzMap.get(verse.juzNumber) || []
  jList.push(verse)
  versesByJuzMap.set(verse.juzNumber, jList)
}

/**
 * Parse a verse key string into numeric components
 */
export function parseVerseKey(verseKey: string): { surahNumber: number; ayahNumber: number } | null {
  if (!verseKey || typeof verseKey !== 'string') return null
  const parts = verseKey.trim().split(':')
  if (parts.length !== 2) return null

  const surahNumber = parseInt(parts[0], 10)
  const ayahNumber = parseInt(parts[1], 10)

  if (Number.isNaN(surahNumber) || Number.isNaN(ayahNumber)) return null
  return { surahNumber, ayahNumber }
}

/**
 * Check if a verse key exists in the canonical bundle
 */
export function isValidVerseKey(verseKey: string): boolean {
  return verseMap.has(verseKey)
}

/**
 * Get all Surahs in the requested browse order
 */
export function getAllSurahs(browseOrder: BrowseOrder = 'mushaf'): Surah[] {
  const list = [...surahs]
  switch (browseOrder) {
    case 'revelation':
      return list.sort((a, b) => a.revelationOrder - b.revelationOrder)
    case 'juz':
      // Juz order: order by the starting Juz of each Surah, then Surah number
      return list.sort((a, b) => {
        const firstAyahA = versesBySurahMap.get(a.number)?.[0]
        const firstAyahB = versesBySurahMap.get(b.number)?.[0]
        const juzA = firstAyahA?.juzNumber ?? 1
        const juzB = firstAyahB?.juzNumber ?? 1
        if (juzA !== juzB) return juzA - juzB
        return a.number - b.number
      })
    case 'mushaf':
    default:
      return list.sort((a, b) => a.number - b.number)
  }
}

/**
 * Get Surah metadata by number (1..114)
 */
export function getSurahByNumber(surahNumber: number): Surah | undefined {
  return surahMap.get(surahNumber)
}

/**
 * Get all 30 Juz definitions
 */
export function getAllJuzs(): Juz[] {
  return [...juzs].sort((a, b) => a.number - b.number)
}

/**
 * Get Juz by number (1..30)
 */
export function getJuzByNumber(juzNumber: number): Juz | undefined {
  return juzMap.get(juzNumber)
}

/**
 * Get a specific verse by its canonical key
 */
export function getVerseByKey(verseKey: string): Verse | undefined {
  return verseMap.get(verseKey)
}

/**
 * Get all verses belonging to a Surah
 */
export function getVersesBySurah(surahNumber: number): Verse[] {
  return versesBySurahMap.get(surahNumber) || []
}

/**
 * Get all verses belonging to a Juz
 */
export function getVersesByJuz(juzNumber: number): Verse[] {
  return versesByJuzMap.get(juzNumber) || []
}

/**
 * Calculate previous and next verse keys across Surah boundaries
 */
export function getAdjacentVerses(verseKey: string): {
  previousVerseKey: string | null
  nextVerseKey: string | null
} {
  const parsed = parseVerseKey(verseKey)
  if (!parsed || !isValidVerseKey(verseKey)) {
    return { previousVerseKey: null, nextVerseKey: null }
  }

  const { surahNumber, ayahNumber } = parsed
  const currentSurah = surahMap.get(surahNumber)
  if (!currentSurah) {
    return { previousVerseKey: null, nextVerseKey: null }
  }

  // Previous verse
  let previousVerseKey: string | null = null
  if (ayahNumber > 1) {
    previousVerseKey = `${surahNumber}:${ayahNumber - 1}`
  } else if (surahNumber > 1) {
    const prevSurah = surahMap.get(surahNumber - 1)
    if (prevSurah) {
      previousVerseKey = `${prevSurah.number}:${prevSurah.verseCount}`
    }
  }

  // Next verse
  let nextVerseKey: string | null = null
  if (ayahNumber < currentSurah.verseCount) {
    nextVerseKey = `${surahNumber}:${ayahNumber + 1}`
  } else if (surahNumber < 114) {
    nextVerseKey = `${surahNumber + 1}:1`
  }

  return { previousVerseKey, nextVerseKey }
}

/**
 * Resolve a requested verse key safely.
 * If invalid, unavailable, or missing, falls back to 1:1 (Al-Fatihah 1).
 */
export function resolveSafeLocation(verseKey?: string | null): {
  verse: Verse
  surah: Surah
  isFallback: boolean
} {
  if (verseKey && isValidVerseKey(verseKey)) {
    const verse = verseMap.get(verseKey)!
    const surah = surahMap.get(verse.surahNumber)!
    return { verse, surah, isFallback: false }
  }

  // Fallback to 1:1
  const defaultVerse = verseMap.get('1:1')!
  const defaultSurah = surahMap.get(1)!
  return {
    verse: defaultVerse,
    surah: defaultSurah,
    isFallback: true,
  }
}
