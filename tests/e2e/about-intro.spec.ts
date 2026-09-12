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
  const chat = page.getByRole("region", { name: "Chat with Rafa" })
  const email = chat.getByRole("textbox", { name: "Your email" })
  await expect(chat).toBeVisible()
  await email.fill("visitor@example.com")
  await expect(intro.getByRole("button", { name: "Play introduction", exact: true })).toBeVisible()
  expect(requests.some(url => url.endsWith("/about-intro/recording.mp4"))).toBe(false)
  await intro.getByRole("button", { name: "Play introduction", exact: true }).click()
  const recording = intro.locator("video[data-recording]")
  await expect(recording).toHaveAttribute("src", "/about-intro/recording.mp4")
  await expect.poll(() => recording.evaluate(video => !(video as HTMLVideoElement).paused)).toBe(true)
  await expect(intro.locator(".about-intro-chat-notification")).toHaveCount(0)
  await intro.getByRole("button", { name: "Pause introduction", exact: true }).click()
  await intro.getByRole("button", { name: "Resume introduction", exact: true }).click()
  await intro.getByRole("button", { name: "Close introduction" }).click()
  await expect(chat).toBeVisible()
  await expect(email).toHaveValue("visitor@example.com")
})

test("compact chat returns after playing the personal introduction", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#about-panel")

  const intro = page.getByRole("region", { name: "A quick hello from Rafael" })
  await intro.locator(".about-intro-portrait-trigger").click()

  const chat = page.getByRole("dialog", { name: "Chat with Rafa" })
  await expect(chat).toBeVisible()
  await chat.getByRole("textbox", { name: "Your email" }).fill("visitor@example.com")
  await chat.getByRole("button", { name: "Play introduction", exact: true }).click()

  await expect(chat).toBeHidden()
  const recording = intro.locator("video[data-recording]")
  await expect(recording).toHaveAttribute("src", "/about-intro/recording.mp4")
  await expect.poll(() => recording.evaluate(video => !(video as HTMLVideoElement).paused)).toBe(true)
  await expect(intro.locator(".about-intro-chat-notification")).toHaveCount(0)

  const close = intro.getByRole("button", { name: "Close introduction" })
  await close.focus()
  await close.press("Enter")
  await expect(chat).toBeVisible()
  await expect(chat.getByRole("textbox", { name: "Your email" })).toHaveValue("visitor@example.com")
  await expect.poll(() => chat.evaluate(node => node.contains(document.activeElement))).toBe(true)
})
