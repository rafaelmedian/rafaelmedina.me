import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

test("project URLs follow selection and browser Back and Forward", async ({ page }) => {
  await page.goto("/?ref=portfolio")
  const trigger = page.getByRole("link", { name: /Open Matcha multiwallet flow/ })
  await trigger.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page).toHaveURL(/\/work\/matcha-multiwallet-flow\/\?ref=portfolio$/)
  await page.getByRole("button", { name: "Next preview", exact: true }).click()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha homepage")
  await expect(page).toHaveURL(/\/work\/matcha-homepage\/\?ref=portfolio$/)
  await expect(page).toHaveTitle("Matcha homepage — Rafael Medina")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://rafaelmedina.me/work/matcha-homepage/")
  await page.goBack()
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
  await expect(page).toHaveTitle("Rafael Medina — Senior Product Designer")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://rafaelmedina.me/")
  await expect(trigger).toBeFocused()
  await page.goForward()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha homepage")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
})

test("closing a locally opened project consumes its history entry", async ({ page }) => {
  await page.goto("/?from=previous")
  await page.goto("/?ref=portfolio")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  await expect(page.getByRole("dialog")).toBeVisible()

  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)

  await page.goBack()
  await expect(page).toHaveURL(/\?from=previous$/)
})

test("browser Back during a preview switch keeps the gallery closed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/?ref=portfolio")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  await expect(page.getByRole("dialog")).toBeVisible()

  await page.getByRole("button", { name: "Next preview", exact: true }).click()
  await page.goBack()
  await expect(page).toHaveURL(/\?ref=portfolio$/)

  // Cross the delayed preview-selection boundary; a stale callback must not
  // write the next project back into the URL and reopen the dialog.
  await page.waitForTimeout(300)
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
})

test("a bookmarked project opens after hydration and refresh and closes locally", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/?ref=shared&project=preview-protector")
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Protector booking")
  await page.reload()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Protector booking")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=shared$/)
  expect(errors).toEqual([])
})

test("a shared project path opens over the gallery and closes into it", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/work/popparazi-v1/?ref=shared")
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Popparazi V1")
  await expect(page.getByRole("button", { name: "Next preview", exact: true })).toBeVisible()

  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\/\?ref=shared$/)
  await expect(page.getByRole("heading", { name: "Rafael Medina", exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test("an unknown project URL keeps the portfolio usable", async ({ page }) => {
  await page.goto("/?project=missing")
  await expect(page.getByRole("heading", { name: "Rafael Medina", exact: true })).toBeVisible()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha multiwallet flow")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
})

test("closing About clears its hash without removing other query parameters", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/?ref=portfolio")
  await page.getByRole("link", { name: "About", exact: true }).click()
  await expect(page).toHaveURL(/\?ref=portfolio#about-panel$/)
  await page.getByRole("button", { name: "Close about", exact: true }).click()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
  await expect(page.locator("#portfolio-title")).toBeFocused()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test("closing a locally opened About section consumes its history entry", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/?from=previous")
  await page.goto("/?ref=portfolio")
  await page.getByRole("link", { name: "About", exact: true }).click()

  await page.getByRole("button", { name: "Close about", exact: true }).click()
  await expect(page).toHaveURL(/\?ref=portfolio$/)

  await page.goBack()
  await expect(page).toHaveURL(/\?from=previous$/)
})

test("the avatar opens chat without replacing the portfolio URL", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Ask about Rafael Medina" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page).toHaveURL(/\/$/)
})
