import { expect, test } from "@playwright/test"

test("wall photos stay still on hover and show hand cursors for interaction", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await page.mouse.move(5, 5)
  const photo = page.locator('.personal-photos-sheet [data-photo-id="office"]')
  const before = (await photo.boundingBox())!
  await photo.hover()
  await expect(photo).toHaveCSS("cursor", "pointer")
  await expect(photo).toHaveCSS("scale", "none")
  expect((await photo.boundingBox())!.width).toBeCloseTo(before.width, 1)
  await page.mouse.down()
  await page.mouse.move(before.x + before.width / 2 + 40, before.y + before.height / 2, { steps: 4 })
  await expect(photo).toHaveCSS("cursor", "grabbing")
  await page.mouse.up()
  await expect(photo).toHaveCSS("cursor", "pointer")
  await page.mouse.move(5, 5)
  await expect.poll(async () => (await photo.boundingBox())!.width / before.width).toBeLessThan(1.01)
})
