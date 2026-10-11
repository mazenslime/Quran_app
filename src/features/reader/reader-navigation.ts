import {
  getAdjacentVerses,
  resolveSafeLocation,
} from '../../content/selectors'
import type { Verse, Surah } from '../../types/quran'

export interface ReaderLocationInfo {
  verse: Verse
  surah: Surah
  previousVerseKey: string | null
  nextVerseKey: string | null
  isFallback: boolean
}

/**
 * Resolve all reader location details for a given verseKey
 */
export function getReaderLocation(verseKey?: string | null): ReaderLocationInfo {
  const { verse, surah, isFallback } = resolveSafeLocation(verseKey)
  const { previousVerseKey, nextVerseKey } = getAdjacentVerses(verse.verseKey)

  return {
    verse,
    surah,
    previousVerseKey,
    nextVerseKey,
    isFallback,
  }
}

/**
 * Jump to next verse
 */
export function getNextLocation(currentVerseKey: string): string | null {
  return getAdjacentVerses(currentVerseKey).nextVerseKey
}

/**
 * Jump to previous verse
 */
export function getPreviousLocation(currentVerseKey: string): string | null {
  return getAdjacentVerses(currentVerseKey).previousVerseKey
}
