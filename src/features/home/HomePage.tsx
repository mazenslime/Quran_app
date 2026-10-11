import React, { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookmark,
  faBookOpen,
  faStar,
  faMagnifyingGlass,
  faHeadphones,
  faBook,
  faBullseye,
} from '@fortawesome/free-solid-svg-icons'
import type { NavigationTarget } from '../../app/routes'
import { useAppState } from '../../app/app-state'
import { resolveSafeLocation, getVerseByKey, getSurahByNumber } from '../../content/selectors'
import { VerseActions } from '../../components/quran/VerseActions'
import { QuranBrowserPage } from '../quran-browser/QuranBrowserPage'
import './home.css'

export interface HomePageProps {
  onNavigate: (target: NavigationTarget) => void
}

// Curated list of inspirational verses for Verse of the Day
const VOD_VERSE_KEYS = [
  '2:255', // Ayat al-Kursi
  '2:286',
  '3:103',
  '24:35', // Ayat an-Nur
  '93:5',
  '94:5',
  '55:13',
  '1:1',
]

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { locale, readingPosition, bookmarks, toggleBookmark } = useAppState()
  const isArabicUI = locale === 'ar'

  // Resolve current saved reading position (only if actively read or saved)
  const savedPositionInfo = useMemo(() => {
    if (!readingPosition?.verseKey) return null
    if (!readingPosition.updatedAt || new Date(readingPosition.updatedAt).getTime() <= 0) {
      return null
    }
    return resolveSafeLocation(readingPosition.verseKey)
  }, [readingPosition?.verseKey, readingPosition?.updatedAt])

  // Select deterministic Verse of the Day based on calendar day
  const vodVerseKey = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    const index = Math.abs(dayOfYear) % VOD_VERSE_KEYS.length
    return VOD_VERSE_KEYS[index]
  }, [])

  const vodData = useMemo(() => {
    const verse = getVerseByKey(vodVerseKey) || getVerseByKey('2:255')!
    const surah = getSurahByNumber(verse.surahNumber)!
    return { verse, surah }
  }, [vodVerseKey])

  const isVodBookmarked = bookmarks.includes(vodData.verse.verseKey)

  return (
    <div className="home-container" id="main-content">
      {/* 1. Serene Hero Section */}
      <section className="home-hero" aria-label={isArabicUI ? 'الترحيب' : 'Welcome'}>
        <div className="home-bismillah" lang="ar" dir="rtl" aria-label="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
        <h1 className="home-title">
          {isArabicUI ? 'مصحف النور والسكينة' : 'Quran Reading Sanctuary'}
        </h1>
        <p className="home-subtitle">
          {isArabicUI
            ? 'اقرأ وتدبر آيات القرآن الكريم برسم المصحف العثماني وترجمة موثوقة'
            : 'Read, explore, and reflect upon the Holy Quran with tranquil Uthmani typography and verified translation.'}
        </p>
      </section>

      {/* 2. Continue Reading Card (US4 Continuation) */}
      {savedPositionInfo && (
        <section
          className="home-continuation-card"
          data-testid="continuation-card"
          aria-label={isArabicUI ? 'متابعة القراءة' : 'Continue Reading'}
        >
          <div className="continuation-badge">
            <span aria-hidden="true" style={{ marginInlineEnd: '0.4rem' }}>
              <FontAwesomeIcon icon={faBookmark} />
            </span>
            <span>{isArabicUI ? 'متابعة القراءة' : 'Continue Reading'}</span>
          </div>

          <div>
            <h2 className="continuation-title">
              {isArabicUI
                ? `${savedPositionInfo.surah.arabicName} - الآية ${savedPositionInfo.verse.ayahNumber}`
                : `${savedPositionInfo.surah.englishName} - Ayah ${savedPositionInfo.verse.ayahNumber}`}
            </h2>
            <p className="continuation-meta">
              {isArabicUI
                ? `آخر موضع قراءة محفوظ (${savedPositionInfo.verse.verseKey})`
                : `Last read position (${savedPositionInfo.verse.verseKey})`}
            </p>
          </div>

          <div>
            <button
              type="button"
              className="sanctuary-button sanctuary-button--primary"
              onClick={() =>
                onNavigate({ route: 'reader', verseKey: savedPositionInfo.verse.verseKey })
              }
              aria-label={
                isArabicUI
                  ? `متابعة القراءة من الآية ${savedPositionInfo.verse.verseKey}`
                  : `Resume reading from verse ${savedPositionInfo.verse.verseKey}`
              }
            >
              <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" style={{ marginInlineEnd: '0.4rem' }} />
              {isArabicUI ? 'استئناف القراءة' : 'Resume Reading'}
            </button>
          </div>
        </section>
      )}

      {/* 3. Verse of the Day Card (FR-011) */}
      <section
        className="home-vod-card"
        data-testid="vod-card"
        aria-label={isArabicUI ? 'آية اليوم' : 'Verse of the Day'}
      >
        <div className="vod-badge">
          <FontAwesomeIcon icon={faStar} aria-hidden="true" style={{ marginInlineEnd: '0.4rem' }} />
          {isArabicUI ? 'آية اليوم' : 'Verse of the Day'} —{' '}
          {isArabicUI
            ? `${vodData.surah.arabicName} (${vodData.verse.verseKey})`
            : `${vodData.surah.englishName} ${vodData.verse.verseKey}`}
        </div>

        <p className="vod-arabic-text" lang="ar" dir="rtl">
          {vodData.verse.arabicText}
        </p>

        {vodData.verse.englishTranslation && (
          <p className="vod-english-text" lang="en" dir="ltr">
            "{vodData.verse.englishTranslation}"
          </p>
        )}

        <div className="vod-footer">
          <button
            type="button"
            className="sanctuary-button sanctuary-button--outline sanctuary-button--sm"
            onClick={() =>
              onNavigate({ route: 'reader', verseKey: vodData.verse.verseKey })
            }
          >
            <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" style={{ marginInlineEnd: '0.4rem' }} />
            {isArabicUI ? 'قراءة في السياق' : 'Read in Context'}
          </button>

          <VerseActions
            verse={vodData.verse}
            isBookmarked={isVodBookmarked}
            onToggleBookmark={toggleBookmark}
          />
        </div>
      </section>

      {/* 4. Complete Quran Browser Section (FR-001, FR-003, FR-004) */}
      <section className="home-browser-section" aria-label={isArabicUI ? 'تصفح القرآن' : 'Browse Quran'}>
        <QuranBrowserPage onNavigate={onNavigate} headingLevel="h2" />
      </section>

      {/* 5. Additional Exploration & Deferred Features (FR-001, FR-014, FR-018) */}
      {/* <section aria-label={isArabicUI ? 'ميزات إضافية' : 'Additional Features'}>
        <h2 className="home-section-title">
          {isArabicUI ? 'أقسام المنصة' : 'Explore Platform'}
        </h2> */}

        {/* <div className="home-nav-grid">
          <button
            type="button"
            className="home-nav-card"
            onClick={() => onNavigate({ route: 'browse' })}
            aria-label={isArabicUI ? 'فهرس سور القرآن الكريم' : 'Browse Surahs and Juzs'}
          >
            <div className="home-nav-card-header">
              <span className="home-nav-icon">
                <FontAwesomeIcon icon={faBookOpen} />
              </span>
            </div>
            <h3 className="home-nav-card-title">
              {isArabicUI ? 'فهرس القرآن' : 'Browse Quran'}
            </h3>
            <p className="home-nav-card-desc">
              {isArabicUI
                ? 'استعرض ١١٤ سورة و٣٠ جزءاً بترتيب المصحف والنزول'
                : 'Explore all 114 Surahs and 30 Juz in Mushaf and revelation orders.'}
            </p>
          </button>

          <button
            type="button"
            className="home-nav-card"
            onClick={() => onNavigate({ route: 'search' })}
            aria-label={isArabicUI ? 'البحث في القرآن' : 'Search Quran'}
          >
            <div className="home-nav-card-header">
              <span className="home-nav-icon">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
            </div>
            <h3 className="home-nav-card-title">
              {isArabicUI ? 'البحث الذكي' : 'Search'}
            </h3>
            <p className="home-nav-card-desc">
              {isArabicUI
                ? 'ابحث في النص العثماني والترجمة وأسماء السور وأرقامها'
                : 'Search Arabic verses without diacritics, translation, and Surahs.'}
            </p>
          </button>

          <button
            type="button"
            className="home-nav-card"
            onClick={() => onNavigate({ route: 'bookmarks' })}
            aria-label={isArabicUI ? 'الإشارات المرجعية' : 'Bookmarks'}
          >
            <div className="home-nav-card-header">
              <span className="home-nav-icon">
                <FontAwesomeIcon icon={faStar} />
              </span>
            </div>
            <h3 className="home-nav-card-title">
              {isArabicUI ? 'الإشارات المرجعية' : 'Bookmarks'}
            </h3>
            <p className="home-nav-card-desc">
              {isArabicUI
                ? 'الوصول السريع إلى آياتك المفضلة المحفوظة على هذا الجهاز'
                : 'Quickly access verses you bookmarked on this device.'}
            </p>
          </button> */}

          {/* Deferred features with Coming Soon indicators (FR-018) */}
          {/* <div
            className="home-nav-card home-nav-card--disabled"
            role="status"
            aria-label={isArabicUI ? 'التلاوات الصوتية - قريباً' : 'Audio Recitations - Coming Soon'}
          >
            <div className="home-nav-card-header">
              <span className="home-nav-icon">
                <FontAwesomeIcon icon={faHeadphones} />
              </span>
              <span className="home-deferred-badge">
                {isArabicUI ? 'قريباً' : 'Coming Soon'}
              </span>
            </div>
            <h3 className="home-nav-card-title">
              {isArabicUI ? 'التلاوات الصوتية' : 'Audio Recitations'}
            </h3>
            <p className="home-nav-card-desc">
              {isArabicUI
                ? 'استماع لتلاوات بأصوات كبار القراء (ميزة قادمة)'
                : 'Listen to recitations from renowned Qaris (upcoming feature).'}
            </p> */}
          {/* </div> */}

          {/* <div
            className="home-nav-card home-nav-card--disabled"
            role="status"
            aria-label={isArabicUI ? 'التفسير والتدبر - قريباً' : 'Study & Tafsir - Coming Soon'}
          >
            <div className="home-nav-card-header">
              <span className="home-nav-icon">
                <FontAwesomeIcon icon={faBook} />
              </span>
              <span className="home-deferred-badge">
                {isArabicUI ? 'قريباً' : 'Coming Soon'}
              </span>
            </div>
            <h3 className="home-nav-card-title">
              {isArabicUI ? 'التفسير والتدبر' : 'Study & Tafsir'}
            </h3>
            <p className="home-nav-card-desc">
              {isArabicUI
                ? 'معاني الكلمات وتفاسير الآيات المعتمدة (ميزة قادمة)'
                : 'In-depth word-by-word meanings and commentaries (upcoming).'}
            </p>
          </div> */}

          {/* <div
            className="home-nav-card home-nav-card--disabled"
            role="status"
            aria-label={isArabicUI ? 'خطة الختمة والأهداف - قريباً' : 'Reading Goals - Coming Soon'}
          >
            <div className="home-nav-card-header">
              <span className="home-nav-icon">
                <FontAwesomeIcon icon={faBullseye} />
              </span>
              <span className="home-deferred-badge">
                {isArabicUI ? 'قريباً' : 'Coming Soon'}
              </span>
            </div>
            <h3 className="home-nav-card-title">
              {isArabicUI ? 'خطة الختمة' : 'Goals & Plans'}
            </h3>
            <p className="home-nav-card-desc">
              {isArabicUI
                ? 'حدد جدول قراءتك اليومية وتابع تقدمك (ميزة قادمة)'
                : 'Set daily reading targets and track progress (upcoming).'}
            </p>
          </div> */}
        {/* </div> */}
      {/* </section> */}
    </div>
  )
}
