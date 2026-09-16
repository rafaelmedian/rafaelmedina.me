import { expect, test, type Locator, type Page } from "@playwright/test"


/** The grid now appears with the shared avatar intro. */
async function openHome(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
}

test("returning photos match the thumbnail crop and frame before the handoff", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  // Opening the wall leaves every photo at rest, so one Escape closes.
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
      visualLeft: element.getBoundingClientRect().left,
      visualTop: element.getBoundingClientRect().top,
      visualWidth: element.getBoundingClientRect().width,
      visualHeight: element.getBoundingClientRect().height,
    })))
    for (let index = 1; index < layout.length; index++) {
      expect(layout[index].top).toBe(layout[0].top)
      expect((layout[index].left - layout[index - 1].left) / layout[index - 1].width).toBeCloseTo(0.5, 1)
    }
    const visualCenters = layout.map((print) => ({
      x: print.visualLeft + print.visualWidth / 2,
      y: print.visualTop + print.visualHeight / 2,
    }))
    const visualSteps = visualCenters.slice(1).map((center, index) => center.x - visualCenters[index].x)
    // The underlying row stays regular for a reliable hit area, but the visible
    // prints are nudged off that rhythm so they look placed by hand rather than
    // plotted on one exact curve.
    expect(Math.max(...visualSteps) - Math.min(...visualSteps)).toBeGreaterThan(layout[0].width * 0.01)
    expect(Math.max(...visualCenters.map(({ y }) => y)) - Math.min(...visualCenters.map(({ y }) => y))).toBeLessThan(layout[0].width * 0.08)
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


test("a print and keyboard activation both open the wall without a selection", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  await trigger.scrollIntoViewIfNeeded()
  await expect(page.locator(".personal-photos-stack")).not.toHaveAttribute("data-deal")
  await trigger.locator(".personal-photos-print").nth(3).click()
  const wall = page.getByRole("region", { name: "Photo wall" })
  await expect(wall).toBeVisible()
  await expect(wall.locator("[data-held]")).toHaveCount(0)
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await expect(trigger).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(wall).toBeVisible()
  await expect(wall.locator("[data-held]")).toHaveCount(0)
})

const dialog = (page: Page) => page.getByRole("dialog", { name: "Personal photos" })

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

async function finishFlights(flights: Locator) {
  // Closing builds a screenful of clones in a layout effect. Under a starved
  // runner, another clone can mount after a one-shot snapshot; keep finishing
  // the current set until every return flight has completed and unmounted.
  await expect.poll(async () => {
    await flights.evaluateAll((elements) => elements
      .flatMap((element) => element.getAnimations({ subtree: true }))
      .forEach((animation) => animation.finish()))
    return flights.count()
  }, { timeout: 5000 }).toBe(0)
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
  // over the tile throughout the return flight.
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

  await finishFlights(flights)
  await expect(dialog(page)).toBeHidden()
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

test("the fan is dealt with a wobble and only changes its angles on card hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 500 })
  await openHome(page)

  const preview = page.locator(".personal-photos")
  await preview.scrollIntoViewIfNeeded()
  await expect(preview.locator(".personal-photos-stack")).not.toHaveAttribute("data-deal")

  const prints = preview.locator(".personal-photos-print")
  // Almost flat: a few degrees at the ends of the row, with a little of each
  // print's fixed wobble.
  const rest = [-3, -1, 1, 0, 3]
  expect(await prints.evaluateAll(readAngles)).toEqual(rest)
  const readDrops = (elements: Element[]) => elements.map((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).f)
  const restDrops = await prints.evaluateAll(readDrops)

  // Pointing at the tile, but at no print — its label — only changes the
  // prints' angles by a degree or two.
  // The pointer is moved by hand throughout so the page holds one scroll
  // position; hover() would scroll first.
  const label = (await preview.locator(".personal-photos-label").boundingBox())!
  await page.mouse.move(label.x + label.width / 2, label.y + label.height / 2)
  await expect.poll(async () => {
    const angles = await prints.evaluateAll(readAngles)
    return angles.every((angle, index) => {
      const change = Math.abs(angle - rest[index])
      return change >= 1 && change <= 3
    })
  }).toBe(true)
  const open = await prints.evaluateAll(readAngles)
  const openDrops = await prints.evaluateAll(readDrops)
  expect(openDrops).toEqual(restDrops)

  // The pile keeps its order: the middle print is the front of the fan and
  // every print behind it steps back.
  const depths = () => prints.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).zIndex))
  expect(await depths()).toEqual(["1", "3", "5", "3", "1"])

  // Crossing onto a print keeps the same card-level response: no lift,
  // individual 3D turn, scaling, or depth shuffle.
  const box = (await prints.nth(1).boundingBox())!
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.9)
  await expect.poll(() => prints.evaluateAll(readAngles)).toEqual(open)
  expect(await prints.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).translate))).toEqual(Array(5).fill("none"))
  expect(await prints.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).rotate))).toEqual(Array(5).fill("none"))
  expect(await depths()).toEqual(["1", "3", "5", "3", "1"])
  await expect(preview.locator(".personal-photos-stack-tilt")).toHaveCSS("transform", "none")
})

