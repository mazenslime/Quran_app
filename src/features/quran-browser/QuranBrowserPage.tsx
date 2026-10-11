import React, { useState } from 'react'
import type { BrowseOrder } from '../../types/quran'
import type { NavigationTarget } from '../../app/routes'
import { SurahList } from './SurahList'
import { JuzList } from './JuzList'
import { useAppState } from '../../app/app-state'
import { getSurahFirstVerseKey, validateAndResolveNavigation } from './quran-navigation'
import './quran-browser.css'

export interface QuranBrowserPageProps {
  onNavigate: (target: NavigationTarget) => void
  headingLevel?: 'h1' | 'h2'
}

export const QuranBrowserPage: React.FC<QuranBrowserPageProps> = ({
  onNavigate,
  headingLevel = 'h1',
}) => {
  const { locale, announceStatus } = useAppState()
  const [browseOrder, setBrowseOrder] = useState<BrowseOrder>('mushaf')
  const [filterQuery, setFilterQuery] = useState('')

  const handleSelectSurah = (surahNumber: number) => {
    const verseKey = getSurahFirstVerseKey(surahNumber)
    if (!verseKey) {
      announceStatus('The requested Surah is unavailable.')
      return
    }

    const { target, errorAnnouncement } = validateAndResolveNavigation({
      route: 'reader',
      verseKey,
    })

    if (errorAnnouncement) {
      announceStatus(errorAnnouncement)
    }
    onNavigate(target)
  }

  const handleSelectJuz = (_juzNumber: number, startVerseKey: string) => {
    const { target, errorAnnouncement } = validateAndResolveNavigation({
      route: 'reader',
      verseKey: startVerseKey,
    })

    if (errorAnnouncement) {
      announceStatus(errorAnnouncement)
    }
    onNavigate(target)
  }

  return (
    <div className="quran-browser-page">
      <header className="browser-header">
        {headingLevel === 'h2' ? (
          <h2 className="browser-title">
            {locale === 'ar' ? 'تصفح القرآن الكريم' : 'Browse the Holy Quran'}
          </h2>
        ) : (
          <h1 className="browser-title">
            {locale === 'ar' ? 'تصفح القرآن الكريم' : 'Browse the Holy Quran'}
          </h1>
        )}
        <p className="browser-subtitle">
          {locale === 'ar'
            ? 'تصفح بالسور أو الأجزاء أو بترتيب النزول'
            : 'Explore by Surah, Juz, or chronological revelation order'}
        </p>
      </header>

      <div className="browser-controls">
        <div className="browser-search-wrapper">
          <label htmlFor="browser-search" className="visually-hidden">
            {locale === 'ar' ? 'بحث عن سورة' : 'Search Surah'}
          </label>
          <input
            id="browser-search"
            type="search"
            className="browser-search-input"
            placeholder={
              locale === 'ar'
                ? 'ابحث باسم السورة أو رقمها...'
                : 'Search Surah by name or number...'
            }
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>

        <div className="browse-tabs" role="tablist" aria-label={locale === 'ar' ? 'طرق العرض' : 'Browse modes'}>
          <button
            type="button"
            role="tab"
            id="tab-mushaf"
            aria-selected={browseOrder === 'mushaf'}
            aria-controls="browser-tabpanel"
            className="browse-tab"
            onClick={() => setBrowseOrder('mushaf')}
          >
            {locale === 'ar' ? 'ترتيب المصحف' : 'Mushaf Order'}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-juz"
            aria-selected={browseOrder === 'juz'}
            aria-controls="browser-tabpanel"
            className="browse-tab"
            onClick={() => setBrowseOrder('juz')}
          >
            {locale === 'ar' ? 'الأجزاء' : 'Juz'}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-revelation"
            aria-selected={browseOrder === 'revelation'}
            aria-controls="browser-tabpanel"
            className="browse-tab"
            onClick={() => setBrowseOrder('revelation')}
          >
            {locale === 'ar' ? 'ترتيب النزول' : 'Revelation Order'}
          </button>
        </div>
      </div>

      <main id="browser-tabpanel" role="tabpanel" aria-labelledby={`tab-${browseOrder}`}>
        {browseOrder === 'juz' ? (
          <JuzList onSelectJuz={handleSelectJuz} />
        ) : (
          <SurahList
            filterQuery={filterQuery}
            browseOrder={browseOrder}
            onSelectSurah={handleSelectSurah}
          />
        )}
      </main>
    </div>
  )
}
