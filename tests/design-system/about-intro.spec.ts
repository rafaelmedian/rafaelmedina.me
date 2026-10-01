import { expect, test, type Page } from "@playwright/test"

const intro = (page: Page) => page.getByRole("region", { name: "A quick hello from Rafael" })
const openAbout = async (page: Page) => {
  await page.locator("#about-panel").evaluate(node => node.scrollIntoView({ behavior: "instant" }))
  await expect(intro(page)).toBeVisible()
  await intro(page).locator(".about-intro-portrait-trigger").press("Enter")
  await expect(page.getByRole("region", { name: "Chat with Rafa" })).toBeVisible()
}

test("defers the teaser until About and never offers the recording", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const requests: string[] = []
  page.on("request", request => {
    if (request.url().includes("/tests/fixtures/about-intro/")) requests.push(request.url())
  })
  await page.goto("/?intro=preview&tune=off")
  await expect(page.locator("#about-panel")).toBeAttached()
  expect(requests).toEqual([])
  await openAbout(page)
  await expect.poll(() => requests.some(url => url.endsWith("teaser.gif"))).toBe(true)
  await expect(intro(page).locator("img.about-intro-teaser")).toBeVisible()
  await intro(page).hover()
  await expect(intro(page).getByRole("button", { name: /introduction/i })).toHaveCount(0)
  await expect(intro(page).locator("video")).toHaveCount(0)
  expect(requests.some(url => url.endsWith("recording.mp4"))).toBe(false)
})

for (const preference of ["reduced motion", "data saving"] as const) {
  test(`${preference} keeps the poster still`, async ({ page }) => {
    if (preference === "reduced motion") await page.emulateMedia({ reducedMotion: "reduce" })
    else await page.addInitScript(() => Object.defineProperty(navigator, "connection", {
      value: Object.assign(new EventTarget(), { saveData: true, effectiveType: "4g" }),
    }))
    const media: string[] = []
    page.on("request", request => {
      if (/about-intro\/.*\.(mp4|gif)/.test(request.url())) media.push(request.url())
    })
    await page.goto("/?intro=preview&tune=off")
    await openAbout(page)
    await expect(intro(page).locator("img.about-intro-poster")).toBeVisible()
    await expect(intro(page).locator(".about-intro-teaser")).toHaveCount(0)
    expect(media).toEqual([])
  })
}

test("drops the teaser while the tab is hidden", async ({ page }) => {
  await page.goto("/?intro=preview&tune=off")
  await openAbout(page)
  const teaser = intro(page).locator("img.about-intro-teaser")
  await expect(teaser).toBeVisible()
  // Headless contexts do not model tab visibility. Exercise the browser event
  // with a controlled visibility getter.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true })
    document.dispatchEvent(new Event("visibilitychange"))
  })
  await expect(teaser).toHaveCount(0)
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false })
    document.dispatchEvent(new Event("visibilitychange"))
  })
  await expect(teaser).toBeVisible()
})

test("keeps the message prompt when the development teaser is off", async ({ page }) => {
  await page.goto("/?intro=off&tune=off")
  await page.locator("#about-panel").evaluate(node => node.scrollIntoView({ behavior: "instant" }))
  await expect(intro(page)).toBeVisible()
  await expect(intro(page).locator("img.about-intro-poster")).toHaveAttribute("src", /profile-photo.*\.webp$/)
  await expect(intro(page).locator("video")).toHaveCount(0)
})

test("loops the personal teaser on ordinary development visits", async ({ page }) => {
  await page.goto("/?tune=off")
  await page.locator("#about-panel").evaluate(node => node.scrollIntoView({ behavior: "instant" }))
  await expect(intro(page)).toBeVisible()
  const poster = intro(page).locator("img.about-intro-poster")
  await expect(poster).toHaveAttribute("src", "/about-intro/poster.webp")
  await expect(poster).toHaveCSS("corner-shape", "superellipse(1)")
  await intro(page).hover()
  await expect(intro(page).locator(".about-intro-surface")).toHaveCSS("transform", "none")
  await expect(intro(page).locator("video.about-intro-teaser")).toHaveAttribute("src", "/about-intro/teaser.mp4")
  await expect(intro(page).getByRole("button", { name: /introduction/i })).toHaveCount(0)
})
