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

async function expectAnimationFramesToSleep(page: Page, count: () => Promise<number>) {
  // The counter sees every page-wide callback, including a one-off late image
  // or ResizeObserver update. Require a sustained quiet window so continuous
  // animation loops still fail without sampling before the page is settled.
  await expect(async () => {
    const before = await count()
    await page.waitForTimeout(500)
    expect(await count()).toBe(before)
  }).toPass({ timeout: 5000 })
}

test("the idle wall sleeps and keyboard panning does not start a continuous loop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  const count = await countAnimationFrames(page)
  await openHome(page)
  await page.locator(".personal-photos-label").click()
  const wall = page.getByRole("region", { name: "Photo wall" })
  await expect(wall).toBeVisible()
  await expectAnimationFramesToSleep(page, count)
  const plane = wall.locator(".personal-photos-masonry")
  const before = await plane.evaluate(element => getComputedStyle(element).transform)
  await wall.focus()
  await page.keyboard.press("Shift+ArrowRight")
  await expect.poll(() => plane.evaluate(element => getComputedStyle(element).transform)).not.toBe(before)
  await expectAnimationFramesToSleep(page, count)
  await page.keyboard.press("Escape")
  await expect(wall).toHaveCount(0)
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
