import React, { useState, useMemo, useCallback } from 'react'
import type { NavigationTarget } from '../../app/routes'
import { searchQuran } from './quran-search'
import type { SearchResult, MatchScope, HighlightRange } from '../../types/search'
import { isValidVerseKey } from '../../content/selectors'
import { useAppState } from '../../app/app-state'
import { VerseActions } from '../../components/quran/VerseActions'
import './search.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass 
} from '@fortawesome/free-solid-svg-icons'

export interface SearchPageProps {
  initialQuery?: string
  onNavigate: (target: NavigationTarget) => void
}

/**
 * Safely render text with <mark> tags at the specified highlight ranges
 */
export function renderHighlightedText(
  text: string,
  ranges: HighlightRange[]
): React.ReactNode {
  if (!ranges || ranges.length === 0) return text

  const sorted = [...ranges].sort((a, b) => a.start - b.start)
  const nodes: React.ReactNode[] = []
  let lastIndex = 0

  sorted.forEach((range, idx) => {
    if (range.start > lastIndex) {
      nodes.push(text.slice(lastIndex, range.start))
    }
    const end = Math.min(range.end, text.length)
    if (end > range.start) {
      nodes.push(
        <mark key={idx} className="search-highlight">
          {text.slice(range.start, end)}
        </mark>
      )
    }
    lastIndex = Math.max(lastIndex, end)
  })

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return <>{nodes}</>
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '', onNavigate }) => {
  const { locale, announceStatus, bookmarks, toggleBookmark } = useAppState()
  const [query, setQuery] = useState(initialQuery)
  const [activeScope, setActiveScope] = useState<MatchScope | 'all'>('all')
  const [hasSearched, setHasSearched] = useState(false)

  // Compute search results
  const results = useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) return []
    return searchQuran(trimmed, { scope: activeScope })
  }, [query, activeScope])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      announceStatus(
        locale === 'ar'
          ? 'يرجى إدخال كلمة للبحث'
          : 'Please enter a search term'
      )
      return
    }

    setHasSearched(true)
    if (results.length === 0) {
      announceStatus(
        locale === 'ar'
          ? `لا توجد نتائج مطابقة لـ "${trimmed}"`
          : `Zero results found for "${trimmed}"`
      )
    } else {
      announceStatus(
        locale === 'ar'
          ? `تم العثور على ${results.length} نتيجة لـ "${trimmed}"`
          : `Found ${results.length} results for "${trimmed}"`
      )
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (val.trim()) {
      setHasSearched(true)
    } else {
      setHasSearched(false)
    }
  }

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      // Contract: Check for stale/unavailable verse key
      if (!isValidVerseKey(result.verseKey)) {
        announceStatus(
          locale === 'ar'
            ? 'النتيجة غير متاحة حالياً'
            : 'Selected verse is unavailable or stale'
        )
        return
      }

      onNavigate({ route: 'reader', verseKey: result.verseKey })
    },
    [announceStatus, locale, onNavigate]
  )

  const isArabicUI = locale === 'ar'

  return (
    <div className="search-container" id="main-content">
      <header className="search-header">
        <h1 className="search-title">
          {isArabicUI ? 'البحث في القرآن الكريم' : 'Search the Holy Quran'}
        </h1>
        <p className="search-subtitle">
          {isArabicUI
            ? 'ابحث في الآيات وترجمتها وأسماء السور وأرقامها'
            : 'Search verses, English translation, Surah names, and numbers'}
        </p>
      </header>

      {/* Search Input and Filters */}
      <form className="search-form" onSubmit={handleSearchSubmit} role="search">
        <div className="search-input-wrapper">
          <input
            type="search"
            className="search-input"
            value={query}
            onChange={handleInputChange}
            placeholder={
              isArabicUI
                ? 'ابحث باللغة العربية أو الإنجليزية أو اسم السورة أو رقمها...'
                : 'Search Arabic, English, Surah name, or number...'
            }
            aria-label={isArabicUI ? 'خانة البحث' : 'Search input'}
            autoFocus
          />
          <button
            type="submit"
            className="sanctuary-button sanctuary-button--primary"
            aria-label={isArabicUI ? 'بحث' : 'Search'}
          >
            {isArabicUI ? 'بحث' : 'Search'}
          </button>
        </div>

        {/* Scope Filters */}
        <div
          className="search-scope-filters"
          role="radiogroup"
          aria-label={isArabicUI ? 'نطاق البحث' : 'Search Scope'}
        >
          {(
            [
              { id: 'all', en: 'All', ar: 'الكل' },
              { id: 'arabic', en: 'Arabic Quran', ar: 'النص القرآني' },
              { id: 'english', en: 'Translation', ar: 'الترجمة' },
              { id: 'surah-name', en: 'Surah Name', ar: 'اسم السورة' },
              { id: 'surah-number', en: 'Surah Number', ar: 'رقم السورة' },
            ] as const
          ).map((scopeOption) => (
            <button
              key={scopeOption.id}
              type="button"
              className={`search-scope-btn ${
                activeScope === scopeOption.id ? 'search-scope-btn--active' : ''
              }`}
              onClick={() => setActiveScope(scopeOption.id)}
              role="radio"
              aria-checked={activeScope === scopeOption.id}
            >
              {isArabicUI ? scopeOption.ar : scopeOption.en}
            </button>
          ))}
        </div>
      </form>

      {/* Main Content Area */}
      <main>
        {/* Empty Query Prompt */}
        {!query.trim() && (
          <div className="search-prompt-state" role="status">
            <span className="search-empty-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faMagnifyingGlass} size="2x" />
            </span>
            <h2>{isArabicUI ? 'ابدأ البحث' : 'Begin Your Search'}</h2>
            <p>
              {isArabicUI
                ? 'اكتب كلمة أو عبارة باللغة العربية أو الإنجليزية أو ابحث عن سورة بالاسم أو الرقم.'
                : 'Type a word or phrase in Arabic or English, or search for a Surah by name or number.'}
            </p>
          </div>
        )}

        {/* Results Found */}
        {query.trim() && results.length > 0 && (
          <div className="search-results-section">
            <div className="search-results-summary" aria-live="polite">
              {isArabicUI
                ? `تم العثور على ${results.length} نتيجة لـ "${query}"`
                : `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
            </div>

            <ul className="search-results-list" role="list">
              {results.map((result) => {
                const verseForActions = {
                  verseKey: result.verseKey,
                  surahNumber: result.surahNumber,
                  ayahNumber: result.ayahNumber,
                  arabicText: result.arabicText,
                  englishTranslation: result.englishTranslation,
                  juzNumber: 1,
                }
                const isBookmarked = bookmarks.includes(result.verseKey)

                return (
                  <li
                    key={result.verseKey}
                    className="search-result-card"
                    data-testid={`search-result-${result.verseKey}`}
                    onClick={() => handleResultClick(result)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleResultClick(result)
                      }
                    }}
                    aria-label={`Open verse ${result.verseKey} in reader`}
                  >
                    <div className="search-result-header">
                      <span className="search-result-surah">
                        {isArabicUI
                          ? `${result.surahArabicName} (${result.verseKey})`
                          : `${result.surahEnglishName} ${result.verseKey}`}
                      </span>
                      <span className="search-result-badge">
                        {result.matchScope}
                      </span>
                    </div>

                    <p
                      className="search-result-arabic"
                      lang="ar"
                      dir="rtl"
                      data-testid="search-result-arabic"
                    >
                      {result.matchScope === 'arabic'
                        ? renderHighlightedText(result.arabicText, result.highlightRanges)
                        : result.arabicText}
                    </p>

                    <p
                      className="search-result-english"
                      lang="en"
                      dir="ltr"
                      data-testid="search-result-english"
                    >
                      {result.matchScope === 'english'
                        ? renderHighlightedText(
                            result.englishTranslation,
                            result.highlightRanges
                          )
                        : result.englishTranslation}
                    </p>

                    <VerseActions
                      verse={verseForActions}
                      isBookmarked={isBookmarked}
                      onToggleBookmark={toggleBookmark}
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* No Results Found */}
        {query.trim() && hasSearched && results.length === 0 && (
          <div className="search-empty-state" role="status" aria-live="polite">
            <span className="search-empty-icon" aria-hidden="true">🍂</span>
            <h2>{isArabicUI ? 'لم يتم العثور على نتائج' : 'No Results Found'}</h2>
            <p>
              {isArabicUI
                ? `لم نتمكن من العثور على أي آية أو سورة مطابقة لـ "${query}". حاول استخدام كلمات أو أشكال كتابية مختلفة.`
                : `We could not find any verses or Surahs matching "${query}". Try different words or spelling.`}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
