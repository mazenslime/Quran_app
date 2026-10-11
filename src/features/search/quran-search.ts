import type { Surah } from '../../types/quran'
import type { SearchResult, SearchQueryOptions, HighlightRange } from '../../types/search'
import { verses, surahs } from '../../content/quran-bundle'
import { getVerseByKey } from '../../content/selectors'
import {
  findArabicHighlightRanges,
  normalizeArabic,
} from '../../lib/arabic-normalization'

const surahMap = new Map<number, Surah>(surahs.map((s) => [s.number, s]))

/**
 * Normalizes English transliteration for flexible Surah name matching
 * e.g. "Al-Ikhlaas" -> "ikhlas", "Faatiha" -> "fatiha"
 */
export function normalizeTransliteration(str: string): string {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/^(?:al|an|at|ar|as|az|ad|ash|al-m|al-h|al-q|al-b|al-f|al-i|al-n)[-'\s]/, '')
    .replace(/^al-|^an-|^at-|^ar-|^as-|^az-|^ad-|^ash-/, '')
    .replace(/[-'\s]/g, '')
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/th/g, 't')
    .replace(/h$/, '')
}

/**
 * Find occurrence ranges of a substring in English text (case-insensitive)
 */
export function findEnglishHighlightRanges(
  text: string,
  query: string
): HighlightRange[] {
  if (!text || !query) return []
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const ranges: HighlightRange[] = []
  let pos = 0

  while (pos < lowerText.length) {
    const idx = lowerText.indexOf(lowerQuery, pos)
    if (idx === -1) break
    ranges.push({ start: idx, end: idx + lowerQuery.length })
    pos = idx + lowerQuery.length
  }

  return ranges
}

/**
 * Search Quran verses and chapters by Arabic text, English translation, Surah name, or Surah number.
 * Conforms to FR-008 and FR-009.
 */
export function searchQuran(
  query: string,
  options: SearchQueryOptions = {}
): SearchResult[] {
  if (!query || typeof query !== 'string') return []
  const trimmed = query.trim()
  if (!trimmed) return []

  const scope = options.scope || 'all'
  const limit = options.limit || 50
  const results: SearchResult[] = []
  const seenVerses = new Set<string>()

  // 1. Check verse key (e.g., "1:1") or Surah number match (e.g., "112" or "surah 112")
  if (scope === 'all' || scope === 'surah-number') {
    const verseKeyMatch = trimmed.match(/^(\d{1,3}):(\d{1,3})$/)
    if (verseKeyMatch) {
      const sNum = parseInt(verseKeyMatch[1], 10)
      const aNum = parseInt(verseKeyMatch[2], 10)
      const vk = `${sNum}:${aNum}`
      const verse = getVerseByKey(vk)
      const surah = surahMap.get(sNum)
      if (verse && surah && !seenVerses.has(vk)) {
        seenVerses.add(vk)
        results.push({
          verseKey: vk,
          surahNumber: sNum,
          ayahNumber: aNum,
          surahArabicName: surah.arabicName,
          surahEnglishName: surah.englishName,
          arabicText: verse.arabicText,
          englishTranslation: verse.englishTranslation,
          matchScope: 'surah-number',
          matchedText: vk,
          highlightRanges: [{ start: 0, end: trimmed.length }],
        })
      }
    }

    const numMatch = trimmed.match(/^(?:surah\s*)?(\d{1,3})$/i)
    if (numMatch) {
      const sNum = parseInt(numMatch[1], 10)
      if (sNum >= 1 && sNum <= 114) {
        const surah = surahMap.get(sNum)
        const firstVerseKey = `${sNum}:1`
        const firstVerse = getVerseByKey(firstVerseKey)
        if (surah && firstVerse && !seenVerses.has(firstVerseKey)) {
          seenVerses.add(firstVerseKey)
          results.push({
            verseKey: firstVerseKey,
            surahNumber: sNum,
            ayahNumber: 1,
            surahArabicName: surah.arabicName,
            surahEnglishName: surah.englishName,
            arabicText: firstVerse.arabicText,
            englishTranslation: firstVerse.englishTranslation,
            matchScope: 'surah-number',
            matchedText: `Surah ${sNum}`,
            highlightRanges: [{ start: 0, end: trimmed.length }],
          })
        }
      }
    }
  }

  // 2. Search verses content (Arabic text and English translation)
  if (scope === 'all' || scope === 'arabic' || scope === 'english') {
    for (const verse of verses) {
      if (results.length >= limit) break
      if (seenVerses.has(verse.verseKey)) continue

      const surah = surahMap.get(verse.surahNumber)
      if (!surah) continue

      // Search Arabic text
      if (scope === 'all' || scope === 'arabic') {
        const arabicRanges = findArabicHighlightRanges(verse.arabicText, trimmed)
        if (arabicRanges.length > 0) {
          seenVerses.add(verse.verseKey)
          results.push({
            verseKey: verse.verseKey,
            surahNumber: verse.surahNumber,
            ayahNumber: verse.ayahNumber,
            surahArabicName: surah.arabicName,
            surahEnglishName: surah.englishName,
            arabicText: verse.arabicText,
            englishTranslation: verse.englishTranslation,
            matchScope: 'arabic',
            matchedText: verse.arabicText,
            highlightRanges: arabicRanges,
          })
          continue
        }
      }

      // Search English translation
      if (scope === 'all' || scope === 'english') {
        const englishRanges = findEnglishHighlightRanges(verse.englishTranslation, trimmed)
        if (englishRanges.length > 0) {
          seenVerses.add(verse.verseKey)
          results.push({
            verseKey: verse.verseKey,
            surahNumber: verse.surahNumber,
            ayahNumber: verse.ayahNumber,
            surahArabicName: surah.arabicName,
            surahEnglishName: surah.englishName,
            arabicText: verse.arabicText,
            englishTranslation: verse.englishTranslation,
            matchScope: 'english',
            matchedText: verse.englishTranslation,
            highlightRanges: englishRanges,
          })
        }
      }
    }
  }

  // 3. Check Surah name match (English, Arabic, or translation name)
  if (scope === 'all' || scope === 'surah-name') {
    const normQ = normalizeArabic(trimmed)
    const lowerQ = trimmed.toLowerCase()
    const translitQ = normalizeTransliteration(trimmed)

    for (const surah of surahs) {
      if (results.length >= limit) break
      let matched = false
      let matchedText = ''

      const normEng = normalizeTransliteration(surah.englishName)
      if (
        surah.englishName.toLowerCase().includes(lowerQ) ||
        (translitQ && normEng.includes(translitQ))
      ) {
        matched = true
        matchedText = surah.englishName
      } else if (surah.englishTranslationName?.toLowerCase().includes(lowerQ)) {
        matched = true
        matchedText = surah.englishTranslationName
      } else if (normQ && normalizeArabic(surah.arabicName).includes(normQ)) {
        matched = true
        matchedText = surah.arabicName
      }

      if (matched) {
        const firstVerseKey = `${surah.number}:1`
        if (!seenVerses.has(firstVerseKey)) {
          const firstVerse = getVerseByKey(firstVerseKey)
          if (firstVerse) {
            seenVerses.add(firstVerseKey)
            results.push({
              verseKey: firstVerseKey,
              surahNumber: surah.number,
              ayahNumber: 1,
              surahArabicName: surah.arabicName,
              surahEnglishName: surah.englishName,
              arabicText: firstVerse.arabicText,
              englishTranslation: firstVerse.englishTranslation,
              matchScope: 'surah-name',
              matchedText,
              highlightRanges: findEnglishHighlightRanges(matchedText, trimmed),
            })
          }
        }
      }
    }
  }

  return results
}
