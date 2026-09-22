import { expect, test } from "@playwright/test"

test("context restoration keeps the usable DOM fallback", async ({ page }) => {
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const wall = page.getByRole("region", { name: "Photo wall" })
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await expect(wall.locator("[data-warp-ready]")).toHaveCount(1)
  await wall.evaluate(async stage => {
    const canvas = stage.querySelector("canvas")!
    const extension = canvas.getContext("webgl")!.getExtension("WEBGL_lose_context")!
    const lost = new Promise(resolve => canvas.addEventListener("webglcontextlost", resolve, { once: true }))
    extension.loseContext()
    await lost
    // Let the loss event finish dispatching before asking for restoration.
    await new Promise(resolve => setTimeout(resolve, 100))
    const restored = new Promise(resolve => canvas.addEventListener("webglcontextrestored", resolve, { once: true }))
    extension.restoreContext()
    await restored
    stage.dispatchEvent(new Event("photo-wall-paint"))
    await new Promise(requestAnimationFrame)
  })
  await expect(wall.locator("[data-warp-ready]")).toHaveCount(0)
  await expect(wall.locator(".personal-photos-masonry")).toHaveCSS("opacity", "1")
  await wall.press("Shift+ArrowRight")
  await expect(wall.locator("canvas")).toBeHidden()
  await wall.press("ArrowRight")
  await expect(wall.locator(".personal-photos-slide[data-held]")).toHaveCount(1)
})

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

test("the opening curve is already at full strength on its first frame", async ({ page }) => {
  // Observe the values sent to the real shader, not just canvas visibility.
  await page.addInitScript(() => {
    const names = new WeakMap<WebGLUniformLocation, string>()
    const locate = WebGLRenderingContext.prototype.getUniformLocation
    const uniform = WebGLRenderingContext.prototype.uniform1f
    Object.assign(window, { renderedRims: [] as number[] })
    WebGLRenderingContext.prototype.getUniformLocation = function (program, name) {
      const location = locate.call(this, program, name)
      if (location) names.set(location, name)
      return location
    }
    WebGLRenderingContext.prototype.uniform1f = function (location, value) {
      if (location && names.get(location) === "rim") {
        (window as unknown as { renderedRims: number[] }).renderedRims.push(value)
      }
      uniform.call(this, location, value)
    }
  })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  await expect.poll(() => page.evaluate(() => (window as unknown as { renderedRims: number[] }).renderedRims.at(-1))).toBe(0.46)
  const values = await page.evaluate(() => (window as unknown as { renderedRims: number[] }).renderedRims)
  expect(values.length).toBeGreaterThan(0)
  expect(values.every(value => value === 0.46)).toBe(true)
})
