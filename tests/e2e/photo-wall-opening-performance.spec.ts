import { expect, test } from "@playwright/test"
import { personalPhotoItems } from "../../src/data/personalPhotos"

test("opening the wall measures the visible prints without laying out a selection", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.addInitScript(() => {
    const counts = { styles: 0 }
    Object.assign(window, { photoStyleReads: counts })
    const read = window.getComputedStyle
    window.getComputedStyle = function (element, pseudo) {
      if (element.classList.contains("personal-photos-slide")) counts.styles++
      return read.call(window, element, pseudo)
    }
  })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("region", { name: "Photo wall" })).toBeVisible()
  await expect(page.locator(".personal-photos-sheet[data-entering]")).toHaveCount(0)
  const reads = await page.evaluate(() => (window as unknown as { photoStyleReads: { styles: number } }).photoStyleReads.styles)
  // Nine copies keep panning seamless, but opening only needs styles for
  // the prints in view. Leave room for setup and visibility bookkeeping;
  // measuring all nine copies to apply zero selection offsets exceeds this.
  expect(reads).toBeLessThan(personalPhotoItems.length * 3)
})
