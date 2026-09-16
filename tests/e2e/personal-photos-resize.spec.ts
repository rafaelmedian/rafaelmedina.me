import { expect, test } from "@playwright/test"

test("rotating the viewport releases a held wall photo and allows a new centred hold", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("personal-photos-layout", "grid"))
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const sheet = page.getByRole("region", { name: "Photo wall" })
  const photo = sheet.locator(".personal-photos-slide").first()
  await photo.click()
  await expect(photo).toHaveAttribute("data-held", "")

  await page.setViewportSize({ width: 844, height: 390 })
  await expect(sheet.locator("[data-held]")).toHaveCount(0)
  await expect(page.locator(".personal-photos-stage-caption")).toHaveText("")
  await expect(sheet).toBeVisible()

  // Keyboard focus brings the photo into the camera view without scrolling
  // the clipped stage in this short landscape viewport.
  await photo.evaluate((element) => element.focus({ preventScroll: true }))
  await page.keyboard.press("Enter")
  await expect(photo).toHaveAttribute("data-held", "")
  await expect.poll(async () => {
    const box = (await photo.boundingBox())!
    return Math.hypot(box.x + box.width / 2 - 422, box.y + box.height / 2 - 147)
  }).toBeLessThan(2)
  const box = (await photo.boundingBox())!
  expect(box.y).toBeGreaterThanOrEqual(0)
  expect(box.y + box.height).toBeLessThanOrEqual(390)
  await expect(page.locator(".personal-photos-stage-caption")).toBeInViewport()
})
