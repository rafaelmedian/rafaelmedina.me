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

// The zoom morphs on the way: mid-flight the surface is projected onto a quad
// whose edge facing the tile is pinched, so its transform carries a
// perspective row. It must be a plain rectangle at both ends, though: on the
// tile, where its clip has to match the tile's outline, and at rest.
test("the zoom bends towards its tile mid-flight and is flat at both ends", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".mosaic-rows").evaluate((element) =>
    Promise.allSettled(element.getAnimations({ subtree: true }).map((animation) => animation.finished)))

  // Capture the flight as it is created. Under load it can finish before a
  // later browser round-trip inspects document.getAnimations().
  await page.evaluate(() => {
    const flights: number[][] = []
    Object.assign(window, { morphFlights: flights })
    const animate = Element.prototype.animate
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args)
      const frames = (animation.effect as KeyframeEffect).getKeyframes()
      if (frames.some(frame => String(frame.transform ?? "").startsWith("matrix3d"))) {
        flights.push(frames.map(frame => {
          const matrix = new DOMMatrixReadOnly(String(frame.transform))
          return Math.abs(matrix.m14) + Math.abs(matrix.m24)
        }))
      }
      return animation
    }
  })
  await page.getByRole("link", { name: /Open Matcha multiwallet flow preview/ }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.locator(".preview-gallery-shell").evaluate((shell) =>
    Promise.allSettled(shell.getAnimations({ subtree: true }).map((animation) => animation.finished)))
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  const [open, close] = await page.evaluate(() =>
    (window as unknown as { morphFlights: number[][] }).morphFlights)

  for (const frames of [open, close]) {
    expect(frames).toBeDefined()
    expect(frames![0]).toBe(0)
    expect(frames!.at(-1)).toBe(0)
    expect(Math.max(...frames!)).toBeGreaterThan(0)
  }
})

// A tile opens on a press; dragging one used to pull a translucent copy of
// the image under the pointer off the grid instead.
test("tiles cannot be dragged off the grid", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  const cancelled = await page.locator(".mosaic-rows img").first().evaluate((image) => {
    const event = new DragEvent("dragstart", { bubbles: true, cancelable: true })
    image.dispatchEvent(event)
    return event.defaultPrevented
  })
  expect(cancelled).toBe(true)
})

// The fill that carries the card out to the tile's outline is painted by the
// flying wrapper, outside the popup whose opacity fades the close off the
// tile. Held opaque, it covered the tile as a blank tile-coloured shape until
// the dialog unmounted, and the tile flashed back in. It must end clear.
test("the close lets go of the tile's fill as the card fades off it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".mosaic-rows").evaluate((element) =>
    Promise.allSettled(element.getAnimations({ subtree: true }).map((animation) => animation.finished)))
  await page.getByRole("link", { name: /Open Matcha multiwallet flow preview/ }).click()
  await page.locator(".preview-gallery-shell").evaluate((shell) =>
    Promise.allSettled(shell.getAnimations({ subtree: true }).map((animation) => animation.finished)))

  await page.keyboard.press("Escape")
  const last = await page.locator(".preview-gallery-origin-wrap").evaluate((wrap) => {
    const fill = wrap.getAnimations().find((animation) =>
      (animation.effect as KeyframeEffect).getKeyframes().some((frame) => "boxShadow" in frame))
    const frame = (fill?.effect as KeyframeEffect | undefined)?.getKeyframes().at(-1)
    return frame ? { shadow: String(frame.boxShadow), fill: String(frame.backgroundColor) } : null
  })
  expect(last).not.toBeNull()
  expect(last!.fill).toMatch(/rgba\(.*,\s*0\)$/)
  expect(last!.shadow).toMatch(/^rgba\([^)]*,\s*0\)/)
})

// The clip that hides the tile-coloured fill around the card runs on the
// compositor and can land a frame after the fill paints. Where the card is at
// rest -- the open's last frame, the close's first -- the fill must already
// be gone, or that frame shows the card in a box ~170px wider on every side.
test("the fill around the card is gone wherever the card is at rest", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".mosaic-rows").evaluate((element) =>
    Promise.allSettled(element.getAnimations({ subtree: true }).map((animation) => animation.finished)))
  const wrap = page.locator(".preview-gallery-origin-wrap")
  const spreads = () => wrap.evaluate((element) => {
    const fill = element.getAnimations().find((animation) =>
      (animation.effect as KeyframeEffect).getKeyframes().some((frame) => "boxShadow" in frame))
    return (fill?.effect as KeyframeEffect | undefined)?.getKeyframes().map((frame) => {
      const lengths = String(frame.boxShadow).match(/-?[\d.]+px/g) ?? []
      return { spread: parseFloat(lengths[3] ?? "0"), behind: String(frame.backgroundColor) }
    }) ?? null
  })

  await page.getByRole("link", { name: /Open Matcha multiwallet flow preview/ }).click()
  const open = await spreads()
  expect(open).not.toBeNull()
  // It does reach past the card mid-flight: this tile is wider than the card.
  expect(Math.max(...open!.map((frame) => frame.spread))).toBeGreaterThan(50)
  expect(open!.at(-1)!.spread).toBe(0)
  expect(open!.at(-1)!.behind).toMatch(/rgba\(.*,\s*0\)$/)
  await page.locator(".preview-gallery-shell").evaluate((shell) =>
    Promise.allSettled(shell.getAnimations({ subtree: true }).map((animation) => animation.finished)))

  await page.keyboard.press("Escape")
  const close = await spreads()
  expect(close).not.toBeNull()
  expect(close![0].spread).toBe(0)
  expect(close![0].behind).toMatch(/rgba\(.*,\s*0\)$/)
})
