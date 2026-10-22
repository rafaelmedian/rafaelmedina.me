import { expect, test } from '@playwright/test'

test('a blocked calendar still offers a direct booking link', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('https://cal.com/**', route => route.abort('failed'))
  await page.goto('/')
  await page.locator('.mosaic-booking-pill').click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await dialog.getByRole('button', { name: 'Continue with email' }).click()
  await dialog.getByRole('button', { name: 'Book a time', exact: true }).click()
  await expect(dialog.locator('iframe')).toBeVisible()
  const fallback = dialog.getByRole('link', { name: 'Open it on cal.com' })
  await expect(fallback).toBeVisible({ timeout: 8000 })
  await expect(fallback).toHaveAttribute('href', 'https://cal.com/rafaelmedian/30min?email=visitor%40example.com')
  await expect(fallback).toHaveAttribute('target', '_blank')
})
