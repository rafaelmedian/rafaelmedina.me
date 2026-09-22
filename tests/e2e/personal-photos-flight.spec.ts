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
