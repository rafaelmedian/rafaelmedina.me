import { expect, test, type Page } from "@playwright/test"
import { personalPhotoItems } from "../../src/data/personalPhotos"


/** The grid now appears with the shared avatar intro. */
async function openHome(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
}

test("returning photos match the thumbnail crop and frame before the handoff", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await page.locator(".personal-photos-print").first().click()
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
  await page.locator(".personal-photos-print").first().click()
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

test("the fan leans along an arc and opens the whole hand at once", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 500 })
  await openHome(page)

  const preview = page.locator(".personal-photos")
  await preview.scrollIntoViewIfNeeded()

  const prints = preview.locator(".personal-photos-print")
  // A straight lean from one end of the row to the other, flat in the middle.
  const rest = [-10, -5, 0, 5, 10]
  expect(await prints.evaluateAll(readAngles)).toEqual(rest)
  const restWidth = await preview.locator(".personal-photos-stack").evaluate((element) => {
    const boxes = Array.from(element.querySelectorAll(".personal-photos-print")).map((print) => print.getBoundingClientRect())
    return Math.max(...boxes.map((box) => box.right)) - Math.min(...boxes.map((box) => box.left))
  })

  // How far down its own transform carries each print. Read from the matrix
  // rather than from the rect, because a print's rect also grows taller as it
  // leans further over and that alone would swallow the drop.
  const readDrops = (elements: Element[]) => elements.map((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).f)
  const restDrops = await prints.evaluateAll(readDrops)

  // The tile answers as one thing: whichever print the pointer lands on, every
  // print swings out to its fanned angle together. Each lands off the even arc
  // by its own fixed wobble, so the open hand reads as dealt rather than
  // stepped. Reading at the same scroll position throughout; hover() would
  // otherwise scroll first.
  await prints.nth(1).scrollIntoViewIfNeeded()
  await prints.nth(1).hover({ position: { x: 4, y: 4 } })
  const open = [-18, -7, 1, 7, 17]
  await expect.poll(() => prints.evaluateAll(readAngles)).toEqual(open)

  // The hand also settles down the arc it sits on — every print lower than it
  // was, the flat middle included, so the whole fan eases rather than only its
  // ends swinging out. The angles above have already settled, so the drops
  // have too: they are the same transform.
  const openDrops = await prints.evaluateAll(readDrops)
  openDrops.forEach((drop, index) => expect(drop).toBeGreaterThan(restDrops[index]))

  // The hand opens outwards rather than sliding.
  const openWidth = await preview.locator(".personal-photos-stack").evaluate((element) => {
    const boxes = Array.from(element.querySelectorAll(".personal-photos-print")).map((print) => print.getBoundingClientRect())
    return Math.max(...boxes.map((box) => box.right)) - Math.min(...boxes.map((box) => box.left))
  })
  expect(openWidth).toBeGreaterThan(restWidth)

  // Pointing at a different print asks for nothing new: the hand is already
  // open and holds its shape, so nothing changes hands under the pointer.
  await prints.nth(3).hover({ position: { x: 4, y: 4 } })
  await expect.poll(() => prints.evaluateAll(readAngles)).toEqual(open)

  // The pile keeps its order at rest and open alike: the middle print is the
  // front of the fan and every print behind it steps back.
  expect(await prints.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).zIndex))).toEqual(["1", "3", "5", "3", "1"])
})

const sheet = (page: Page) => page.getByRole("region", { name: "Photo sheet" })
const dialog = (page: Page) => page.getByRole("dialog", { name: "Personal photos" })

/** Watch a close from inside the page: how long after the Escape keydown the
    first flight appears, and where the sheet was scrolled every frame until it
    did. Everything here is the page's own work, and the claims below are a
    handful of frames wide, so reading them across the protocol spends most of
    the budget on an `expect` poll interval and a round trip rather than on the
    close — this test has failed CI at 155ms and at 480ms against a 150ms
    budget for a handoff that never left one frame, and its "no print has moved
    yet" check races the 360ms rewind the same way. Sampling stops at the first
    flight, so every reading is from before the deal by construction. Arm it
    before the keypress; read it once the flights are up. */
