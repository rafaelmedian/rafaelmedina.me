import { expect, test, type Page } from "@playwright/test"


/** The grid now appears with the shared avatar intro. */
async function openHome(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
}

test("returning photos match the thumbnail crop and frame before the handoff", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  // Opened beside the prints rather than on one, so no photo is held and a
  // single Escape closes. A click on a print holds its photo, and the first
  // Escape only lets it go.
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCSS("opacity", "1")
  await expect(page.locator(".personal-photos-print img").first()).toHaveCSS("opacity", "0")
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
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
  await page.keyboard.press("Escape")
  const landing = await page.locator(".personal-photos-flight").first().evaluate(async (flight) => {
    await Promise.all(flight.getAnimations({ subtree: true }).map((animation) => animation.ready))
    flight.getAnimations({ subtree: true }).forEach((animation) => {
      animation.currentTime = Number(animation.effect!.getTiming().duration) - 0.1
    })
    const source = document.querySelector(`.personal-photos-print[data-photo-id="${(flight as HTMLElement).dataset.photoId}"]`)!
    const delta = (a: Element, b: Element) => {
      const first = a.getBoundingClientRect(), second = b.getBoundingClientRect()
      return Math.max(Math.abs(first.x - second.x), Math.abs(first.y - second.y), Math.abs(first.width - second.width), Math.abs(first.height - second.height))
    }
    const image = flight.querySelector("img")!, sourceImage = source.querySelector("img")!
    const matrix = new DOMMatrixReadOnly(getComputedStyle(flight).transform)
    return {
      duration: flight.getAnimations()[0].effect!.getTiming().duration,
      actual: flight.getBoundingClientRect().toJSON(), expected: source.getBoundingClientRect().toJSON(),
      frame: delta(flight, source), image: delta(image, sourceImage),
      // The sheet shows the whole photo and the print shows a square of it, so
      // the crop has to match on both counts: the same fit as well as the same
      // centre. A flight that fits differently squashes the picture on the way
      // down and snaps to the print's crop as it hands off.
      crop: `${getComputedStyle(image).objectFit} ${getComputedStyle(image).objectPosition}`,
      sourceCrop: `${getComputedStyle(sourceImage).objectFit} ${getComputedStyle(sourceImage).objectPosition}`,
      // The print wears the flat placeholder while away; the landing frame must
      // still carry the card shadow it hands off to.
      shadowAlpha: Math.max(...(getComputedStyle(flight).boxShadow.match(/rgba?\([^)]+\)/g) ?? []).map((color) => {
        const channels = color.replace(/^rgba?\(|\)$/g, "").split(",")
        return channels.length > 3 ? parseFloat(channels[3]) : 1
      })),
      distortion: Math.abs(Math.hypot(matrix.a, matrix.b) - Math.hypot(matrix.c, matrix.d)),
    }
  })
  expect(landing.duration).toBe(200)
  expect(landing.frame, JSON.stringify(landing)).toBeLessThan(1)
  expect(landing.image).toBeLessThan(1)
  expect(landing.crop).toBe(landing.sourceCrop)
  expect(landing.crop).toContain("cover")
  expect(landing.shadowAlpha).toBeGreaterThan(0)
  expect(landing.distortion).toBeLessThan(0.001)
})

test("the returning photo travels straight to its print instead of arcing above it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await openHome(page)
  // Beside the prints, so nothing is held and one Escape closes.
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCSS("opacity", "1")
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
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
  await page.keyboard.press("Escape")
  // The card centre is the whole point of the flight: sample it across the
  // close and compare against the straight line between the two endpoints.
  // Reading the interruption's start as a computed matrix froze the open card's
  // half-height into the transform, so the photo rode up to 14px above the line
  // and dropped the difference on the last frame.
  const path = await page.locator(".personal-photos-flight").first().evaluate(async (flight) => {
    const animations = flight.getAnimations({ subtree: true })
    await Promise.all(animations.map((animation) => animation.ready))
    const duration = Number(animations[0].effect!.getTiming().duration)
    const centre = () => {
      const rect = flight.getBoundingClientRect()
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
    }
    const sample = (progress: number) => {
      animations.forEach((animation) => { animation.currentTime = duration * progress })
      return centre()
    }
    const start = sample(0)
    const end = sample(1)
    const travel = Math.hypot(end.x - start.x, end.y - start.y)
    // Easing decides how far along the line the card has got, so measure the
    // distance off the line rather than against a position at that fraction.
    const drift = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((progress) => {
      const point = sample(progress)
      return Math.abs((end.x - start.x) * (start.y - point.y) - (start.x - point.x) * (end.y - start.y)) / travel
    })
    return { drift, travel }
  })
  expect(path.travel).toBeGreaterThan(50)
  // The tolerance only covers subpixel layout rounding.
  expect(Math.max(...path.drift), JSON.stringify(path)).toBeLessThan(2)
})

