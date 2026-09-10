import { expect, test, type Page } from "@playwright/test"

const intro = (page: Page) => page.getByRole("region", { name: "A quick hello from Rafael" })
const openAbout = async (page: Page) => {
  await page.locator("#about-panel").evaluate(node => node.scrollIntoView({ behavior: "instant" }))
  await expect(intro(page)).toBeVisible()
}

test("defers introduction assets until About and recording until play", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const requests: string[] = []
  page.on("request", request => {
    if (request.url().includes("/tests/fixtures/about-intro/")) requests.push(request.url())
  })
  await page.goto("/?intro=preview")
  await expect(page.locator("#about-panel")).toBeAttached()
  expect(requests).toEqual([])
  await openAbout(page)
  await expect.poll(() => requests.some(url => url.endsWith("teaser.gif"))).toBe(true)
  expect(requests.some(url => url.endsWith("recording.mp4"))).toBe(false)
  await intro(page).getByRole("button", { name: "Play introduction", exact: true }).focus()
  await expect(intro(page).locator(".about-intro-play-disc")).toHaveCSS("outline-style", "solid")
  await expect(intro(page).locator(".about-intro-play-disc")).toHaveCSS("outline-width", "2px")
  await intro(page).getByRole("button", { name: "Play introduction", exact: true }).click()
  const recording = intro(page).locator("video[data-recording]")
  await expect.poll(() => recording.evaluate(video => !(video as HTMLVideoElement).paused)).toBe(true)
  await intro(page).getByRole("button", { name: "Pause introduction" }).click()
  await expect.poll(() => recording.evaluate(video => (video as HTMLVideoElement).paused)).toBe(true)
  await intro(page).getByRole("slider", { name: "Seek introduction" }).fill("2")
  await expect.poll(() => recording.evaluate(video => Math.round((video as HTMLVideoElement).currentTime))).toBe(2)
  await expect(intro(page).getByRole("button", { name: "Captions", exact: true })).toHaveAttribute("aria-pressed", "true")
  await intro(page).getByRole("button", { name: "Captions", exact: true }).click()
  await expect.poll(() => recording.evaluate(video => (video as HTMLVideoElement).textTracks[0]?.mode)).toBe("disabled")
  await intro(page).getByRole("button", { name: "Mute introduction" }).click()
  await expect.poll(() => recording.evaluate(video => (video as HTMLVideoElement).muted)).toBe(true)
  await intro(page).getByRole("button", { name: "Collapse introduction" }).click()
  await expect(intro(page).getByRole("button", { name: "Resume introduction", exact: true })).toBeFocused()
  await intro(page).getByRole("button", { name: "Resume introduction", exact: true }).click()
  await expect.poll(() => recording.evaluate(video => (video as HTMLVideoElement).currentTime)).toBeGreaterThan(2)
  await page.keyboard.press("Escape")
  await expect(intro(page).getByRole("button", { name: "Resume introduction", exact: true })).toBeFocused()
})

test("keeps the mobile bubble beside the TOC and expanded video above it", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto("/?intro=preview")
  await openAbout(page)
  const toc = page.getByRole("button", { name: "Table of contents: About" })
  const bubble = intro(page).getByRole("button", { name: "Play introduction", exact: true })
  const tocBox = await toc.boundingBox()
  const bubbleBox = await bubble.boundingBox()
  expect(bubbleBox!.x - (tocBox!.x + tocBox!.width)).toBeCloseTo(12, 0)
  expect(bubbleBox!.x + bubbleBox!.width).toBeLessThanOrEqual(308)
  await bubble.click()
  await expect(intro(page).getByRole("button", { name: "Pause introduction" })).toBeVisible()
  await expect.poll(async () => {
    const box = await intro(page).locator(".about-intro-surface").boundingBox()
    return box!.y + box!.height <= tocBox!.y - 8
  }).toBe(true)
  const playerBox = await intro(page).locator(".about-intro-surface").boundingBox()
  expect(playerBox!.x).toBeGreaterThanOrEqual(12)
  expect(playerBox!.x + playerBox!.width).toBeLessThanOrEqual(308)
  await toc.click()
  await expect(intro(page).getByRole("button", { name: "Resume introduction", exact: true })).toBeVisible()
  await expect.poll(() => intro(page).locator("video[data-recording]").evaluate(video => (video as HTMLVideoElement).paused)).toBe(true)
  await expect(page.getByRole("navigation", { name: "Table of contents" })).toHaveCSS("width", "272px")
  await expect.poll(async () => {
    const menu = await page.getByRole("navigation", { name: "Table of contents" }).boundingBox()
    return menu!.x >= 12 && menu!.x + menu!.width <= 308
  }).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
})

