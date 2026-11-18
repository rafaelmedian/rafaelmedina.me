import { expect, test } from "@playwright/test"

// Grid hover stays silent, including after gallery interaction warms audio.
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.addInitScript(() => {
    const starts: number[] = []
    Object.assign(window, { soundStarts: starts })
    const start = AudioScheduledSourceNode.prototype.start
    AudioScheduledSourceNode.prototype.start = function (...args) {
      starts.push(performance.now())
      return start.apply(this, args)
    }
  })
})

const soundStarts = () => (window as unknown as { soundStarts: number[] }).soundStarts.length

const centre = async (page: import("@playwright/test").Page, name: RegExp) => {
  const box = (await page.getByRole("link", { name }).first().boundingBox())!
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

test("tiles stay silent on hover once audio is warm", async ({ page }) => {
  await page.goto("/")
  const matcha = page.getByRole("link", { name: /Open Matcha multiwallet flow/ })
  const dealership = page.getByRole("link", { name: /Open Dealership Hub preview/ })

  // Cold: moving across tiles builds nothing and plays nothing.
  await matcha.hover()
  await dealership.hover()
  expect(await page.evaluate(soundStarts)).toBe(0)

  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.querySelector(".preview-gallery-shell")?.getAttribute("data-origin-animating"))).toBeNull()
  // The warmup builds the context in idle time after the entrance, with a
  // silent note through the same hook the real sounds use.
  await expect.poll(() => page.evaluate(soundStarts)).toBeGreaterThan(0)
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)
  await page.waitForTimeout(400)

  const before = await page.evaluate(soundStarts)
  await matcha.hover()
  await page.waitForTimeout(120)
  await dealership.hover()
  await page.waitForTimeout(150)
  expect(await page.evaluate(soundStarts)).toBe(before)

  // Moving around inside the same tile is not another tile.
  const position = await centre(page, /Open Dealership Hub preview/)
  await page.mouse.move(position.x + 20, position.y + 10, { steps: 5 })
  await page.waitForTimeout(150)
  expect(await page.evaluate(soundStarts)).toBe(before)
})
