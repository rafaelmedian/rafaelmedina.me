import { expect, test } from '@playwright/test'

for (const preference of ['reduce', 'save-data'] as const) {
  test(`video offers keyboard playback with ${preference}`, async ({ page }) => {
    if (preference === 'reduce') await page.emulateMedia({ reducedMotion: 'reduce' })
    else await page.addInitScript(() => Object.defineProperty(navigator, 'connection', {
      configurable: true, value: Object.assign(new EventTarget(), { saveData: true, effectiveType: '3g' }),
    }))
    await page.goto('/work/matcha-multiwallet-flow/')
    const video = page.getByRole('dialog').locator('video')
    await expect(video).toBeVisible()
    await expect(video).toHaveJSProperty('paused', true)
    await expect(video).toHaveJSProperty('controls', true)
    await video.focus()
    await page.keyboard.press('Space')
    await expect(video).toHaveJSProperty('paused', false)
    await page.keyboard.press('Space')
    await expect(video).toHaveJSProperty('paused', true)
  })
}
