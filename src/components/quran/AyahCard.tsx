import React from 'react'
import type { Verse } from '../../types/quran'
import { AyahMedallion } from './AyahMedallion'
import { VerseActions } from './VerseActions'
import './ayah-card.css'

export interface AyahCardProps {
  verse: Verse
  isActive?: boolean
  showTranslation?: boolean
  isBookmarked?: boolean
  onSelectAyah?: (verseKey: string) => void
  onToggleBookmark?: (verseKey: string) => void
  onCopy?: (verse: Verse) => void
  onShare?: (verse: Verse) => void
}

export const AyahCard: React.FC<AyahCardProps> = ({
  verse,
  isActive = false,
  showTranslation = true,
  isBookmarked = false,
  onSelectAyah,
  onToggleBookmark,
  onCopy,
  onShare,
}) => {
  return (
    <article
      id={`ayah-${verse.verseKey}`}
      data-testid={`ayah-card-${verse.verseKey}`}
      className={`ayah-card ${isActive ? 'ayah-card--active' : ''}`}
      onClick={() => onSelectAyah?.(verse.verseKey)}
    >
      {/* 1. Reference and Medallion */}
      <div className="ayah-header">
        <span className="ayah-reference">{verse.verseKey}</span>
        <AyahMedallion ayahNumber={verse.ayahNumber} isActive={isActive} />
      </div>

      {/* 2. Arabic Quran Text */}
      <p
        data-testid="arabic-text"
        className="ayah-arabic-text"
        lang="ar"
        dir="rtl"
      >
        {verse.arabicText}
      </p>

      {/* 3. English Translation */}
      {showTranslation && verse.englishTranslation && (
        <p
          data-testid="english-translation"
          className="ayah-english-translation"
          lang="en"
          dir="ltr"
        >
          {verse.englishTranslation}
        </p>
      )}

      {/* 4. Actions */}
      <VerseActions
        verse={verse}
        isBookmarked={isBookmarked}
        onToggleBookmark={onToggleBookmark}
        onCopy={onCopy}
        onShare={onShare}
      />
    </article>
  )
}
