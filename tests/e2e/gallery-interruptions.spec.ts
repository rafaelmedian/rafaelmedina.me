import { expect, test } from "@playwright/test"

test("closing a fading preview preserves its current opacity", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".mosaic-rows").evaluate(element =>
    Promise.allSettled(element.getAnimations({ subtree: true }).map(animation => animation.finished)))
  const tile = page.locator(".mosaic-row-card-preview-matcha-marketing")
  await tile.scrollIntoViewIfNeeded()
  // Freeze both flights so the turn can be inspected without a frame race.
  await page.evaluate(() => {
    const animate = Element.prototype.animate
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args)
      animation.playbackRate = 0
      return animation
    }
  })
  await tile.click()
  const popup = page.locator(".preview-gallery-popup")
  await expect(popup).toHaveCount(1)
  const before = await popup.evaluate(element => {
    const shell = element.closest(".preview-gallery-shell")!
    for (const animation of shell.getAnimations({ subtree: true })) {
      if (!(animation instanceof CSSTransition)) animation.currentTime = 25
    }
    return Number(getComputedStyle(element).opacity)
  })
  expect(before).toBeGreaterThan(0)
  expect(before).toBeLessThan(0.5)

  await page.keyboard.press("Escape")
  const after = await popup.evaluate(element => Number(getComputedStyle(element).opacity))
  expect(after).toBeCloseTo(before, 2)
  // The remainder of the close only fades out; it never brightens first.
  const opacities = await popup.evaluate(element => element.getAnimations()
    .flatMap(animation => (animation.effect as KeyframeEffect).getKeyframes())
    .filter(frame => "opacity" in frame).map(frame => Number(frame.opacity)))
  expect(opacities.length).toBeGreaterThan(1)
  expect(Math.max(...opacities)).toBeLessThanOrEqual(before + 0.001)
  expect(opacities.at(-1)).toBe(0)
})
