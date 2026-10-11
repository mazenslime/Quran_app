import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faGear,
  faBookOpen,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import type { NavigationTarget } from '../../app/routes'
import {
  getAllSurahs,
  getVersesBySurah,
  resolveSafeLocation,
  getAdjacentVerses,
} from '../../content/selectors'
import { AyahCard } from '../../components/quran/AyahCard'
import { ReaderSettings } from '../settings/ReaderSettings'
import { useAppState } from '../../app/app-state'
import { copyTextToClipboard, formatVerseText, shareVerse } from '../../lib/verse-actions'
import { debounceUpdateReadingPosition } from './reading-position'
import type { Verse } from '../../types/quran'
import '../../styles/reader.css'

export interface ReaderPageProps {
  initialVerseKey?: string
  onNavigate: (target: NavigationTarget) => void
}

export const ReaderPage: React.FC<ReaderPageProps> = ({ initialVerseKey, onNavigate }) => {
  const {
    locale,
    showTranslation,
    bookmarks,
    toggleBookmark,
    setReadingPosition,
    announceStatus,
  } = useAppState()

  const [activeVerseKey, setActiveVerseKey] = useState<string>(() => {
    return resolveSafeLocation(initialVerseKey).verse.verseKey
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Update activeVerseKey when initialVerseKey prop changes
  useEffect(() => {
    if (initialVerseKey) {
      const resolved = resolveSafeLocation(initialVerseKey)
      setActiveVerseKey(resolved.verse.verseKey)
    }
  }, [initialVerseKey])

  // Resolve current active location and Surah
  const locationInfo = useMemo(() => {
    return resolveSafeLocation(activeVerseKey)
  }, [activeVerseKey])

  const currentSurah = locationInfo.surah
  const surahVerses = useMemo(() => {
    return getVersesBySurah(currentSurah.number)
  }, [currentSurah.number])

  const allSurahs = useMemo(() => getAllSurahs('mushaf'), [])

  const { previousVerseKey, nextVerseKey } = useMemo(() => {
    return getAdjacentVerses(activeVerseKey)
  }, [activeVerseKey])

  // Debounced/updated reading position
  useEffect(() => {
    debounceUpdateReadingPosition(activeVerseKey, setReadingPosition)
  }, [activeVerseKey, setReadingPosition])

  const handleSelectVerseKey = useCallback((newKey: string) => {
    const resolved = resolveSafeLocation(newKey)
    setActiveVerseKey(resolved.verse.verseKey)
    announceStatus(`Verse ${resolved.verse.verseKey}`)
  }, [announceStatus])

  const handleSelectSurah = useCallback((surahNumber: number) => {
    const newKey = `${surahNumber}:1`
    const resolved = resolveSafeLocation(newKey)
    setActiveVerseKey(resolved.verse.verseKey)
    announceStatus(`Surah ${resolved.surah.englishName}`)
  }, [announceStatus])

  const handleCopy = async (verse: Verse) => {
    const text = formatVerseText(verse)
    const ok = await copyTextToClipboard(text)
    if (ok) {
      announceStatus(
        locale === 'ar'
          ? `تم نسخ الآية ${verse.verseKey} إلى الحافظة`
          : `Copied verse ${verse.verseKey} to clipboard`
      )
    } else {
      announceStatus(locale === 'ar' ? 'فشل النسخ' : 'Failed to copy verse')
    }
  }

  const handleShare = async (verse: Verse) => {
    const res = await shareVerse(verse)
    if (res.shared) {
      announceStatus(
        res.method === 'web-share'
          ? (locale === 'ar' ? 'تمت المشاركة' : 'Shared verse')
          : (locale === 'ar' ? 'تم نسخ رابط الآية' : 'Verse link copied to clipboard')
      )
    }
  }

  // Scroll active verse into view if navigated
  useEffect(() => {
    const elem = document.getElementById(`ayah-${activeVerseKey}`)
    if (elem && typeof elem.scrollIntoView === 'function') {
      elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeVerseKey])

  const isBismillahVisible = currentSurah.number !== 9 && currentSurah.number !== 1

  return (
    <div className="reader-container">
      {/* 1. Surah Header */}
      <header className="reader-header">
        <h1 className="reader-surah-title">
          <span className="reader-arabic-title" lang="ar" dir="rtl">
            {currentSurah.arabicName}
          </span>{' '}
          <span className="reader-surah-subtitle">
            {currentSurah.number}. {currentSurah.englishName}
            {currentSurah.englishTranslationName && ` (${currentSurah.englishTranslationName})`}
          </span>
        </h1>
        <div className="reader-surah-meta">
          <span>
            {locale === 'ar'
              ? `${currentSurah.verseCount} آيات`
              : `${currentSurah.verseCount} Verses`}
          </span>
          <span>•</span>
          <span>
            {locale === 'ar'
              ? currentSurah.revelationPlace === 'makki'
                ? 'مكية'
                : 'مدنية'
              : currentSurah.revelationPlace === 'makki'
              ? 'Makki'
              : 'Madani'}
          </span>
        </div>
      </header>

      {/* 2. Reader Navigation Toolbar */}
      <div className="reader-toolbar" role="toolbar" aria-label={locale === 'ar' ? 'أدوات القراءة' : 'Reader Controls'}>
        <div className="reader-nav-controls">
          <button
            type="button"
            className="sanctuary-button sanctuary-button--outline sanctuary-button--sm"
            onClick={() => previousVerseKey && handleSelectVerseKey(previousVerseKey)}
            disabled={!previousVerseKey}
            aria-label={locale === 'ar' ? 'الآية السابقة' : 'Previous Verse'}
          >
            {locale === 'ar' ? (
              <>
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" style={{ marginInlineEnd: '0.35rem' }} />
                السابق
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" style={{ marginInlineEnd: '0.35rem' }} />
                Previous
              </>
            )}
          </button>

          <button
            type="button"
            className="sanctuary-button sanctuary-button--outline sanctuary-button--sm"
            onClick={() => nextVerseKey && handleSelectVerseKey(nextVerseKey)}
            disabled={!nextVerseKey}
            aria-label={locale === 'ar' ? 'الآية التالية' : 'Next Verse'}
          >
            {locale === 'ar' ? (
              <>
                التالي
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" style={{ marginInlineStart: '0.35rem' }} />
              </>
            ) : (
              <>
                Next
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" style={{ marginInlineStart: '0.35rem' }} />
              </>
            )}
          </button>
        </div>

        <div className="reader-nav-controls">
          {/* Surah dropdown */}
          <select
            className="reader-verse-select"
            value={currentSurah.number}
            onChange={(e) => handleSelectSurah(parseInt(e.target.value, 10))}
            aria-label={locale === 'ar' ? 'اختر السورة' : 'Select Surah'}
          >
            {allSurahs.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {locale === 'ar' ? s.arabicName : s.englishName}
              </option>
            ))}
          </select>

          {/* Verse dropdown */}
          <select
            className="reader-verse-select"
            value={activeVerseKey}
            onChange={(e) => handleSelectVerseKey(e.target.value)}
            aria-label={locale === 'ar' ? 'اختر الآية' : 'Select Verse'}
          >
            {surahVerses.map((v) => (
              <option key={v.verseKey} value={v.verseKey}>
                {locale === 'ar' ? `آية ${v.ayahNumber}` : `Verse ${v.ayahNumber}`}
              </option>
            ))}
          </select>

          {/* Search Trigger */}
          <button
            type="button"
            className="sanctuary-button sanctuary-button--ghost sanctuary-button--sm"
            onClick={() => onNavigate({ route: 'search' })}
            aria-label={locale === 'ar' ? 'البحث في القرآن' : 'Search Quran'}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" style={{ marginInlineEnd: '0.35rem' }} />
            {locale === 'ar' ? 'بحث' : 'Search'}
          </button>

          {/* Settings Trigger */}
          <button
            type="button"
            className="sanctuary-button sanctuary-button--ghost sanctuary-button--sm"
            onClick={() => setIsSettingsOpen(true)}
            aria-label={locale === 'ar' ? 'الإعدادات' : 'Settings'}
          >
            <FontAwesomeIcon icon={faGear} aria-hidden="true" style={{ marginInlineEnd: '0.35rem' }} />
            {locale === 'ar' ? 'إعدادات' : 'Settings'}
          </button>

          {/* Return to Quran Browser */}
          <button
            type="button"
            className="sanctuary-button sanctuary-button--ghost sanctuary-button--sm"
            onClick={() => onNavigate({ route: 'browse' })}
            aria-label={locale === 'ar' ? 'فهرس السور' : 'Browse Surahs'}
          >
            <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" style={{ marginInlineEnd: '0.35rem' }} />
            {locale === 'ar' ? 'الفهرس' : 'Index'}
          </button>
        </div>
      </div>

      {/* 3. Bismillah Banner */}
      {isBismillahVisible && (
        <div className="bismillah-banner" lang="ar" dir="rtl" aria-label="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      )}

      {/* 4. Verses List */}
      <main id="main-content" tabIndex={-1}>
        <div className="reader-verses-list" role="feed" aria-label={locale === 'ar' ? 'آيات السورة' : 'Surah Verses'}>
          {surahVerses.map((verse) => (
            <AyahCard
              key={verse.verseKey}
              verse={verse}
              isActive={verse.verseKey === activeVerseKey}
              showTranslation={showTranslation}
              isBookmarked={bookmarks.includes(verse.verseKey)}
              onSelectAyah={handleSelectVerseKey}
              onToggleBookmark={toggleBookmark}
              onCopy={handleCopy}
              onShare={handleShare}
            />
          ))}
        </div>
      </main>

      {/* Settings Modal */}
      <ReaderSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}
