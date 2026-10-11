import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { AppProviders } from '../../src/app/AppProviders'
import { useAppState } from '../../src/app/app-state'
import { GUEST_STORAGE_KEY } from '../../src/types/guest-state'

const PersistenceTestConsumer: React.FC = () => {
  const {
    bookmarks,
    readingPosition,
    storageNotice,
    dismissStorageNotice,
    toggleBookmark,
    setReadingPosition,
  } = useAppState()

  return (
    <div>
      <div data-testid="reading-position">{readingPosition.verseKey}</div>
      <div data-testid="bookmarks-list">{bookmarks.join(',')}</div>
      {storageNotice && (
        <div role="alert" data-testid="storage-notice">
          {storageNotice}
          <button type="button" onClick={dismissStorageNotice}>
            Dismiss
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => toggleBookmark('1:5')}
        data-testid="toggle-bookmark-btn"
      >
        Toggle 1:5
      </button>
      <button
        type="button"
        onClick={() => setReadingPosition('2:255')}
        data-testid="set-position-btn"
      >
        Set Pos 2:255
      </button>
    </div>
  )
}

describe('Guest Persistence Contract (T036)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('updates view immediately when bookmark is toggled and persists to storage', () => {
    render(
      <AppProviders>
        <PersistenceTestConsumer />
      </AppProviders>
    )

    const toggleBtn = screen.getByTestId('toggle-bookmark-btn')
    const bookmarksList = screen.getByTestId('bookmarks-list')

    // Initial bookmarks empty
    expect(bookmarksList).toHaveTextContent('')

    // Click toggle
    fireEvent.click(toggleBtn)
    expect(bookmarksList).toHaveTextContent('1:5')

    // Verify written to localStorage
    const saved = JSON.parse(localStorage.getItem(GUEST_STORAGE_KEY) || '{}')
    expect(saved.bookmarks).toContain('1:5')
  })

  it('updates reading position immediately and validates stored key', () => {
    render(
      <AppProviders>
        <PersistenceTestConsumer />
      </AppProviders>
    )

    const setPosBtn = screen.getByTestId('set-position-btn')
    const posDisplay = screen.getByTestId('reading-position')

    // Click set position
    fireEvent.click(setPosBtn)
    expect(posDisplay).toHaveTextContent('2:255')

    // Check localStorage
    const saved = JSON.parse(localStorage.getItem(GUEST_STORAGE_KEY) || '{}')
    expect(saved.readingPosition.verseKey).toBe('2:255')
  })

  it('handles storage failure with non-blocking notice while keeping in-memory updates', () => {
    // Force localStorage.setItem to fail
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded')
    })

    render(
      <AppProviders>
        <PersistenceTestConsumer />
      </AppProviders>
    )

    const toggleBtn = screen.getByTestId('toggle-bookmark-btn')
    fireEvent.click(toggleBtn)

    // View should still update in memory!
    expect(screen.getByTestId('bookmarks-list')).toHaveTextContent('1:5')

    // Non-blocking notice alert should be displayed
    const notice = screen.getByTestId('storage-notice')
    expect(notice).toBeInTheDocument()
    expect(notice).toHaveTextContent(/Storage is currently unavailable/i)

    // Notice can be dismissed
    const dismissBtn = screen.getByRole('button', { name: /dismiss/i })
    fireEvent.click(dismissBtn)
    expect(screen.queryByTestId('storage-notice')).not.toBeInTheDocument()
  })
})