test("four or five photos stay in one overlapping row at each breakpoint", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openHome(page)
  await expect(page.locator(".mosaic-about-photo")).toHaveCount(0)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  const prints = page.locator(".personal-photos-print")
  for (const width of [1440, 900, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await trigger.scrollIntoViewIfNeeded()
    // Reduced motion never holds the hand back for a deal.
    await expect(page.locator(".personal-photos-stack")).not.toHaveAttribute("data-deal")
    await expect(prints).toHaveCount(width >= 700 ? 5 : 4)
    const layout = await prints.evaluateAll((elements) => elements.map((element) => ({
      left: (element as HTMLElement).offsetLeft,
      top: (element as HTMLElement).offsetTop,
      width: (element as HTMLElement).offsetWidth,
    })))
    for (let index = 1; index < layout.length; index++) {
      expect(layout[index].top).toBe(layout[0].top)
      expect((layout[index].left - layout[index - 1].left) / layout[index - 1].width).toBeCloseTo(0.5, 1)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})

function readAngles(elements: Element[]) {
  return elements.map((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
    return Math.round(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI)
  })
}


test("a click on a print opens the globe holding that photo; Enter opens it as it lies", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  await trigger.scrollIntoViewIfNeeded()
  const print = trigger.locator(".personal-photos-print").nth(3)
  const photoId = await print.getAttribute("data-photo-id")
  const largest = () => largestSlide(page)

  // The part of the print the middle one leaves showing, as a visitor would.
  const box = (await print.boundingBox())!
  await page.mouse.click(box.x + box.width * 0.8, box.y + box.height / 2)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  // The hold waits for the open flight to land and then turns and grows over
  // --sphere-focus-duration; under a full parallel run that takes longer than
  // the default 5s poll.
  await expect.poll(async () => {
    const { id, lead } = await largest()
    return id === photoId && lead > 1.5
  }, { timeout: 15_000 }).toBe(true)
  // Escape lets the photo go first, then closes.
  await page.keyboard.press("Escape")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeHidden()

  // The keyboard reaches the tile as one stop and opens the globe with
  // nothing held; Tab brings a photo to the front from there.
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCSS("opacity", "1", { timeout: 15_000 })
  await page.waitForTimeout(600)
  expect((await largest()).lead).toBeLessThan(1.5)
})

test("a print pulled from the fan follows the pointer with resistance and opens on release", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  await trigger.scrollIntoViewIfNeeded()
  await expect(page.locator(".personal-photos-stack")).not.toHaveAttribute("data-deal")
  // By class, not through the trigger's role: the open sheet hides the tile
  // from the accessibility tree, and the print is read again behind it.
  const prints = page.locator(".personal-photos-print")
  const print = prints.nth(3)
  const photoId = await print.getAttribute("data-photo-id")
  const box = (await print.boundingBox())!
  const start = { x: box.x + box.width * 0.8, y: box.y + box.height / 2 }
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  for (let step = 1; step <= 8; step++) await page.mouse.move(start.x + 25 * step, start.y)
  // A 200px pull moves the print about 39px — p x 48 / (48 + p) — and turns
  // it; the rest of the hand stays where it was dealt.
  const pull = () => print.evaluate((element) => parseFloat(getComputedStyle(element).translate))
  await expect.poll(pull).toBeGreaterThan(34)
  expect(await pull()).toBeLessThan(44)
  await expect(print).toHaveAttribute("data-print-drag", "")
  expect(await print.evaluate((element) => getComputedStyle(element).rotate)).not.toBe("none")
  expect(await prints.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).translate).filter((_, index) => index !== 3))).toEqual(["none", "none", "none", "none"])

  // Let go: the click it was opens the globe holding that photo, and the
  // print springs back into the hand behind the sheet.
  await page.mouse.up()
  await expect(dialog(page)).toBeVisible()
  await expect.poll(async () => {
    const { id, lead } = await largestSlide(page)
    return id === photoId && lead > 1.5
  }, { timeout: 15_000 }).toBe(true)
  await expect.poll(() => print.evaluate((element) => getComputedStyle(element).translate)).toBe("none")
  await page.keyboard.press("Escape")
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
})

