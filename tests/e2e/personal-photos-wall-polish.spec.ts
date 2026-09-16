import { expect, test } from "@playwright/test"

test("wall hover grows the photo and returns when the pointer leaves", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await page.mouse.move(5, 5)
  const photo = page.locator('.personal-photos-sheet [data-photo-id="office"]')
  const before = (await photo.boundingBox())!
  await photo.hover()
  await expect(photo).toHaveCSS("cursor", "pointer")
  await expect.poll(async () => (await photo.boundingBox())!.width / before.width).toBeGreaterThan(1.03)
  await page.mouse.move(5, 5)
  await expect.poll(async () => (await photo.boundingBox())!.width / before.width).toBeLessThan(1.01)
})
