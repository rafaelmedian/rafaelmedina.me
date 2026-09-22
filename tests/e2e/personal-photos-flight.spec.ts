import { expect, test } from "@playwright/test"

for (const width of [1440, 390]) {
  test(`wall photos stay visible throughout open and close at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")
    await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
    // Freeze real flights so the intermediate frames cannot escape inspection.
    await page.evaluate(() => {
      const animate = Element.prototype.animate
      Element.prototype.animate = function (...args) {
        const animation = animate.apply(this, args)
        if (this.closest(".personal-photos-flight")) {
          animation.pause()
          animation.currentTime = 0
        }
        return animation
      }
    })
    await page.locator(".personal-photos-label").click()
    const flights = page.locator(".personal-photos-flight")
    await expect(flights.first()).toBeAttached()
    expect(await flights.first().evaluate(flight => flight.getAnimations()[0].effect!.getTiming().duration)).toBe(480)
    await expect(page.locator("[data-photo-flight-curve]")).toHaveCount(0)
    await expect(page.locator(".personal-photos-wall-surface[data-warp-ready]")).toHaveCount(1)
    const movingLayout = await flights.evaluateAll(elements => elements.flatMap(element =>
      element.getAnimations({ subtree: true }).flatMap(animation =>
        (animation.effect as KeyframeEffect).getKeyframes().flatMap(frame =>
          Object.keys(frame).filter(key => ["height", "width", "padding", "paddingTop", "borderRadius", "boxShadow"].includes(key))))))
    expect(movingLayout, "GPU opening must not animate DOM layout or paint").toEqual([])
    for (const direction of ["open", "close"]) {
      const frames = await page.evaluate(async () => {
        const flights = Array.from(document.querySelectorAll<HTMLElement>(".personal-photos-flight"))
        const animations = flights.flatMap(flight => flight.getAnimations({ subtree: true }))
        await Promise.all(animations.map(animation => animation.ready))
        const sheet = document.querySelector<HTMLElement>(".personal-photos-sheet")!
        const dialog = sheet.closest<HTMLElement>('[role="dialog"]')!
        return [0, 0.25, 0.5, 0.75, 0.999].map(progress => {
          animations.forEach(animation => { animation.currentTime = Number(animation.effect!.getTiming().duration) * progress })
          return flights.map(flight => ({
            opacity: Number(getComputedStyle(flight).opacity),
            borrowedShadow: flight.hasAttribute("data-photo-trailing") ? getComputedStyle(flight).boxShadow : "none",
            frame: parseFloat(getComputedStyle(flight).paddingTop),
            // A copy below the popup is visible only if the wall surface does
            // not paint over it. The opaque backdrop belongs below both.
            covered: Number(getComputedStyle(flight).zIndex) < Number(getComputedStyle(dialog).zIndex)
              && getComputedStyle(sheet).backgroundColor !== "rgba(0, 0, 0, 0)",
          }))
        })
      })
      expect(frames.flat().every(frame => !frame.covered), `${direction}: white wall covers flying photos`).toBe(true)
      expect(frames.flat().every(frame => frame.opacity === 1), `${direction}: photos fade independently`).toBe(true)
      expect(frames.flat().every(frame => frame.borrowedShadow === "none"), `${direction}: borrowed photos stack extra shadows beneath the fan`).toBe(true)
      if (direction === "close") {
        expect(frames[2].every(frame => frame.frame > 0), "every collapsing photo gains a white frame").toBe(true)
      }
      if (direction === "close") {
        const count = await flights.count()
        // The first flight can finish a frame before its neighbours. Keep it
        // above the borrowed photos until the complete fan can take over.
        await page.locator(".personal-photos-flight:not([data-photo-trailing])").first().evaluate(flight =>
          flight.getAnimations({ subtree: true }).forEach(animation => animation.finish()))
        await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())))
        expect(await flights.count(), "front photos stay until the whole group lands").toBe(count)
      }
      await page.evaluate(() => document.querySelectorAll(".personal-photos-flight").forEach(flight =>
        flight.getAnimations({ subtree: true }).forEach(animation => animation.finish())))
      await expect(flights).toHaveCount(0)
      await expect(page.locator("[data-photo-flight-curve]")).toHaveCount(0)
      if (direction === "open") await page.getByRole("button", { name: "Close photo wall" }).click()
    }
    await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
  })
}

test("focused opens keep a bitmap behind newly mounted flight images", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  const trigger = page.locator(".personal-photos-trigger")
  await trigger.scrollIntoViewIfNeeded()
  await trigger.locator("img").evaluateAll(images => Promise.all(images.map(image => image.decode())))
  // Observe the real handoff before the browser paints the new clone. Even
  // a cached, complete img may still need decoding; retain its fallback.
  await page.evaluate(() => {
    const animate = Element.prototype.animate
    Object.assign(window, { blankPhotoFlights: [] as string[] })
    Element.prototype.animate = function (...args) {
      const flight = this.closest(".personal-photos-flight")
      if (flight) {
        const image = flight.querySelector("img")!
        if (getComputedStyle(image).backgroundImage === "none") {
          (window as unknown as { blankPhotoFlights: string[] }).blankPhotoFlights.push(image.src)
        }
      }
      return animate.apply(this, args)
    }
  })
  for (let visit = 0; visit < 2; visit++) {
    await trigger.focus()
    await trigger.press("Enter")
    await expect(page.getByRole("region", { name: "Photo wall" })).toBeVisible()
    await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
    await page.getByRole("button", { name: "Close photo wall" }).click()
    await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
    await expect(trigger).toBeFocused()
  }
  expect(await page.evaluate(() => (window as unknown as { blankPhotoFlights: string[] }).blankPhotoFlights)).toEqual([])
})


test("the opening wall stays opaque through the flight handoff", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.evaluate(() => {
    Object.assign(window, { openingOpacity: [] as number[] })
    const sample = () => {
      const dialog = document.querySelector(".personal-photos-dialog:not([data-ending-style])")
      const backdrop = document.querySelector(".personal-photos-backdrop:not([data-ending-style])")
      if (dialog && backdrop) (window as unknown as { openingOpacity: number[] }).openingOpacity.push(
        Number(getComputedStyle(dialog).opacity), Number(getComputedStyle(backdrop).opacity),
      )
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("region", { name: "Photo wall" })).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  const samples = await page.evaluate(() => (window as unknown as { openingOpacity: number[] }).openingOpacity)
  expect(samples.length).toBeGreaterThan(1)
  expect(Math.min(...samples)).toBe(1)
})

test("closing during a GPU opening returns the photos to their fan slots", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.evaluate(() => {
    const animate = Element.prototype.animate
    Element.prototype.animate = function (...args) {
      const animation = animate.apply(this, args)
      if (this.closest(".personal-photos-flight")) { animation.pause(); animation.currentTime = 0 }
      return animation
    }
  })
  await page.locator(".personal-photos-label").click()
  await expect(page.locator(".personal-photos-wall-surface[data-warp-ready]")).toHaveCount(1)
  await page.locator(".personal-photos-flight").evaluateAll(flights => flights.forEach(flight =>
    flight.getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = Number(animation.effect!.getTiming().duration) / 2 })))
  await page.keyboard.press("Escape")
  const error = await page.locator(".personal-photos-flight:not([data-photo-trailing])").first().evaluate(async flight => {
    const animations = flight.getAnimations({ subtree: true })
    await Promise.all(animations.map(animation => animation.ready))
    animations.forEach(animation => { animation.currentTime = Number(animation.effect!.getTiming().duration) - 0.001 })
    const source = document.querySelector(`.personal-photos-print[data-photo-id="${(flight as HTMLElement).dataset.photoId}"]`)!
    const actual = flight.getBoundingClientRect(), expected = source.getBoundingClientRect()
    return Math.max(Math.abs(actual.x - expected.x), Math.abs(actual.y - expected.y), Math.abs(actual.width - expected.width), Math.abs(actual.height - expected.height))
  })
  expect(error).toBeLessThan(1)
  await page.locator(".personal-photos-flight").evaluateAll(flights => flights.forEach(flight =>
    flight.getAnimations({ subtree: true }).forEach(animation => animation.finish())))
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
})

test("cold opening waits for its first GPU paint before advancing the flight", async ({ page }) => {
  await page.addInitScript(() => {
    const draw = WebGLRenderingContext.prototype.drawArrays
    Object.assign(window, { firstFlightPaint: null as null | { time: number; state: string }, afterFirstFlightPaint: null as null | { time: number; state: string } })
    WebGLRenderingContext.prototype.drawArrays = function (...args) {
      const flight = document.querySelector(".personal-photos-flight")
      const clock = flight?.getAnimations()[0]
      const state = window as unknown as { firstFlightPaint: null | { time: number; state: string } }
      if (clock && !state.firstFlightPaint) {
        state.firstFlightPaint = { time: Number(clock.currentTime), state: clock.playState }
        // Simulate a cold shader/texture upload consuming this render frame.
        const until = performance.now() + 80
        while (performance.now() < until) { /* GPU setup can block the main thread. */ }
        requestAnimationFrame(() => {
          (window as unknown as { afterFirstFlightPaint: { time: number; state: string } }).afterFirstFlightPaint = { time: Number(clock.currentTime), state: clock.playState }
        })
      }
      return draw.apply(this, args)
    }
  })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  await expect.poll(() => page.evaluate(() => (window as unknown as { firstFlightPaint: unknown }).firstFlightPaint)).not.toBeNull()
  const first = await page.evaluate(() => (window as unknown as { firstFlightPaint: { time: number; state: string } }).firstFlightPaint)
  expect(first.time).toBe(0)
  expect(first.state).toBe("paused")
  await expect.poll(() => page.evaluate(() => (window as unknown as { afterFirstFlightPaint: unknown }).afterFirstFlightPaint)).toEqual({ time: 0, state: "paused" })
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await expect(page.locator(".personal-photos-wall-surface[data-warp-ready]")).toHaveCount(1)
})