async function armFlightClock(page: Page) {
  await page.evaluate(() => {
    Object.assign(window, {
      flightClock: new Promise<{ delay: number; scrolls: number[]; looks: string[]; scrollAtFlight: number }>((resolve) => {
        const sheet = document.querySelector<HTMLElement>(".personal-photos-sheet")!
        const scrolls: number[] = []
        const looks = new Set<string>()
        let pressed = 0
        let frame = 0
        const sample = () => {
          scrolls.push(sheet.scrollTop)
          for (const slide of sheet.querySelectorAll<HTMLElement>(".personal-photos-slide")) {
            const style = getComputedStyle(slide)
            looks.add(`${style.filter} ${style.opacity}`)
          }
          frame = requestAnimationFrame(sample)
        }
        // Capture, so the stamp beats the app's own Escape handler. It comes
        // off on the first Escape rather than the first key, so a test that
        // presses anything else on the way to the close still times the close.
        const stamp = (event: KeyboardEvent) => {
          if (event.key !== "Escape") return
          removeEventListener("keydown", stamp, { capture: true })
          pressed = performance.now()
          sample()
        }
        addEventListener("keydown", stamp, { capture: true })
        const observer = new MutationObserver(() => {
          if (!document.querySelector(".personal-photos-flight")) return
          observer.disconnect()
          cancelAnimationFrame(frame)
          resolve({ delay: performance.now() - pressed, scrolls, looks: [...looks], scrollAtFlight: sheet.scrollTop })
        })
        observer.observe(document.body, { childList: true, subtree: true })
      }),
    })
  })
}

/** Resolves once the flights are up; awaiting it before that hangs the test. */
const flightClock = (page: Page) => page.evaluate(() => (window as unknown as {
  flightClock: Promise<{ delay: number; scrolls: number[]; looks: string[]; scrollAtFlight: number }>
}).flightClock)

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

test("the sheet lays every print out in columns at its own aspect ratio", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const width of [2560, 1440, 900, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await openHome(page)
    await page.locator(".personal-photos-print").first().click()
    await expect(dialog(page)).toBeVisible()
    const layout = await sheet(page).evaluate((element) => {
      const slides = Array.from(element.querySelectorAll<HTMLElement>(".personal-photos-slide"))
      const masonry = element.querySelector(".personal-photos-masonry")!.getBoundingClientRect()
      return {
        count: slides.length,
        columns: new Set(slides.map((slide) => Math.round(slide.getBoundingClientRect().left))).size,
        sideways: element.scrollWidth - element.clientWidth,
        pageSideways: document.documentElement.scrollWidth - innerWidth,
        centre: masonry.left + masonry.width / 2,
        ratios: slides.map((slide) => {
          const image = slide.querySelector("img")!, rect = image.getBoundingClientRect()
          return Math.abs(rect.width / rect.height - Number(image.getAttribute("width")) / Number(image.getAttribute("height")))
        }),
        overlaps: slides.some((a, i) => slides.some((b, j) => {
          if (i >= j) return false
          const p = a.getBoundingClientRect(), q = b.getBoundingClientRect()
          return p.left < q.right - 1 && q.left < p.right - 1 && p.top < q.bottom - 1 && q.top < p.bottom - 1
        })),
      }
    })
    expect(layout.count).toBe(personalPhotoItems.length)
    expect(layout.columns, `${width}px`).toBe(width >= 700 ? 3 : 2)
    expect(layout.sideways).toBe(0)
    expect(layout.pageSideways).toBeLessThanOrEqual(0)
    expect(layout.centre).toBeCloseTo(width / 2, 0)
    expect(Math.max(...layout.ratios)).toBeLessThan(0.02)
    expect(layout.overlaps).toBe(false)
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
  }
})

test("opening from any print starts the sheet at its first row", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const [width, indices] of [[1440, [4, 2, 0]], [390, [3, 0]]] as const) {
    await page.setViewportSize({ width, height: 900 })
    await openHome(page)
    const prints = page.locator(".personal-photos-print")
    for (const index of indices) {
      // The prints are the first photos, so the top of the sheet is where
      // every one of them lives; the tapped print never changes that.
      await prints.nth(index).click()
      await expect(dialog(page)).toBeVisible()
      expect(await sheet(page).evaluate((element) => element.scrollTop), `${width}px print ${index}`).toBe(0)
      // The prints are the first photos wherever the columns put them; dealing
      // round-robin spreads them across the top instead of down one column, so
      // compare the set rather than the sheet's DOM order.
      const retained = await sheet(page).locator(".personal-photos-slide[data-photo-retained]").evaluateAll((slides) => slides.map((slide) => (slide as HTMLElement).dataset.photoId))
      expect([...retained].sort()).toEqual([...await prints.evaluateAll((elements) => elements.map((print) => (print as HTMLElement).dataset.photoId))].sort())
      await page.keyboard.press("Escape")
      await expect(dialog(page)).toBeHidden()
    }
  }
})

