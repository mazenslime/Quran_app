import { test, expect } from '@playwright/test'

test.describe('Search and Verse Actions E2E Workflows (T034)', () => {
  test('search Arabic variants without diacritics', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.getByRole('searchbox')
    await expect(searchInput).toBeVisible()

    // Type Arabic text without diacritics
    await searchInput.fill('الرحمن')
    await page.keyboard.press('Enter')

    // Results should appear and highlight original Arabic text
    await expect(page.getByTestId('search-result-1:1')).toBeVisible()
    await expect(page.locator('mark.search-highlight').first()).toBeVisible()
  })

  test('search English translation and open matching verse in reader', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('Merciful')
    await page.keyboard.press('Enter')

    const firstResult = page.getByTestId('search-result-1:1')
    await expect(firstResult).toBeVisible()

    // Click result to navigate to reader
    await firstResult.click()
    await expect(page).toHaveURL(/.*reader\?verse=1:1/)
    await expect(page.getByTestId('ayah-card-1:1')).toBeVisible()
  })

  test('search Surah number directly', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('112')
    await page.keyboard.press('Enter')

    await expect(page.getByTestId('search-result-112:1')).toBeVisible()
    await expect(page.getByText(/Al-Ikhlaas|الإخلاص/i)).toBeVisible()
  })

  test('retains query on no-results and supports keyboard navigation', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('totallyunmatchedsearchtermxyz')
    await page.keyboard.press('Enter')

    // Expect empty state and retained query
    await expect(page.getByText(/No Results Found|لم يتم العثور على نتائج/i)).toBeVisible()
    await expect(searchInput).toHaveValue('totallyunmatchedsearchtermxyz')
  })

  test('verse actions: copy and bookmark interaction on search result', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('1:1')
    await page.keyboard.press('Enter')

    const resultCard = page.getByTestId('search-result-1:1')
    await expect(resultCard).toBeVisible()

    // Toggle bookmark
    const bookmarkBtn = resultCard.getByRole('button', { name: /bookmark/i })
    await bookmarkBtn.click()
    await expect(bookmarkBtn).toHaveAttribute('aria-pressed', 'true')

    // Copy button
    const copyBtn = resultCard.getByRole('button', { name: /copy/i })
    await copyBtn.click()
  })
})
