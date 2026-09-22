import { expect, test, type Page } from "@playwright/test"

async function openWall(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("region", { name: "Photo wall" })).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
}

test("opening avoids a live full-screen backdrop filter", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openWall(page)

  await expect(page.locator(".personal-photos-backdrop")).toHaveCSS("backdrop-filter", "none")
})

test("wall textures upgrade at most one full-size photo per frame", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.addInitScript(() => {
    const upload = WebGLRenderingContext.prototype.texImage2D
    Object.assign(window, { photoUploads: {} as Record<string, number> })
    WebGLRenderingContext.prototype.texImage2D = function (...args: Parameters<typeof upload>) {
      const source = args[args.length - 1]
      if (source instanceof HTMLImageElement && !source.currentSrc.includes("-thumb.webp")) {
        const frames = (window as unknown as { photoUploads: Record<string, number> }).photoUploads
        const frame = String(document.timeline.currentTime)
        frames[frame] = (frames[frame] ?? 0) + 1
      }
      return upload.apply(this, args)
    } as typeof upload
  })
  await openWall(page)
  await expect.poll(() => page.evaluate(() => Object.values((window as unknown as { photoUploads: Record<string, number> }).photoUploads).reduce((a, b) => a + b, 0))).toBeGreaterThan(1)
  const batches = await page.evaluate(() => Object.values((window as unknown as { photoUploads: Record<string, number> }).photoUploads))
  expect(Math.max(...batches)).toBe(1)
  const image = page.locator('.personal-photos-slide[data-photo-id="office"] img')
  const before = await image.getAttribute("sizes")
  const width = await image.evaluate(element => element.getBoundingClientRect().width)
  expect(parseFloat(before!)).toBeLessThanOrEqual(Math.ceil(width) + 1)
  await page.getByRole("region", { name: "Photo wall" }).press("+")
  await expect(image).not.toHaveAttribute("sizes", before!)
})