/** The photos whose slot is on screen. Every one of them leaves the fan and
    every one of them goes back to it; only the ones with a print of their own
    have a frame to morph between. */
const onScreen = (page: Page, match: string) => sheet(page).evaluate((element, selector) =>
  Array.from(element.querySelectorAll<HTMLElement>(selector)).filter((slide) => {
    const rect = slide.getBoundingClientRect(), bounds = element.getBoundingClientRect()
    return rect.bottom > bounds.top && rect.top < bounds.bottom
  }).map((slide) => slide.dataset.photoId), match)

const visibleRetained = (page: Page) => onScreen(page, ".personal-photos-slide[data-photo-retained]")
const visibleSlides = (page: Page) => onScreen(page, ".personal-photos-slide")

test("every print leaves for the middle of the screen in one beat and comes home in one beat", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await holdFlights(page)
  const prints = page.locator(".personal-photos-print")
  const retained = await prints.evaluateAll((elements) => elements.map((print) => (print as HTMLElement).dataset.photoId))
  await prints.first().click()
  const flights = page.locator(".personal-photos-flight")
  // The sheet deals its columns round-robin, so all five prints have a slot on
  // screen to fly to and every one of them flies. The whole screenful comes
  // with them: a photo with no print of its own borrows the print nearest it
  // and swells out from under the pile, exactly as it tucks back under it on
  // the way home, rather than rising in with the sheet.
  const flying = await visibleRetained(page)
  const dealt = await visibleSlides(page)
  expect(flying.length).toBe(retained.length)
  expect(retained).toEqual(expect.arrayContaining(flying))
  expect(dealt.length).toBeGreaterThan(flying.length)
  await expect(flights).toHaveCount(dealt.length)
  expect(await flights.evaluateAll((elements) => elements.map((element) => (element as HTMLElement).dataset.photoId))).toEqual(dealt)
  expect(await flights.evaluateAll((elements) => elements.map((element) => (element as HTMLElement).hasAttribute("data-photo-trailing"))))
    .toEqual(dealt.map((id) => !flying.includes(id)))

  // The sheet is centred on the page, so the hand lands on the middle of the
  // screen together rather than being thrown out to one edge -- which is what
  // has to hold wherever in the grid the band the fan sits in ends up.
  // Read where each flight is headed, not where it is: the flights are held at
  // their first frame, which is still the print's own place on the page. A
  // clone is positioned on its landing slot and carries the trip back to the
  // print in its transform, so `left` is the destination.
  const landings = await flights.evaluateAll((elements) => elements.map((element) => {
    const flight = element as HTMLElement
    return { centre: parseFloat(flight.style.left), width: parseFloat(flight.style.width) }
  }))
  const landingCentre = (
    Math.min(...landings.map(({ centre, width }) => centre - width / 2)) +
    Math.max(...landings.map(({ centre, width }) => centre + width / 2))
  ) / 2
  expect(landingCentre).toBeCloseTo(1440 / 2, 0)

  const deal = await flights.evaluateAll((elements) => elements.map((element) => {
    const timing = element.getAnimations()[0].effect!.getTiming()
    return { delay: Number(timing.delay), duration: Number(timing.duration) }
  }))
  // One beat, no stagger: the whole hand leaves at once.
  expect(deal.every(({ delay }) => delay === 0)).toBe(true)
  expect(deal.every(({ duration }) => duration === 200)).toBe(true)
  await flights.evaluateAll((elements) => elements.flatMap((element) => element.getAnimations({ subtree: true })).forEach((animation) => animation.finish()))
  await expect(flights).toHaveCount(0)
  await expect(sheet(page).locator(".personal-photos-slide").first()).toHaveCSS("opacity", "1")

  // The return has no stagger either, and the whole sheet comes with it: the
  // photos with a print of their own land on it, and the rest borrow the print
  // nearest them and tuck in under it rather than fading where they stand.
  await page.keyboard.press("Escape")
  await expect(flights).not.toHaveCount(0)
  const homebound = await visibleSlides(page)
  expect(homebound.length).toBeGreaterThan(flying.length)
  expect(await flights.evaluateAll((elements) => elements.map((element) => (element as HTMLElement).dataset.photoId))).toEqual(homebound)
  expect(await flights.evaluateAll((elements) => elements.map((element) => (element as HTMLElement).hasAttribute("data-photo-trailing"))))
    .toEqual(homebound.map((id) => !flying.includes(id)))
  // The fan is a pile, and a flight keeps its print's place in it. Travelling
  // on one flat tier stacked the photos in DOM order instead, and the print
  // beside one covered it completely — a photo that plainly never came back.
  // A borrower passes under the whole pile, or it lands in front of it.
  const tiers = await flights.evaluateAll((elements) => elements.map((element) => ({
    id: (element as HTMLElement).dataset.photoId,
    trailing: (element as HTMLElement).hasAttribute("data-photo-trailing"), z: Number(getComputedStyle(element).zIndex),
  })))
  const depths = Object.fromEntries(await prints.evaluateAll((elements) => elements.map((print) =>
    [(print as HTMLElement).dataset.photoId, Number(getComputedStyle(print).zIndex)] as const)))
  const landing = tiers.filter(({ trailing }) => !trailing)
  expect(landing.map(({ id, z }) => z - depths[id!])).toEqual(landing.map(() => landing[0].z - depths[landing[0].id!]))
  expect(new Set(landing.map(({ z }) => z)).size).toBe(new Set(Object.values(depths)).size)
  expect(Math.max(...tiers.filter(({ trailing }) => trailing).map(({ z }) => z)))
    .toBeLessThan(Math.min(...landing.map(({ z }) => z)))
  expect(await flights.evaluateAll((elements) => elements.map((element) => Number(element.getAnimations()[0].effect!.getTiming().delay)))).toEqual(
    await flights.evaluateAll((elements) => elements.map(() => 0)),
  )
  await flights.evaluateAll((elements) => elements.flatMap((element) => element.getAnimations({ subtree: true })).forEach((animation) => animation.finish()))
  await expect(dialog(page)).toBeHidden()
})

