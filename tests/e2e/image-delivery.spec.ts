import { expect, test } from "@playwright/test"

for (const width of [390, 1440]) {
  test(`photo sheet chooses responsive sources at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" })
    const page = await context.newPage()
    await page.goto("/")
    await page.locator(".personal-photos-print").first().click()
    const photo = page.locator(".personal-photos-slide img").first()
    await expect.poll(() => photo.evaluate((img) => (img as HTMLImageElement).currentSrc)).toContain(width === 390 ? "-400w.webp" : "-800w.webp")
    await expect.poll(() => photo.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    const sizes = await photo.evaluate((img) => {
      const image = img as HTMLImageElement
      return { selected: image.currentSrc, width: image.getBoundingClientRect().width }
    })
    expect(width === 390 ? 400 : 800).toBeGreaterThanOrEqual(sizes.width * 2)
    await expect(page.locator('.personal-photos-slide img[loading="lazy"]')).not.toHaveCount(0)
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
