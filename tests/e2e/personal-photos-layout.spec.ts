import { expect, test, type Locator, type Page } from "@playwright/test"

/** The grid now appears with the shared avatar intro. */
async function openHome(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
}

/** Starts the visit with the grid already picked, as a returning visitor
    who left it on the grid would. */
async function preferGrid(page: Page) {
  await page.addInitScript(() => localStorage.setItem("personal-photos-layout", "grid"))
}

const dialog = (page: Page) => page.getByRole("dialog", { name: "Personal photos" })
const globe = (page: Page) => page.getByRole("region", { name: "Photo globe" })
const grid = (page: Page) => page.getByRole("region", { name: "Photo sheet" })
const toggle = (page: Page, name: "Grid" | "Sphere") => dialog(page).getByRole("group", { name: "Layout" }).getByRole("button", { name })
/** Opened beside the prints rather than on one, so no photo is held. */
const openFromLabel = (page: Page) => page.locator(".personal-photos-label").click()

test("the toggle turns the open sheet between the globe and a grid, and the choice holds for the next visit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)

  // The globe is the default.
  await openFromLabel(page)
  await expect(globe(page)).toBeVisible()
  await expect(toggle(page, "Sphere")).toHaveAttribute("aria-pressed", "true")
  await expect(toggle(page, "Grid")).toHaveAttribute("aria-pressed", "false")

  // A press on the toggle is not a press on the stage: it neither closes the
  // dialog nor leaves the globe behind in the grid.
  await toggle(page, "Grid").click()
  // The thumb is the picked segment's own box: as wide as its label, and
  // slid under it.
  await expect.poll(() => dialog(page).getByRole("group", { name: "Layout" }).evaluate((group) => {
    const active = group.querySelector<HTMLElement>('[aria-pressed="true"]')!
    const thumb = getComputedStyle(group, "::before")
    return { width: Math.round(parseFloat(thumb.width)) === active.offsetWidth, x: Math.round(parseFloat(thumb.translate)) === active.offsetLeft, label: active.textContent?.trim() }
  })).toEqual({ width: true, x: true, label: "Grid" })
  await expect(dialog(page)).toBeVisible()
  await expect(grid(page)).toBeVisible()
  await expect(toggle(page, "Grid")).toHaveAttribute("aria-pressed", "true")
  await expect(page.locator(".personal-photos-sphere")).toHaveCount(0)
  const layout = await grid(page).evaluate((element) => {
    const slides = Array.from(element.querySelectorAll<HTMLElement>(".personal-photos-slide"))
    return {
      ids: slides.map((slide) => slide.dataset.photoId),
      columns: new Set(slides.map((slide) => Math.round(slide.getBoundingClientRect().left))).size,
      scrollTop: element.scrollTop,
      scrolls: element.scrollHeight > element.clientHeight,
    }
  })
  // Every photo once, with no decorative copies: the grid is the set itself.
  expect(new Set(layout.ids).size).toBe(layout.ids.length)
  expect(layout.ids.every(Boolean)).toBe(true)
  expect(layout.columns).toBe(3)
  expect(layout.scrollTop).toBe(0)
  expect(layout.scrolls).toBe(true)

  // The next visit opens on the grid.
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await openFromLabel(page)
  await expect(grid(page)).toBeVisible()

  // And back: the globe returns, and so does the choice.
  await toggle(page, "Sphere").click()
  await expect(globe(page)).toBeVisible()
  await expect(page.locator(".personal-photos-sphere .personal-photos-slide[data-photo-id]")).toHaveCount(layout.ids.length)
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await openFromLabel(page)
  await expect(globe(page)).toBeVisible()
})