test("Escape and the sheet's margin close it and hand focus back; there is no chrome", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  await page.locator(".personal-photos-print").first().click()
  await expect(dialog(page)).toBeVisible()
  await expect(dialog(page).getByRole("button")).toHaveCount(0)
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await expect(trigger).toBeFocused()

  await page.keyboard.press("Enter")
  await expect(dialog(page)).toBeVisible()
  // The margin beside the masonry dismisses; a print does not.
  await sheet(page).locator(".personal-photos-slide").first().click()
  await expect(dialog(page)).toBeVisible()
  await page.mouse.click(10, 450)
  await expect(dialog(page)).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("the sheet scrolls with the wheel and keys and reopens at the top", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(dialog(page)).toBeVisible()
  await expect(sheet(page)).toBeFocused()
  const position = () => sheet(page).evaluate((element) => element.scrollTop)
  await expect.poll(position).toBe(0)
  await page.mouse.move(720, 450)
  // Every scroll here animates -- the wheel's, and End's and Home's too -- and
  // a key pressed while the last one is still easing in can be overtaken by
  // it, leaving the sheet where the previous scroll was headed. Each step waits
  // for the sheet to come to rest before the next key.
  const settled = async () => {
    let last = -1
    await expect.poll(async () => {
      const now = await position()
      const still = now === last
      last = now
      return still
    }).toBe(true)
  }
  const fromBottom = () => sheet(page).evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop)
  await page.mouse.wheel(0, 600)
  await expect.poll(position).toBeGreaterThan(0)
  await settled()
  await page.keyboard.press("End")
  await expect.poll(fromBottom).toBeLessThan(1)
  await settled()
  await page.keyboard.press("Home")
  await expect.poll(position).toBe(0)
  await settled()
  await page.keyboard.press("End")
  await expect.poll(fromBottom).toBeLessThan(1)
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  // No visit reshuffles the stack, and the next one starts at the first row.
  expect(await trigger.locator(".personal-photos-print").evaluateAll((prints) => prints.map((print) => (print as HTMLElement).dataset.photoId))).toEqual(personalPhotoItems.slice(0, 5).map((photo) => photo.id))
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(dialog(page)).toBeVisible()
  await expect.poll(position).toBe(0)
})

