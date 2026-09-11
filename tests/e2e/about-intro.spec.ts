import { expect, test } from "@playwright/test"

test("production shows the profile-photo message prompt without video", async ({ page }) => {
  const requests: string[] = []
  page.on("request", request => {
    if (/about-intro\/|AboutIntro-/.test(request.url())) requests.push(request.url())
  })
  await page.goto("/?intro=preview")
  await page.getByRole("link", { name: "About", exact: true }).click()
  await expect(page.locator("#about-panel")).toBeFocused()
  const intro = page.getByRole("region", { name: "A quick hello from Rafael" })
  await expect(intro).toBeVisible()
  await expect(intro.locator("img.about-intro-poster")).toHaveAttribute("src", /profile-photo.*\.webp$/)
  await expect(intro.locator("video")).toHaveCount(0)
  await expect(intro.getByRole("button", { name: /introduction/i })).toHaveCount(0)
  expect(requests.some(url => /about-intro\/(?:recording|teaser)/.test(url))).toBe(false)
})
