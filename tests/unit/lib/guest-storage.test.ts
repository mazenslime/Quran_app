import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  loadGuestState,
  saveGuestState,
  sanitizeBookmarks,
  sanitizeReadingPosition,
  sanitizePreferences,
  DEFAULT_GUEST_STATE,
} from '../../../src/lib/guest-storage'
import { GUEST_STORAGE_KEY } from '../../../src/types/guest-state'

describe('Guest Storage Unit Tests (T035)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('handles corrupt JSON safely with default state and error flag', () => {
    localStorage.setItem(GUEST_STORAGE_KEY, '{invalid json---')
    const { state, hadErrors } = loadGuestState()
    expect(hadErrors).toBe(true)
    expect(state.readingPosition.verseKey).toBe('1:1')
    expect(state.bookmarks).toEqual([])
  })

  it('loads valid state with schemaVersion 1.0.0', () => {
    const validData = {
      schemaVersion: '1.0.0',
      bookmarks: ['1:1', '2:255'],
      readingPosition: {
        verseKey: '2:255',
        updatedAt: '2026-09-20T00:00:00.000Z',
      },
      preferences: {
        locale: 'ar',
        theme: 'dark',
        fontScale: 'lg',
        showTranslation: false,
      },
    }
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(validData))

    const { state, hadErrors } = loadGuestState()
    expect(hadErrors).toBe(false)
    expect(state.schemaVersion).toBe('1.0.0')
    expect(state.bookmarks).toEqual(['1:1', '2:255'])
    expect(state.readingPosition.verseKey).toBe('2:255')
    expect(state.preferences.locale).toBe('ar')
    expect(state.preferences.theme).toBe('dark')
  })

  it('handles unavailable storage without crashing and reports error on save failure', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError: localStorage is disabled')
    })
    const { state, hadErrors } = loadGuestState()
    expect(hadErrors).toBe(true)
    expect(state).toEqual(DEFAULT_GUEST_STATE)

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    const saved = saveGuestState(DEFAULT_GUEST_STATE)
    expect(saved).toBe(false)
  })

  it('filters out invalid verse keys and keeps unique valid keys in bookmarks', () => {
    const raw = ['1:1', '999:999', 'invalidKey', '1:1', '2:255', '114:6', '']
    const sanitized = sanitizeBookmarks(raw)
    expect(sanitized).toEqual(['1:1', '2:255', '114:6'])
  })

  it('falls back to 1:1 when reading position verseKey is invalid or missing', () => {
    expect(sanitizeReadingPosition(null).verseKey).toBe('1:1')
    expect(sanitizeReadingPosition({}).verseKey).toBe('1:1')
    expect(sanitizeReadingPosition({ verseKey: '999:999' }).verseKey).toBe('1:1')
    expect(sanitizeReadingPosition({ verseKey: '1:5' }).verseKey).toBe('1:5')
  })

  it('sanitizes user preferences with valid fallbacks', () => {
    const malformed = {
      locale: 'fr', // invalid
      theme: 'neon', // invalid
      fontScale: 'huge', // invalid
      showTranslation: 'notABool', // invalid
    }
    const clean = sanitizePreferences(malformed)
    expect(clean.locale).toBe('en')
    expect(clean.theme).toBe('system')
    expect(clean.fontScale).toBe('md')
    expect(clean.showTranslation).toBe(true)
  })
})
