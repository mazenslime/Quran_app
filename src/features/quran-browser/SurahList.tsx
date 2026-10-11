import React, { useMemo } from 'react'
import type { Surah, BrowseOrder } from '../../types/quran'
import { getAllSurahs } from '../../content/selectors'
import { normalizeArabic } from '../../lib/arabic-normalization'
import { useAppState } from '../../app/app-state'
import './surah-list.css'

export interface SurahListProps {
  filterQuery: string
  browseOrder: BrowseOrder
  onSelectSurah: (surahNumber: number) => void
}

export const SurahList: React.FC<SurahListProps> = ({
  filterQuery,
  browseOrder,
  onSelectSurah,
}) => {
  const { locale } = useAppState()
  const allSurahs = useMemo(() => getAllSurahs(browseOrder), [browseOrder])

  const filteredSurahs = useMemo(() => {
    const query = filterQuery.trim()
    if (!query) return allSurahs

    const numQuery = parseInt(query, 10)
    const isNum = !Number.isNaN(numQuery)
    const normQuery = normalizeArabic(query).toLowerCase()
    const lowQuery = query.toLowerCase()
    const flexQuery = lowQuery.replace(/h$/, '')

    return allSurahs.filter((surah) => {
      if (isNum && surah.number === numQuery) return true
      const lowEng = surah.englishName.toLowerCase()
      if (lowEng.includes(lowQuery) || lowEng.replace(/h$/, '').includes(flexQuery)) return true
      if (surah.englishTranslationName?.toLowerCase().includes(lowQuery)) return true
      const normArabic = normalizeArabic(surah.arabicName)
      if (normArabic.includes(normQuery)) return true
      return false
    })
  }, [allSurahs, filterQuery])

  if (filteredSurahs.length === 0) {
    return (
      <div className="empty-surah-state" role="status">
        <p>
          {locale === 'ar'
            ? `لا توجد سور مطابقة لـ "${filterQuery}"`
            : `No Surahs matching "${filterQuery}"`}
        </p>
      </div>
    )
  }

  return (
    <div className="surah-list-container">
      <ul className="surah-grid" role="list" aria-label={locale === 'ar' ? 'قائمة السور' : 'Surah List'}>
        {filteredSurahs.map((surah: Surah) => {
          const placeLabel =
            locale === 'ar'
              ? surah.revelationPlace === 'makki'
                ? 'مكية'
                : 'مدنية'
              : surah.revelationPlace === 'makki'
              ? 'Makki'
              : 'Madani'

          const versesLabel =
            locale === 'ar'
              ? `${surah.verseCount} آيات`
              : `${surah.verseCount} verses`

          return (
            <li key={surah.number}>
              <button
                type="button"
                className="surah-card"
                onClick={() => onSelectSurah(surah.number)}
                aria-label={`${surah.number}. ${surah.englishName} (${surah.arabicName}), ${versesLabel}, ${placeLabel}`}
              >
                <div className="surah-card-left">
                  <span className="surah-number-badge">{surah.number}</span>
                  <div className="surah-card-info">
                    <span className="surah-english-name">{surah.englishName}</span>
                    <div className="surah-meta-details">
                      <span>{versesLabel}</span>
                      <span>•</span>
                      <span className="revelation-badge">{placeLabel}</span>
                    </div>
                  </div>
                </div>
                <div className="surah-card-right">
                  <span className="surah-arabic-name" lang="ar" dir="rtl">
                    {surah.arabicName}
                  </span>
                  {surah.englishTranslationName && (
                    <span className="surah-meta-details">{surah.englishTranslationName}</span>
                  )}
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