const dialog = (page: Page) => page.getByRole("dialog", { name: "Personal photos" })

/** The slide drawn largest, and so furthest forward: the held photo grows at
    the centre while the rest of the globe steps back. */
const largestSlide = (page: Page) => page.evaluate(() => {
  const slides = Array.from(document.querySelectorAll<HTMLElement>(".personal-photos-sphere .personal-photos-slide"))
  const widths = slides.map((slide) => slide.getBoundingClientRect().width)
  const widest = widths.indexOf(Math.max(...widths))
  const runnerUp = Math.max(...widths.filter((_, index) => index !== widest))
  return { id: slides[widest].dataset.photoId, lead: widths[widest] / runnerUp }
})


/** Pause every flight at its first frame so the deal can be inspected. */
async function holdFlights(page: Page) {
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
}

test("the hand comes to rest when the sheet closes and only opens again for a moving pointer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  const prints = trigger.locator(".personal-photos-print")
  const rects = () => prints.evaluateAll((elements) => elements.map((print) => {
    const { x, y, width, height } = print.getBoundingClientRect()
    return [x, y, width, height].map((value) => Math.round(value * 10) / 10)
  }))
  // Untouched, before the pointer or the keyboard has been near the tile;
  // in view, so the click below scrolls nothing.
  await trigger.scrollIntoViewIfNeeded()
  await expect(page.locator(".personal-photos-stack")).not.toHaveAttribute("data-deal")
  const resting = await rects()

  // Opened from the tile's label, with the pointer left where it clicked —
  // over the tile — the way a click on the globe's margin leaves it.
  await trigger.locator(".personal-photos-label").click()
  await expect(dialog(page)).toBeVisible()
  await holdFlights(page)
  await page.keyboard.press("Escape")
  const flights = page.locator(".personal-photos-flight")
  await expect(flights).not.toHaveCount(0)
  // The hand is at rest under the sheet, so the flights are aimed at the
  // frames it keeps at rest. It used to open here on the focus the sheet
  // handed back, and again on :hover once the sheet stopped taking the
  // pointer, which read as a print still picked after the close.
  expect(await rects()).toEqual(resting)

  await flights.evaluateAll((elements) => elements.flatMap((element) => element.getAnimations({ subtree: true })).forEach((animation) => animation.finish()))
  await expect(dialog(page)).toBeHidden()
  await expect(flights).toHaveCount(0)
  await expect(trigger).toBeFocused()
  // The pointer is still over the tile and the tile holds focus; neither is
  // intent, so nothing opens, lifts, or glides on.
  await page.waitForTimeout(500)
  expect(await rects()).toEqual(resting)
  await expect(trigger).not.toHaveAttribute("data-fan-open")
  expect(await prints.evaluateAll((elements) => elements.map((print) => print.hasAttribute("data-print-hover") || getComputedStyle(print).translate !== "none"))).toEqual([false, false, false, false, false])

  // Travel is intent: the smallest nudge opens the hand.
  const label = (await trigger.locator(".personal-photos-label").boundingBox())!
  await page.mouse.move(label.x + label.width / 2 + 2, label.y + label.height / 2 + 2)
  await expect(trigger).toHaveAttribute("data-fan-open", "")
  await expect.poll(rects).not.toEqual(resting)
})

