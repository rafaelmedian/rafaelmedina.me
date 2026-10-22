import { expect, test } from "@playwright/test"

// The zoom back into a tile clips the card to the tile's artwork, measured
// from the card's layout when the close starts. Anything that re-lays the card
// before it unmounts slides a different layout under that clip: a 260ms reset
// timer dropped the wide layout mid-way through the 360ms zoom, and a shrunken
// copy of the whole card flashed beside the tile.
test("the card keeps its layout until the zoom back into the tile has finished", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".mosaic-rows").evaluate((element) =>
    Promise.allSettled(element.getAnimations({ subtree: true }).map((animation) => animation.finished)))
  await page.getByRole("link", { name: /Open Matcha multiwallet flow preview/ }).click()

  const popup = page.locator(".preview-gallery-popup")
  await expect(popup).toHaveAttribute("data-wide", "true")
  await page.locator(".preview-gallery-shell").evaluate((shell) =>
    Promise.allSettled(shell.getAnimations({ subtree: true }).map((animation) => animation.finished)))

  // Record every frame from the close press until the popup unmounts.
  await page.evaluate(() => {
    const frames: { wide: string | null; width: number }[] = []
    Object.assign(window, { closeFrames: frames })
    const tick = () => {
      const node = document.querySelector(".preview-gallery-popup")
      if (!node) return
      frames.push({ wide: node.getAttribute("data-wide"), width: node.getBoundingClientRect().width })
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  await page.keyboard.press("Escape")
  await expect(popup).toHaveCount(0)

  const frames = await page.evaluate(() => (window as unknown as { closeFrames: { wide: string | null; width: number }[] }).closeFrames)
  expect(frames.length).toBeGreaterThan(3)
  expect(frames.every((frame) => frame.wide === "true")).toBe(true)
  // And the card only ever shrinks on its way down; a reflow showed as a jump.
  for (let index = 1; index < frames.length; index += 1) {
    expect(frames[index].width).toBeLessThanOrEqual(frames[index - 1].width + 0.5)
  }

  // The next open still starts from the viewport's own choice of layout.
  await page.getByRole("link", { name: /Open Matcha multiwallet flow preview/ }).click()
  await expect(popup).toHaveAttribute("data-wide", "true")
})
