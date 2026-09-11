import { expect, test } from "@playwright/test"

test("a layout switch stays opaque and lands within a slightly eased beat", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("region", { name: "Photo globe" })).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await page.evaluate(() => {
    const original = Element.prototype.animate
    const records: { className: string; duration: number }[] = []
    Object.assign(window, { __photoLayoutAnimations: records })
    Element.prototype.animate = function (...args) {
      const options = args[1]
      records.push({
        className: this instanceof HTMLElement ? this.className : "",
        duration: typeof options === "number" ? options : Number(options?.duration ?? 0),
      })
      return original.apply(this, args)
    }
  })

  await page.getByRole("button", { name: "Grid" }).click()
  await expect(page.getByRole("region", { name: "Photo sheet" })).toBeVisible()
  const animations = await page.evaluate(() => (window as unknown as { __photoLayoutAnimations: { className: string; duration: number }[] }).__photoLayoutAnimations)
  const stageDurations = animations.filter(({ className }) => className === "personal-photos-sheet").map(({ duration }) => duration)
  const flightDurations = animations.filter(({ className }) => className.includes("personal-photos-flight")).map(({ duration }) => duration)

  expect(stageDurations).toEqual([])
  expect(flightDurations.length).toBeGreaterThan(5)
  expect(Math.min(...flightDurations)).toBeGreaterThanOrEqual(155)
  expect(Math.max(...flightDurations)).toBeLessThanOrEqual(170)
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0, { timeout: 360 })
})
