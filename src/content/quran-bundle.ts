import type { QuranBundle } from '../types/quran'
import quranData from './quran-data.json'

export const quranBundle: QuranBundle = quranData as unknown as QuranBundle

export const { manifest, surahs, juzs, verses } = quranBundle
