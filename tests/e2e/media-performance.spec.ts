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
  await page.getByRole("button", { name: /Open Matcha multiwallet flow/ }).click()
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
