/**
 * Search domain types and match contracts
 */

export type MatchScope = 'arabic' | 'english' | 'surah-name' | 'surah-number'

export interface HighlightRange {
  start: number
  end: number
}

export interface SearchResult {
  verseKey: string
  surahNumber: number
  ayahNumber: number
  surahArabicName: string
  surahEnglishName: string
  arabicText: string // Original canonical text - NEVER mutated
  englishTranslation: string
  matchScope: MatchScope
  matchedText: string
  highlightRanges: HighlightRange[]
}

export interface SearchQueryOptions {
  scope?: MatchScope | 'all'
  limit?: number
}
