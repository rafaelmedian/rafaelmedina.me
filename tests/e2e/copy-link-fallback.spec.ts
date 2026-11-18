import { expect, test } from '@playwright/test'

for (const mode of ['denied', 'unavailable'] as const) {
  test(`copy link offers a selectable URL when clipboard is ${mode}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.addInitScript(mode => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mode === 'unavailable' ? undefined : {
        writeText: () => Promise.reject(new DOMException('Denied', 'NotAllowedError')),
      } })
    }, mode)
    await page.goto('/notes/designing-matcha/')
    await expect(page.getByRole('dialog')).toBeVisible()
    const prompt = page.waitForEvent('dialog', { timeout: 5000 })
    page.on('dialog', dialog => void dialog.dismiss())
    await page.getByRole('link', { name: 'Copy a link to this note' }).click()
    const dialog = await prompt
    expect(dialog.type()).toBe('prompt')
    expect(dialog.defaultValue()).toBe('https://rafaelmedina.me/notes/designing-matcha/')
    await expect(page).toHaveURL(/\/notes\/designing-matcha\/$/)
  })
}
