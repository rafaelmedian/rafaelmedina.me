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

// "Pinch to zoom" named a gesture a mouse cannot make, and the wall's keys
// were only in the screen-reader description. A fine pointer gets the keys.
test("the hint shows keys under a mouse and the pinch on touch", async ({ page, browser }) => {
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const desktop = page.getByRole("dialog", { name: "Personal photos" })
  await expect(desktop.locator(`${hint}-keys`)).toBeVisible()
  await expect(desktop.locator(`${hint}-keys kbd`)).toHaveText(["+", "\u2212", "0", "\u2190", "\u2192"])
  await expect(desktop.getByText("Pinch to zoom")).toBeHidden()

  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
  const phone = await context.newPage()
  await phone.goto("/")
  await phone.locator(".personal-photos-label").click()
  const sheet = phone.getByRole("dialog", { name: "Personal photos" })
  await expect(sheet.getByText("Pinch to zoom")).toBeVisible()
  await expect(sheet.locator(`${hint}-keys`)).toBeHidden()
  await context.close()
})