test("on the grid a click holds a photo at the centre with its name under it; Escape, the margin, and a scroll let it go before anything closes", async ({ page }) => {
  await preferGrid(page)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })

  // Opened from a print, the grid holds nothing: the prints are the first
  // photos, so they sit across the top row, and one Escape closes.
  await trigger.locator(".personal-photos-print").nth(3).click()
  await expect(grid(page)).toBeVisible()
  expect(await grid(page).evaluate((element) => element.scrollTop)).toBe(0)
  await expect(grid(page).locator("[data-held]")).toHaveCount(0)
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await expect(trigger).toBeFocused()

  // A click on a photo holds it: it comes to the centre of the stage, far
  // larger, with its caption just under it. Captions are otherwise unseen.
  await page.keyboard.press("Enter")
  await expect(grid(page)).toBeVisible()
  const slides = grid(page).locator(".personal-photos-slide")
  const slide = slides.nth(4)
  const caption = page.locator(".personal-photos-stage-caption")
  await expect(caption).toHaveText("")
  await expect(slide.locator("figcaption")).not.toBeInViewport()
  const resting = (await slide.boundingBox())!
  await slide.click()
  await expect(slide).toHaveAttribute("data-held", "")
  const stage = (await grid(page).boundingBox())!
  await expect.poll(async () => {
    const box = (await slide.boundingBox())!
    return { dx: Math.round(box.x + box.width / 2 - (stage.x + stage.width / 2)), dy: Math.round(box.y + box.height / 2 - (stage.y + stage.height / 2)), grown: box.width / resting.width }
  }).toEqual(expect.objectContaining({ dx: expect.any(Number), dy: expect.any(Number) }))
  const heldBox = (await slide.boundingBox())!
  expect(Math.abs(heldBox.x + heldBox.width / 2 - (stage.x + stage.width / 2))).toBeLessThan(2)
  expect(Math.abs(heldBox.y + heldBox.height / 2 - (stage.y + stage.height / 2))).toBeLessThan(2)
  // Growth depends on the photo's aspect ratio; the reordered collection
  // puts a portrait here, which reaches the height cap before a square.
  expect(heldBox.width / resting.width).toBeGreaterThan(1)
  expect(Math.max(heldBox.width / stage.width, heldBox.height / stage.height)).toBeCloseTo(0.7, 1)
  await expect(caption).toHaveText(await slide.locator("figcaption").innerText())
  await expect(caption).toHaveCSS("opacity", "1")
  const captionBox = (await caption.boundingBox())!
  expect(captionBox.y - (heldBox.y + heldBox.height)).toBeGreaterThan(4)
  expect(captionBox.y - (heldBox.y + heldBox.height)).toBeLessThan(32)
  // The photo over the top of it, at its held size, is still the slide the
  // flights aim at: nothing else in the grid moved.
  const neighbour = (await slides.nth(0).boundingBox())!
  expect(neighbour.width).toBeCloseTo(resting.width, 0)

  // Choosing another visible photo is one continuous handoff: the current
  // one returns while the newly chosen photo takes its place. It must not
  // leave the sheet with nothing held and require a second click.
  const nextSlide = slides.first()
  await nextSlide.click({ position: { x: 12, y: 12 } })
  await expect(nextSlide).toHaveAttribute("data-held", "")
  await expect(slide).not.toHaveAttribute("data-held", "")
  await expect(grid(page).locator("[data-held]")).toHaveCount(1)
  await expect(caption).toHaveText(await nextSlide.locator("figcaption").innerText())

  // Escape lets it go first; the next Escape closes.
  await page.keyboard.press("Escape")
  await expect(grid(page).locator("[data-held]")).toHaveCount(0)
  await expect(caption).toHaveText("")
  await expect(dialog(page)).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await expect(trigger).toBeFocused()

  // Empty space between grid photos and the outer margin both let a held photo
  // go without closing; a scroll does too. Enter and Space hold and release
  // from the keyboard.
  await page.keyboard.press("Enter")
  await expect(grid(page)).toBeVisible()
  await slides.first().click()
  await expect(slides.first()).toHaveAttribute("data-held", "")
  const gap = await grid(page).evaluate((element) => {
    const masonry = element.querySelector<HTMLElement>(".personal-photos-masonry")!
    const bounds = masonry.getBoundingClientRect()
    for (let y = Math.max(bounds.top, 0) + 2; y < Math.min(bounds.bottom, innerHeight) - 2; y += 4) {
      for (let x = bounds.left + 2; x < bounds.right - 2; x += 4) {
        const hit = document.elementFromPoint(x, y)
        if (hit && masonry.contains(hit) && !hit.closest(".personal-photos-slide")) return { x, y }
      }
    }
    throw new Error("No visible gap between grid photos")
  })
  await page.mouse.click(gap.x, gap.y)
  await expect(grid(page).locator("[data-held]")).toHaveCount(0)
  await expect(dialog(page)).toBeVisible()
  await slides.first().click()
  await expect(slides.first()).toHaveAttribute("data-held", "")
  await page.mouse.click(10, 450)
  await expect(grid(page).locator("[data-held]")).toHaveCount(0)
  await expect(dialog(page)).toBeVisible()
  await slides.first().click()
  await expect(slides.first()).toHaveAttribute("data-held", "")
  await grid(page).evaluate((element) => { element.scrollTop = 120 })
  await expect(grid(page).locator("[data-held]")).toHaveCount(0)
  await grid(page).evaluate((element) => { element.scrollTop = 0 })
  await slides.nth(1).focus()
  await page.keyboard.press("Enter")
  await expect(slides.nth(1)).toHaveAttribute("data-held", "")
  await page.keyboard.press(" ")
  await expect(grid(page).locator("[data-held]")).toHaveCount(0)
  await page.mouse.click(10, 450)
  await expect(dialog(page)).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("hovering another grid photo while one is held only nudges its size and preserves its stack", async ({ page }) => {
  await preferGrid(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await openFromLabel(page)
  await expect(grid(page)).toBeVisible()

  const slides = grid(page).locator(".personal-photos-slide")
  const held = slides.nth(4)
  const neighbour = slides.first()
  const resting = (await neighbour.boundingBox())!
  await held.click()
  await expect(held).toHaveAttribute("data-held", "")

  await neighbour.hover({ position: { x: 12, y: 12 } })
  expect(await neighbour.evaluate((element) => getComputedStyle(element).zIndex)).toBe("auto")
  await expect.poll(async () => (await neighbour.boundingBox())!.width / resting.width).toBeGreaterThan(1.03)
  const hovered = (await neighbour.boundingBox())!
  expect(hovered.width / resting.width).toBeLessThan(1.06)
})

test("a held grid photo tilts under a fine pointer with a directional gloss", async ({ page }) => {
  await preferGrid(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await openFromLabel(page)

  const sheet = grid(page)
  const slide = sheet.locator(".personal-photos-slide").nth(4)
  await slide.click()
  await expect(slide).toHaveAttribute("data-held", "")
  const stage = (await sheet.boundingBox())!
  await expect.poll(async () => {
    const box = (await slide.boundingBox())!
    return Math.hypot(
      box.x + box.width / 2 - (stage.x + stage.width / 2),
      box.y + box.height / 2 - (stage.y + stage.height / 2),
    )
  }).toBeLessThan(2)

  const readSurface = () => slide.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
    const gloss = getComputedStyle(element, "::after")
    return {
      x: matrix.m13,
      y: matrix.m23,
      gloss: Number(gloss.opacity),
      blend: gloss.mixBlendMode,
    }
  })
  const held = (await slide.boundingBox())!
  await page.mouse.move(held.x + held.width * 0.2, held.y + held.height * 0.2)
  await expect.poll(async () => {
    const surface = await readSurface()
    return Math.abs(surface.x) + Math.abs(surface.y)
  }).toBeGreaterThan(0.02)
  const topLeft = await readSurface()
  expect(topLeft.blend).toBe("screen")
  expect(topLeft.gloss).toBeGreaterThan(0.35)

  await page.mouse.move(held.x + held.width * 0.8, held.y + held.height * 0.8)
  await expect.poll(async () => {
    const next = await readSurface()
    return Math.sign(next.x) === -Math.sign(topLeft.x) && Math.sign(next.y) === -Math.sign(topLeft.y)
  }).toBe(true)

  await page.mouse.move(5, 5)
  await expect.poll(async () => {
    const flat = await readSurface()
    return Math.abs(flat.x) + Math.abs(flat.y)
  }).toBeLessThan(0.005)
})

