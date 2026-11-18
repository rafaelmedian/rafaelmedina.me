import { expect, test } from '@playwright/test'

test('Escape closes Contents before leaving the note', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/notes/designing-matcha/')
  await expect(page.getByRole('dialog')).toBeVisible()
  const contents = page.locator('.writing-contents-trigger')
  await contents.click()
  await page.keyboard.press('Escape')
  await expect(contents).toHaveAttribute('aria-expanded', 'false')
  await expect(contents).toBeFocused()
  await expect(page).toHaveURL(/\/notes\/designing-matcha\/$/)
  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/\/notes\/$/)
})

