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

// The zoom used to bend towards its tile mid-flight -- a projective
// transform pinched the edge facing the tile -- and on a wide card that read
// as the whole card tilting into a parallelogram. The surface is a rectangle
// the whole way now: every keyframe is a plain translate and scale, with no
// overshoot past rest on either leg.
test("the zoom stays a flat rectangle and never overshoots", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".mosaic-rows").evaluate((element) =>
    Promise.allSettled(element.getAnimations({ subtree: true }).map((animation) => animation.finished)))

  // Capture the flights as they are created. Under load one can finish
  // before a later browser round-trip inspects document.getAnimations().
  await page.evaluate(() => {
    const flights: string[][] = []
    Object.assign(window, { zoomFlights: flights })
    const animate = Element.prototype.animate
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args)
      const frames = (animation.effect as KeyframeEffect).getKeyframes()
      if (frames.some(frame => "clipPath" in frame)) flights.push(frames.map(frame => String(frame.transform)))
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
    (window as unknown as { zoomFlights: string[][] }).zoomFlights)

  for (const frames of [open, close]) {
    expect(frames).toBeDefined()
    const scales = frames!.map(transform => {
      expect(transform).toMatch(/^translate3d\(.*\) scale\([\d.]+\)$/)
      return Number(/scale\(([\d.]+)\)/.exec(transform)![1])
    })
    expect(Math.max(...scales)).toBeLessThanOrEqual(1)
  }
  expect(open![0]).not.toBe(open!.at(-1))
})

// The artwork lands first and the card's body unfolds under it. Opening the
// body with the picture put a blank tile-coloured sheet the size of the screen
// under a wide card, which read as a grey box appearing and then loading. So
// the clip's bottom edge stays on the artwork's frame until the surface is
// all but full size, and only the last keyframe reaches the card's bottom.
test("the open lands the artwork before it unfolds the card's body", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".mosaic-rows").evaluate((element) =>
    Promise.allSettled(element.getAnimations({ subtree: true }).map((animation) => animation.finished)))
  await page.evaluate(() => {
    const flights: { transform: string; clip: string }[][] = []
    Object.assign(window, { zoomFlights: flights })
    const animate = Element.prototype.animate
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args)
      const frames = (animation.effect as KeyframeEffect).getKeyframes()
      if (frames.some(frame => "clipPath" in frame)) {
        flights.push(frames.map(frame => ({ transform: String(frame.transform), clip: String(frame.clipPath) })))
      }
      return animation
    }
  })
  await page.getByRole("link", { name: /Open Matcha multiwallet flow preview/ }).click()
  const popup = page.locator(".preview-gallery-popup")
  await expect(popup).toHaveAttribute("data-wide", "true")
  const [open] = await page.evaluate(() =>
    (window as unknown as { zoomFlights: { transform: string; clip: string }[][] }).zoomFlights)
  // The card's geometry at rest, which the keyframes are written in.
  await page.locator(".preview-gallery-shell").evaluate((shell) =>
    Promise.allSettled(shell.getAnimations({ subtree: true }).map((animation) => animation.finished)))
  const { cardHeight, frameBottom } = await page.locator(".preview-gallery-origin-wrap").evaluate((wrap) => {
    const frame = wrap.querySelector(".preview-gallery-media-frame")!.getBoundingClientRect()
    const card = wrap.getBoundingClientRect()
    return { cardHeight: card.height, frameBottom: frame.bottom - card.top }
  })
  // The clip's lowest point: the largest y in its path.
  const bottomOf = (clip: string) => Math.max(...[...clip.matchAll(/-?[\d.]+ (-?[\d.]+)/g)].map(match => Number(match[1])))
  const scaleOf = (transform: string) => Number(/scale\(([\d.]+)\)/.exec(transform)![1])
  const scaleFrom = scaleOf(open[0].transform)
  const grownOf = (transform: string) => (scaleOf(transform) - scaleFrom) / (1 - scaleFrom)
  // Nine tenths of the way out the clip sits on the artwork's frame; with the
  // surface all but at full size it has only begun to unfold; at rest it is
  // the whole card.
  const nearly = open.findIndex(frame => grownOf(frame.transform) >= 0.9)
  const landed = open.findIndex(frame => grownOf(frame.transform) >= 0.98)
  expect(nearly).toBeGreaterThan(0)
  expect(landed).toBeGreaterThan(nearly)
  expect(Math.abs(bottomOf(open[nearly].clip) - frameBottom)).toBeLessThan(cardHeight * 0.05)
  expect(bottomOf(open[landed].clip)).toBeGreaterThan(frameBottom)
  expect(bottomOf(open[landed].clip)).toBeLessThan(cardHeight - 20)
  expect(bottomOf(open.at(-1)!.clip)).toBeCloseTo(cardHeight, 0)
})

// A close pressed while the card is still growing used to cancel the open,
// which snapped the card to its full size, and shrink it from there: a jump
// to rest and back. It shrinks from the size it had reached.
test("a close mid-open resumes from the card's current size", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.locator(".mosaic-rows").evaluate((element) =>
    Promise.allSettled(element.getAnimations({ subtree: true }).map((animation) => animation.finished)))
  await page.getByRole("link", { name: /Open Matcha multiwallet flow preview/ }).click()
  const wrap = page.locator(".preview-gallery-origin-wrap")
  await expect(wrap).toHaveCount(1)
  // Hold the open a third of the way through, measure, then close.
  const before = await wrap.evaluate((element) => {
    const [flight] = element.getAnimations()
    flight.pause()
    flight.currentTime = Number((flight.effect as KeyframeEffect).getTiming().duration) / 3
    return element.getBoundingClientRect().width
  })
  await page.evaluate(() => {
    const widths: number[] = []
    Object.assign(window, { closeWidths: widths })
    const tick = () => {
      const node = document.querySelector(".preview-gallery-origin-wrap")
      if (!node) return
      widths.push(node.getBoundingClientRect().width)
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  await page.keyboard.press("Escape")
  await expect(page.locator(".preview-gallery-popup")).toHaveCount(0)
  const widths = await page.evaluate(() => (window as unknown as { closeWidths: number[] }).closeWidths)
  expect(widths.length).toBeGreaterThan(3)
  const rest = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize))
  // The first frame of the close is within a step of where the open was
  // held, nowhere near the card's resting width, and from there it only
  // shrinks.
  expect(Math.abs(widths[0] - before)).toBeLessThan(rest * 4)
  for (let index = 1; index < widths.length; index += 1) {
    expect(widths[index]).toBeLessThanOrEqual(widths[index - 1] + 0.5)
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