test("a switch flies every photo from where one layout left it to where the other puts it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await openFromLabel(page)
  await expect(globe(page)).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await page.mouse.move(5, 5)
  // Park the globe: a photo brought to the front from the keyboard holds it
  // still for seconds once the turn has settled, so the positions read here
  // are the ones the switch will find, however long the click takes to
  // land. The turn is a spring advanced by frame time, so under a starved
  // run it takes longer than its nominal beat: wait for two reads to agree
  // rather than for a fixed time.
  await page.keyboard.press("Tab")
  const centres = (root: Locator) => root.evaluate((element) => Object.fromEntries(Array.from(element.querySelectorAll<HTMLElement>(".personal-photos-slide[data-photo-id]"))
    .filter((slide) => slide.getBoundingClientRect().width)
    .map((slide) => { const rect = slide.getBoundingClientRect(); return [slide.dataset.photoId!, { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width }] })))
  await expect.poll(async () => {
    const first = JSON.stringify(await centres(globe(page)))
    await page.waitForTimeout(150)
    return first === JSON.stringify(await centres(globe(page)))
  }, { timeout: 10_000 }).toBe(true)
  // Hold the switch's flights at their first frame as they are built, so
  // both ends can be read.
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
  const before = await centres(globe(page))

  await toggle(page, "Grid").click()
  await expect(grid(page)).toBeVisible()
  const flights = page.locator(".personal-photos-flight")
  await expect(flights).not.toHaveCount(0)
  const after = await centres(grid(page))
  // At their first frame the flights sit where the globe left the photos,
  // carrying that size; the grid's own slides wait hidden under them.
  const flown = await flights.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect()
    const slide = document.querySelector<HTMLElement>(`.personal-photos-sheet .personal-photos-slide[data-photo-id="${element.dataset.photoFlight}"]`)!
    return { id: element.dataset.photoFlight!, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, slideOpacity: getComputedStyle(slide).opacity }
  }))
  expect(flown.length).toBeGreaterThan(5)
  for (const flight of flown) {
    const start = before[flight.id]
    expect(start, flight.id).toBeDefined()
    expect(Math.hypot(flight.x - start.x, flight.y - start.y), flight.id).toBeLessThan(2)
    expect(Math.abs(flight.width - start.width), flight.id).toBeLessThan(2)
    expect(flight.slideOpacity).toBe("0")
  }
  // At their last frame they sit exactly where the grid has put the photos.
  const landed = await flights.evaluateAll((elements) => elements.map((element) => {
    element.getAnimations().forEach((animation) => { animation.currentTime = Number(animation.effect!.getTiming().duration) })
    const rect = element.getBoundingClientRect()
    return { id: element.dataset.photoFlight!, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width }
  }))
  for (const flight of landed) {
    const end = after[flight.id]
    expect(Math.hypot(flight.x - end.x, flight.y - end.y), flight.id).toBeLessThan(2)
    expect(Math.abs(flight.width - end.width), flight.id).toBeLessThan(2)
  }
  await flights.evaluateAll((elements) => elements.forEach((element) => element.getAnimations().forEach((animation) => animation.finish())))
  await expect(flights).toHaveCount(0)
  expect(await grid(page).locator(".personal-photos-slide[data-photo-id]").evaluateAll((elements) => elements.every((element) => getComputedStyle(element).opacity === "1"))).toBe(true)

  // And back: the grid's photos fly out to their slots on the globe.
  await toggle(page, "Sphere").click()
  await expect(globe(page)).toBeVisible()
  await expect(flights).not.toHaveCount(0)
  await flights.evaluateAll((elements) => elements.forEach((element) => element.getAnimations().forEach((animation) => animation.finish())))
  await expect(flights).toHaveCount(0)
})

