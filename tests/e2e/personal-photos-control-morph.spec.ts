import { expect, test } from "@playwright/test"

for (const width of [390, 1440]) {
  test(`the TOC morphs into Close and back at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")
    await page.locator(".personal-photos-trigger").scrollIntoViewIfNeeded()
    const toc = page.locator(".mosaic-mobile-toc-surface")
    await expect(page.locator(".mosaic-mobile-toc")).toHaveAttribute("data-visible", "true")
    await page.waitForTimeout(300)
    const origin = await toc.boundingBox()
    await page.evaluate(() => {
      const animate = Element.prototype.animate
      Element.prototype.animate = function (...args) {
        const animation = animate.apply(this, args)
        if (this.closest(".personal-photos-wall-close, .personal-photos-flight")) {
          animation.pause()
          animation.currentTime = 0
        }
        return animation
      }
    })
    await page.locator(".personal-photos-label").click()
    const close = page.getByRole("button", { name: "Close photo wall" })
    await expect(close).toBeVisible()
    await expect(close.locator(".personal-photos-control-morph-label")).toContainText("Work")
    const opening = await close.boundingBox()
    expect(Math.abs(opening!.width - origin!.width)).toBeLessThan(1)
    expect(Math.abs(opening!.y - origin!.y)).toBeLessThan(1)
    await close.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()))
    await page.locator(".personal-photos-flight").evaluateAll(elements => elements.forEach(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish())))
    await expect(close.locator(".personal-photos-control-morph-label")).toHaveCount(0)
    await close.click()
    await close.evaluate(async element => {
      const animations = element.getAnimations({ subtree: true })
      await Promise.all(animations.map(animation => animation.ready))
      animations.forEach(animation => { animation.currentTime = Number(animation.effect!.getTiming().duration) - 0.001 })
    })
    const returning = await close.boundingBox()
    expect(Math.abs(returning!.width - origin!.width)).toBeLessThan(1)
    expect(Math.abs(returning!.y - origin!.y)).toBeLessThan(1)
    await expect(page.locator(".personal-photos-dialog")).toHaveCSS("opacity", "1")
    await page.locator(".personal-photos-flight").evaluateAll(elements => elements.forEach(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish())))
    await expect(close).toHaveCount(0)
    await expect(page.getByRole("button", { name: "Table of contents: Work" })).toBeVisible()
  })
}

test("reduced motion keeps the Close control immediate and usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const close = page.getByRole("button", { name: "Close photo wall" })
  await expect(close).toBeVisible()
  await expect(close.locator(".personal-photos-control-morph-label")).toHaveCount(0)
  await close.click()
  await expect(close).toHaveCount(0)
})
