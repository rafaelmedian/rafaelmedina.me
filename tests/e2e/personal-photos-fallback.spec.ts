import { expect, test } from "@playwright/test"

test("a failed photo does not block the wall opening", async ({ page }) => {
  await page.route("**/images/personal/office*", route => route.abort())
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const wall = page.getByRole("region", { name: "Photo wall" })
  await expect(wall).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await expect(wall.locator(".personal-photos-masonry")).toHaveCSS("opacity", "1")
  await expect(wall.locator('[data-photo-id="night-portrait"]')).toHaveCSS("opacity", "1")
  await wall.press("ArrowRight")
  await expect(wall.locator(".personal-photos-slide[data-held]")).toHaveCount(1)
  await page.getByRole("button", { name: "Close photo wall" }).click()
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toHaveCount(0)
})
