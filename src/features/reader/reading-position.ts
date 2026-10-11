import type { ReadingPosition } from '../../types/guest-state'
import { isValidVerseKey, parseVerseKey, getSurahByNumber } from '../../content/selectors'

/**
 * Reading position manager with debounced persistence
 */
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

export function debounceUpdateReadingPosition(
  verseKey: string,
  onPersist: (verseKey: string, scrollAnchor?: number) => void,
  scrollAnchor?: number,
  delayMs = 300
): void {
  if (!isValidVerseKey(verseKey)) return

  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  debounceTimeout = setTimeout(() => {
    onPersist(verseKey, scrollAnchor)
    debounceTimeout = null
  }, delayMs)
}

/**
 * Format reading position for display (e.g. on Home screen continuation card)
 */
export function formatReadingPosition(
  position: ReadingPosition,
  locale: 'en' | 'ar' = 'en'
): {
  verseKey: string
  surahName: string
  ayahNumber: number
  displayText: string
} | null {
  const parsed = parseVerseKey(position.verseKey)
  if (!parsed || !isValidVerseKey(position.verseKey)) {
    return null
  }

  const surah = getSurahByNumber(parsed.surahNumber)
  if (!surah) return null

  const surahName = locale === 'ar' ? surah.arabicName : surah.englishName
  const ayahNumber = parsed.ayahNumber

  const displayText =
    locale === 'ar'
      ? `${surahName}، الآية ${ayahNumber} (${position.verseKey})`
      : `${surahName}, Ayah ${ayahNumber} (${position.verseKey})`

  return {
    verseKey: position.verseKey,
    surahName,
    ayahNumber,
    displayText,
  }
}
