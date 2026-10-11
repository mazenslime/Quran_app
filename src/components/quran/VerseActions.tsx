import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faCopy, faCheck, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import type { Verse } from '../../types/quran'
import { useAppState } from '../../app/app-state'
import { copyTextToClipboard, formatVerseText, shareVerse } from '../../lib/verse-actions'

export interface VerseActionsProps {
  verse: Verse
  isBookmarked?: boolean
  onToggleBookmark?: (verseKey: string) => void
  onCopy?: (verse: Verse) => void
  onShare?: (verse: Verse) => void
}

export const VerseActions: React.FC<VerseActionsProps> = ({
  verse,
  isBookmarked = false,
  onToggleBookmark,
  onCopy,
  onShare,
}) => {
  const { locale, announceStatus } = useAppState()
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  const bookmarkLabel = isBookmarked
    ? locale === 'ar'
      ? 'إزالة الإشارة المرجعية'
      : 'Remove Bookmark'
    : locale === 'ar'
    ? 'حفظ في الإشارات المرجعية'
    : 'Bookmark Verse'

  const copyLabel = locale === 'ar' ? 'نسخ الآية' : 'Copy Verse'
  const shareLabel = locale === 'ar' ? 'مشاركة الآية' : 'Share Verse'

  const handleCopyClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onCopy) {
      onCopy(verse)
      return
    }

    const text = formatVerseText(verse)
    const success = await copyTextToClipboard(text)
    if (success) {
      setCopyStatus('copied')
      announceStatus(
        locale === 'ar'
          ? `تم نسخ الآية ${verse.verseKey} إلى الحافظة`
          : `Copied verse ${verse.verseKey} to clipboard`
      )
      setTimeout(() => setCopyStatus('idle'), 2000)
    } else {
      setCopyStatus('failed')
      announceStatus(locale === 'ar' ? 'فشل النسخ' : 'Failed to copy verse')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onShare) {
      onShare(verse)
      return
    }

    const res = await shareVerse(verse)
    if (res.shared) {
      announceStatus(
        res.method === 'web-share'
          ? (locale === 'ar' ? 'تمت مشاركة الآية' : 'Shared verse')
          : (locale === 'ar' ? 'تم نسخ رابط الآية' : 'Verse link copied to clipboard')
      )
    }
  }

  return (
    <div className="ayah-actions" role="toolbar" aria-label={`Actions for verse ${verse.verseKey}`}>
      {onToggleBookmark && (
        <button
          type="button"
          className={`ayah-action-btn ${isBookmarked ? 'ayah-action-btn--active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleBookmark(verse.verseKey)
          }}
          aria-label={bookmarkLabel}
          aria-pressed={isBookmarked}
        >
          <FontAwesomeIcon icon={faStar} aria-hidden="true" style={{ marginInlineEnd: '0.35rem' }} />
          <span>
            {isBookmarked
              ? locale === 'ar'
                ? 'محفوظ'
                : 'Saved'
              : locale === 'ar'
              ? 'حفظ'
              : 'Bookmark'}
          </span>
        </button>
      )}

      <button
        type="button"
        className="ayah-action-btn"
        onClick={handleCopyClick}
        aria-label={copyLabel}
      >
        <FontAwesomeIcon
          icon={copyStatus === 'copied' ? faCheck : faCopy}
          aria-hidden="true"
          style={{ marginInlineEnd: '0.35rem' }}
        />
        <span>
          {copyStatus === 'copied'
            ? locale === 'ar'
              ? 'تم النسخ!'
              : 'Copied!'
            : locale === 'ar'
            ? 'نسخ'
            : 'Copy'}
        </span>
      </button>

      <button
        type="button"
        className="ayah-action-btn"
        onClick={handleShareClick}
        aria-label={shareLabel}
      >
        <FontAwesomeIcon icon={faShareNodes} aria-hidden="true" style={{ marginInlineEnd: '0.35rem' }} />
        <span>{locale === 'ar' ? 'مشاركة' : 'Share'}</span>
      </button>
    </div>
  )
}