test("the fan is dealt with a wobble, opens as a hand, and lifts the one print under the pointer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 500 })
  await openHome(page)

  const preview = page.locator(".personal-photos")
  await preview.scrollIntoViewIfNeeded()
  // The deal rides on `translate`, which the lift below reads.
  await expect(preview.locator(".personal-photos-stack")).not.toHaveAttribute("data-deal")

  const prints = preview.locator(".personal-photos-print")
  // A straight lean from one end of the row to the other, flat in the middle,
  // with each print's fixed wobble already in — a hand dealt by hand is never
  // quite on its arc.
  const rest = [-12, -4, 1, 4, 11]
  expect(await prints.evaluateAll(readAngles)).toEqual(rest)
  const restWidth = await preview.locator(".personal-photos-stack").evaluate((element) => {
    const boxes = Array.from(element.querySelectorAll(".personal-photos-print")).map((print) => print.getBoundingClientRect())
    return Math.max(...boxes.map((box) => box.right)) - Math.min(...boxes.map((box) => box.left))
  })
  const readDrops = (elements: Element[]) => elements.map((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).f)
  const restDrops = await prints.evaluateAll(readDrops)

  // Pointing at the tile, but at no print — its label — swings every print
  // out to its fanned angle together, wider and with more wobble than at rest.
  // The pointer is moved by hand throughout so the page holds one scroll
  // position; hover() would scroll first.
  const label = (await preview.locator(".personal-photos-label").boundingBox())!
  await page.mouse.move(label.x + label.width / 2, label.y + label.height / 2)
  const open = [-18, -7, 2, 6, 18]
  await expect.poll(() => prints.evaluateAll(readAngles)).toEqual(open)
  const openDrops = await prints.evaluateAll(readDrops)
  openDrops.forEach((drop, index) => expect(drop).toBeGreaterThan(restDrops[index]))
  const openWidth = await preview.locator(".personal-photos-stack").evaluate((element) => {
    const boxes = Array.from(element.querySelectorAll(".personal-photos-print")).map((print) => print.getBoundingClientRect())
    return Math.max(...boxes.map((box) => box.right)) - Math.min(...boxes.map((box) => box.left))
  })
  expect(openWidth).toBeGreaterThan(restWidth)

  // The pile keeps its order: the middle print is the front of the fan and
  // every print behind it steps back.
  const depths = () => prints.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).zIndex))
  expect(await depths()).toEqual(["1", "3", "5", "3", "1"])

  // The one print under the pointer slides up, on `translate` so the lean
  // and the drop stay where they are; nothing else moves, grows, or changes
  // hands. Pointed at near its bottom edge — where a print that rose out
  // from under the pointer used to lose it and fall back — it stays lifted.
  const lifts = () => prints.evaluateAll((elements) => elements.map((element) => {
    const translate = getComputedStyle(element).translate
    return translate === "none" ? 0 : Math.round(parseFloat(translate.split(" ")[1] ?? "0"))
  }))
  const growth = () => prints.evaluateAll((elements) => elements.map((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
    return Math.round(Math.hypot(matrix.a, matrix.b) * 100) / 100
  }))
  const box = (await prints.nth(1).boundingBox())!
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.9)
  await expect.poll(async () => (await lifts())[1]).toBeLessThan(-4)
  expect((await lifts()).filter((_, index) => index !== 1)).toEqual([0, 0, 0, 0])
  await page.waitForTimeout(400)
  expect(await prints.nth(1).evaluate((element) => element.matches(":hover"))).toBe(true)
  expect(await prints.evaluateAll(readAngles)).toEqual(open)
  expect(await growth()).toEqual([1, 1, 1, 1, 1])
  expect(await depths()).toEqual(["1", "3", "5", "3", "1"])
  // Over a print the hand lies flat and the print alone turns toward the
  // pointer, on `rotate`, so the lean it was dealt with is untouched.
  const turns = () => prints.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).rotate !== "none"))
  await expect.poll(turns).toEqual([false, true, false, false, false])
  await expect(preview.locator(".personal-photos-stack-tilt")).toHaveCSS("transform", "none")
  expect(await prints.evaluateAll(readAngles)).toEqual(open)
  await page.mouse.move(label.x + label.width / 2, label.y + label.height / 2)
  await expect.poll(lifts).toEqual([0, 0, 0, 0, 0])
  await expect.poll(turns).toEqual([false, false, false, false, false])
})

/** Records each print's beat the moment the deal starts. The whole deal is
    over in a second, which a poll can miss under a full parallel run. */
async function recordDealBeats(page: Page) {
  await page.locator(".personal-photos-stack").evaluate((stack: HTMLElement) => {
    new MutationObserver((_, observer) => {
      if (stack.dataset.deal !== "dealing") return
      observer.disconnect()
      stack.dataset.testBeats = Array.from(stack.querySelectorAll(".personal-photos-print"), (print) => getComputedStyle(print).animationDelay).join()
    }).observe(stack, { attributes: true, attributeFilter: ["data-deal"] })
  })
}

