/**
 * Guest State domain types and persistence envelope
 */

export type Locale = 'en' | 'ar'
export type ThemePreference = 'light' | 'dark' | 'system'
export type FontScale = 'sm' | 'md' | 'lg' | 'xl'

export interface UserPreferences {
  locale: Locale
  theme: ThemePreference
  fontScale: FontScale
  showTranslation: boolean
}

export interface ReadingPosition {
  verseKey: string
  scrollAnchor?: number
  updatedAt: string
}

export interface GuestStateEnvelope {
  schemaVersion: string // e.g. '1.0.0' or 'v1'
  bookmarks: string[] // Unique valid verse keys
  readingPosition: ReadingPosition
  preferences: UserPreferences
}

export const GUEST_STORAGE_KEY = 'quran-reader:guest-state:v1'
export const DEFAULT_READING_POSITION: ReadingPosition = {
  verseKey: '1:1',
  updatedAt: new Date(0).toISOString(),
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  locale: 'en',
  theme: 'system',
  fontScale: 'md',
  showTranslation: true,
}

export const DEFAULT_GUEST_STATE: GuestStateEnvelope = {
  schemaVersion: '1.0.0',
  bookmarks: [],
  readingPosition: DEFAULT_READING_POSITION,
  preferences: DEFAULT_PREFERENCES,
}
