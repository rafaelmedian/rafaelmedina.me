import { expect, test } from "@playwright/test"

// The card is aria-hidden (the dialog's description already explains
// zooming), so it is found by class rather than by role or text.
const hint = ".personal-photos-zoom-hint"

test("the zoom hint shows on a browser's first open only", async ({ page }) => {
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await expect(dialog.locator(hint)).toBeVisible()
  await expect(dialog.locator(`${hint}-hand`)).toHaveCount(2)
  await dialog.getByRole("button", { name: "Close photo wall" }).click()
  await expect(dialog).toBeHidden()
  await page.reload()
  await page.locator(".personal-photos-label").click()
  await expect(dialog).toBeVisible()
  await expect(dialog.locator(hint)).toHaveCount(0)
})

test("zooming dismisses the hint", async ({ page }) => {
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  await expect(dialog.locator(hint)).toBeVisible()
  await dialog.getByRole("region", { name: "Photo wall", exact: true }).press("+")
  await expect(dialog.locator(hint)).toHaveCount(0)
})

test("the hint never takes a press from the wall", async ({ page }) => {
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  await expect(page.locator(hint)).toBeVisible()
  await expect(page.locator(hint)).toHaveCSS("pointer-events", "none")
})
