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

test("desktop tile loops fit a 600KB budget while projects retain full videos", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/#audit")
  await expect.poll(() => page.locator('video.mosaic-row-media').evaluateAll(videos => videos.filter(video => !(video as HTMLVideoElement).paused).length)).toBe(3)
  const sources = await page.locator('video.mosaic-row-media').evaluateAll(videos => videos.map(video => (video as HTMLVideoElement).currentSrc).filter(Boolean))
  let bytes = 0
  for (const source of sources) bytes += (await (await page.request.get(source)).body()).length
  expect(bytes).toBeLessThan(600_000)
  await page.getByRole('link', { name: /Open Matcha multiwallet flow/ }).click()
  await expect(page.getByRole('dialog').locator('video').first()).toHaveAttribute('src', '/Projects/shot-small-9.webm')
})

test("the mobile wall progressively loads nearby photos while panning", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const photos = new Set<string>()
  page.on('request', request => { if (/\/images\/personal\/.*-400w\.webp$/.test(request.url())) photos.add(request.url()) })
  await page.goto('/')
  await page.getByRole('button', { name: 'Personal life', exact: true }).click()
  const wall = page.getByRole('region', { name: 'Photo wall' })
  await expect(wall).toBeVisible()
  await page.waitForTimeout(500)
  expect(photos.size).toBeGreaterThan(0)
  expect(photos.size).toBeLessThan(47)
  const before = photos.size
  await wall.focus()
  for (let index = 0; index < 15; index++) await page.keyboard.press('Shift+ArrowDown')
  await expect.poll(() => photos.size).toBeGreaterThan(before)
})

test("the homepage keeps dialog CSS and case-study prose off its initial graph", async ({ page }) => {
  await page.goto('/#audit')
  const sizes = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    return {
      js: resources.filter(entry => new URL(entry.name).origin === location.origin && /\.js$/.test(entry.name)).reduce((total, entry) => total + entry.decodedBodySize, 0),
      css: resources.filter(entry => /\.css$/.test(entry.name)).reduce((total, entry) => total + entry.decodedBodySize, 0),
    }
  })
  expect(sizes.js).toBeLessThan(535_000)
  expect(sizes.css).toBeLessThan(210_000)
  await page.getByRole('link', { name: /Open Matcha multiwallet flow/ }).click()
  await expect(page.getByRole('dialog').locator('.project-case-study')).toBeVisible()
})