for (const preference of ["reduced motion", "data saving"] as const) {
  test(`${preference} keeps a poster but permits explicit recording playback`, async ({ page }) => {
    if (preference === "reduced motion") await page.emulateMedia({ reducedMotion: "reduce" })
    else await page.addInitScript(() => Object.defineProperty(navigator, "connection", {
      value: Object.assign(new EventTarget(), { saveData: true, effectiveType: "4g" }),
    }))
    const media: string[] = []
    page.on("request", request => {
      if (/about-intro\/.*\.(mp4|gif)/.test(request.url())) media.push(request.url())
    })
    await page.goto("/?intro=preview")
    await openAbout(page)
    await expect(intro(page).locator("img")).toBeVisible()
    expect(media).toEqual([])
    await intro(page).getByRole("button", { name: "Play introduction", exact: true }).click()
    await expect.poll(() => intro(page).locator("video[data-recording]").evaluate(video => !(video as HTMLVideoElement).paused)).toBe(true)
    expect(media.some(url => url.endsWith("teaser.gif"))).toBe(false)
  })
}

test("dismissal resets on reentering About, without restarting sound", async ({ page }) => {
  await page.goto("/?intro=preview")
  await openAbout(page)
  await intro(page).getByRole("button", { name: "Play introduction", exact: true }).click()
  await expect(intro(page).getByRole("button", { name: "Pause introduction" })).toBeVisible()
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
  await expect(intro(page)).toBeHidden()
  await openAbout(page)
  await expect.poll(() => intro(page).locator("video[data-recording]").evaluate(video => (video as HTMLVideoElement).paused)).toBe(true)
  await intro(page).getByRole("button", { name: "Dismiss introduction" }).click()
  await expect(intro(page)).toBeHidden()
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
  await expect(page.locator(".about-intro-dock")).toHaveAttribute("data-about-active", "false")
  await openAbout(page)
})

test("keeps the poster and recovers after a media error", async ({ page }) => {
  await page.route("**/about-intro/recording.mp4", route => route.abort("failed"))
  await page.goto("/?intro=preview")
  await openAbout(page)
  await intro(page).getByRole("button", { name: "Play introduction", exact: true }).click()
  await expect(intro(page).getByRole("button", { name: "Retry introduction" })).toBeVisible()
  await expect(intro(page).locator("img")).toBeVisible()
  await page.unroute("**/about-intro/recording.mp4")
  await intro(page).getByRole("button", { name: "Retry introduction" }).click()
  await expect(intro(page).getByRole("button", { name: "Pause introduction" })).toBeVisible()
})

test("plays again from the beginning after the recording ends", async ({ page }) => {
  await page.goto("/?intro=preview")
  await openAbout(page)
  await intro(page).getByRole("button", { name: "Play introduction", exact: true }).click()
  await expect(intro(page).getByRole("button", { name: "Pause introduction" })).toBeVisible()
  await intro(page).getByRole("slider", { name: "Seek introduction" }).fill("4.8")
  await expect(intro(page).getByRole("button", { name: "Replay introduction" })).toBeVisible()
  await intro(page).getByRole("button", { name: "Replay introduction" }).click()
  const video = intro(page).locator("video[data-recording]")
  await expect.poll(() => video.evaluate(node => !(node as HTMLVideoElement).paused)).toBe(true)
  expect(await video.evaluate(node => (node as HTMLVideoElement).currentTime)).toBeLessThan(2)
})

