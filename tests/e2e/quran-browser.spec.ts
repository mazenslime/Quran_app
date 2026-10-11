import { test, expect } from '@playwright/test'

test.describe('Quran Browser E2E Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays all browse orders and filters surahs', async ({ page }) => {
    // Check header and tabs
    await expect(page.locator('h1')).toBeVisible()

    // Default Mushaf order
    const mushafTab = page.getByRole('tab', { name: /mushaf/i })
    await expect(mushafTab).toHaveAttribute('aria-selected', 'true')

    // Check Al-Fatihah exists
    await expect(page.getByText(/Al-Faatiha/i)).toBeVisible()

    // Filter by name
    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('Baqara')
    await expect(page.getByText(/Al-Baqara/i)).toBeVisible()
    await expect(page.getByText(/Al-Faatiha/i)).not.toBeVisible()

    // Clear filter
    await searchInput.clear()

    // Switch to Revelation order
    const revTab = page.getByRole('tab', { name: /revelation/i })
    await revTab.click()
    await expect(revTab).toHaveAttribute('aria-selected', 'true')

    // First in revelation is Surah 96 (Al-Alaq)
    const firstCard = page.locator('.surah-card').first()
    await expect(firstCard).toContainText('Al-Alaq')

    // Switch to Juz order
    const juzTab = page.getByRole('tab', { name: /juz/i })
    await juzTab.click()
    await expect(juzTab).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText(/^Juz 1$/i)).toBeVisible()
    await expect(page.getByText(/Juz 30/i)).toBeVisible()
  })

  test('supports keyboard navigation through browse modes', async ({ page }) => {
    // Focus searchbox
    const searchInput = page.getByRole('searchbox')
    await searchInput.focus()
    await expect(searchInput).toBeFocused()

    // Tab to tabs
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
  })
})
