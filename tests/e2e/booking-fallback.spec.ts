import { expect, test } from '@playwright/test'

test('a failed booking chunk preserves the page and can be retried', async ({ page }) => {
  let fail = true
  await page.route('**/BookingDialog-*.js*', route => fail ? route.abort() : route.continue())
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('.mosaic-booking-pill').click()
  const retry = page.getByRole('button', { name: 'Try opening the conversation again' })
  await expect(retry).toBeVisible()
  await expect(page.locator('.mosaic-booking-pill')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open it on cal.com' })).toHaveAttribute('href', 'https://cal.com/rafaelmedian/30min')
  fail = false
  await retry.click()
  await expect(page.getByRole('dialog', { name: 'Chat with Rafael Medina' })).toBeVisible()
})

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

test('a failed booking stylesheet retries before presenting the dialog', async ({ page }) => {
  let fail = true
  await page.route('**/BookingDialog-*.css*', route => fail ? route.abort() : route.continue())
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('.mosaic-booking-pill').click()
  await expect(page.getByRole('button', { name: 'Try opening the conversation again' })).toBeVisible()
  expect(await page.getByRole('dialog').count()).toBe(0)
  fail = false
  await page.getByRole('button', { name: 'Try opening the conversation again' }).click()
  const dialog = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveCSS('position', 'relative')
  await expect(page.locator('.booking-shell')).toHaveCSS('position', 'fixed')
})

test('retry repairs every failed conversation stylesheet', async ({ page }) => {
  let fail = true
  await page.route(/\/(BookingDialog|CalendarThumbnail)-[^/]+\.css$/, route => fail ? route.abort() : route.continue())
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('.mosaic-booking-pill').click()
  await expect(page.getByRole('button', { name: 'Try opening the conversation again' })).toBeVisible()
  fail = false
  await page.getByRole('button', { name: 'Try opening the conversation again' }).click()
  await expect(page.getByRole('dialog', { name: 'Chat with Rafael Medina' })).toBeVisible()
  await expect(page.locator('.booking-shell')).toHaveCSS('position', 'fixed')
  await page.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await page.getByRole('button', { name: 'Continue with email' }).click()
  await expect(page.locator('.booking-thumbnail-grid')).toHaveCSS('display', 'grid')
})
