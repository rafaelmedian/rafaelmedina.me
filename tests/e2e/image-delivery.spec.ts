import { expect, test } from "@playwright/test"
import sharp from "sharp"
import path from "node:path"

// The globe advertises the held size up front: its initial candidate must
// have enough pixels when a visitor enlarges the photo on a 2x display.
for (const width of [390, 1440]) {
  test(`photo globe chooses responsive sources at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" })
    const page = await context.newPage()
    await page.goto("/")
    await page.locator(".personal-photos-label").click()
    const photo = page.locator(".personal-photos-slide img").first()
    // Twenty-seven photos load at once when the globe opens; under a full
    // parallel run the first can take longer than the default 5s to arrive.
    await expect.poll(() => photo.evaluate((img) => (img as HTMLImageElement).naturalWidth), { timeout: 15_000 }).toBeGreaterThan(0)
    const source = await photo.evaluate((img) => (img as HTMLImageElement).currentSrc)
    // Read the bitmap itself: naturalWidth on a srcset image is corrected
    // for density, rather than reporting the file's available pixels.
    const bitmap = await sharp(path.resolve("public", new URL(source).pathname.slice(1))).metadata()
    const slide = page.locator(".personal-photos-sphere .personal-photos-slide[data-photo-id]").first()
    await slide.focus()
    await page.keyboard.press("Enter")
    await expect(slide).toHaveAttribute("data-sphere-held", "")
    const required = await photo.evaluate((img) => img.getBoundingClientRect().width * devicePixelRatio)
    expect(bitmap.width).toBeGreaterThanOrEqual(required)
    // Every tile loads eagerly: a lazy one on the far side of the globe
    // (display: none never loads) came round to the front still blank.
    await expect(page.locator('.personal-photos-sphere img[loading="lazy"]')).toHaveCount(0)
    await context.close()
  })
}

test("reaction animations load only on intent and stay static in data-saving mode", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", { configurable: true, value: Object.assign(new EventTarget(), { saveData: true, effectiveType: "4g" }) })
  })
  const animations: string[] = []
  page.on("request", (request) => {
    if (/\/reactions\/(copy-email-before|copy-email-success|booking-reaction)\.webp$/.test(request.url())) animations.push(request.url())
  })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  expect(animations).toEqual([])
  await page.locator(".mosaic-social-corner .mosaic-profile-email").hover()
  const image = page.locator(".reaction-card-media img")
  await expect(image).toBeVisible()
  await expect.poll(() => image.evaluate((img) => (img as HTMLImageElement).currentSrc)).toContain("copy-email-before-still.webp")
  expect(animations).toEqual([])
})

test("LinkedIn does not download its clip on a slow connection", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", { configurable: true, value: Object.assign(new EventTarget(), { effectiveType: "3g" }) })
  })
  const videos: string[] = []
  page.on("request", request => { if (/\/reactions\/.*\.(webm|mp4)$/.test(request.url())) videos.push(request.url()) })
  await page.goto("/")
  await page.getByRole("link", { name: "Message on LinkedIn" }).hover()
  await expect(page.locator(".mosaic-linkedin-card")).toHaveAttribute("data-state", "open")
  await expect(page.locator(".mosaic-linkedin-card video")).toHaveJSProperty("paused", true)
  expect(videos).toEqual([])
})

// Catch regressions where a contained image requests its entire tile's width,
// or a missing intermediate variant doubles the pixels sent to the browser.
for (const width of [390, 1440]) {
  for (const deviceScaleFactor of [1, 2]) {
    test(`sizes contained previews at ${width}px and ${deviceScaleFactor}x density`, async ({ browser }) => {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor, reducedMotion: "reduce" })
      await page.goto("/")
      // Intended artwork widths: smaller downloads must not shrink the layout.
      // Dealership renders at 112% of its clip width for the deliberate crop.
      const fixtures = width === 390
        ? [["Popparazi V1", 84], ["Shared family stories", 177], ["Dealership lead hub", 185]] as const
        : [["Popparazi V1", 130], ["Shared family stories", 565], ["Dealership lead hub", 854]] as const
      for (const [name, originalWidth] of fixtures) {
        const image = page.getByAltText(name, { exact: true }).and(page.locator("img.mosaic-row-media"))
        await image.scrollIntoViewIfNeeded()
        await expect(image).toHaveAttribute("data-loaded", "true")
        const rendered = await image.evaluate((node) => {
          const img = node as HTMLImageElement
          return { source: new URL(img.currentSrc).pathname, width: img.getBoundingClientRect().width, dpr: devicePixelRatio }
        })
        const metadata = await sharp(path.join(process.cwd(), "public", decodeURI(rendered.source))).metadata()
        expect(rendered.width).toBeCloseTo(originalWidth, -1)
        expect(metadata.width!, `${name}: resource width versus rendered artwork`).toBeLessThanOrEqual(rendered.width * rendered.dpr * 1.5)
        expect(metadata.width!).toBeGreaterThanOrEqual(rendered.width * rendered.dpr * 0.9)
      }
      await page.close()
    })
  }
}
