import { expect, test, type Page } from "@playwright/test"

async function openHome(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
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
    const images = page.locator(".personal-photos-sphere [data-photo-id] img")
    await expect.poll(() => images.evaluateAll((items) => items.every((image) => (image as HTMLImageElement).complete))).toBe(true)
    const sources = () => images.evaluateAll((items) => items.map((image) => (image as HTMLImageElement).currentSrc))
    const uploads = () => page.evaluate(() => (window as unknown as { __photoUploads: string[] }).__photoUploads)
    await expect.poll(uploads).toEqual(expect.arrayContaining(await sources()))

    await page.setViewportSize({ width: 1440, height: 1000 })
    await expect.poll(async () => (await sources()).every((src) => src.endsWith("-800w.webp"))).toBe(true)
    await expect.poll(uploads).toEqual(expect.arrayContaining(await sources()))
  } finally {
    await context.close()
  }
})
