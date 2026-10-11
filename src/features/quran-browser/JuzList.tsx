import React, { useMemo } from 'react'
import type { Juz } from '../../types/quran'
import { getAllJuzs, getSurahByNumber, parseVerseKey } from '../../content/selectors'
import { useAppState } from '../../app/app-state'
import './juz-list.css'

export interface JuzListProps {
  onSelectJuz: (juzNumber: number, startVerseKey: string) => void
}

export const JuzList: React.FC<JuzListProps> = ({ onSelectJuz }) => {
  const { locale } = useAppState()
  const juzs = useMemo(() => getAllJuzs(), [])

  return (
    <div className="juz-list-container">
      <ul className="juz-grid" role="list" aria-label={locale === 'ar' ? 'قائمة الأجزاء' : 'Juz List'}>
        {juzs.map((juz: Juz) => {
          const firstRange = juz.ranges[0]
          const startParsed = parseVerseKey(firstRange?.startVerseKey || juz.startVerseKey)
          const endParsed = parseVerseKey(firstRange?.endVerseKey || juz.startVerseKey)

          const startSurah = startParsed ? getSurahByNumber(startParsed.surahNumber) : undefined
          const endSurah = endParsed ? getSurahByNumber(endParsed.surahNumber) : undefined

          const startLabel = startSurah
            ? locale === 'ar'
              ? `${startSurah.arabicName} ${startParsed?.ayahNumber}`
              : `${startSurah.englishName} ${startParsed?.ayahNumber}`
            : juz.startVerseKey

          const endLabel = endSurah
            ? locale === 'ar'
              ? `${endSurah.arabicName} ${endParsed?.ayahNumber}`
              : `${endSurah.englishName} ${endParsed?.ayahNumber}`
            : firstRange?.endVerseKey

          const juzTitle = locale === 'ar' ? `الجزء ${juz.number}` : `Juz ${juz.number}`
          const rangeSummary = `${startLabel} - ${endLabel}`

          return (
            <li key={juz.number}>
              <button
                type="button"
                className="juz-card"
                onClick={() => onSelectJuz(juz.number, juz.startVerseKey)}
                aria-label={`${juzTitle}, ${rangeSummary}`}
              >
                <div className="juz-card-left">
                  <span className="juz-number-badge">{juz.number}</span>
                  <div className="juz-card-info">
                    <span className="juz-title">{juzTitle}</span>
                    <span className="juz-range-summary">{rangeSummary}</span>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
