import { test, expect } from '@playwright/test'

test.describe('RTL & Locale Navigation E2E (T043)', () => {
  test('toggles English and Arabic UI with correct html attributes', async ({ page }) => {
    await page.goto('/')

    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', 'en')
    await expect(html).toHaveAttribute('dir', 'ltr')

    // Find language toggle button
    const langBtn = page.getByRole('button', { name: /switch interface to arabic|تغيير اللغة إلى الإنجليزية/i })
    await langBtn.click()

    // Shell direction changes to RTL
    await expect(html).toHaveAttribute('lang', 'ar')
    await expect(html).toHaveAttribute('dir', 'rtl')

    // Navigate to reader
    await page.goto('/reader?verse=1:1')

    // Arabic text stays RTL
    const arabicVerse = page.getByTestId('arabic-text').first()
    await expect(arabicVerse).toHaveAttribute('dir', 'rtl')
    await expect(arabicVerse).toHaveAttribute('lang', 'ar')

    // English translation stays LTR
    const translation = page.getByTestId('english-translation').first()
    await expect(translation).toHaveAttribute('dir', 'ltr')
    await expect(translation).toHaveAttribute('lang', 'en')
  })
})
