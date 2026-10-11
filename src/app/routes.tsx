/**
 * Application routing contracts and path helpers
 */

export type AppRoute =
  | 'home'
  | 'browse'
  | 'reader'
  | 'search'
  | 'bookmarks'
  | 'settings'
  | 'audio'
  | 'study'
  | 'goals'

export interface NavigationTarget {
  route: AppRoute
  verseKey?: string
  searchQuery?: string
}

export const ROUTES: Record<AppRoute, string> = {
  home: '/',
  browse: '/browse',
  reader: '/reader',
  search: '/search',
  bookmarks: '/bookmarks',
  settings: '/settings',
  audio: '/audio',
  study: '/study',
  goals: '/goals',
}

/**
 * Helper to construct URL or hash for navigation targets
 */
export function buildRoutePath(target: NavigationTarget): string {
  const base = ROUTES[target.route] || '/'
  const params = new URLSearchParams()
  if (target.verseKey) {
    params.set('verse', target.verseKey)
  }
  if (target.searchQuery) {
    params.set('q', target.searchQuery)
  }
  const queryStr = params.toString().replace(/%3A/g, ':')
  return queryStr ? `${base}?${queryStr}` : base
}

/**
 * Parse route and parameters from current window.location
 */
export function parseCurrentLocation(): NavigationTarget {
  if (typeof window === 'undefined') {
    return { route: 'home' }
  }

  const path = window.location.pathname
  const params = new URLSearchParams(window.location.search)
  const verseKey = params.get('verse') || undefined
  const searchQuery = params.get('q') || undefined

  let route: AppRoute = 'home'
  if (path.includes('/reader')) route = 'reader'
  else if (path.includes('/browse') || path.includes('/quran')) route = 'browse'
  else if (path.includes('/search')) route = 'search'
  else if (path.includes('/bookmarks')) route = 'bookmarks'
  else if (path.includes('/settings')) route = 'settings'
  else if (path.includes('/audio')) route = 'audio'
  else if (path.includes('/study')) route = 'study'
  else if (path.includes('/goals')) route = 'goals'

  return { route, verseKey, searchQuery }
}
