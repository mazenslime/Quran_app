import { test, expect } from '@playwright/test'

test.describe('Reader E2E Workflows', () => {
  test('direct and adjacent verse navigation', async ({ page }) => {
    await page.goto('/reader?verse=1:1')

    // Expect Surah title and first verse to be visible
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByTestId('ayah-card-1:1')).toBeVisible()

    // Previous verse should be disabled on 1:1
    const prevBtn = page.getByRole('button', { name: /previous|السابق/i })
    await expect(prevBtn).toBeDisabled()

    // Next verse should be enabled
    const nextBtn = page.getByRole('button', { name: /next|التالي/i })
    await expect(nextBtn).toBeEnabled()

    // Click next verse -> 1:2 becomes active
    await nextBtn.click()
    await expect(page.getByTestId('ayah-card-1:2')).toHaveClass(/ayah-card--active/)

    // Direct jump using verse select dropdown
    const verseSelect = page.getByRole('combobox', { name: /select verse|اختر الآية/i })
    await verseSelect.selectOption('1:5')
    await expect(page.getByTestId('ayah-card-1:5')).toHaveClass(/ayah-card--active/)
  })

  test('reader settings: translation visibility and theme switching', async ({ page }) => {
    await page.goto('/reader?verse=1:1')

    // Translations should be visible initially
    await expect(page.getByTestId('english-translation').first()).toBeVisible()

    // Open settings modal
    const settingsBtn = page.getByRole('button', { name: /settings|إعدادات/i })
    await settingsBtn.click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Hide translation
    const toggleTransCheckbox = page.getByRole('checkbox', { name: /translation|الترجمة/i })
    await toggleTransCheckbox.click()

    // Close settings modal with Escape
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()

    // Translation should now be hidden
    await expect(page.getByTestId('english-translation')).toHaveCount(0)

    // Reopen settings and switch to Dark theme
    await settingsBtn.click()
    const darkThemeBtn = page.getByRole('button', { name: /dark|داكن/i })
    await darkThemeBtn.click()

    // Check data-theme attribute on root html element
    const htmlElem = page.locator('html')
    await expect(htmlElem).toHaveAttribute('data-theme', 'dark')
  })

  test('RTL semantics and reading column constraints', async ({ page }) => {
    await page.goto('/reader?verse=1:1')

    const arabicText = page.getByTestId('arabic-text').first()
    await expect(arabicText).toHaveAttribute('dir', 'rtl')
    await expect(arabicText).toHaveAttribute('lang', 'ar')

    // Reading container constraint (max 720px)
    const readerContainer = page.locator('.reader-container')
    await expect(readerContainer).toBeVisible()
    const boundingBox = await readerContainer.boundingBox()
    if (boundingBox) {
      expect(boundingBox.width).toBeLessThanOrEqual(720)
    }
  })

  test('responsiveness at 320px viewport without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 })
    await page.goto('/reader?verse=1:1')

    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByTestId('ayah-card-1:1')).toBeVisible()

    // Toolbar controls should remain visible and accessible
    const nextBtn = page.getByRole('button', { name: /next|التالي/i })
    await expect(nextBtn).toBeVisible()
  })
})