test("offers play again when the browser blocks the first playback request", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play
    let blocked = false
    HTMLMediaElement.prototype.play = function () {
      if (this.hasAttribute("data-recording") && !blocked) {
        blocked = true
        return Promise.reject(new DOMException("User gesture required", "NotAllowedError"))
      }
      return original.call(this)
    }
  })
  await page.goto("/?intro=preview")
  await openAbout(page)
  await intro(page).getByRole("button", { name: "Play introduction", exact: true }).click()
  await expect(intro(page).getByRole("status")).toBeHidden()
  await intro(page).getByRole("button", { name: "Resume introduction", exact: true }).click()
  await expect(intro(page).getByRole("button", { name: "Pause introduction" })).toBeVisible()
})

test("pauses when the tab is hidden and does not restart sound on return", async ({ page }) => {
  await page.goto("/?intro=preview")
  await openAbout(page)
  await intro(page).getByRole("button", { name: "Play introduction", exact: true }).click()
  const video = intro(page).locator("video[data-recording]")
  await expect.poll(() => video.evaluate(node => !(node as HTMLVideoElement).paused)).toBe(true)
  // Headless contexts do not model tab visibility. Exercise the browser event
  // with a controlled visibility getter while keeping actual media playback.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true })
    document.dispatchEvent(new Event("visibilitychange"))
  })
  await expect.poll(() => video.evaluate(node => (node as HTMLVideoElement).paused)).toBe(true)
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false })
    document.dispatchEvent(new Event("visibilitychange"))
  })
  await expect(intro(page).getByRole("button", { name: "Resume introduction", exact: true })).toBeVisible()
  expect(await video.evaluate(node => (node as HTMLVideoElement).paused)).toBe(true)
})

test("hides and pauses while the booking dialog covers About", async ({ page }) => {
  await page.goto("/?intro=preview")
  await page.locator("#about-panel-services").evaluate(node => node.scrollIntoView({ behavior: "instant" }))
  await expect(intro(page)).toBeVisible()
  await intro(page).getByRole("button", { name: "Play introduction", exact: true }).click()
  await expect(intro(page).getByRole("button", { name: "Pause introduction" })).toBeVisible()
  await page.getByRole("button", { name: "book a 30-minute call", exact: true }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(intro(page)).toBeHidden()
  const video = page.locator("video[data-recording]")
  expect(await video.evaluate(node => (node as HTMLVideoElement).paused)).toBe(true)
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(intro(page)).toBeVisible()
  expect(await video.evaluate(node => (node as HTMLVideoElement).paused)).toBe(true)
})

test("keeps a poster while the recording download is pending", async ({ page }) => {
  let release = () => {}
  const held = new Promise<void>(resolve => { release = resolve })
  await page.route("**/about-intro/recording.mp4", async route => {
    await held
    await route.continue()
  })
  await page.goto("/?intro=preview")
  await openAbout(page)
  await intro(page).getByRole("button", { name: "Play introduction", exact: true }).click()
  await expect(intro(page).getByRole("status")).toHaveText("Loading introduction…")
  await expect(intro(page).locator("img")).toBeVisible()
  release()
  await expect(intro(page).getByRole("button", { name: "Pause introduction" })).toBeVisible()
})

test("can turn off the development placeholder", async ({ page }) => {
  await page.goto("/?intro=off")
  await page.locator("#about-panel").evaluate(node => node.scrollIntoView({ behavior: "instant" }))
  await expect(intro(page)).toHaveCount(0)
})

test("shows the placeholder video and GIF on ordinary development visits", async ({ page }) => {
  await page.goto("/")
  await openAbout(page)
  await expect(intro(page).locator("img.about-intro-teaser")).toHaveAttribute("src", /teaser\.gif$/)
  await intro(page).getByRole("button", { name: "Play introduction", exact: true }).click()
  await expect(intro(page).getByText("Placeholder", { exact: true })).toBeVisible()
  await expect(intro(page).getByRole("button", { name: "Pause introduction" })).toBeVisible()
})