test("closing from the first row is immediate; a scrolled sheet rewinds there first, then the same prints fly home", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  const prints = trigger.locator(".personal-photos-print")
  const retained = await prints.evaluateAll((elements) => elements.map((print) => (print as HTMLElement).dataset.photoId))
  const flights = page.locator(".personal-photos-flight")
  // No photo fades where it stands: as the flights start, every slot on screen
  // has handed its photo to one and snaps to zero, while the photos below the
  // fold keep their colour and full strength and leave with the sheet's own
  // fade. Read them by handle, since the dialog's role changes as the close
  // begins.
  const slots = () => page.evaluate(() => {
    const sheet = document.querySelector<HTMLElement>(".personal-photos-sheet")!
    const bounds = sheet.getBoundingClientRect()
    return Array.from(sheet.querySelectorAll<HTMLElement>(".personal-photos-slide")).map((slide) => {
      const rect = slide.getBoundingClientRect(), style = getComputedStyle(slide)
      return `${rect.bottom > bounds.top && rect.top < bounds.bottom ? "on" : "off"} ${style.filter} ${style.opacity}`
    })
  })

  // At the first row: nothing dims, nothing waits — the prints just leave.
  await prints.last().click()
  await expect(dialog(page)).toBeVisible()
  await expect(flights).toHaveCount(0)
  await holdFlights(page)
  await armFlightClock(page)
  await page.keyboard.press("Escape")
  await expect(flights).not.toHaveCount(0)
  expect((await flightClock(page)).delay).toBeLessThan(150)
  expect(new Set(await slots())).toEqual(new Set(["on none 0", "off none 1"]))
  expect(await flights.evaluateAll((elements) => elements.map((element) => (element as HTMLElement).dataset.photoId))).toEqual(await visibleSlides(page))
  await flights.evaluateAll((elements) => elements.flatMap((element) => element.getAnimations({ subtree: true })).forEach((animation) => animation.finish()))
  await expect(dialog(page)).toBeHidden()

  // Scrolled away: the sheet glides back to the first row, then the whole
  // screenful leaves from the slots it was dealt to. Nothing dims under the
  // rewind, and nothing is left fading in place once the flights start.
  await prints.first().click()
  await expect(dialog(page)).toBeVisible()
  // The hold from the first visit is still in place; let the dealt flights land.
  await expect(flights).not.toHaveCount(0)
  await flights.evaluateAll((elements) => elements.flatMap((element) => element.getAnimations({ subtree: true })).forEach((animation) => animation.finish()))
  await expect(flights).toHaveCount(0)
  await page.keyboard.press("End")
  await expect.poll(() => sheet(page).evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(1)
  await holdFlights(page)
  await armFlightClock(page)
  await page.keyboard.press("Escape")
  const bottom = await sheet(page).evaluate((element) => element.scrollHeight - element.clientHeight)
  await expect(flights).not.toHaveCount(0)
  expect(new Set(await slots())).toEqual(new Set(["on none 0", "off none 1"]))
  // The rewind is under way before any print moves, and it glides: the sheet
  // is read every frame from the keypress until the first flight exists, so it
  // is caught between the bottom and the top on the way rather than jumping,
  // and the deal waits for it to land. Undimmed and at full strength in every
  // one of those frames, too. Which slides are on screen is deliberately not
  // part of that claim: the masonry is twice the sheet's height, so around a
  // fifth of the way through the rewind there is a band where every slide
  // touches the sheet's box at once.
  const rewind = await flightClock(page)
  expect(rewind.delay).toBeGreaterThanOrEqual(300)
  expect(rewind.scrolls.some((top) => top > 0 && top < bottom - 50)).toBe(true)
  expect(rewind.looks).toEqual(["none 1"])
  expect(rewind.scrollAtFlight).toBe(0)
  expect(await sheet(page).evaluate((element) => element.scrollTop)).toBe(0)
  expect(retained).toEqual(expect.arrayContaining(await visibleRetained(page)))
  expect(await flights.evaluateAll((elements) => elements.map((element) => (element as HTMLElement).dataset.photoId))).toEqual(await visibleSlides(page))
  await flights.evaluateAll((elements) => elements.flatMap((element) => element.getAnimations({ subtree: true })).forEach((animation) => animation.finish()))
  await expect(dialog(page)).toBeHidden()
  expect(await prints.evaluateAll((elements) => elements.map((print) => (print as HTMLElement).dataset.photoId))).toEqual(retained)
})

