import { expect, test, type Page } from '@playwright/test'

const openAbout = async (page: Page) => {
  await page.goto('/?intro=preview')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const intro = page.getByRole('region', { name: 'A quick hello from Rafael' })
  await expect(intro).toBeVisible()
  return intro
}

test('reveals play on the portrait and offers email and text tooltips', async ({ page }) => {
  const intro = await openAbout(page)
  await expect(intro.locator('.about-intro-play-disc')).toHaveCSS('opacity', '0')
  await intro.getByRole('button', { name: 'Show introduction actions' }).hover()
  await expect(intro.locator('.about-intro-play-disc')).toHaveCSS('opacity', '1')
  const email = intro.getByRole('button', { name: 'Email', exact: true })
  await email.hover()
  await expect(intro.getByRole('tooltip', { name: 'Email', exact: true })).toBeVisible()
  await expect(intro.getByRole('button', { name: 'Text', exact: true })).toBeVisible()
  await expect(intro.getByRole('button', { name: 'Reply on video' })).toHaveCount(0)
})

test('opens a minimal email input with an arrow and returns focus on escape', async ({ page }) => {
  const intro = await openAbout(page)
  await intro.hover()
  await intro.getByRole('button', { name: 'Email', exact: true }).click()
  const panel = intro.getByRole('region', { name: 'Email reply' })
  const email = panel.getByRole('textbox', { name: 'Your email' })
  await expect(email).toBeFocused()
  await expect(panel.getByRole('textbox')).toHaveCount(1)
  await expect(panel.getByRole('button')).toHaveCount(1)
  await expect(panel.locator('header, p')).toHaveCount(0)
  const arrow = panel.getByRole('button', { name: 'Open email draft' })
  const inputBox = await email.boundingBox()
  const arrowBox = await arrow.boundingBox()
  expect(arrowBox!.x).toBeGreaterThan(inputBox!.x)
  expect(Math.abs(inputBox!.y - arrowBox!.y)).toBeLessThan(4)
  await arrow.click()
  await expect(email).toBeFocused()
  await email.fill('hello@example.com')
  await page.keyboard.press('Escape')
  await expect(intro.getByRole('button', { name: 'Email', exact: true })).toBeFocused()
  await expect(intro.locator('video[data-recording]')).not.toHaveAttribute('src')
})

test('opens a compact text composer and keeps delivery explicit', async ({ page }) => {
  const intro = await openAbout(page)
  await intro.hover()
  await intro.getByRole('button', { name: 'Text', exact: true }).click()
  const panel = intro.getByRole('region', { name: 'Text reply' })
  await expect(panel.getByRole('textbox', { name: 'Your message' })).toBeFocused()
  await panel.getByRole('textbox', { name: 'Your message' }).fill('A question & an idea?')
  await panel.getByRole('textbox', { name: 'Your email' }).fill('hello+site@example.com')
  await expect(panel.getByRole('button', { name: 'Open email draft' })).toHaveAttribute('title', 'Review and send in your email app')
  await page.mouse.click(310, 100)
  await expect(panel).toHaveCount(0)
})

test.describe('touch layout', () => {
  test.use({ hasTouch: true, isMobile: true })

test('keeps minimal email controls together at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  const intro = await openAbout(page)
  await intro.getByRole('button', { name: 'Show introduction actions' }).tap()
  await intro.getByRole('button', { name: 'Email', exact: true }).click()
  const panel = intro.getByRole('region', { name: 'Email reply' })
  const box = await panel.boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(12)
  expect(box!.x + box!.width).toBeLessThanOrEqual(308)
  expect(box!.height).toBeLessThanOrEqual(64)
  await page.setViewportSize({ width: 320, height: 420 })
  await expect(panel.getByRole('button', { name: 'Open email draft' })).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
})

})
