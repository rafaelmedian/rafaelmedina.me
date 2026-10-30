import { expect, test } from "@playwright/test"

for (const address of ["/notes/", "/resume/", "/work/matcha-multiwallet-flow/"]) {
  test(`direct entry ${address} leaves covered decorative media unloaded`, async ({ page }) => {
    const decorations: string[] = []
    page.on("request", request => {
      if (/\/images\/personal\/|\/writings\/folder-|\/reactions\/linkedin-reaction/.test(request.url())) decorations.push(request.url())
    })
    await page.goto(address)
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.waitForTimeout(400)
    expect(decorations).toEqual([])
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).toBeHidden()
    await expect.poll(() => decorations.some(url => url.includes("/writings/folder-"))).toBe(true)
  })
}

test("hovering the photo fan does not fetch the entire photo library", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  const thumbs = new Set<string>()
  page.on("request", request => {
    if (/\/images\/personal\/.*-thumb\.webp$/.test(request.url())) thumbs.add(request.url())
  })
  await page.goto("/")
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })
  await trigger.hover()
  await page.waitForTimeout(500)
  expect(thumbs.size).toBeLessThanOrEqual(5)
  await trigger.click()
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  await expect.poll(() => page.locator('.personal-photos-sheet img').evaluateAll(images => images.filter(image => (image as HTMLImageElement).naturalWidth > 0).length)).toBeGreaterThan(5)
})

test("a brief return to fast connectivity does not start tile video downloads", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", { configurable: true,
      value: Object.assign(new EventTarget(), { effectiveType: "3g", saveData: false }) })
  })
  const videos: string[] = []
  page.on("request", request => { if (/\/Projects\/.*\.(webm|mp4)$/.test(request.url())) videos.push(request.url()) })
  await page.goto("/#audit")
  await page.evaluate(() => {
    const connection = (navigator as Navigator & { connection: EventTarget & { effectiveType: string } }).connection
    connection.effectiveType = "4g"
    connection.dispatchEvent(new Event("change"))
    setTimeout(() => {
      connection.effectiveType = "3g"
      connection.dispatchEvent(new Event("change"))
    }, 80)
  })
  await page.waitForTimeout(500)
  expect(videos).toEqual([])
  await page.evaluate(() => {
    const connection = (navigator as Navigator & { connection: EventTarget & { effectiveType: string } }).connection
    connection.effectiveType = "4g"
    connection.dispatchEvent(new Event("change"))
  })
  await expect.poll(() => videos.length).toBeGreaterThan(0)
})
