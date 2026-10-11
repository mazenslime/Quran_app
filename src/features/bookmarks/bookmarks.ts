import type { Verse, Surah } from '../../types/quran'
import { getVerseByKey, getSurahByNumber, isValidVerseKey } from '../../content/selectors'
import { normalizeArabic } from '../../lib/arabic-normalization'

export interface ResolvedBookmark {
  verseKey: string
  verse: Verse
  surah: Surah
}

/**
 * Resolve an array of stored bookmark verse keys into full Verse and Surah entities.
 * Safely filters out stale or unavailable keys.
 */
export function getResolvedBookmarks(bookmarkKeys: string[]): {
  validBookmarks: ResolvedBookmark[]
  staleKeys: string[]
} {
  const validBookmarks: ResolvedBookmark[] = []
  const staleKeys: string[] = []

  for (const key of bookmarkKeys) {
    if (!isValidVerseKey(key)) {
      staleKeys.push(key)
      continue
    }

    const verse = getVerseByKey(key)
    if (!verse) {
      staleKeys.push(key)
      continue
    }

    const surah = getSurahByNumber(verse.surahNumber)
    if (!surah) {
      staleKeys.push(key)
      continue
    }

    validBookmarks.push({
      verseKey: key,
      verse,
      surah,
    })
  }

  return { validBookmarks, staleKeys }
}

/**
 * Filter resolved bookmarks by a user query (verse key, Surah name, or verse text)
 */
export function filterBookmarks(
  bookmarks: ResolvedBookmark[],
  query: string
): ResolvedBookmark[] {
  if (!query || !query.trim()) return bookmarks
  const q = query.trim().toLowerCase()
  const normQ = normalizeArabic(q)

  return bookmarks.filter(({ verse, surah, verseKey }) => {
    if (verseKey.includes(q)) return true
    if (surah.englishName.toLowerCase().includes(q)) return true
    if (surah.englishTranslationName?.toLowerCase().includes(q)) return true
    if (normQ && normalizeArabic(surah.arabicName).includes(normQ)) return true
    if (verse.englishTranslation?.toLowerCase().includes(q)) return true
    if (normQ && normalizeArabic(verse.arabicText).includes(normQ)) return true
    return false
  })
}
