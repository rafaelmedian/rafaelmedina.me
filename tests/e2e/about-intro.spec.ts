import { expect, test } from "@playwright/test"

test("production never enables synthetic introduction footage", async ({ page }) => {
  const requests: string[] = []
  page.on("request", request => {
    if (/about-intro\/|AboutIntro-/.test(request.url())) requests.push(request.url())
  })
  await page.goto("/?intro=preview")
  await page.getByRole("link", { name: "About", exact: true }).click()
  await expect(page.locator("#about-panel")).toBeFocused()
  await expect(page.getByRole("region", { name: "A quick hello from Rafael" })).toHaveCount(0)
  expect(requests).toEqual([])
})
