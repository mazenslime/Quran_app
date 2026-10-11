import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useAppState } from '../../app/app-state'
import './ui.css'

export const StatusMessage: React.FC = () => {
  const { statusMessage, storageNotice, dismissStorageNotice, locale } = useAppState()

  const dismissLabel = locale === 'ar' ? 'إغلاق' : 'Dismiss'

  return (
    <>
      {/* Screen reader live region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
      >
        {statusMessage}
      </div>

      {/* Non-blocking persistent storage notice if any */}
      {storageNotice && (
        <div className="sanctuary-storage-notice" role="alert">
          <p>{storageNotice}</p>
          <button
            type="button"
            className="sanctuary-notice-dismiss"
            onClick={dismissStorageNotice}
            aria-label={dismissLabel}
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  )
}
