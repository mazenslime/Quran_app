import { test, expect } from '@playwright/test'

test.describe('Guest Persistence E2E Workflows (T041)', () => {
  test('saves reading position and allows continuation from Home', async ({ page }) => {
    // 1. Visit reader at 1:5
    await page.goto('/reader?verse=1:5')
    await expect(page.getByTestId('ayah-card-1:5')).toBeVisible()

    // Allow debounce to write to localStorage
    await page.waitForTimeout(400)

    // 2. Return to Home
    await page.goto('/')

    // 3. Continuation card should be visible
    const continuationCard = page.getByTestId('continuation-card')
    await expect(continuationCard).toBeVisible()
    await expect(continuationCard).toContainText('1:5')

    // 4. Click Resume Reading
    const resumeBtn = continuationCard.getByRole('button', { name: /resume reading|استئناف القراءة/i })
    await resumeBtn.click()

    // 5. Back in reader at 1:5
    await expect(page).toHaveURL(/.*reader\?verse=1:5/)
    await expect(page.getByTestId('ayah-card-1:5')).toBeVisible()
  })

  test('bookmark lifecycle: add on reader, view on bookmarks page, remove', async ({ page }) => {
    // 1. Open reader
    await page.goto('/reader?verse=1:1')

    // 2. Click bookmark button on 1:1
    const ayahCard = page.getByTestId('ayah-card-1:1')
    const bookmarkBtn = ayahCard.getByRole('button', { name: /bookmark/i })
    await bookmarkBtn.click()
    await expect(bookmarkBtn).toHaveAttribute('aria-pressed', 'true')

    // 3. Navigate to /bookmarks
    await page.goto('/bookmarks')
    await expect(page.getByTestId('bookmark-card-1:1')).toBeVisible()

    // 4. Remove bookmark
    const removeBtn = page.getByTestId('bookmark-card-1:1').getByRole('button', { name: /bookmark|إزالة/i })
    await removeBtn.click()

    // 5. Should display empty state
    await expect(page.getByText(/No Bookmarks Yet|لا توجد إشارات مرجعية/i)).toBeVisible()
  })

  test('recovers safely from invalid or corrupt stored state', async ({ page }) => {
    // Inject corrupt/invalid data in localStorage before page load
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'quran-reader:guest-state:v1',
        JSON.stringify({
          schemaVersion: '1.0.0',
          bookmarks: ['invalid:key', '999:999'],
          readingPosition: { verseKey: '888:888' },
          preferences: { locale: 'invalid_locale', theme: 'neon' },
        })
      )
    })

    // Navigate to Home
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()

    // Reading position should safely fallback to 1:1
    await page.goto('/reader')
    await expect(page.getByTestId('ayah-card-1:1')).toBeVisible()

    // Bookmarks page should safely discard invalid keys
    await page.goto('/bookmarks')
    await expect(page.getByText(/No Bookmarks Yet|لا توجد إشارات مرجعية/i)).toBeVisible()
  })
})
