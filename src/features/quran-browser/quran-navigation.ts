import type { NavigationTarget } from '../../app/routes'
import { getSurahByNumber, getJuzByNumber, isValidVerseKey } from '../../content/selectors'

/**
 * Return the first verse key of a given Surah (e.g. "1:1")
 */
export function getSurahFirstVerseKey(surahNumber: number): string | null {
  const surah = getSurahByNumber(surahNumber)
  if (!surah) return null
  return `${surah.number}:1`
}

/**
 * Return the startVerseKey of a given Juz (e.g. "2:142" for Juz 2)
 */
export function getJuzStartVerseKey(juzNumber: number): string | null {
  const juz = getJuzByNumber(juzNumber)
  if (!juz) return null
  return juz.startVerseKey
}

/**
 * Validates and resolves navigation actions. If the target is invalid,
 * falls back to safe behavior with an announcement per UI contract.
 */
export function validateAndResolveNavigation(
  target: NavigationTarget
): { target: NavigationTarget; errorAnnouncement?: string } {
  if (target.route === 'reader') {
    if (!target.verseKey || !isValidVerseKey(target.verseKey)) {
      return {
        target: { route: 'browse' },
        errorAnnouncement: 'The requested Quran passage is unavailable. Returned to the Quran browser.',
      }
    }
  }

  return { target }
}
