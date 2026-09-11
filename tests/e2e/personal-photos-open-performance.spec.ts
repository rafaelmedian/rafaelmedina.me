import { expect, test, type Page } from "@playwright/test"

async function openSphere(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await page.locator(".personal-photos-label").click()
  await expect(page.getByRole("region", { name: "Photo globe" })).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
}

test("opening avoids a live full-screen backdrop filter", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openSphere(page)

  await expect(page.locator(".personal-photos-backdrop")).toHaveCSS("backdrop-filter", "none")
})