test("the hand takes its shape before the photos come home, and holds it once they are back", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  const prints = trigger.locator(".personal-photos-print")
  const rects = () => prints.evaluateAll((elements) => elements.map((print) => {
    const { x, y, width, height } = print.getBoundingClientRect()
    return [x, y, width, height].map((value) => Math.round(value * 10) / 10)
  }))
  // Untouched, before the pointer or the keyboard has been near the tile.
  const resting = await rects()

  await prints.nth(2).click()
  await expect(dialog(page)).toBeVisible()
  await holdFlights(page)
  await page.keyboard.press("Escape")
  const flights = page.locator(".personal-photos-flight")
  await expect(flights).not.toHaveCount(0)
  // Escape hands the tile its focus back, so the hand opens here — under the
  // sheet, before a single photo has left it — and the flights are aimed at
  // the frames it keeps. It used to wait for the dialog to unmount, which the
  // flight holds off until the photos have landed, and the whole row then
  // opened out from under them a beat after they arrived.
  const aimed = await rects()
  expect(aimed).not.toEqual(resting)

  await flights.evaluateAll((elements) => elements.flatMap((element) => element.getAnimations({ subtree: true })).forEach((animation) => animation.finish()))
  await expect(dialog(page)).toBeHidden()
  await expect(flights).toHaveCount(0)
  await expect(trigger).toBeFocused()
  expect(await rects()).toEqual(aimed)
  // Nothing glides on afterwards either: the settle is well inside 360ms.
  await page.waitForTimeout(500)
  expect(await rects()).toEqual(aimed)
})

test("on a phone the sheet keeps two columns, honours reduced motion, and fits landscape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  await trigger.click()
  await expect(dialog(page)).toBeVisible()
  expect(await dialog(page).evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThan(0.001)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(await sheet(page).evaluate((element) => new Set(Array.from(element.querySelectorAll(".personal-photos-slide")).map((slide) => Math.round(slide.getBoundingClientRect().left))).size)).toBe(2)
  await sheet(page).evaluate((element) => { element.scrollTop = element.scrollHeight })
  await expect.poll(() => sheet(page).evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(1)
  await page.mouse.click(10, 10)
  await expect(dialog(page)).toBeHidden()
  // Every visit starts at the first row, where the prints are.
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(dialog(page)).toBeVisible()
  await expect.poll(() => sheet(page).evaluate((element) => element.scrollTop)).toBe(0)
  await page.setViewportSize({ width: 844, height: 390 })
  const bounds = await dialog(page).boundingBox()
  expect(bounds?.y).toBeGreaterThanOrEqual(0)
  expect((bounds?.y ?? 0) + (bounds?.height ?? 0)).toBeLessThanOrEqual(390)
})

test("touch swipes scroll the sheet and a tap on its margin dismisses", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 393, height: 659 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await openHome(page)
  await page.locator(".personal-photos-print").first().tap()
  await expect(dialog(page)).toBeVisible()
  await expect(sheet(page)).toHaveCSS("pointer-events", "auto")
  const before = await sheet(page).evaluate((element) => element.scrollTop)
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 196, y: 600 }] })
  for (let step = 1; step <= 8; step++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 196, y: 600 - step * 40 }] })
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  await expect.poll(() => sheet(page).evaluate((element) => element.scrollTop)).toBeGreaterThan(before)
  await expect(dialog(page)).toBeVisible()
  // A tap during the fling only stops the scroll; let it settle first.
  await expect.poll(() => sheet(page).evaluate((element) => new Promise((resolve) => {
    const start = element.scrollTop
    setTimeout(() => resolve(element.scrollTop === start), 150)
  }))).toBe(true)
  // Once scrolled, the top margin has gone with the content; the side gutter
  // beside the masonry is still the sheet's own margin, and a print is not.
  await page.touchscreen.tap(196, 300)
  await expect(dialog(page)).toBeVisible()
  await page.touchscreen.tap(8, 400)
  await expect(dialog(page)).toBeHidden()
  await context.close()
})
