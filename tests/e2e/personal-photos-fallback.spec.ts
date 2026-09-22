import { expect, test } from "@playwright/test"

for (const mode of ["flat", "watch"]) {
  test(`${mode} mode finishes opening through DOM flights`, async ({ page }) => {
    await page.goto("/")
    // Use the same settings as the dev tuner's flat toggle and Watch mode.
    await page.addStyleTag({ content: `.personal-photos-sheet[data-layout="wall"] {
      --wall-bend: 0; --wall-rim: 0; --wall-watch-shrink: ${mode === "watch" ? 0.3 : 0};
    }` })
    await page.locator(".personal-photos-label").click()
    const wall = page.getByRole("region", { name: "Photo wall" })
    await expect(wall).toBeVisible()
    await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
    await expect(wall.locator("canvas")).toBeHidden()
    await expect(wall.locator(".personal-photos-masonry")).toHaveCSS("opacity", "1")
    await wall.press("ArrowRight")
    await expect(wall.locator(".personal-photos-slide[data-held]")).toHaveCount(1)
    await page.getByRole("button", { name: "Close photo wall" }).click()
    await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
  })
}

test("disabling curvature during opening releases the GPU flights", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => {
    const animate = Element.prototype.animate
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args)
      if (this.closest(".personal-photos-flight")) { animation.pause(); animation.currentTime = 0 }
      return animation
    }
  })
  await page.locator(".personal-photos-label").click()
  await expect(page.locator("[data-warp-ready]")).toHaveCount(1)
  await page.addStyleTag({ content: '.personal-photos-sheet[data-layout="wall"] { --wall-bend: 0; --wall-rim: 0; }' })
  await page.evaluate(() => window.dispatchEvent(new Event("photo-wall-curve-change")))
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await expect(page.locator(".personal-photos-masonry")).toHaveCSS("opacity", "1")
})

test("a failed photo does not block the wall opening", async ({ page }) => {
  await page.route("**/images/personal/office*", route => route.abort())
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const wall = page.getByRole("region", { name: "Photo wall" })
  await expect(wall).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await expect(wall.locator(".personal-photos-masonry")).toHaveCSS("opacity", "1")
  await expect(wall.locator('[data-photo-id="night-portrait"]')).toHaveCSS("opacity", "1")
  await wall.press("ArrowRight")
  await expect(wall.locator(".personal-photos-slide[data-held]")).toHaveCount(1)
  await page.getByRole("button", { name: "Close photo wall" }).click()
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
})
