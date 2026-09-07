import { expect, test } from "@playwright/test"
import { groupWritingsByYear } from "../../src/lib/writings"

for (const viewport of [{ width: 2283, height: 1239 }, { width: 1024, height: 768 }]) {
  test(`notes expand within viewport margins and preserve reading at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    const folder = page.getByRole("button", { name: "Open writings folder" })
    await folder.click()
    const dialog = page.getByRole("dialog")
    const original = (await dialog.boundingBox())!
    expect(original.height).toBe(viewport.height - 48)
    await expect(dialog.getByRole("button", { name: "Expand modal" })).toBeInViewport()
    await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
    const reader = dialog.locator('[data-page-id="2"]')
    await reader.evaluate((element) => element.scrollTo(0, 400))
    await dialog.getByRole("button", { name: "Expand modal" }).click()
    await expect(dialog.getByRole("button", { name: "Restore modal size" })).toHaveAttribute("aria-pressed", "true")
    const margin = 24
    expect(await dialog.boundingBox()).toEqual({ x: margin, y: margin, width: viewport.width - margin * 2, height: viewport.height - margin * 2 })
    expect(await dialog.evaluate((element) => getComputedStyle(element).borderRadius)).toBe("24px")
    expect((await dialog.getByRole("navigation", { name: "Breadcrumb" }).boundingBox())!.y).toBeLessThan(80)
    await expect.poll(() => reader.evaluate((element) => element.scrollTop)).toBe(400)
    await expect(dialog.getByRole("button", { name: "Next note" })).toBeInViewport()
    await dialog.getByRole("button", { name: "Restore modal size" }).click()
    expect(await dialog.boundingBox()).toEqual(original)
    await expect.poll(() => reader.evaluate((element) => element.scrollTop)).toBe(400)
    await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toHaveCount(1)
    await dialog.getByRole("button", { name: "Expand modal" }).click()
    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeVisible()
    await folder.click()
    await expect(dialog.getByRole("button", { name: "Expand modal" })).toBeVisible()
    expect(await dialog.boundingBox()).toEqual(original)
  })
}

test("the phone sheet drops expand and moves navigation onto the breadcrumb line", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  const dialog = page.getByRole("dialog")
  expect(await dialog.boundingBox()).toEqual({ x: 8, y: 8, width: 304, height: 552 })
  // The sheet is already within half a rem of the viewport, so there is nothing to expand into.
  await expect(dialog.getByRole("button", { name: /modal/ })).toHaveCount(0)
  const crumbs = (await dialog.getByRole("navigation", { name: "Breadcrumb" }).boundingBox())!
  const close = (await dialog.getByRole("button", { name: "Close writings" }).boundingBox())!
  expect(close.y).toBe(crumbs.y)
  expect(close.x + close.width).toBe(292)
  await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
  const prev = (await dialog.getByRole("button", { name: "Previous note" }).boundingBox())!
  expect(prev.y).toBe(crumbs.y)
  expect(prev.x).toBeGreaterThanOrEqual(crumbs.x + crumbs.width)
  // Reading and browsing leave the close button where the list put it.
  expect(await dialog.getByRole("button", { name: "Close writings" }).boundingBox()).toEqual(close)
  // No bottom bar: the article scrolls to the foot of the sheet.
  const reader = (await dialog.locator('[data-page-id="2"]').boundingBox())!
  expect(reader.y + reader.height).toBe(560)
})

test("archive orders years and dates newest first without assigning dates to undated notes", () => {
  const entries = [
    { id: "older", publishedAt: "2024-12-31" },
    { id: "undated" },
    { id: "january", publishedAt: "2026-01-01" },
    { id: "september", publishedAt: "2026-09-01" },
    { id: "middle", publishedAt: "2025-06-01" },
  ].map((entry) => ({ ...entry, title: entry.id, category: "Notes", paragraphs: [] }))
  expect(groupWritingsByYear(entries).map(({ year, entries }) => ({ year, ids: entries.map((entry) => entry.id) }))).toEqual([
    { year: "2026", ids: ["september", "january"] },
    { year: "2025", ids: ["middle"] },
    { year: "2024", ids: ["older"] },
    { year: "Undated", ids: ["undated"] },
  ])
  expect(entries[0].id).toBe("older")
  expect(groupWritingsByYear([])).toEqual([])
})

test("notes stay in the larger modal and breadcrumbs restore the simple list", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const folder = page.getByRole("button", { name: "Open writings folder" })
  await expect(folder.locator(".writings-tile-label")).toHaveText("Writings & notes")
  await expect(folder.locator(".writings-tile-caption")).toHaveCount(0)
  await folder.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByRole("searchbox")).toHaveCount(0)
  await expect(dialog.getByText("Project notes", { exact: true })).toHaveCount(0)
  const before = (await dialog.boundingBox())!
  expect(before.width).toBeGreaterThan(700)
  expect(before.width).toBeLessThan(1000)
  const entry = dialog.getByRole("button", { name: "Designing Matcha", exact: true })
  await entry.click()
  await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeFocused()
  const after = (await dialog.boundingBox())!
  expect(after.width).toBe(before.width)
  expect(after.height).toBe(before.height)
  const breadcrumbs = dialog.getByRole("navigation", { name: "Breadcrumb" })
  await expect(breadcrumbs).toHaveText("Notes2026")
  await expect(dialog.getByRole("heading", { name: "A system has to survive the awkward states", exact: true })).toBeVisible()
  const image = dialog.getByRole("img", { name: "Matcha homepage", exact: true })
  await image.scrollIntoViewIfNeeded()
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  expect(await dialog.locator('.writings-scroll[data-page-id="2"]').evaluate((element) => element.scrollHeight > element.clientHeight * 3)).toBe(true)
  await expect(breadcrumbs).toBeInViewport()
  await breadcrumbs.getByRole("button", { name: "Notes", exact: true }).click()
  await expect(entry).toBeFocused()
  await expect(dialog.locator(".writings-year > h3")).toHaveText(["2026", "2025"])
  await page.keyboard.press("Escape")
  await expect(dialog).not.toBeVisible()
  await expect(folder).toBeFocused()
})

test("notes fit mobile, preserve keyboard access, and reopen on the list", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/")
  const folder = page.getByRole("button", { name: "Open writings folder" })
  await folder.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await dialog.getByRole("button", { name: "From quote to confirmation", exact: true }).click()
  await expect(dialog.getByRole("heading", { name: "Give the numbers a clear meaning", exact: true })).toBeVisible()
  await expect.poll(() => dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return rect.left > 0 && rect.right < innerWidth && rect.top > 0 && rect.bottom < innerHeight
  })).toBe(true)
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab")
    await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  }
  await dialog.getByRole("button", { name: "Close writings" }).click()
  await expect(dialog).not.toBeVisible()
  await folder.click()
  await expect(dialog.getByRole("button", { name: "From quote to confirmation", exact: true })).toBeVisible()
  await page.mouse.click(1, 1)
  await expect(dialog).not.toBeVisible()
})


test("Notes stays aligned and its breadcrumb returns to the list", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  const dialog = page.getByRole("dialog")
  const notes = dialog.getByRole("button", { name: "Notes", exact: true })
  await dialog.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const anchor = await notes.boundingBox()
  await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
  await expect(dialog.getByRole("button", { name: "Back to notes", exact: true })).toHaveCount(0)
  await expect(dialog.locator(".writing-reader-date time")).toHaveText("September 1, 2026")
  await expect(dialog.locator(".writing-reader-date time")).toHaveAttribute("datetime", "2026-09-01")
  const reader = dialog.locator('[data-page-id="2"]')
  await expect(reader).toHaveAttribute("aria-hidden", "false")
  await expect(dialog.locator('[data-page-id="1"]')).toHaveAttribute("inert", "")
  await expect(dialog.getByRole("img", { name: "Matcha discovery homepage with token search and market overview" })).toBeVisible()
  expect((await notes.boundingBox())!.x).toBe(anchor!.x)
  await notes.click()
  await expect(dialog.getByRole("button", { name: "Designing Matcha", exact: true })).toBeFocused()
  await expect.poll(async () => (await notes.boundingBox())!.x).toBe(anchor!.x)
  await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
  await notes.click()
  await dialog.getByRole("button", { name: "From quote to confirmation", exact: true }).click()
  await notes.click()
  await expect(dialog.getByRole("button", { name: "From quote to confirmation", exact: true })).toBeFocused()
  await expect(reader).toHaveAttribute("inert", "")
})

test("note navigation follows the archive and resets the reader scroll", async ({ page }) => {
  await page.setViewportSize({ width: 2283, height: 1239 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  const dialog = page.getByRole("dialog")
  await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
  await dialog.locator('[data-page-id="2"]').evaluate((element) => element.scrollTo(0, 800))
  await dialog.getByRole("button", { name: "Next note", exact: true }).click()
  await expect(dialog.getByRole("heading", { name: "Designing for active traders", exact: true })).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Next note", exact: true })).toBeFocused()
  await expect.poll(() => dialog.locator('[data-page-id="2"]').evaluate((element) => element.scrollTop)).toBe(0)
  await dialog.getByRole("button", { name: "Previous note", exact: true }).click()
  await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Previous note", exact: true })).toBeFocused()
  await dialog.getByRole("button", { name: "Previous note", exact: true }).click()
  await expect(dialog.getByRole("heading", { name: "A song we all know", exact: true })).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Previous note", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeFocused()
  await dialog.locator('[data-page-id="2"]').evaluate((element) => element.scrollTo(0, 800))
  await page.keyboard.press("ArrowRight")
  await expect(dialog.getByRole("heading", { name: "Designing for active traders", exact: true })).toBeFocused()
  await expect.poll(() => dialog.locator('[data-page-id="2"]').evaluate((element) => element.scrollTop)).toBe(0)
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("ArrowUp")
  await expect(dialog.getByRole("heading", { name: "Designing for active traders", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(dialog.getByRole("heading", { name: "A song we all know", exact: true })).toBeFocused()
  await dialog.getByRole("button", { name: "Notes", exact: true }).click()
  await expect(dialog.getByRole("button", { name: "A song we all know", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(dialog).toHaveAttribute("data-reading", "false")
  await dialog.getByRole("button", { name: "My project context is moving into Markdown", exact: true }).click()
  await page.keyboard.press("ArrowLeft")
  await expect(dialog.getByRole("heading", { name: "From quote to confirmation", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(dialog.getByRole("heading", { name: "My project context is moving into Markdown", exact: true })).toBeFocused()
})
