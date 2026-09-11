import { expect, test, type Page } from "@playwright/test"

async function openHome(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
}

async function countAnimationFrames(page: Page) {
  await page.addInitScript(() => {
    const counts = { callbacks: 0 }
    Object.assign(window, { __photoFrames: counts })
    const request = window.requestAnimationFrame
    window.requestAnimationFrame = (callback) => request((time) => { counts.callbacks++; callback(time) })
  })
  return () => page.evaluate(() => (window as unknown as { __photoFrames: { callbacks: number } }).__photoFrames.callbacks)
}

test("responsive source upgrades reach the globe's GPU textures", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: "reduce" })
  const page = await context.newPage()
  try {
    await page.addInitScript(() => {
      const uploaded: string[] = []
      Object.assign(window, { __photoUploads: uploaded })
      const upload = WebGL2RenderingContext.prototype.texImage2D
      WebGL2RenderingContext.prototype.texImage2D = function (...args: Parameters<typeof upload>) {
        const image = args[args.length - 1]
        if (this.canvas instanceof HTMLCanvasElement && this.canvas.matches(".personal-photos-pebbles") && image instanceof HTMLImageElement) uploaded.push(image.currentSrc)
        return upload.apply(this, args)
      }
    })
    await openHome(page)
    await page.locator(".personal-photos-label").click()
    await expect(page.locator(".personal-photos-sphere")).toBeVisible()
    const images = page.locator(".personal-photos-sphere [data-photo-id] img")
    await expect.poll(() => images.evaluateAll((items) => items.every((image) => (image as HTMLImageElement).complete))).toBe(true)
    const sources = () => images.evaluateAll((items) => items.map((image) => (image as HTMLImageElement).currentSrc))
    const uploads = () => page.evaluate(() => (window as unknown as { __photoUploads: string[] }).__photoUploads)
    await expect.poll(async () => (await sources()).every((src) => src.endsWith("-400w.webp"))).toBe(true)
    await expect.poll(uploads).toEqual(expect.arrayContaining(await sources()))

    await page.setViewportSize({ width: 1440, height: 1000 })
    await expect.poll(async () => (await sources()).every((src) => src.endsWith("-800w.webp"))).toBe(true)
    await expect.poll(uploads).toEqual(expect.arrayContaining(await sources()))
  } finally {
    await context.close()
  }
})

test("a settled reduced-motion globe stops animation callbacks and wakes for input", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  const count = await countAnimationFrames(page)
  await openHome(page)
  await page.locator(".personal-photos-label").click()
  const globe = page.getByRole("region", { name: "Photo globe" })
  await expect(globe).toBeVisible()
  // Let image uploads, the fan's handoff and dialog effects finish first.
  await page.waitForTimeout(2000)
  const before = await count()
  await page.waitForTimeout(500)
  expect(await count()).toBe(before)

  const photo = globe.locator(".personal-photos-slide").first()
  const pose = await photo.getAttribute("style")
  await globe.focus()
  await page.keyboard.press("ArrowRight")
  await expect(photo).not.toHaveAttribute("style", pose!)
  await page.waitForTimeout(250)
  const afterInput = await count()
  await page.waitForTimeout(500)
  expect(await count()).toBe(afterInput)
  await page.keyboard.press("Escape")
  await expect(globe).toHaveCount(0)
})

test("a held globe sleeps after its springs settle and resumes spinning after release", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const count = await countAnimationFrames(page)
  await openHome(page)
  await page.locator(".personal-photos-print").nth(2).click()
  const globe = page.getByRole("region", { name: "Photo globe" })
  await expect(globe).toBeVisible()
  await page.mouse.move(5, 5)
  await page.waitForTimeout(2500)
  const settled = await count()
  await page.waitForTimeout(500)
  expect(await count()).toBe(settled)

  await page.mouse.click(5, 5)
  await expect(globe).toBeVisible()
  // Beyond the front dwell, the timer must restart the idle spin.
  await page.waitForTimeout(4500)
  const photo = globe.locator(".personal-photos-slide").first()
  const pose = await photo.getAttribute("style")
  await expect(photo).not.toHaveAttribute("style", pose!)
  await page.keyboard.press("Escape")
  await expect(globe).toHaveCount(0)
})

test("scrolling to the fan fetches only its previews until opening intent", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 })
  const requested = new Set<string>()
  page.on("request", (request) => {
    if (/\/images\/personal\/[^/]+-thumb\.webp$/.test(request.url())) requested.add(new URL(request.url()).pathname)
  })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  await trigger.scrollIntoViewIfNeeded()
  const previewSources = await trigger.locator("img").evaluateAll((images) => images.map((image) => new URL(image.src).pathname))
  await expect.poll(() => requested.size).toBeGreaterThanOrEqual(previewSources.length)
  await page.waitForTimeout(500)
  expect([...requested].sort()).toEqual(previewSources.sort())

  await trigger.focus()
  await expect.poll(() => requested.size).toBeGreaterThan(previewSources.length)
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
})
