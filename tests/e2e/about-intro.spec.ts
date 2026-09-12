import { expect, test } from "@playwright/test"

test("production chat offers the personal introduction video", async ({ page }) => {
  const requests: string[] = []
  page.on("request", request => {
    if (/about-intro\/|AboutIntro-/.test(request.url())) requests.push(request.url())
  })
  await page.goto("/?intro=preview")
  await page.getByRole("link", { name: "About", exact: true }).click()
  await expect(page.locator("#about-panel")).toBeFocused()
  const intro = page.getByRole("region", { name: "A quick hello from Rafael" })
  await expect(intro).toBeVisible()
  await expect(intro.locator("img.about-intro-poster")).toHaveAttribute("src", "/about-intro/poster.webp")
  await intro.locator(".about-intro-portrait-trigger").focus()
  await expect(intro.getByRole("button", { name: "Play introduction", exact: true })).toBeVisible()
  expect(requests.some(url => url.endsWith("/about-intro/recording.mp4"))).toBe(false)
  await intro.getByRole("button", { name: "Play introduction", exact: true }).click()
  const recording = intro.locator("video[data-recording]")
  await expect(recording).toHaveAttribute("src", "/about-intro/recording.mp4")
  await expect.poll(() => recording.evaluate(video => !(video as HTMLVideoElement).paused)).toBe(true)
})
