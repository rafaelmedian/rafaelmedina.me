import { expect, test } from "@playwright/test"

test("rests feed videos while a project preview covers them and resumes on close", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  const feedVideos = page.locator("video.mosaic-row-media")
  const playingCount = () => feedVideos.evaluateAll(videos =>
    videos.filter(video => !(video as HTMLVideoElement).paused).length,
  )
  await expect.poll(playingCount).toBe(2)
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect.poll(playingCount).toBe(0)
  await expect.poll(() => page.getByRole("dialog").locator("video").evaluate(video => video.paused)).toBe(false)
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect.poll(playingCount).toBe(2)
})

test("reduced-motion visitors keep posters without requesting feed video data", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  const videoRequests: string[] = []
  page.on("request", request => {
    if (request.url().includes("/Projects/") && request.url().endsWith(".webm")) {
      videoRequests.push(request.url())
    }
  })
  await page.goto("/")
  const videos = page.locator("video.mosaic-row-media")
  await expect(videos).toHaveCount(3)
  // Visiting About crosses every feed row and lets its visibility observers run.
  await page.getByRole("link", { name: "About", exact: true }).click()
  await expect(page.locator("#about-panel")).toBeFocused()
  await page.getByRole("button", { name: "Close about", exact: true }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  expect(videoRequests).toEqual([])
  for (const video of await videos.all()) {
    await expect(video).toHaveAttribute("preload", "none")
    await expect(video).toHaveAttribute("poster", /\S+/)
  }
  // A live preference change must restore the normal visible-video behavior.
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await expect.poll(() => videos.first().evaluate(video => video.paused)).toBe(false)
})

// A live connection downgrade used to leave visible loops downloading/playing.
test("uses posters on 3g and responds when the connection changes", async ({ page }) => {
  await page.addInitScript(() => {
    const connection = Object.assign(new EventTarget(), { effectiveType: "3g", saveData: false })
    Object.defineProperty(navigator, "connection", { value: connection, configurable: true })
  })
  const requests: string[] = []
  page.on("request", request => {
    if (/\/Projects\/.*\.(webm|mp4)$/.test(request.url())) requests.push(request.url())
  })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  const videos = page.locator("video.mosaic-row-media")
  await expect(videos).toHaveCount(3)
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).hover()
  expect(requests).toEqual([])
  await page.evaluate(() => {
    const connection = (navigator as Navigator & { connection: EventTarget & { effectiveType: string } }).connection
    connection.effectiveType = "4g"
    connection.dispatchEvent(new Event("change"))
  })
  await expect.poll(() => videos.first().evaluate(video => video.paused)).toBe(false)
  await page.evaluate(() => {
    const connection = (navigator as Navigator & { connection: EventTarget & { effectiveType: string } }).connection
    connection.effectiveType = "3g"
    connection.dispatchEvent(new Event("change"))
  })
  await expect.poll(() => videos.evaluateAll(items => items.every(item => (item as HTMLVideoElement).paused))).toBe(true)
  await expect(videos.first()).not.toHaveAttribute("src")
})

test("keeps a thumbnail visible during a slow preview and offers retry after failure", async ({ page }) => {
  let release: () => void = () => {}
  const held = new Promise<void>(resolve => { release = resolve })
  await page.route("**/Projects/protector.webp", async route => {
    await held
    await route.abort("failed")
  })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Protector booking preview/ }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByRole("status")).toContainText("Loading preview")
  const thumbnail = dialog.locator(".preview-gallery-media-placeholder")
  await expect(thumbnail).toBeVisible()
  await expect.poll(() => thumbnail.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  release()
  await expect(dialog.getByRole("button", { name: "Retry preview" })).toBeVisible()
  await page.unroute("**/Projects/protector.webp")
  await dialog.getByRole("button", { name: "Retry preview" }).click()
  await expect(dialog.locator(".preview-gallery-media[data-loaded='true']")).toBeVisible()
  await expect(dialog.getByRole("status")).toHaveCount(0)
})

test("slow connections only fetch a preview video after an explicit play", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      value: Object.assign(new EventTarget(), { effectiveType: "3g", saveData: true }),
      configurable: true,
    })
  })
  const requests: string[] = []
  page.on("request", request => {
    if (/\/Projects\/.*\.(webm|mp4)$/.test(request.url())) requests.push(request.url())
  })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  const video = page.getByRole("dialog").locator("video")
  await expect(video).toBeVisible()
  await expect(video).toHaveAttribute("controls", "")
  await expect(video).toHaveAttribute("preload", "none")
  expect(requests).toEqual([])
  await video.evaluate(element => element.play())
  await expect.poll(() => requests.length).toBeGreaterThan(0)
})

test("resumes preview autoplay when the connection improves", async ({ page }) => {
  await page.addInitScript(() => {
    const connection = Object.assign(new EventTarget(), { effectiveType: "3g", saveData: false })
    Object.defineProperty(navigator, "connection", { value: connection, configurable: true })
  })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  const video = page.getByRole("dialog").locator("video")
  await expect(video).toHaveAttribute("controls", "")
  await expect(video).toHaveJSProperty("paused", true)
  await page.evaluate(() => {
    const connection = (navigator as Navigator & { connection: EventTarget & { effectiveType: string } }).connection
    connection.effectiveType = "4g"
    connection.dispatchEvent(new Event("change"))
  })
  await expect.poll(() => video.evaluate(element => element.paused)).toBe(false)
})

test("reduced motion clears preview blur during loading and switching", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("link", { name: /Open Protector booking preview/ }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toHaveCSS("filter", "none")
  await expect(dialog.locator(".preview-gallery-media[data-loaded]")).toHaveCSS("filter", "none")
  await page.keyboard.press("ArrowDown")
  await expect(dialog.locator(".preview-gallery-card")).toHaveCSS("filter", "none")
})

for (const slow of [false, true]) {
  test(`uses observed startup speed without network hints on a ${slow ? "slow" : "fast"} load`, async ({ page, context }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", { value: undefined, configurable: true })
    })
    if (slow) {
      const cdp = await context.newCDPSession(page)
      await cdp.send("Network.enable")
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 200000,
      })
    }
    const requests: string[] = []
    page.on("request", request => {
      if (/\/Projects\/.*\.(webm|mp4)$/.test(request.url())) requests.push(request.url())
    })
    await page.goto("/")
    const video = page.locator("video.mosaic-row-media").first()
    if (slow) {
      await expect(video).not.toHaveAttribute("src")
      expect(requests).toEqual([])
      await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
      const preview = page.getByRole("dialog").locator("video")
      await expect(preview).toHaveAttribute("controls", "")
      await expect(preview).toHaveAttribute("preload", "none")
    } else {
      await expect.poll(() => video.evaluate(element => element.paused)).toBe(false)
    }
  })
}
