import { expect, test } from "@playwright/test"

test("production portrait loops the teaser without a player", async ({ page }) => {
  const requests: string[] = []
  page.on("request", request => {
    if (/about-intro\/|AboutIntro-/.test(request.url())) requests.push(request.url())
  })
  await page.goto("/")
  await page.getByRole("link", { name: "About", exact: true }).click()
  await expect(page.locator("#about-panel")).toBeFocused()
  const intro = page.getByRole("region", { name: "A quick hello from Rafael" })
  await expect(intro).toBeVisible()
  await expect(intro.locator("img.about-intro-poster")).toHaveAttribute("src", "/about-intro/poster.webp")
  await expect(intro.locator("video.about-intro-teaser")).toHaveAttribute("src", "/about-intro/teaser.mp4")
  await intro.locator(".about-intro-portrait-trigger").click()
  await expect(page.getByRole("region", { name: "Chat with Rafa" })).toBeVisible()
  await expect(intro.getByRole("button", { name: /introduction/i })).toHaveCount(0)
  await expect(intro.locator("video")).toHaveCount(1)
  expect(requests.some(url => url.endsWith("/about-intro/recording.mp4"))).toBe(false)
})

test("compact chat offers no introduction video", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#about-panel")

  const intro = page.getByRole("region", { name: "A quick hello from Rafael" })
  await intro.locator(".about-intro-portrait-trigger").click()

  const chat = page.getByRole("dialog", { name: "Chat with Rafa" })
  await expect(chat).toBeVisible()
  await expect(chat.getByRole("textbox", { name: "Your email" })).toBeVisible()
  await expect(chat.getByRole("button", { name: /introduction/i })).toHaveCount(0)
})

test("chat waits for activation and returns collapsed with its draft", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")
  await page.getByRole("link", { name: "About", exact: true }).click()
  const intro = page.getByRole("region", { name: "A quick hello from Rafael" })
  const portrait = intro.locator(".about-intro-portrait-trigger")
  const chat = page.getByRole("region", { name: "Chat with Rafa" })
  await expect(chat).toBeHidden()
  await expect(intro.locator(".about-intro-chat-notification")).toBeVisible()
  await portrait.hover()
  await expect(chat).toBeHidden()
  await portrait.click()
  await expect(chat).toBeVisible()
  await chat.getByRole("textbox", { name: "Your email" }).fill("visitor@example.com")
  await page.getByRole("button", { name: "Close about", exact: true }).click()
  await page.getByRole("link", { name: "About", exact: true }).click()
  await expect(chat).toBeHidden()
  await portrait.press("Enter")
  await expect(chat.getByRole("textbox", { name: "Your email" })).toHaveValue("visitor@example.com")
})

for (const width of [390, 768, 1440]) {
  test(`collapsed chat appears at the CV tile after scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    const requests: string[] = []
    page.on("request", request => {
      if (/about-intro\/|AboutIntro-/.test(request.url())) requests.push(request.url())
    })
    await page.goto("/")
    await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
    expect(requests).toEqual([])
    await page.locator(".mosaic-tile-resume").scrollIntoViewIfNeeded()
    const intro = page.getByRole("region", { name: "A quick hello from Rafael" })
    await expect(intro).toBeVisible()
    await expect(page.getByRole(width < 900 ? "dialog" : "region", { name: "Chat with Rafa" })).toBeHidden()
    expect(await page.locator("#about-panel").evaluate(node => node.getBoundingClientRect().top)).toBeGreaterThan(900 * 0.31)
    await page.locator(".personal-photos-label").scrollIntoViewIfNeeded()
    await expect(intro).toBeVisible()
    await page.locator(".personal-photos-label").click()
    await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
    await expect(intro).toBeHidden()
    await expect(page.locator(".mosaic-mobile-toc")).toBeHidden()
    await page.keyboard.press("Escape")
    await expect(intro).toBeVisible()
  })
}

test("a CV visible on initial load waits for the first scroll before loading chat", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1800 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  const requests: string[] = []
  page.on("request", request => {
    if (/about-intro\/|AboutIntro-/.test(request.url())) requests.push(request.url())
  })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await expect(page.locator(".mosaic-tile-resume")).toBeInViewport({ ratio: 0.5 })
  expect(requests).toEqual([])
  await expect(page.locator(".about-intro")).toHaveCount(0)
  await page.evaluate(() => window.scrollTo(0, 97))
  await expect(page.getByRole("region", { name: "A quick hello from Rafael" })).toBeVisible()
})
