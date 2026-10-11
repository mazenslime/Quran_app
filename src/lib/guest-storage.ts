import {
  GUEST_STORAGE_KEY,
  DEFAULT_GUEST_STATE,
  DEFAULT_READING_POSITION,
  DEFAULT_PREFERENCES,
  type GuestStateEnvelope,
  type ReadingPosition,
  type UserPreferences,
  type Locale,
  type ThemePreference,
  type FontScale,
} from '../types/guest-state'
import { isValidVerseKey } from '../content/selectors'

export { DEFAULT_GUEST_STATE }

/**
 * Validate and sanitize reading position, falling back to 1:1 if invalid.
 */
export function sanitizeReadingPosition(rawPos: unknown): ReadingPosition {
  if (!rawPos || typeof rawPos !== 'object') {
    return { ...DEFAULT_READING_POSITION, updatedAt: DEFAULT_READING_POSITION.updatedAt }
  }

  const pos = rawPos as Partial<ReadingPosition>
  const rawKey = typeof pos.verseKey === 'string' ? pos.verseKey : ''
  const isKeyValid = isValidVerseKey(rawKey)
  const verseKey: string = isKeyValid ? rawKey : '1:1'

  const scrollAnchor = typeof pos.scrollAnchor === 'number' && !Number.isNaN(pos.scrollAnchor)
    ? pos.scrollAnchor
    : undefined

  let updatedAt: string = isKeyValid ? new Date().toISOString() : DEFAULT_READING_POSITION.updatedAt
  if (typeof pos.updatedAt === 'string' && !Number.isNaN(Date.parse(pos.updatedAt))) {
    updatedAt = pos.updatedAt
  }

  return { verseKey, scrollAnchor, updatedAt }
}

/**
 * Validate and sanitize user preferences.
 */
export function sanitizePreferences(rawPrefs: unknown): UserPreferences {
  if (!rawPrefs || typeof rawPrefs !== 'object') {
    return { ...DEFAULT_PREFERENCES }
  }

  const prefs = rawPrefs as Partial<UserPreferences>

  const validLocales: Locale[] = ['en', 'ar']
  const locale: Locale = validLocales.includes(prefs.locale as Locale)
    ? (prefs.locale as Locale)
    : DEFAULT_PREFERENCES.locale

  const validThemes: ThemePreference[] = ['light', 'dark', 'system']
  const theme: ThemePreference = validThemes.includes(prefs.theme as ThemePreference)
    ? (prefs.theme as ThemePreference)
    : DEFAULT_PREFERENCES.theme

  const validScales: FontScale[] = ['sm', 'md', 'lg', 'xl']
  const fontScale: FontScale = validScales.includes(prefs.fontScale as FontScale)
    ? (prefs.fontScale as FontScale)
    : DEFAULT_PREFERENCES.fontScale

  const showTranslation = typeof prefs.showTranslation === 'boolean'
    ? prefs.showTranslation
    : DEFAULT_PREFERENCES.showTranslation

  return { locale, theme, fontScale, showTranslation }
}

/**
 * Validate and sanitize bookmark keys: unique, valid canonical verse keys only.
 */
export function sanitizeBookmarks(rawBookmarks: unknown): string[] {
  if (!Array.isArray(rawBookmarks)) return []

  const unique = new Set<string>()
  for (const item of rawBookmarks) {
    if (typeof item === 'string' && isValidVerseKey(item)) {
      unique.add(item)
    }
  }

  return Array.from(unique)
}

/**
 * Load and validate guest state from localStorage.
 * Resilient against JSON errors, missing keys, or storage unavailability.
 */
export function loadGuestState(): { state: GuestStateEnvelope; hadErrors: boolean } {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { state: { ...DEFAULT_GUEST_STATE }, hadErrors: false }
    }

    const raw = window.localStorage.getItem(GUEST_STORAGE_KEY)
    if (!raw) {
      return { state: { ...DEFAULT_GUEST_STATE }, hadErrors: false }
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return { state: { ...DEFAULT_GUEST_STATE }, hadErrors: true }
    }

    const sanitizedState: GuestStateEnvelope = {
      schemaVersion: '1.0.0',
      bookmarks: sanitizeBookmarks(parsed.bookmarks),
      readingPosition: sanitizeReadingPosition(parsed.readingPosition),
      preferences: sanitizePreferences(parsed.preferences),
    }

    return { state: sanitizedState, hadErrors: false }
  } catch {
    return { state: { ...DEFAULT_GUEST_STATE }, hadErrors: true }
  }
}

/**
 * Persist guest state to localStorage safely.
 * Returns boolean indicating whether storage succeeded.
 */
export function saveGuestState(state: GuestStateEnvelope): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    const serialized = JSON.stringify(state)
    window.localStorage.setItem(GUEST_STORAGE_KEY, serialized)
    return true
  } catch (err) {
    console.warn('Failed to save guest state to localStorage:', err)
    return false
  }
}
