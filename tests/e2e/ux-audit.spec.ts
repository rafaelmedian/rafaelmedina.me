import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/audit.html")
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test("presents a usable set of UX recommendations", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "UX audit" })).toBeVisible()
  await expect(page.getByRole("textbox", { name: "Project or flow" })).toHaveValue("Rafael Medina portfolio")
  await expect(page.getByRole("article")).toHaveCount(10)
  await expect(page.getByRole("radiogroup", { name: /Decision for/ })).toHaveCount(10)
  await expect(page.getByText("0 of 10 reviewed")).toBeVisible()
})

test("pairs every finding with before evidence and an updated idea", async ({ page }) => {
  await expect(page.getByRole("img", { name: /^Before:/ })).toHaveCount(10)
  await expect(page.getByText("Before", { exact: true })).toHaveCount(10)
  await expect(page.getByText("Updated idea", { exact: true })).toHaveCount(10)
  await expect(page.locator("article pre")).toHaveCount(10)
})

test("records and persists yes and no decisions", async ({ page }) => {
  const firstSuggestion = page.getByRole("article").first()
  const secondSuggestion = page.getByRole("article").nth(1)

  await firstSuggestion.getByRole("radio", { name: "Yes" }).click()
  await secondSuggestion.getByRole("radio", { name: "No" }).click()

  await expect(page.getByText("2 of 10 reviewed")).toBeVisible()
  await expect(page.getByTestId("yes-count")).toHaveText("1")
  await expect(page.getByTestId("no-count")).toHaveText("1")

  await page.reload()
  await expect(firstSuggestion.getByRole("radio", { name: "Yes" })).toBeChecked()
  await expect(secondSuggestion.getByRole("radio", { name: "No" })).toBeChecked()
})

test("captures discussion notes and filters the audit", async ({ page }) => {
  const firstSuggestion = page.getByRole("article").first()

  await firstSuggestion.getByRole("radio", { name: "Discuss" }).click()
  const note = firstSuggestion.getByRole("textbox", { name: "Discussion note" })
  await expect(note).toBeVisible()
  await note.fill("Review this with product and engineering.")

  await page.getByRole("button", { name: "Discuss 1" }).click()
  await expect(page.getByRole("article")).toHaveCount(1)

  await page.reload()
  await page.getByRole("button", { name: "Discuss 1" }).click()
  await expect(page.getByRole("textbox", { name: "Discussion note" })).toHaveValue(
    "Review this with product and engineering.",
  )
})

test("copies a complete Markdown response summary", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])

  const suggestions = page.getByRole("article")
  await suggestions.nth(0).getByRole("radio", { name: "Yes" }).click()
  await suggestions.nth(1).getByRole("radio", { name: "No" }).click()
  await suggestions.nth(2).getByRole("radio", { name: "Discuss" }).click()
  await suggestions.nth(2).getByRole("textbox", { name: "Discussion note" }).fill(
    "Confirm the labels with the project team.",
  )

  const copyButton = page.getByRole("button", { name: "Copy responses" })
  await copyButton.click()
  await expect(copyButton).toHaveText(/Copied/)

  const clipboard = await page.evaluate(() => navigator.clipboard.readText())
  expect(clipboard).toContain("# UX audit responses — Rafael Medina portfolio")
  expect(clipboard).toContain("Reviewed: 3 of 10")
  expect(clipboard).toContain("## Yes\n- Make the positioning specific above the fold")
  expect(clipboard).toContain("## No\n- Introduce the work before showing the mosaic")
  expect(clipboard).toContain(
    "## Discuss\n- Keep project labels visible on desktop\n  - Note: Confirm the labels with the project team.",
  )
  expect(clipboard).toContain("## Open\n- Give the desktop project viewer a visible close control")
})

test("supports clearing all responses", async ({ page }) => {
  await page.getByRole("article").first().getByRole("radio", { name: "Yes" }).click()
  await page.getByRole("button", { name: "Clear responses" }).click()
  await page.getByRole("button", { name: "Clear all" }).click()

  await expect(page.getByText("0 of 10 reviewed")).toBeVisible()
  await expect(page.getByRole("radio", { name: "Yes" }).first()).not.toBeChecked()
})

test("keeps keyboard focus inside the clear confirmation", async ({ page }) => {
  await page.getByRole("radio", { name: "Yes" }).first().click()
  await page.getByRole("button", { name: "Clear responses" }).click()

  const dialog = page.getByRole("alertdialog")
  const cancel = dialog.getByRole("button", { name: "Cancel" })
  const clearAll = dialog.getByRole("button", { name: "Clear all" })

  await expect(cancel).toBeFocused()
  await page.keyboard.press("Shift+Tab")
  await expect(clearAll).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(cancel).toBeFocused()
})

test("closes the clear confirmation with Escape and restores trigger focus", async ({ page }) => {
  await page.getByRole("radio", { name: "Yes" }).first().click()
  const trigger = page.getByRole("button", { name: "Clear responses" })
  await trigger.click()

  await page.keyboard.press("Escape")

  await expect(page.getByRole("alertdialog")).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("supports native arrow-key navigation within each decision group", async ({ page }) => {
  const firstSuggestion = page.getByRole("article").first()
  const yes = firstSuggestion.getByRole("radio", { name: "Yes" })
  const no = firstSuggestion.getByRole("radio", { name: "No" })

  await yes.focus()
  await page.keyboard.press("ArrowRight")

  await expect(no).toBeChecked()
  await expect(no).toBeFocused()
})

test("keeps controls usable on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)

  const controls = page.getByRole("article").first().getByRole("radio")
  await expect(controls).toHaveCount(3)
  for (const control of await controls.all()) {
    const box = await control.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(40)
  }
})