test("the fan deals in from the middle out the first time it scrolls into view", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const stack = page.locator(".personal-photos-stack")
  const prints = stack.locator(".personal-photos-print")
  // Below the fold the hand is held back, not dealt where nobody sees it.
  await expect(stack).toHaveAttribute("data-deal", "pending")
  await expect(prints.first()).toHaveCSS("opacity", "0")

  await recordDealBeats(page)
  await stack.scrollIntoViewIfNeeded()
  // The front print first, then 100ms later for each step out to the ends.
  await expect(stack).toHaveAttribute("data-test-beats", "0.2s,0.1s,0s,0.1s,0.2s")
  // Once the last print lands the deal retires, and every print is at rest.
  await expect(stack).not.toHaveAttribute("data-deal")
  expect(await prints.evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element)
    return `${style.opacity} ${style.translate}`
  }))).toEqual(Array(5).fill("1 none"))

  // It is dealt once per visit: scrolled away and back, the hand stays put.
  await page.evaluate(() => scrollTo(0, 0))
  await stack.scrollIntoViewIfNeeded()
  await expect(stack).not.toHaveAttribute("data-deal")
})

test("opening the sheet mid-deal snaps the hand to rest before the flights measure it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const stack = page.locator(".personal-photos-stack")
  // Freeze the deal a quarter of the way in, with every print still low.
  await stack.evaluate((element: HTMLElement) => {
    new MutationObserver((_, observer) => {
      if (element.dataset.deal !== "dealing") return
      observer.disconnect()
      element.getAnimations({ subtree: true }).forEach((animation) => {
        animation.pause()
        animation.currentTime = 200
      })
      element.dataset.testFrozen = ""
    }).observe(element, { attributes: true, attributeFilter: ["data-deal"] })
  })
  await stack.scrollIntoViewIfNeeded()
  await expect(stack).toHaveAttribute("data-test-frozen")
  expect(await stack.locator(".personal-photos-print").first().evaluate((element) => getComputedStyle(element).translate)).not.toBe("none")

  await page.locator(".personal-photos-label").click()
  await expect(dialog(page)).toBeVisible()
  await expect(stack).not.toHaveAttribute("data-deal")
  expect(await stack.locator(".personal-photos-print").evaluateAll((elements) => elements.map((element) => getComputedStyle(element).translate))).toEqual(Array(5).fill("none"))
})

/** The budget for anything that waits on the globe's own motion. A turn
    takes 360ms and the zoom settles in about a third of a second, but the
    globe advances by at most 50ms of motion per frame, so under a full
    parallel run — eight Chromiums each drawing a WebGL globe — a starved tab
    turns slowly in wall time and the default 5s poll missed. Fifteen seconds
    is well past anything the globe needs and well short of the test timeout. */
const motion = { timeout: 15_000 }

/** The globe's stage, and the tiles on it that are not hidden round the back. */
const stage = (page: Page) => page.getByRole("region", { name: "Photo globe" })
const shownTiles = (page: Page) => stage(page).locator(".personal-photos-slide:not([data-sphere-hidden])")
/** Each shown tile's centre relative to the stage's, its width, and its depth. */
const readTiles = (page: Page) => shownTiles(page).evaluateAll((elements) => elements.map((element) => {
  const rect = element.getBoundingClientRect()
  return {
    id: (element as HTMLElement).dataset.photoId ?? null,
    x: Math.round(rect.left + rect.width / 2 - innerWidth / 2), y: Math.round(rect.top + rect.height / 2 - innerHeight / 2),
    width: Math.round(rect.width), depth: Number((element as HTMLElement).style.getPropertyValue("--sphere-depth")),
  }
}))
const frontTile = async (page: Page) => (await readTiles(page)).sort((a, b) => b.depth - a.depth)[0]

