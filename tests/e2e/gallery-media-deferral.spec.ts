import { expect, test } from '@playwright/test'

test('a direct notes entry defers project images until the feed is revealed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const projects: string[] = []
  page.on('request', request => { if (request.url().includes('/Projects/')) projects.push(request.url()) })
  await page.goto('/notes/')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').locator('.writing-entry-trigger')).toHaveCount(10)
  // Observe an idle interval too: postponed effects must not start these downloads.
  await page.waitForTimeout(300)
  expect(projects).toEqual([])
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect.poll(() => projects.length).toBeGreaterThan(0)
  await expect.poll(() => page.locator('img.mosaic-row-media').first().evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
})
