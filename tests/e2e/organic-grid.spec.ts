import { expect, test } from "@playwright/test"

// A misplaced grid area can silently paint two working links on top of one
// another. Check the rendered geometry, including either side of breakpoints.
for (const width of [390, 699, 700, 899, 900, 1440, 1728]) {
  test(`keeps every mosaic tile reachable without overlap at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    const tiles = page.locator(".mosaic-row-item")
    await expect(tiles).toHaveCount(17)
    // Twelve projects and the résumé: its reader has a page of its own now, so
    // its tile is a link on the grid like theirs.
    await expect(page.locator("a.mosaic-row-card")).toHaveCount(13)
    const boxes = await tiles.evaluateAll(elements => elements.map(element => {
      const { x, y, width, height } = element.getBoundingClientRect()
      return { x, y, width, height }
    }))
    for (const [index, box] of boxes.entries()) {
      expect(box.width).toBeGreaterThan(100)
      expect(box.height).toBeGreaterThan(100)
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1)
      for (const other of boxes.slice(index + 1)) {
        const overlapX = Math.min(box.x + box.width, other.x + other.width) - Math.max(box.x, other.x)
        const overlapY = Math.min(box.y + box.height, other.y + other.height) - Math.max(box.y, other.y)
        expect(overlapX > 1 && overlapY > 1).toBe(false)
      }
    }
    // Address tiles by their grid area rather than their position in the DOM.
    const byArea = await tiles.evaluateAll(elements => Object.fromEntries(elements.map(element => {
      const area = [...element.classList].find(name => name.startsWith("mosaic-tile-"))!.slice("mosaic-tile-".length)
      const { x, y, width, height } = element.getBoundingClientRect()
      return [area, { x, y, width, height }]
    })))
    const { wallet, homepage, writings, resume, protector, quote, photos, dealership,
      quote2, duo, twilio, moodys, turtle, onit, relaunch, patrol, marketing } = byArea
    if (width < 900) {
      // The opening projects share a row, with the notes folder below them.
      expect(wallet.y).toBeCloseTo(homepage.y, 0)
      expect(wallet.height).toBeCloseTo(wallet.width, 0)
      expect(homepage.x).toBeGreaterThan(wallet.x + wallet.width)
      expect(protector.width).toBeCloseTo(homepage.x + homepage.width - wallet.x, 0)
      for (const tile of [quote, photos, quote2, duo, dealership, twilio, turtle, onit, relaunch, patrol, marketing]) {
        expect(tile.width).toBeCloseTo(protector.width, 0)
      }
      // The quote, Duo, and dealership band follows the notes, ahead of Protector.
      expect(quote2.y).toBeGreaterThan(writings.y + writings.height - 1)
      expect(duo.y).toBeGreaterThan(quote2.y + quote2.height - 1)
      expect(dealership.y).toBeGreaterThan(duo.y + duo.height - 1)
      expect(protector.y).toBeGreaterThan(dealership.y + dealership.height - 1)
      // Films, marketing, and photos follow the two phone recordings.
      const sequence = [protector, patrol, quote, relaunch, marketing, photos, twilio, moodys, turtle, onit]
      for (let index = 1; index < sequence.length; index++) {
        expect(sequence[index].y).toBeGreaterThan(sequence[index - 1].y + sequence[index - 1].height - 1)
      }
      // The résumé shares Moody's row, with both tiles filling the grid.
      expect(resume.y).toBeCloseTo(moodys.y, 0)
      expect(resume.height).toBeCloseTo(moodys.height, 0)
      expect(resume.x).toBeGreaterThan(moodys.x + moodys.width)
      expect(resume.x + resume.width).toBeCloseTo(protector.x + protector.width, 0)
    } else {
      // Protector and the quote share one height above the personal row.
      expect(quote.y).toBeCloseTo(protector.y, 0)
      expect(quote.height).toBeCloseTo(protector.height, 0)
      expect(patrol.y).toBeCloseTo(protector.y, 0)
      expect(patrol.height).toBeCloseTo(protector.height, 0)
      // Films, marketing, and photos share the band below the phones.
      expect(relaunch.y).toBeCloseTo(photos.y, 0)
      expect(marketing.y).toBeCloseTo(photos.y, 0)
      expect(relaunch.height).toBeCloseTo(photos.height, 0)
      expect(marketing.height).toBeCloseTo(photos.height, 0)
      expect(relaunch.x).toBeCloseTo(protector.x, 0)
      expect(marketing.x).toBeGreaterThan(relaunch.x + relaunch.width)
      expect(photos.x).toBeGreaterThan(marketing.x + marketing.width)
      expect(photos.x + photos.width).toBeCloseTo(quote.x + quote.width, 0)
      expect(photos.y).toBeGreaterThan(protector.y + protector.height - 1)
      // The quote, Duo, and dealership span a band between the opening row and
      // Protector, the Duo the fifth tile and the dealership widest.
      expect(quote2.x).toBeCloseTo(protector.x, 0)
      for (const tile of [duo, dealership]) {
        expect(tile.y).toBeCloseTo(quote2.y, 0)
        expect(tile.height).toBeCloseTo(quote2.height, 0)
      }
      expect(duo.x).toBeGreaterThan(quote2.x + quote2.width)
      expect(dealership.x).toBeGreaterThan(duo.x + duo.width)
      expect(dealership.width).toBeGreaterThan(duo.width)
      expect(dealership.x + dealership.width).toBeCloseTo(photos.x + photos.width, 0)
      expect(quote2.y).toBeGreaterThan(homepage.y + homepage.height - 1)
      expect(protector.y).toBeGreaterThan(quote2.y + quote2.height - 1)
      // The agency group closes the grid, with the résumé in its first row.
      expect(twilio.y).toBeGreaterThan(photos.y + photos.height - 1)
      expect(twilio.x).toBeCloseTo(protector.x, 0)
      expect(moodys.y).toBeCloseTo(twilio.y, 0)
      expect(resume.y).toBeCloseTo(twilio.y, 0)
      expect(resume.height).toBeCloseTo(twilio.height, 0)
      expect(resume.x).toBeGreaterThan(moodys.x + moodys.width)
      expect(resume.x + resume.width).toBeCloseTo(photos.x + photos.width, 0)
      expect(turtle.y).toBeCloseTo(onit.y, 0)
      expect(turtle.y).toBeGreaterThan(twilio.y + twilio.height - 1)
      expect(twilio.width).toBeGreaterThan(moodys.width)
      expect(onit.width).toBeGreaterThan(turtle.width)
      expect(turtle.x).toBeCloseTo(twilio.x, 0)
      expect(onit.x + onit.width).toBeCloseTo(resume.x + resume.width, 0)
    }
  })
}

test("keeps the takeover stage matched to its content after resizing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  // Simulate a content-height change independent of the viewport. The sticky
  // offset must follow layout rather than a duplicate row-count formula.
  await page.locator(".mosaic-rows").evaluate(element => {
    (element as HTMLElement).style.paddingBottom = "400px"
  })
  for (const width of [1728, 700, 899, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await expect.poll(() => page.locator(".mosaic-takeover-stage").evaluate(element => {
      const stage = element as HTMLElement
      const grid = stage.querySelector<HTMLElement>(".mosaic-rows")!
      const runway = stage.parentElement!
      return Math.max(
        Math.abs(stage.offsetHeight - grid.offsetHeight),
        Math.abs(runway.offsetHeight - stage.offsetHeight - window.innerHeight),
        Math.abs(Number.parseFloat(getComputedStyle(stage).top) - (window.innerHeight - stage.offsetHeight)),
      )
    })).toBeLessThanOrEqual(1)
  }
})

test("reserves the mosaic layout before scripts or media load", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.route(/\.(webp|jpg|png|webm)(\?.*)?$/, route => route.abort())
  await page.goto("/")
  const cards = page.locator("a.mosaic-row-card")
  await expect(cards).toHaveCount(13)
  const first = await cards.nth(0).boundingBox()
  const second = await cards.nth(1).boundingBox()
  expect(first!.height).toBeGreaterThan(100)
  expect(first!.y).toBeCloseTo(second!.y, 0)
  expect(second!.x).toBeGreaterThan(first!.x + first!.width)
  await context.close()
})

test("shows the dealership preview large and crops it at the card edge", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const card = page.getByRole("link", { name: /Open Dealership Hub/ })
  await card.scrollIntoViewIfNeeded()

  const [cardBox, mediaClipBox, mediaBox] = await Promise.all([
    card.boundingBox(),
    card.locator(".mosaic-row-card-media-clip").boundingBox(),
    card.locator("img.mosaic-row-media").boundingBox(),
  ])
  expect(cardBox).not.toBeNull()
  expect(mediaClipBox).not.toBeNull()
  expect(mediaBox).not.toBeNull()
  expect(mediaClipBox!.y + mediaClipBox!.height).toBeCloseTo(cardBox!.y + cardBox!.height - 1, 0)
  expect(mediaBox!.y).toBeGreaterThan(mediaClipBox!.y)
  expect(mediaBox!.width / mediaClipBox!.width).toBeCloseTo(1.04, 2)

  // Its slot in the aside band is wider and shorter than the export's 4:3, so
  // the top of the dashboard shows and the lower rows run off the card's edge.
  const visibleShare = mediaClipBox!.height / mediaBox!.height
  expect(visibleShare).toBeGreaterThan(0.45)
  expect(visibleShare).toBeLessThan(0.95)
})
