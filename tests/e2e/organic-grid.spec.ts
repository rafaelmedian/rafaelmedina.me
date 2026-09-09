import { expect, test } from "@playwright/test"

// A misplaced grid area can silently paint two working links on top of one
// another. Check the rendered geometry, including either side of breakpoints.
for (const width of [390, 699, 700, 899, 900, 1440, 1728]) {
  test(`keeps every mosaic tile reachable without overlap at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    const tiles = page.locator(".mosaic-row-item")
    await expect(tiles).toHaveCount(15)
    await expect(page.locator("a.mosaic-row-card")).toHaveCount(12)
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
    if (width < 900) {
      // The opening projects must remain side by side even on phones.
      expect(boxes[0].y).toBeCloseTo(boxes[1].y, 0)
      expect(boxes[0].height).toBeCloseTo(boxes[0].width, 0)
      expect(boxes[1].x).toBeGreaterThan(boxes[0].x + boxes[0].width)
      const protector = boxes[5]
      const quote = boxes[6]
      expect(protector.width).toBeCloseTo(boxes[1].x + boxes[1].width - boxes[0].x, 0)
      expect(quote.width).toBeCloseTo(protector.width, 0)
    } else {
      // The long middle cards bridge the smaller stack alongside them.
      expect(boxes[5].height).toBeGreaterThan(boxes[6].height + 100)
      expect(boxes[5].y + boxes[5].height).toBeCloseTo(boxes[7].y + boxes[7].height, 0)
      expect(boxes[8].y + boxes[8].height).toBeGreaterThan(boxes[9].y + boxes[9].height + 30)
      expect(boxes[10].y + boxes[10].height).toBeCloseTo(boxes[11].y + boxes[11].height, 0)
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
  await expect(cards).toHaveCount(12)
  const first = await cards.nth(0).boundingBox()
  const second = await cards.nth(1).boundingBox()
  expect(first!.height).toBeGreaterThan(100)
  expect(first!.y).toBeCloseTo(second!.y, 0)
  expect(second!.x).toBeGreaterThan(first!.x + first!.width)
  await context.close()
})

test("loads enough pixels for Protector's tall crop at the desktop breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const media = page.locator(".mosaic-row-card-preview-protector img")
  await media.scrollIntoViewIfNeeded()
  await expect(media).toHaveJSProperty("complete", true)
  const { sourceWidth, paintedWidth } = await media.evaluate(async element => {
    const image = element as HTMLImageElement
    // An independent Image avoids sizes' density-corrected naturalWidth.
    const source = new Image()
    source.src = image.currentSrc
    await source.decode()
    const scale = new DOMMatrixReadOnly(getComputedStyle(image).transform).a
    return {
      sourceWidth: source.naturalWidth,
      paintedWidth: Math.max(image.clientWidth, image.clientHeight * source.naturalWidth / source.naturalHeight) * scale,
    }
  })
  expect(sourceWidth).toBeGreaterThanOrEqual(paintedWidth)
})

test("separates Rewards artwork and extends Matcha product backgrounds", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const rewardsCard = page.getByRole("link", { name: /Open Matcha Rewards/ })
  const rewardsMedia = rewardsCard.locator("img")
  await rewardsCard.scrollIntoViewIfNeeded()
  await expect(rewardsMedia).toHaveCount(2)
  await expect(rewardsMedia.nth(0)).toHaveAttribute("src", /matcha-rewards-link-preview\.webp$/)
  await expect(rewardsMedia.nth(1)).toHaveAttribute("src", /matcha-rewards-countdown\.webp$/)

  const rewardsBox = await rewardsCard.boundingBox()
  expect(rewardsBox).not.toBeNull()
  for (const media of await rewardsMedia.all()) {
    const box = await media.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(rewardsBox!.x - 1)
    expect(box!.y).toBeGreaterThanOrEqual(rewardsBox!.y - 1)
    expect(box!.x + box!.width).toBeLessThanOrEqual(rewardsBox!.x + rewardsBox!.width + 1)
    expect(box!.y + box!.height).toBeLessThanOrEqual(rewardsBox!.y + rewardsBox!.height + 1)
  }

  for (const name of [/Open Matcha token page/, /Open Matcha Pro/]) {
    const card = page.getByRole("link", { name })
    await expect(card).toHaveCSS("padding", "0px")
    expect(await card.evaluate(element => getComputedStyle(element).backgroundImage)).not.toBe("none")

    const [cardBox, mediaBox] = await Promise.all([card.boundingBox(), card.locator("img").boundingBox()])
    expect(cardBox).not.toBeNull()
    expect(mediaBox).not.toBeNull()
    expect(mediaBox!.x).toBeGreaterThanOrEqual(cardBox!.x - 1)
    expect(mediaBox!.y).toBeGreaterThanOrEqual(cardBox!.y - 1)
    expect(mediaBox!.x + mediaBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width + 1)
    expect(mediaBox!.y + mediaBox!.height).toBeLessThanOrEqual(cardBox!.y + cardBox!.height + 1)
  }
})
