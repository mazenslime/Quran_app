/**
 * Canonical domain types for Quran Content
 */

export type VerseKey = `${number}:${number}` | string

export type RevelationPlace = 'makki' | 'madani'

export interface Surah {
  number: number // 1–114
  arabicName: string
  englishName: string
  englishTranslationName?: string
  verseCount: number
  revelationPlace: RevelationPlace
  revelationOrder: number
}

export interface JuzRange {
  startVerseKey: string
  endVerseKey: string
}

export interface Juz {
  number: number // 1–30
  startVerseKey: string
  ranges: JuzRange[]
}

export interface Verse {
  verseKey: string // "{surahNumber}:{ayahNumber}"
  surahNumber: number // 1–114
  ayahNumber: number // 1–verseCount
  arabicText: string // Uthmani Hafs
  englishTranslation: string // Approved attributed translation
  juzNumber: number // 1–30
  ordinal?: number // derived search/sort value
}

export interface ContentManifest {
  version: string
  source: string
  licence: string
  attribution: string
  translationResourceId: string
  translationName: string
  retrievalDate: string
  contentHash: string
}

export interface QuranBundle {
  manifest: ContentManifest
  surahs: Surah[]
  juzs: Juz[]
  verses: Verse[]
}

export type BrowseOrder = 'mushaf' | 'juz' | 'revelation'
