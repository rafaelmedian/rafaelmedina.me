import { expect, test } from "@playwright/test"

type RecordedFlight = { animation: Animation; frames: ComputedKeyframe[] }

test("a finished opening animation does not change the closing bend", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const closes: string[][] = []
  // Keeping or discarding a finished effect cannot change the next flight.
  // Previously its retained currentTime made an ordinary close look like an
  // interrupted open, so only discarding it restored the closing bend.
  for (const discardFinished of [false, true]) {
    await page.goto("/")
    await page.evaluate(() => document.fonts.ready)
    await page.locator(".mosaic-rows").evaluate(element =>
      Promise.allSettled(element.getAnimations({ subtree: true }).map(animation => animation.finished)))
    await page.evaluate(() => {
      const flights: RecordedFlight[] = []
      Object.assign(window, { recordedOriginFlights: flights })
      const animate = Element.prototype.animate
      Element.prototype.animate = function (...args) {
        const animation = animate.apply(this, args)
        const frames = (animation.effect as KeyframeEffect).getKeyframes()
        if (this.matches(".preview-gallery-origin-wrap") && frames.some(frame => "clipPath" in frame)) {
          flights.push({ animation, frames })
        }
        return animation
      }
    })
    await page.getByRole("link", { name: /Open Matcha multiwallet flow preview/ }).click()
    await page.locator(".preview-gallery-shell").evaluate(element =>
      Promise.allSettled(element.getAnimations({ subtree: true }).map(animation => animation.finished)))
    const state = await page.evaluate(discard => {
      const { recordedOriginFlights: [flight] } = window as unknown as { recordedOriginFlights: RecordedFlight[] }
      const state = flight.animation.playState
      if (discard) flight.animation.cancel()
      return state
    }, discardFinished)
    expect(state).toBe("finished")
    await page.keyboard.press("Escape")
    await expect(page.locator(".preview-gallery-popup")).toHaveCount(0)
    closes.push(await page.evaluate(() => {
      const { recordedOriginFlights: flights } = window as unknown as { recordedOriginFlights: RecordedFlight[] }
      return flights[1].frames.map(frame => String(frame.transform))
    }))
  }
  expect(closes[0]).toEqual(closes[1])
})

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
