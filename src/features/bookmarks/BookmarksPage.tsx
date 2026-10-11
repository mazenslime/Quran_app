import React, { useState, useMemo, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import type { NavigationTarget } from '../../app/routes'
import { useAppState } from '../../app/app-state'
import { getResolvedBookmarks, filterBookmarks } from './bookmarks'
import { AyahMedallion } from '../../components/quran/AyahMedallion'
import { VerseActions } from '../../components/quran/VerseActions'
import './bookmarks.css'

export interface BookmarksPageProps {
  onNavigate: (target: NavigationTarget) => void
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({ onNavigate }) => {
  const { bookmarks, removeBookmark, announceStatus, locale } = useAppState()
  const [filterQuery, setFilterQuery] = useState('')

  // Resolve bookmarks
  const { validBookmarks, staleKeys } = useMemo(() => {
    return getResolvedBookmarks(bookmarks)
  }, [bookmarks])

  // Automatically clean up stale bookmarks per UI interaction contract
  useEffect(() => {
    if (staleKeys.length > 0) {
      staleKeys.forEach((key) => removeBookmark(key))
      announceStatus(
        locale === 'ar'
          ? 'تمت إزالة إشارات مرجعية قديمة غير صالحة'
          : 'Removed obsolete or unavailable bookmark entries'
      )
    }
  }, [staleKeys, removeBookmark, announceStatus, locale])

  const filteredBookmarks = useMemo(() => {
    return filterBookmarks(validBookmarks, filterQuery)
  }, [validBookmarks, filterQuery])

  const isArabicUI = locale === 'ar'

  const handleOpenVerse = (verseKey: string) => {
    onNavigate({ route: 'reader', verseKey })
  }

  return (
    <div className="bookmarks-container" id="main-content">
      <header className="bookmarks-header">
        <h1 className="bookmarks-title">
          {isArabicUI ? 'الإشارات المرجعية المحفوظة' : 'Saved Bookmarks'}
        </h1>
        <p className="bookmarks-subtitle">
          {isArabicUI
            ? 'الآيات التي قمت بحفظها للرجوع إليها سريعاً على هذا الجهاز'
            : 'Verses you have saved for quick access on this device'}
        </p>
      </header>

      {/* Filter if any bookmarks exist */}
      {validBookmarks.length > 0 && (
        <div className="bookmarks-filter-wrapper">
          <input
            type="search"
            className="bookmarks-filter-input"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={
              isArabicUI
                ? 'تصفية الإشارات المرجعية باسم السورة أو رقم الآية...'
                : 'Filter bookmarks by Surah or verse...'
            }
            aria-label={isArabicUI ? 'تصفية الإشارات المرجعية' : 'Filter bookmarks'}
          />
        </div>
      )}

      {/* Main Content */}
      <main>
        {validBookmarks.length === 0 ? (
          <div className="bookmarks-empty-state" role="status">
            <span className="bookmarks-empty-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faBookmark} />
            </span>
            <h2>{isArabicUI ? 'لا توجد إشارات مرجعية بعد' : 'No Bookmarks Yet'}</h2>
            <p>
              {isArabicUI
                ? 'انقر على رمز النجمة بجانب أي آية أثناء القراءة لحفظها في هذه القائمة.'
                : 'Click the star icon on any verse while reading to save it to this list.'}
            </p>
            <button
              type="button"
              className="sanctuary-button sanctuary-button--primary"
              onClick={() => onNavigate({ route: 'browse' })}
            >
              <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" style={{ marginInlineEnd: '0.4rem' }} />
              {isArabicUI ? 'استكشف سور القرآن' : 'Explore the Quran'}
            </button>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="bookmarks-empty-state" role="status">
            <h2>{isArabicUI ? 'لا توجد نتائج مطابقة' : 'No Matching Bookmarks'}</h2>
            <p>
              {isArabicUI
                ? `لا توجد إشارات مرجعية مطابقة لـ "${filterQuery}"`
                : `No bookmarks match "${filterQuery}"`}
            </p>
          </div>
        ) : (
          <ul
            className="bookmarks-list"
            role="list"
            aria-label={isArabicUI ? 'قائمة الإشارات المرجعية' : 'Bookmarks List'}
          >
            {filteredBookmarks.map(({ verse, surah, verseKey }) => (
              <li
                key={verseKey}
                className="bookmark-card"
                data-testid={`bookmark-card-${verseKey}`}
              >
                <div className="bookmark-header">
                  <div className="bookmark-surah-info">
                    <span className="bookmark-surah-name">
                      {isArabicUI ? surah.arabicName : surah.englishName}
                    </span>
                    <span className="ayah-reference">{verseKey}</span>
                  </div>
                  <AyahMedallion ayahNumber={verse.ayahNumber} />
                </div>

                <p
                  className="bookmark-arabic-text"
                  lang="ar"
                  dir="rtl"
                  data-testid="bookmark-arabic-text"
                >
                  {verse.arabicText}
                </p>

                {verse.englishTranslation && (
                  <p
                    className="bookmark-english-text"
                    lang="en"
                    dir="ltr"
                    data-testid="bookmark-english-text"
                  >
                    {verse.englishTranslation}
                  </p>
                )}

                <div className="bookmark-footer-actions">
                  <button
                    type="button"
                    className="sanctuary-button sanctuary-button--primary sanctuary-button--sm"
                    onClick={() => handleOpenVerse(verseKey)}
                    aria-label={
                      isArabicUI
                        ? `فتح الآية ${verseKey} في المصحف`
                        : `Open verse ${verseKey} in reader`
                    }
                  >
                    <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" style={{ marginInlineEnd: '0.4rem' }} />
                    {isArabicUI ? 'اقرأ في المصحف' : 'Open in Reader'}
                  </button>

                  <VerseActions
                    verse={verse}
                    isBookmarked={true}
                    onToggleBookmark={() => {
                      removeBookmark(verseKey)
                      announceStatus(
                        isArabicUI
                          ? `تمت إزالة الآية ${verseKey} من الإشارات المرجعية`
                          : `Removed verse ${verseKey} from bookmarks`
                      )
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
