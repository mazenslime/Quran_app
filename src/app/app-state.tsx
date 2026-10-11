import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type {
  GuestStateEnvelope,
  Locale,
  ThemePreference,
  FontScale,
  UserPreferences,
} from '../types/guest-state'
import {
  loadGuestState,
  saveGuestState,
} from '../lib/guest-storage'
import { isValidVerseKey } from '../content/selectors'

export interface AppStateContextType {
  guestState: GuestStateEnvelope
  locale: Locale
  direction: 'ltr' | 'rtl'
  theme: ThemePreference
  resolvedTheme: 'light' | 'dark'
  fontScale: FontScale
  showTranslation: boolean
  bookmarks: string[]
  readingPosition: {
    verseKey: string
    scrollAnchor?: number
    updatedAt: string
  }
  statusMessage: string
  storageNotice: string | null

  // Actions
  setReadingPosition: (verseKey: string, scrollAnchor?: number) => void
  toggleBookmark: (verseKey: string) => boolean
  addBookmark: (verseKey: string) => boolean
  removeBookmark: (verseKey: string) => void
  setLocale: (locale: Locale) => void
  setTheme: (theme: ThemePreference) => void
  setFontScale: (scale: FontScale) => void
  setShowTranslation: (show: boolean) => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  announceStatus: (message: string) => void
  dismissStorageNotice: () => void
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guestState, setGuestState] = useState<GuestStateEnvelope>(() => {
    const { state } = loadGuestState()
    return state
  })
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [storageNotice, setStorageNotice] = useState<string | null>(null)

  // Track system color scheme
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const stateRef = React.useRef(guestState)
  stateRef.current = guestState

  // Derived theme & locale
  const locale = guestState.preferences.locale
  const direction: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr'
  const theme = guestState.preferences.theme
  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme
  const fontScale = guestState.preferences.fontScale
  const showTranslation = guestState.preferences.showTranslation
  const bookmarks = guestState.bookmarks
  const readingPosition = guestState.readingPosition

  // Sync html attributes: dir, lang, data-theme
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
      document.documentElement.dir = direction
      document.documentElement.setAttribute('data-theme', resolvedTheme)
      document.documentElement.setAttribute('data-font-scale', fontScale)
    }
  }, [locale, direction, resolvedTheme, fontScale])

  const announceStatus = useCallback((message: string) => {
    setStatusMessage(message)
  }, [])

  const setReadingPosition = useCallback(
    (verseKey: string, scrollAnchor?: number) => {
      if (!isValidVerseKey(verseKey)) return
      setGuestState((prev) => {
        if (
          prev.readingPosition.verseKey === verseKey &&
          prev.readingPosition.scrollAnchor === scrollAnchor
        ) {
          return prev
        }
        const newPos = {
          verseKey,
          scrollAnchor,
          updatedAt: new Date().toISOString(),
        }
        const next: GuestStateEnvelope = {
          ...prev,
          readingPosition: newPos,
        }
        const ok = saveGuestState(next)
        if (!ok) {
          setStorageNotice('Storage is currently unavailable on this device. Changes will remain in memory.')
        }
        return next
      })
    },
    []
  )

  const addBookmark = useCallback(
    (verseKey: string): boolean => {
      if (!isValidVerseKey(verseKey)) return false
      let added = false
      setGuestState((prev) => {
        if (prev.bookmarks.includes(verseKey)) return prev
        added = true
        const next: GuestStateEnvelope = {
          ...prev,
          bookmarks: [...prev.bookmarks, verseKey],
        }
        const ok = saveGuestState(next)
        if (!ok) {
          setStorageNotice('Storage is currently unavailable on this device. Changes will remain in memory.')
        }
        return next
      })
      if (added) {
        announceStatus(`Verse ${verseKey} added to bookmarks`)
      }
      return added
    },
    [announceStatus]
  )

  const removeBookmark = useCallback(
    (verseKey: string) => {
      let removed = false
      setGuestState((prev) => {
        if (!prev.bookmarks.includes(verseKey)) return prev
        removed = true
        const next: GuestStateEnvelope = {
          ...prev,
          bookmarks: prev.bookmarks.filter((b) => b !== verseKey),
        }
        const ok = saveGuestState(next)
        if (!ok) {
          setStorageNotice('Storage is currently unavailable on this device. Changes will remain in memory.')
        }
        return next
      })
      if (removed) {
        announceStatus(`Verse ${verseKey} removed from bookmarks`)
      }
    },
    [announceStatus]
  )

  const toggleBookmark = useCallback(
    (verseKey: string): boolean => {
      if (stateRef.current.bookmarks.includes(verseKey)) {
        removeBookmark(verseKey)
        return false
      } else {
        return addBookmark(verseKey)
      }
    },
    [addBookmark, removeBookmark]
  )

  const updatePreferences = useCallback(
    (prefs: Partial<UserPreferences>) => {
      setGuestState((prev) => {
        const next: GuestStateEnvelope = {
          ...prev,
          preferences: {
            ...prev.preferences,
            ...prefs,
          },
        }
        const ok = saveGuestState(next)
        if (!ok) {
          setStorageNotice('Storage is currently unavailable on this device. Changes will remain in memory.')
        }
        return next
      })
    },
    []
  )

  const setLocale = useCallback(
    (newLocale: Locale) => {
      updatePreferences({ locale: newLocale })
      announceStatus(newLocale === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language set to English')
    },
    [updatePreferences, announceStatus]
  )

  const setTheme = useCallback(
    (newTheme: ThemePreference) => {
      updatePreferences({ theme: newTheme })
      announceStatus(`Theme set to ${newTheme}`)
    },
    [updatePreferences, announceStatus]
  )

  const setFontScale = useCallback(
    (newScale: FontScale) => {
      updatePreferences({ fontScale: newScale })
      announceStatus(`Text size set to ${newScale}`)
    },
    [updatePreferences, announceStatus]
  )

  const setShowTranslation = useCallback(
    (show: boolean) => {
      updatePreferences({ showTranslation: show })
      announceStatus(show ? 'Translation shown' : 'Translation hidden')
    },
    [updatePreferences, announceStatus]
  )

  const dismissStorageNotice = useCallback(() => {
    setStorageNotice(null)
  }, [])

  const value = useMemo(
    () => ({
      guestState,
      locale,
      direction,
      theme,
      resolvedTheme,
      fontScale,
      showTranslation,
      bookmarks,
      readingPosition,
      statusMessage,
      storageNotice,
      setReadingPosition,
      toggleBookmark,
      addBookmark,
      removeBookmark,
      setLocale,
      setTheme,
      setFontScale,
      setShowTranslation,
      updatePreferences,
      announceStatus,
      dismissStorageNotice,
    }),
    [
      guestState,
      locale,
      direction,
      theme,
      resolvedTheme,
      fontScale,
      showTranslation,
      bookmarks,
      readingPosition,
      statusMessage,
      storageNotice,
      setReadingPosition,
      toggleBookmark,
      addBookmark,
      removeBookmark,
      setLocale,
      setTheme,
      setFontScale,
      setShowTranslation,
      updatePreferences,
      announceStatus,
      dismissStorageNotice,
    ]
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateContextType {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
