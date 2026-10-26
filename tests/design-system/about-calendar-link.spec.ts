import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  for (const confirmed of [false, true]) {
    test(`About calendar opens scheduling ${confirmed ? 'with' : 'without'} an email at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.route('https://cal.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Calendar</title>' }))
      await page.goto('/?tune=off')
      await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
      await page.locator('.about-intro-portrait-trigger').click()
      const chat = page.locator('.about-intro-chat')
      if (confirmed) {
        await chat.getByRole('textbox', { name: 'Your email', exact: true }).fill('visitor@example.com')
        await chat.getByRole('button', { name: 'Continue with email' }).click()
      }
      await chat.getByRole('link', { name: /30-min call with Rafael/ }).click()
      const dialog = page.getByRole('dialog', { name: 'Chat with Rafael Medina' })
      const calendar = dialog.locator('iframe')
      await expect(calendar).toBeVisible()
      const url = new URL((await calendar.getAttribute('src'))!)
      expect(url.searchParams.get('email')).toBe(confirmed ? 'visitor@example.com' : null)
      await dialog.getByRole('button', { name: 'Back to conversation' }).click()
      await expect(dialog.getByRole('textbox', { name: confirmed ? 'Your message' : 'Your email', exact: true })).toBeVisible()
    })
  }
}