test("the globe carries every photo at least twice, larger at the front than the rim, hides its far side, and turns on its own", async ({ page }) => {
  test.slow()
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await page.locator(".personal-photos-label").click()
  await page.mouse.move(5, 5)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  const tiles = stage(page).locator(".personal-photos-slide")
  const originals = await stage(page).locator(".personal-photos-slide[data-photo-id]").count()
  expect(originals).toBeGreaterThan(10)
  // The copies are decoration: no id, no group, hidden from assistive tech
  // and from Tab.
  expect(await tiles.count()).toBeGreaterThanOrEqual(originals * 2)
  expect(await stage(page).locator('.personal-photos-slide:not([data-photo-id])[aria-hidden="true"][tabindex="-1"]').count()).toBe(await tiles.count() - originals)
  // The far side is a dome's: gone, not showing through.
  await expect.poll(() => stage(page).locator(".personal-photos-slide[data-sphere-hidden]").count(), motion).toBeGreaterThan(5)
  const layout = await readTiles(page)
  const byDepth = [...layout].sort((a, b) => b.depth - a.depth)
  expect(byDepth[0].width).toBeGreaterThan(byDepth[byDepth.length - 1].width * 1.5)
  // Every photo is a print: a white border, the same all round.
  expect(await tiles.first().evaluate((slide) => {
    const style = getComputedStyle(slide)
    return { paper: style.backgroundColor, even: parseFloat(style.paddingTop) > 0 && style.paddingTop === style.paddingBottom && style.paddingLeft === style.paddingTop }
  })).toEqual({ paper: "rgb(255, 255, 255)", even: true })
  // A slow spin of its own, once the open flight has landed: the photo at
  // the front moves off it.
  const before = await frontTile(page)
  await expect.poll(async () => {
    const after = (await readTiles(page)).find((tile) => tile.id === before.id)
    return after === undefined || after.x !== before.x || after.depth !== before.depth
  }, motion).toBe(true)
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
})

test("a drag turns the globe and lets a held photo go; a click holds a photo at the centre and the next click, anywhere, lets it go", async ({ page }) => {
  test.slow()
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await page.locator(".personal-photos-label").click()
  await page.mouse.move(5, 5)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await page.waitForTimeout(400)

  // A click on a photo turns it to the centre and grows it; the caption
  // under the globe names it.
  const target = (await readTiles(page)).filter((tile) => tile.id).sort((a, b) => b.depth - a.depth)[2]
  await page.mouse.click(innerCentre(1440) + target.x, innerCentre(900) + target.y)
  await page.mouse.move(5, 5)
  // Within a couple of pixels: the globe is centred on a half-pixel at some
  // viewport sizes.
  const centred = async (id: string) => { const tile = (await readTiles(page)).find((candidate) => candidate.id === id); return tile ? Math.max(Math.abs(tile.x), Math.abs(tile.y)) : NaN }
  await expect.poll(() => centred(target.id), motion).toBeLessThanOrEqual(2)
  const held = (await readTiles(page)).find((tile) => tile.id === target.id)!
  expect(held.width).toBeGreaterThan(target.width * 1.8)
  // The caption names it, just under it, once the hold has landed.
  const caption = page.locator(".personal-photos-stage-caption")
  await expect(caption).toHaveText(await stage(page).locator(`.personal-photos-slide[data-photo-id="${target.id}"] figcaption`).innerText())
  await expect.poll(() => caption.evaluate((element) => getComputedStyle(element).opacity), motion).toBe("1")
  const heldBox = (await stage(page).locator(`.personal-photos-slide[data-photo-id="${target.id}"]`).boundingBox())!
  const captionBox = (await caption.boundingBox())!
  expect(captionBox.y - (heldBox.y + heldBox.height)).toBeGreaterThan(4)
  expect(captionBox.y - (heldBox.y + heldBox.height)).toBeLessThan(32)
  expect(Math.abs(captionBox.x + captionBox.width / 2 - (heldBox.x + heldBox.width / 2))).toBeLessThan(3)
  // While one photo is held the rest of the globe steps back a little.
  const others = (await readTiles(page)).filter((tile) => tile.id !== target.id)
  expect(Math.max(...others.map((tile) => tile.width))).toBeLessThan(held.width / 2)

  // A click on a neighbouring photo does not hand the hold over; it lets the
  // held photo go, and the globe stays open.
  const neighbour = others.filter((tile) => tile.depth > 600).sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))[0]
  await page.mouse.click(innerCentre(1440) + neighbour.x, innerCentre(900) + neighbour.y)
  await page.mouse.move(5, 5)
  await expect.poll(async () => Math.max(...(await readTiles(page)).map((tile) => tile.width)), motion).toBeLessThan(target.width * 1.3)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  // The caption went with it.
  await expect(caption).toHaveText("")

  // A drag turns it: the front changes hands. A drag also lets a held photo go.
  // The globe turned to bring the target to the centre and stays there once it
  // is let go, so the target is clicked where it is now, not where it was dealt.
  const moved = (await readTiles(page)).find((tile) => tile.id === target.id)!
  await page.mouse.click(innerCentre(1440) + moved.x, innerCentre(900) + moved.y)
  await expect.poll(async () => (await readTiles(page)).find((tile) => tile.id === target.id)?.width ?? 0, motion).toBeGreaterThan(target.width * 1.8)
  await page.mouse.move(400, 450)
  await page.mouse.down()
  for (let step = 1; step <= 12; step++) await page.mouse.move(400 + step * 30, 450 + step * 5)
  await page.mouse.up()
  await page.mouse.move(5, 5)
  await expect.poll(async () => Math.max(...(await readTiles(page)).map((tile) => tile.width)), motion).toBeLessThan(target.width * 1.3)
  expect((await frontTile(page)).id).not.toBe(target.id)

  // With nothing held, a click on the margin closes and hands focus back.
  await page.mouse.click(30, 450)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Personal life", exact: true })).toBeFocused()
})

