import { expect, test } from "@playwright/test"

// Read pixels in the render frame, before WebGL discards its drawing buffer.
// A visible canvas alone would miss a blank renderer or a failed framebuffer.
test("the shared curved surface paints photos and sleeps at rest", async ({ page }) => {
  await page.addInitScript(() => {
    const original = window.requestAnimationFrame
    Object.assign(window, { wallFrames: 0 })
    window.requestAnimationFrame = callback => original(time => {
      const state = window as unknown as { wallFrames: number }
      state.wallFrames++
      callback(time)
    })
  })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const wall = page.getByRole("region", { name: "Photo wall" })
  await expect(wall).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await expect(wall.locator("[data-warp-ready]")).toHaveCount(1)
  const painted = await wall.evaluate(async stage => {
    stage.dispatchEvent(new Event("photo-wall-paint"))
    return new Promise<number>(resolve => requestAnimationFrame(() => {
      const gl = stage.querySelector("canvas")!.getContext("webgl")!
      const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4)
      gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
      let opaque = 0
      for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 200) opaque++
      resolve(opaque / (pixels.length / 4))
    }))
  })
  expect(painted).toBeGreaterThan(0.4)
  await expect(async () => {
    const frames = () => page.evaluate(() => (window as unknown as { wallFrames: number }).wallFrames)
    const before = await frames()
    await page.waitForTimeout(400)
    expect(await frames()).toBe(before)
  }).toPass({ timeout: 5000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(wall.locator("[data-warp-ready]")).toHaveCount(0)
  await expect(wall.locator(".personal-photos-masonry")).toHaveCSS("opacity", "1")
})

test("the original photo wall remains usable without WebGL", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (args[0] === "webgl") return null
      return original.apply(this, args)
    } as typeof original
  })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const wall = page.getByRole("region", { name: "Photo wall" })
  await expect(wall).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await expect(wall.locator("[data-warp-ready]")).toHaveCount(0)
  await wall.press("ArrowRight")
  await expect(wall.locator(".personal-photos-slide[data-held]")).toHaveCount(1)
})
