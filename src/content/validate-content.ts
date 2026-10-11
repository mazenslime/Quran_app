import type { QuranBundle, Surah } from '../types/quran'
import { quranBundle } from './quran-bundle'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  stats?: {
    surahCount: number
    juzCount: number
    verseCount: number
  }
}

export function validateQuranBundle(bundle: QuranBundle = quranBundle): ValidationResult {
  const errors: string[] = []

  if (!bundle) {
    return { valid: false, errors: ['Quran bundle is null or undefined'] }
  }

  // 1. Validate Manifest
  if (!bundle.manifest) {
    errors.push('Manifest is missing')
  } else {
    const requiredManifestFields = [
      'version',
      'source',
      'licence',
      'attribution',
      'translationResourceId',
      'translationName',
      'retrievalDate',
      'contentHash',
    ] as const

    for (const field of requiredManifestFields) {
      if (!bundle.manifest[field]) {
        errors.push(`Manifest missing required field: ${field}`)
      }
    }
  }

  // 2. Validate Surahs (1..114, unique, integer)
  if (!Array.isArray(bundle.surahs)) {
    errors.push('Surahs is not an array')
  } else if (bundle.surahs.length !== 114) {
    errors.push(`Expected 114 Surahs, found ${bundle.surahs.length}`)
  } else {
    const seenSurahNumbers = new Set<number>()
    for (const surah of bundle.surahs) {
      if (!Number.isInteger(surah.number) || surah.number < 1 || surah.number > 114) {
        errors.push(`Surah number must be an integer between 1 and 114, received: ${surah.number}`)
      }
      if (seenSurahNumbers.has(surah.number)) {
        errors.push(`Duplicate Surah number detected: ${surah.number}`)
      }
      seenSurahNumbers.add(surah.number)

      if (!surah.arabicName || typeof surah.arabicName !== 'string') {
        errors.push(`Surah ${surah.number} missing valid arabicName`)
      }
      if (!surah.englishName || typeof surah.englishName !== 'string') {
        errors.push(`Surah ${surah.number} missing valid englishName`)
      }
      if (!Number.isInteger(surah.verseCount) || surah.verseCount < 1) {
        errors.push(`Surah ${surah.number} invalid verseCount: ${surah.verseCount}`)
      }
      if (surah.revelationPlace !== 'makki' && surah.revelationPlace !== 'madani') {
        errors.push(`Surah ${surah.number} invalid revelationPlace: ${surah.revelationPlace}`)
      }
      if (!Number.isInteger(surah.revelationOrder) || surah.revelationOrder < 1) {
        errors.push(`Surah ${surah.number} invalid revelationOrder: ${surah.revelationOrder}`)
      }
    }
  }

  // 3. Validate Juzs (1..30, unique, integer)
  if (!Array.isArray(bundle.juzs)) {
    errors.push('Juzs is not an array')
  } else if (bundle.juzs.length !== 30) {
    errors.push(`Expected 30 Juzs, found ${bundle.juzs.length}`)
  } else {
    const seenJuzNumbers = new Set<number>()
    for (const juz of bundle.juzs) {
      if (!Number.isInteger(juz.number) || juz.number < 1 || juz.number > 30) {
        errors.push(`Juz number must be an integer between 1 and 30, received: ${juz.number}`)
      }
      if (seenJuzNumbers.has(juz.number)) {
        errors.push(`Duplicate Juz number detected: ${juz.number}`)
      }
      seenJuzNumbers.add(juz.number)

      if (!juz.startVerseKey || !/^\d+:\d+$/.test(juz.startVerseKey)) {
        errors.push(`Juz ${juz.number} has invalid startVerseKey: ${juz.startVerseKey}`)
      }
      if (!Array.isArray(juz.ranges) || juz.ranges.length === 0) {
        errors.push(`Juz ${juz.number} has no valid ranges`)
      }
    }
  }

  // 4. Validate Verses & Surah Verse-Count Agreement
  const surahMap = new Map<number, Surah>()
  if (Array.isArray(bundle.surahs)) {
    for (const s of bundle.surahs) {
      surahMap.set(s.number, s)
    }
  }

  const surahVerseCounts = new Map<number, number>()
  const seenVerseKeys = new Set<string>()

  if (!Array.isArray(bundle.verses)) {
    errors.push('Verses is not an array')
  } else {
    for (const verse of bundle.verses) {
      // Verse Key format
      if (!verse.verseKey || !/^\d+:\d+$/.test(verse.verseKey)) {
        errors.push(`Invalid verseKey format: ${verse.verseKey}`)
        continue
      }
      if (seenVerseKeys.has(verse.verseKey)) {
        errors.push(`Duplicate verseKey detected: ${verse.verseKey}`)
      }
      seenVerseKeys.add(verse.verseKey)

      const [expectedSurahStr, expectedAyahStr] = verse.verseKey.split(':')
      const expectedSurah = parseInt(expectedSurahStr, 10)
      const expectedAyah = parseInt(expectedAyahStr, 10)

      if (verse.surahNumber !== expectedSurah || verse.ayahNumber !== expectedAyah) {
        errors.push(
          `verseKey ${verse.verseKey} does not match surahNumber ${verse.surahNumber} or ayahNumber ${verse.ayahNumber}`
        )
      }

      const surah = surahMap.get(verse.surahNumber)
      if (!surah) {
        errors.push(`Verse references non-existent Surah number: ${verse.surahNumber}`)
      } else if (verse.ayahNumber < 1 || verse.ayahNumber > surah.verseCount) {
        errors.push(
          `Ayah number ${verse.ayahNumber} out of bounds for Surah ${verse.surahNumber} (1..${surah.verseCount})`
        )
      }

      // Count verses per Surah
      surahVerseCounts.set(verse.surahNumber, (surahVerseCounts.get(verse.surahNumber) || 0) + 1)

      if (!verse.arabicText || verse.arabicText.trim().length === 0) {
        errors.push(`Verse ${verse.verseKey} has empty arabicText`)
      }
      if (!verse.englishTranslation || verse.englishTranslation.trim().length === 0) {
        errors.push(`Verse ${verse.verseKey} has empty englishTranslation`)
      }
      if (!Number.isInteger(verse.juzNumber) || verse.juzNumber < 1 || verse.juzNumber > 30) {
        errors.push(`Verse ${verse.verseKey} has invalid juzNumber: ${verse.juzNumber}`)
      }
    }

    // Agreement between Surah verseCount and actual Verses
    for (const surah of bundle.surahs || []) {
      const actualCount = surahVerseCounts.get(surah.number) || 0
      if (actualCount !== surah.verseCount) {
        errors.push(
          `Surah ${surah.number} verseCount mismatch: declared ${surah.verseCount}, actual verses ${actualCount}`
        )
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    stats: {
      surahCount: bundle.surahs?.length || 0,
      juzCount: bundle.juzs?.length || 0,
      verseCount: bundle.verses?.length || 0,
    },
  }
}