function innerCentre(size: number) { return size / 2 }

test("hovering a photo on the globe grows it a little under a pointer cursor", async ({ page }) => {
  test.slow()
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await page.locator(".personal-photos-label").click()
  await page.mouse.move(5, 5)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await page.waitForTimeout(400)
  const target = (await readTiles(page)).filter((tile) => tile.id).sort((a, b) => b.depth - a.depth)[1]
  const tile = stage(page).locator(`.personal-photos-slide[data-photo-id="${target.id}"]`)
  await expect(tile).toHaveCSS("cursor", "pointer")
  await page.mouse.move(innerCentre(1440) + target.x, innerCentre(900) + target.y)
  await expect.poll(() => tile.evaluate((element) => element.getBoundingClientRect().width), motion).toBeGreaterThan(target.width * 1.05)
  await page.mouse.move(5, 5)
  await expect.poll(() => tile.evaluate((element) => element.getBoundingClientRect().width), motion).toBeLessThan(target.width * 1.02)
  await page.keyboard.press("Escape")
})

test("the keyboard turns the globe: Tab brings a photo to the front, the arrows step it round, and Escape lets a held photo go before it closes", async ({ page }) => {
  test.slow()
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await page.locator(".personal-photos-label").click()
  await page.mouse.move(5, 5)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")
  const focused = page.locator(".personal-photos-slide:focus")
  await expect(focused).toHaveAttribute("data-photo-id", /./)
  const id = (await focused.getAttribute("data-photo-id"))!
  await expect.poll(async () => { const tile = (await readTiles(page)).find((candidate) => candidate.id === id); return tile ? Math.max(Math.abs(tile.x), Math.abs(tile.y)) : NaN }, motion).toBeLessThanOrEqual(2)
  const before = (await readTiles(page)).find((tile) => tile.id === id)!
  await page.keyboard.press("ArrowRight")
  await expect.poll(async () => (await readTiles(page)).find((tile) => tile.id === id)?.x ?? NaN, motion).not.toBe(before.x)
  // Hold one from the pointer, then Escape twice: release, then close.
  await page.mouse.click(innerCentre(1440) + before.x + 1, innerCentre(900) + before.y)
  await page.mouse.move(5, 5)
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
})

test("on a phone the globe overhangs the screen, holds still with reduced motion, and a tap beside it closes", async ({ browser }) => {
  test.slow()
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" })
  const page = await context.newPage()
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  await trigger.scrollIntoViewIfNeeded()
  await page.locator(".personal-photos-label").tap()
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  // Wider than the screen, overhanging both edges equally, and the page does
  // not scroll sideways for it.
  const globe = await page.locator(".personal-photos-sphere").evaluate((element) => element.getBoundingClientRect().toJSON())
  expect(globe.width).toBeGreaterThan(390)
  expect(Math.abs(globe.left + globe.right - 390)).toBeLessThan(2)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  // No spin of its own under reduced motion.
  const before = await readTiles(page)
  await page.waitForTimeout(800)
  expect(await readTiles(page)).toEqual(before)
  await page.touchscreen.tap(10, 30)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
  // No focus check here: a touch never gave the trigger focus, so there is
  // nothing for the dialog to hand back. The desktop tests cover the return.
  await context.close()
})
