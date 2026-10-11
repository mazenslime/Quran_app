import React, { useEffect, useRef } from 'react'
import { useAppState } from '../../app/app-state'
import type { FontScale, ThemePreference, Locale } from '../../types/guest-state'
import './reader-settings.css'

export interface ReaderSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export const ReaderSettings: React.FC<ReaderSettingsProps> = ({ isOpen, onClose }) => {
  const {
    locale,
    theme,
    fontScale,
    showTranslation,
    setLocale,
    setTheme,
    setFontScale,
    setShowTranslation,
  } = useAppState()

  const modalRef = useRef<HTMLDivElement>(null)

  // Close on Escape key per contract
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const scales: { label: string; value: FontScale }[] = [
    { label: locale === 'ar' ? 'صغير' : 'Small', value: 'sm' },
    { label: locale === 'ar' ? 'متوسط' : 'Medium', value: 'md' },
    { label: locale === 'ar' ? 'كبير' : 'Large', value: 'lg' },
    { label: locale === 'ar' ? 'كبير جداً' : 'Extra Large', value: 'xl' },
  ]

  const themes: { label: string; value: ThemePreference }[] = [
    { label: locale === 'ar' ? 'تلقائي' : 'System', value: 'system' },
    { label: locale === 'ar' ? 'فاتح' : 'Light', value: 'light' },
    { label: locale === 'ar' ? 'داكن' : 'Dark', value: 'dark' },
  ]

  const locales: { label: string; value: Locale }[] = [
    { label: 'English', value: 'en' },
    { label: 'العربية', value: 'ar' },
  ]

  return (
    <div
      className="settings-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={modalRef}
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
      >
        <div className="settings-header">
          <h2 id="settings-dialog-title" className="settings-title">
            {locale === 'ar' ? 'إعدادات القراءة' : 'Reader Settings'}
          </h2>
          <button
            type="button"
            className="settings-close-btn"
            onClick={onClose}
            aria-label={locale === 'ar' ? 'إغلاق الإعدادات' : 'Close Settings'}
          >
            ✕
          </button>
        </div>

        {/* 1. Interface Language */}
        <div className="settings-group">
          <span className="settings-group-title">
            {locale === 'ar' ? 'لغة الواجهة' : 'Interface Language'}
          </span>
          <div className="settings-options-row">
            {locales.map((loc) => (
              <button
                key={loc.value}
                type="button"
                className={`settings-pill-btn ${locale === loc.value ? 'settings-pill-btn--active' : ''}`}
                onClick={() => setLocale(loc.value)}
                aria-pressed={locale === loc.value}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Theme */}
        <div className="settings-group">
          <span className="settings-group-title">
            {locale === 'ar' ? 'المظهر' : 'Appearance'}
          </span>
          <div className="settings-options-row">
            {themes.map((th) => (
              <button
                key={th.value}
                type="button"
                className={`settings-pill-btn ${theme === th.value ? 'settings-pill-btn--active' : ''}`}
                onClick={() => setTheme(th.value)}
                aria-pressed={theme === th.value}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Text Size */}
        <div className="settings-group">
          <span className="settings-group-title">
            {locale === 'ar' ? 'حجم الخط' : 'Text Size'}
          </span>
          <div className="settings-options-row">
            {scales.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`settings-pill-btn ${fontScale === s.value ? 'settings-pill-btn--active' : ''}`}
                onClick={() => setFontScale(s.value)}
                aria-pressed={fontScale === s.value}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Translation Visibility */}
        <div className="settings-group">
          <label className="settings-toggle-row">
            <span className="settings-group-title">
              {locale === 'ar' ? 'إظهار الترجمة الإنجليزية' : 'Show English Translation'}
            </span>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
