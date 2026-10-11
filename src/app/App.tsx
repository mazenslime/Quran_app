import React, { useState, useEffect, useCallback } from 'react'
import { AppProviders } from './AppProviders'
import { parseCurrentLocation, buildRoutePath, type NavigationTarget } from './routes'
import { PrimaryNavigation } from '../components/navigation/PrimaryNavigation'
import { HomePage } from '../features/home/HomePage'
import { QuranBrowserPage } from '../features/quran-browser/QuranBrowserPage'
import { ReaderPage } from '../features/reader/ReaderPage'
import { SearchPage } from '../features/search/SearchPage'
import { BookmarksPage } from '../features/bookmarks/BookmarksPage'
import { SkipLink } from '../components/ui/SkipLink'
import { StatusMessage } from '../components/ui/StatusMessage'

const AppContent: React.FC = () => {
  const [navigationTarget, setNavigationTarget] = useState<NavigationTarget>(() =>
    parseCurrentLocation()
  )

  useEffect(() => {
    const handlePopState = () => {
      setNavigationTarget(parseCurrentLocation())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigate = useCallback((target: NavigationTarget) => {
    setNavigationTarget(target)
    const path = buildRoutePath(target)
    if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== path) {
      window.history.pushState(null, '', path)
    }
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="app-layout">
      <SkipLink targetId="main-content" />

      {/* Responsive Primary Navigation Header */}
      <PrimaryNavigation
        currentRoute={navigationTarget.route}
        onNavigate={handleNavigate}
      />

      {/* Live status announcements and storage notice */}
      <StatusMessage />

      {/* Route Rendering */}
      {navigationTarget.route === 'reader' && (
        <ReaderPage
          initialVerseKey={navigationTarget.verseKey || '1:1'}
          onNavigate={handleNavigate}
        />
      )}
      {navigationTarget.route === 'search' && (
        <SearchPage
          initialQuery={navigationTarget.searchQuery}
          onNavigate={handleNavigate}
        />
      )}
      {navigationTarget.route === 'bookmarks' && (
        <BookmarksPage onNavigate={handleNavigate} />
      )}
      {navigationTarget.route === 'browse' && (
        <QuranBrowserPage onNavigate={handleNavigate} />
      )}
      {navigationTarget.route === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  )
}

export default App
