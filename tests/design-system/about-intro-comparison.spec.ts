import { expect, test } from '@playwright/test'

for (const width of [320, 1440]) {
  test(`shows all three live options on one page at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/intro-options')
    await expect(page.getByRole('heading', { name: 'Three ways to say hello' })).toBeVisible()
    const cards = page.locator('.intro-comparison-card')
    await expect(cards).toHaveCount(3)
    for (const name of ['Compact pill', 'Chat bubble', 'Stacked buttons']) {
      const card = page.getByRole('region', { name, exact: true })
      await card.scrollIntoViewIfNeeded()
      const frame = await card.boundingBox()
      expect(frame!.x).toBeGreaterThanOrEqual(12)
      expect(frame!.x + frame!.width).toBeLessThanOrEqual(width - 12)
      if (name === 'Chat bubble') {
        await expect(card.getByRole('textbox', { name: 'Your email' })).toBeVisible()
        continue
      }
      await card.getByRole('button', { name: 'Show introduction actions' }).focus()
      await card.getByRole('button', { name: 'Your email', exact: true }).click()
      await expect(card.getByRole('textbox', { name: 'Your email' })).toBeFocused()
      const form = await card.getByRole('region', { name: 'Email reply' }).boundingBox()
      expect(form!.x + form!.width).toBeLessThanOrEqual(frame!.x + frame!.width)
      await page.keyboard.press('Escape')
      await expect(card.getByRole('button', { name: 'Your email', exact: true })).toBeFocused()
    }
    if (width === 1440) {
      const boxes = await cards.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().y))
      expect(new Set(boxes).size).toBe(1)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}

test('plays one comparison video at a time and keeps the players inside their cards', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/intro-options')
  for (const name of ['Compact pill', 'Chat bubble', 'Stacked buttons']) {
    const card = page.getByRole('region', { name, exact: true })
    await card.getByRole('button', { name: 'Show introduction actions' }).focus()
    await card.getByRole('button', { name: 'Play introduction', exact: true }).click()
    await expect.poll(() => page.locator('video[data-recording]').evaluateAll(videos =>
      videos.filter(video => !(video as HTMLVideoElement).paused).length)).toBe(1)
    await expect(card.getByRole('button', { name: 'Pause introduction' })).toBeVisible()
    await expect(card.getByRole('button', { name: 'Expand introduction' })).toHaveCount(0)
    const frame = await card.boundingBox()
    const surface = card.locator('.about-intro-surface')
    await expect(surface).toHaveCSS('width', '240px')
    const player = await surface.boundingBox()
    expect(player!.x).toBeGreaterThanOrEqual(frame!.x)
    expect(player!.x + player!.width).toBeLessThanOrEqual(frame!.x + frame!.width)
  }
})
