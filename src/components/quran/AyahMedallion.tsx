import React from 'react'
import './ayah-card.css'

const EASTERN_ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

export function toEasternArabicNumerals(num: number): string {
  if (num === null || num === undefined || Number.isNaN(num)) return ''
  return String(num)
    .split('')
    .map((char) => {
      const d = parseInt(char, 10)
      return Number.isNaN(d) ? char : EASTERN_ARABIC_DIGITS[d]
    })
    .join('')
}

export interface AyahMedallionProps {
  ayahNumber: number
  isActive?: boolean
  className?: string
}

export const AyahMedallion: React.FC<AyahMedallionProps> = ({
  ayahNumber,
  isActive = false,
  className = '',
}) => {
  const easternNumber = toEasternArabicNumerals(ayahNumber)
  const classes = [
    'ayah-medallion',
    isActive ? 'ayah-medallion--active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      role="img"
      aria-label={`Verse ${ayahNumber} / الآية ${ayahNumber}`}
    >
      <svg
        className="medallion-svg"
        viewBox="0 0 44 44"
        aria-hidden="true"
        focusable="false"
      >
        {/* Layered 45-degree rounded-square Khatim Sulayman */}
        <rect
          className="medallion-square-1"
          x="7"
          y="7"
          width="30"
          height="30"
        />
        <rect
          className="medallion-square-2"
          x="7"
          y="7"
          width="30"
          height="30"
        />
        <text
          className="medallion-numeral"
          x="22"
          y="23"
        >
          {easternNumber}
        </text>
      </svg>
    </div>
  )
}
