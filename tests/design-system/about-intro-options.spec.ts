import { expect, test } from '@playwright/test'

for (const variant of ['b', 'c']) {
  for (const width of [320, 1440]) {
    test(`option ${variant.toUpperCase()} supports replies and playback at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto(`/?introStyle=${variant}`)
      await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
      const intro = page.getByRole('region', { name: 'A quick hello from Rafael' })
      await expect(intro).toHaveAttribute('data-variant', variant)
      const email = intro.getByRole('button', { name: 'Your email', exact: true })
      const text = intro.getByRole('button', { name: 'Text me', exact: true })
      await expect(email).toBeVisible()
      await expect(text).toBeVisible()
      if (variant === 'b') await expect(intro.getByText('How can I help today?')).toBeVisible()
      const selector = page.getByRole('complementary', { name: 'Introduction design options' })
      const selectorBox = await selector.boundingBox()
      expect(selectorBox!.y).toBeLessThan(20)
      expect(selectorBox!.x).toBeGreaterThanOrEqual(12)
      expect(selectorBox!.x + selectorBox!.width).toBeLessThanOrEqual(width - 12)
      const actions = intro.locator('.about-intro-actions')
      const box = await actions.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(12)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width - 12)
      await email.click()
      await expect(intro.getByRole('textbox', { name: 'Your email' })).toBeFocused()
      await page.mouse.click(width / 2, 300)
      await expect(email).toBeVisible()
      await text.click()
      await expect(intro.getByRole('textbox', { name: 'Your message' })).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(text).toBeFocused()
      await intro.getByRole('button', { name: 'Show introduction actions' }).focus()
      await intro.getByRole('button', { name: 'Play introduction', exact: true }).click()
      await expect(intro.getByRole('button', { name: 'Pause introduction' })).toBeVisible()
      await expect(page.getByRole('complementary', { name: 'Introduction design options' })).toHaveCount(0)
      await page.keyboard.press('Escape')
      await expect(intro).toHaveAttribute('data-open', 'false')
      await expect(email).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    })
  }
}

test('switches between A B and C and keeps the selection in the URL', async ({ page }) => {
  await page.goto('/')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const intro = page.getByRole('region', { name: 'A quick hello from Rafael' })
  const selector = page.getByRole('group', { name: 'Choose introduction style' })
  for (const [letter, name] of [['b', 'Chat bubble'], ['c', 'Stacked buttons'], ['a', 'Compact pill']]) {
    const button = selector.getByRole('button', { name: `${letter.toUpperCase()}: ${name}` })
    await button.click()
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(intro).toHaveAttribute('data-variant', letter)
    await expect(page).toHaveURL(new RegExp(`introStyle=${letter}`))
  }
})