test("a scrolled grid glides back to its first row before the prints fly home", async ({ page }) => {
  await preferGrid(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await openFromLabel(page)
  await expect(grid(page)).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await page.keyboard.press("End")
  const bottom = await grid(page).evaluate((element) => element.scrollHeight - element.clientHeight)
  await expect.poll(() => grid(page).evaluate((element) => element.scrollTop)).toBeGreaterThan(bottom - 1)

  // Sampled in the page, every frame from the Escape to the first flight, so
  // the rewind is caught mid-way rather than across a protocol round trip.
  const rewind = page.evaluate(() => new Promise<{ scrolls: number[]; scrollAtFlight: number }>((resolve) => {
    const sheet = document.querySelector<HTMLElement>(".personal-photos-sheet")!
    const scrolls: number[] = []
    let frame = 0
    const sample = () => {
      scrolls.push(sheet.scrollTop)
      frame = requestAnimationFrame(sample)
    }
    sample()
    const observer = new MutationObserver(() => {
      if (!document.querySelector(".personal-photos-flight")) return
      observer.disconnect()
      cancelAnimationFrame(frame)
      resolve({ scrolls, scrollAtFlight: sheet.scrollTop })
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }))
  await page.keyboard.press("Escape")
  const { scrolls, scrollAtFlight } = await rewind
  expect(scrolls.some((top) => top > 0 && top < bottom - 50)).toBe(true)
  expect(scrollAtFlight).toBe(0)
  await expect(dialog(page)).toBeHidden()
})

test("on a phone the grid keeps two columns and the toggle clears the first row", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 390, height: 844 })
  await openHome(page)
  await page.getByRole("button", { name: "Personal life", exact: true }).click()
  await expect(globe(page)).toBeVisible()
  await toggle(page, "Grid").click()
  await expect(grid(page)).toBeVisible()
  // Read a frame on. The global reduced-motion policy leaves every element a
  // 1e-05s `all` transition rather than none, so the stage's grid padding
  // lands on the frame after the switch, not the one it is asked for in.
  const { columns, toggleBottom, firstRowTop, sideways } = await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const slides = Array.from(document.querySelectorAll<HTMLElement>(".personal-photos-masonry .personal-photos-slide"))
    return {
      columns: new Set(slides.map((slide) => Math.round(slide.getBoundingClientRect().left))).size,
      toggleBottom: document.querySelector(".personal-photos-layout")!.getBoundingClientRect().bottom,
      firstRowTop: Math.min(...slides.map((slide) => slide.getBoundingClientRect().top)),
      sideways: document.documentElement.scrollWidth - innerWidth,
    }
  })
  expect(columns).toBe(2)
  expect(toggleBottom).toBeLessThan(firstRowTop)
  expect(sideways).toBeLessThanOrEqual(0)
})

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`holding a bottom-row photo preserves the grid's scroll position (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion })
    await page.setViewportSize({ width: 1440, height: 900 })
    await preferGrid(page)
    await openHome(page)
    await openFromLabel(page)
    const sheet = grid(page)
    const photo = sheet.locator('[data-photo-id="beach"]')
    await photo.scrollIntoViewIfNeeded()
    // Let the scroll event arrive before selecting the photo.
    await page.waitForTimeout(100)
    const before = await sheet.evaluate((element) => ({ top: element.scrollTop, height: element.scrollHeight }))
    await photo.click()
    await expect(photo).toHaveAttribute("data-held", "")
    // Scroll anchoring is delivered after layout; check beyond the hold glide.
    await page.waitForTimeout(500)
    await expect(photo).toHaveAttribute("data-held", "")
    expect(await sheet.evaluate((element) => ({ top: element.scrollTop, height: element.scrollHeight }))).toEqual(before)
    await sheet.evaluate((element) => { element.scrollTop -= 100 })
    await expect(photo).not.toHaveAttribute("data-held", "")
  })
}