/** Records each print's centre, relative to the stack's, halfway through the
    deal — where the overshoot peaks — by pausing it there for one read and
    letting it run on. The whole deal is over in under half a second, which a
    poll can miss under a full parallel run. */
async function recordDealPeak(page: Page) {
  await page.locator(".personal-photos-stack").evaluate((stack: HTMLElement) => {
    new MutationObserver((_, observer) => {
      if (stack.dataset.deal !== "dealing") return
      observer.disconnect()
      const animations = stack.getAnimations({ subtree: true }).filter((animation) => animation instanceof CSSAnimation)
      animations.forEach((animation) => {
        animation.pause()
        animation.currentTime = Number(animation.effect?.getComputedTiming().duration) / 2
      })
      const middle = stack.getBoundingClientRect().left + stack.getBoundingClientRect().width / 2
      stack.dataset.testPeak = Array.from(stack.querySelectorAll(".personal-photos-print"), (print) => {
        const rect = print.getBoundingClientRect()
        return Math.round(rect.left + rect.width / 2 - middle)
      }).join()
      animations.forEach((animation) => animation.play())
    }).observe(stack, { attributes: true, attributeFilter: ["data-deal"] })
  })
}

/** Each print's centre relative to the stack's, and its opacity. */
const readPrintCentres = (stack: Locator) => stack.evaluate((element) => {
  const middle = element.getBoundingClientRect().left + element.getBoundingClientRect().width / 2
  return Array.from(element.querySelectorAll(".personal-photos-print"), (print) => {
    const rect = print.getBoundingClientRect()
    return { x: Math.round(rect.left + rect.width / 2 - middle), opacity: getComputedStyle(print).opacity }
  })
})

test("the fan springs out of a pile the first time it scrolls into view", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const stack = page.locator(".personal-photos-stack")
  const prints = stack.locator(".personal-photos-print")
  // Below the fold the hand waits in one pile on the middle print, the
  // prints behind the front one at half opacity.
  await expect(stack).toHaveAttribute("data-deal", "pending")
  const pile = await readPrintCentres(stack)
  for (const { x } of pile) expect(Math.abs(x)).toBeLessThanOrEqual(2)
  expect(pile.map(({ opacity }) => opacity)).toEqual(["0.5", "0.5", "1", "0.5", "0.5"])

  await recordDealPeak(page)
  await stack.scrollIntoViewIfNeeded()
  await expect(stack).toHaveAttribute("data-test-peak")
  // Once the prints land the deal retires, and every print is at rest.
  await expect(stack).not.toHaveAttribute("data-deal")
  expect(await prints.evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element)
    return `${style.opacity} ${style.translate} ${style.rotate}`
  }))).toEqual(Array(5).fill("1 none none"))
  // Halfway out, every print but the middle one had swung past its slot.
  const rest = (await readPrintCentres(stack)).map(({ x }) => x)
  const peak = (await stack.getAttribute("data-test-peak"))!.split(",").map(Number)
  peak.forEach((x, index) => {
    // The centre print now carries a sub-2px hand-placed nudge rather than
    // landing on the stack's mathematical zero; it remains the pile's anchor.
    if (Math.abs(rest[index]) <= 2) expect(Math.abs(x)).toBeLessThanOrEqual(2)
    else expect(Math.abs(x)).toBeGreaterThan(Math.abs(rest[index]) + 4)
  })

  // It is dealt once per visit: scrolled away and back, the hand stays put.
  await page.evaluate(() => scrollTo(0, 0))
  await stack.scrollIntoViewIfNeeded()
  await expect(stack).not.toHaveAttribute("data-deal")
})

test("opening the sheet mid-deal snaps the hand to rest before the flights measure it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const stack = page.locator(".personal-photos-stack")
  // Freeze the deal halfway, with the outer prints swung past their slots.
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
