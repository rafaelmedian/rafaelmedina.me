import { expect, test } from "@playwright/test"
import { groupWritingsByCategory } from "../../src/lib/writings"

/* The notes are two surfaces. The list is a slide of the preview gallery, at
   the place the folder tile occupies on the grid, so the arrow keys walk from a
   project into the notes and out the other side the way they walk into the
   résumé. A note opens in the reader's own sheet over that list, with the
   hearts, the copy link, and the arrows that turn to the next note, and its
   back arrow returns to the slide. */

const sheet = (page: import("@playwright/test").Page) => page.locator(".writings-dialog")
const popup = (page: import("@playwright/test").Page) => page.locator(".preview-gallery-popup")

test("the notes list is a slide of the preview gallery", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const folder = page.getByRole("button", { name: "Open writings folder" })
  await expect(folder.locator(".writings-tile-label")).toHaveText("Notes & tools")
  await folder.click()
  // The same popup a project opens, on the list's own address, counted in the
  // sequence at the tile's place: after the two projects of the first row.
  await expect(popup(page)).toBeVisible()
  await expect(page).toHaveURL(/\/notes\/$/)
  await expect(page).toHaveTitle("Notes — Rafael Medina")
  await expect(popup(page)).toHaveAttribute("data-preview-kind", "writings")
  await expect(popup(page).locator(".preview-gallery-count")).toHaveText("3 / 14")
  await expect(popup(page).locator(".preview-gallery-notes-title")).toHaveText("Notes and tools")
  await expect(popup(page).locator(".writings-category > h3")).toHaveText(["Tools", "Notes"])
  await expect(popup(page).getByRole("button", { name: "Make pull requests easier to review", exact: true })
    .locator(".writing-entry-date")).toHaveText("Sep 11 '26")
  await expect(popup(page).getByRole("searchbox")).toHaveCount(0)
  await expect(sheet(page)).toHaveCount(0)

  // Either arrow leaves for the tile on that side, in the same popup.
  await page.keyboard.press("ArrowRight")
  await expect(page).toHaveURL(/\/work\/popparazi-v1\/$/)
  await expect(popup(page)).toHaveAttribute("data-preview-kind", "project")
  await page.keyboard.press("ArrowLeft")
  await expect(page).toHaveURL(/\/notes\/$/)
  await page.keyboard.press("ArrowLeft")
  await expect(page).toHaveURL(/\/work\/matcha-homepage\/$/)
  await page.keyboard.press("ArrowRight")
  await expect(popup(page).getByRole("button", { name: "Designing Matcha", exact: true })).toBeVisible()

  await page.keyboard.press("Escape")
  await expect(popup(page)).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
  await expect(folder).toBeFocused()
})

test("the header Notes link opens the list on the project preview's line", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const card = page.locator(".mosaic-row-card").first()
  await card.scrollIntoViewIfNeeded()
  await card.click()
  await expect(popup(page)).toBeVisible()
  const previewTop = (await popup(page).boundingBox())!.y
  await page.keyboard.press("Escape")
  await expect(popup(page)).toBeHidden()
  await page.evaluate(() => window.scrollTo(0, 0))

  const notes = page.getByRole("navigation", { name: "Sections" }).getByRole("button", { name: "Notes", exact: true })
  await notes.click()
  await expect(popup(page).getByRole("button", { name: "Designing Matcha", exact: true })).toBeVisible()
  // One modal, so the header cannot move between a project and the notes.
  // Polled, because the popup's first frames are its starting pose and the
  // attribute that marks it lands a frame after the popup does.
  await expect.poll(async () => Math.round((await popup(page).boundingBox())!.y)).toBe(Math.round(previewTop))

  await page.keyboard.press("Escape")
  await expect(popup(page)).toBeHidden()
  // Focus returns to the header link, not to the folder tile down in the mosaic.
  await expect(notes).toBeFocused()
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
})

test("a row opens a nested note and Back returns within the same dialog", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/?ref=portfolio")
  const folder = page.getByRole("button", { name: "Open writings folder" })
  await folder.click()
  const entry = popup(page).getByRole("button", { name: "Designing Matcha", exact: true })
  await entry.click()
  // The reader takes the list's frame; the retained list must not paint behind it.
  await expect(page).toHaveURL(/\/notes\/designing-matcha\/\?ref=portfolio$/)
  await expect(sheet(page)).toBeVisible()
  await expect(popup(page)).toBeVisible()
  await expect(page.locator(".notes-gallery-list")).toBeHidden()
  await expect(page.locator(".preview-gallery-backdrop")).toHaveCount(1)
  await expect(page.locator(".writings-backdrop")).toHaveCount(0)
  // List and article share the same active modal tree.
  await expect(page.getByRole("dialog")).toHaveCount(1)
  await expect(sheet(page).getByRole("heading", { name: "Designing Matcha", exact: true })).toBeFocused()
  await expect(sheet(page).locator(".writings-toolbar")).toHaveText("Notes and tools")
  await expect(sheet(page).locator(".writing-reader-date time")).toHaveText("March 2, 2026")
  await expect(sheet(page).getByRole("img", { name: "Matcha discovery homepage with token search and market overview" })).toBeVisible()
  // The sheet is the one surface with a back arrow, and it never collapses:
  // there is always the list to go back to.
  const back = sheet(page).getByRole("button", { name: "Go back to Notes", exact: true })
  await expect(back).toBeVisible()
  const arrow = (await back.boundingBox())!
  const title = (await sheet(page).getByRole("heading", { name: "Notes and tools", exact: true }).boundingBox())!
  // On a sheet this wide the arrow hangs in the left gutter, clear of the title.
  expect(arrow.x + arrow.width).toBeLessThanOrEqual(title.x)
  await expect(sheet(page).getByRole("button", { name: "Next note", exact: true })).toBeVisible()
  await expect(sheet(page).getByRole("button", { name: "Next preview", exact: true })).toHaveCount(0)

  await back.click()
  await expect(sheet(page)).toBeHidden()
  await expect(page).toHaveURL(/\/notes\/\?ref=portfolio$/)
  await expect(popup(page)).toBeVisible()
  await expect(popup(page).locator(".preview-gallery-count")).toHaveText("3 / 14")
  // The row the sheet was opened from is back, and focus is in the list's
  // popup rather than stranded on the tile behind it.
  await expect(entry).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.activeElement?.closest(".preview-gallery-popup") !== null)).toBe(true)

  // Escape from a note is the same move as back: one level, to the list.
  await entry.click()
  await expect(sheet(page)).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(sheet(page)).toBeHidden()
  await expect(popup(page)).toBeVisible()
  await expect(page).toHaveURL(/\/notes\/\?ref=portfolio$/)
  await page.keyboard.press("Escape")
  await expect(popup(page)).toBeHidden()
  await expect(page).toHaveURL(/\/\?ref=portfolio$/)
  await expect(folder).toBeFocused()
})

test("a press outside a note closes the gallery once, with the note still on it", async ({ page }) => {
  // Back is a single tone and the close is a noise transient over one. A press
  // outside used to be two dismissals -- Back on mousedown, then Base UI closing
  // the list on the click -- and played both.
  await page.addInitScript(() => {
    const sounds = { tones: 0, noise: 0 }
    Object.assign(window, { __sounds: sounds })
    const { createOscillator, createBufferSource } = BaseAudioContext.prototype
    BaseAudioContext.prototype.createOscillator = function () { sounds.tones += 1; return createOscillator.call(this) }
    BaseAudioContext.prototype.createBufferSource = function () { sounds.noise += 1; return createBufferSource.call(this) }
  })
  const sounds = () => page.evaluate(() => ({ ...(window as unknown as { __sounds: { tones: number; noise: number } }).__sounds }))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  const folder = page.getByRole("button", { name: "Open writings folder" })
  await folder.click()
  await popup(page).getByRole("button", { name: "Designing Matcha", exact: true }).click()
  await expect(sheet(page).getByRole("heading", { name: "Designing Matcha", exact: true })).toBeFocused()
  await page.evaluate(() => document.getAnimations().forEach(animation => animation.finish()))
  const before = await sounds()

  // The note stays on the card while it shrinks: turning back to the list on
  // the way out is the second dismissal this replaced.
  const frames = popup(page).evaluate(element => new Promise<string[]>(resolve => {
    const samples: string[] = []
    const end = performance.now() + 1500
    const sample = () => {
      if (!element.isConnected || performance.now() > end) return resolve(samples)
      samples.push(element.querySelector(".writing-reader") ? "note" : "list")
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  }))
  // Twice: the second press lands during the exit, while the note's address is
  // still being given up, and must not close it a second time.
  await page.mouse.dblclick(8, 500)
  expect(await frames).not.toContain("list")
  await expect(popup(page)).toBeHidden()
  // Both addresses are given up, so the visit is back where it began.
  await expect(page).toHaveURL(/\/$/)
  await expect(folder).toBeFocused()
  const after = await sounds()
  expect({ tones: after.tones - before.tones, noise: after.noise - before.noise }).toEqual({ tones: 1, noise: 1 })

  // A shared note has no list or opener behind it, and closes to the page.
  await page.goto("/notes/designing-matcha/")
  await expect(sheet(page).getByRole("heading", { name: "Designing Matcha", exact: true })).toBeFocused()
  await page.mouse.click(8, 500)
  await expect(popup(page)).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
  await expect(folder).toBeFocused()
})

for (const viewport of [{ width: 2283, height: 1239 }, { width: 1024, height: 768 }]) {
  test(`a note's sheet hangs from the preview's line and keeps its box at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/notes/designing-matcha/")
    const dialog = sheet(page)
    const waitForSettledDialog = () => expect.poll(() => dialog.evaluate((element) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
      return Math.abs(matrix.a - 1) < 0.001 && Math.abs(matrix.d - 1) < 0.001
    })).toBe(true)
    await waitForSettledDialog()
    const reading = (await dialog.boundingBox())!
    // The sheet hangs from the line a project preview opens on -- 8vh, and
    // 5vh from 1320px where the preview goes wide -- with a matching bottom gutter.
    const top = viewport.height * (viewport.width >= 1320 ? 0.05 : 0.08)
    const room = viewport.height - 2 * top
    expect(reading.y).toBeCloseTo(top, 0)
    // An article is taller than the room, so the sheet takes all of it.
    expect(reading.height).toBeCloseTo(room, 0)
    expect(await dialog.evaluate((element) => getComputedStyle(element).borderBottomLeftRadius)).toBe("24px")
    // Growing is the only sizing there is: no expand control.
    await expect(dialog.getByRole("button", { name: /Expand modal|Restore modal size/ })).toHaveCount(0)
    const reader = dialog.locator(".writings-scroll")
    await reader.evaluate((element) => element.scrollTo(0, 400))
    await expect.poll(() => dialog.boundingBox()).toEqual(reading)
    expect((await dialog.getByRole("heading", { name: "Notes and tools", exact: true }).boundingBox())!.y).toBeLessThan(reading.y + 80)
    await expect(dialog.getByRole("button", { name: "Next note" })).toBeInViewport()
    await expect.poll(() => reader.evaluate((element) => element.scrollTop)).toBe(400)
    await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toHaveCount(1)
    // A deep link has its own reading frame. Once the list is shown, choosing
    // a row preserves that list's frame instead of jumping back to the deep link size.
    await dialog.getByRole("button", { name: "Go back to Notes", exact: true }).click()
    await expect(dialog).toBeHidden()
    await popup(page).getByRole("button", { name: "Designing Matcha", exact: true }).click()
    await waitForSettledDialog()
    await expect.poll(() => dialog.boundingBox()).toEqual(reading)
  })
}

test("the nested reader grows downward without replacing its dialog", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  const dialog = popup(page)
  await expect(dialog.getByRole("button", { name: "Designing Matcha", exact: true })).toBeVisible()
  await expect(dialog.locator(".notes-gallery-card")).toHaveAttribute("style", /notes-list-height/)
  await page.evaluate(() => document.getAnimations().forEach(animation => animation.finish()))
  const listBox = (await dialog.boundingBox())!
  const original = await dialog.elementHandle()
  await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
  await expect(dialog).toHaveAttribute("data-reading-note", "true")
  await expect.poll(async () => (await dialog.boundingBox())!.height).toBeCloseTo(900, 0)
  const readingBox = (await dialog.boundingBox())!
  expect(readingBox.x).toBe(listBox.x)
  expect(readingBox.y).toBe(listBox.y)
  expect(readingBox.width).toBe(listBox.width)
  expect(readingBox.height).toBeGreaterThan(listBox.height)
  expect(await original!.evaluate(element => element === document.querySelector('[role="dialog"]'))).toBe(true)
  await expect(page.getByRole("dialog")).toHaveCount(1)
  await expect(page.locator(".preview-gallery-backdrop")).toHaveCount(1)
  await expect(dialog.locator(".notes-gallery-list")).toBeHidden()
  await expect(dialog).toHaveCSS("opacity", "1")

  await page.keyboard.press("Escape")
  await expect(dialog).not.toHaveAttribute("data-reading-note")
  await expect.poll(async () => (await dialog.boundingBox())!.height).toBeCloseTo(listBox.height, 0)
  expect(await original!.evaluate(element => element === document.querySelector('[role="dialog"]'))).toBe(true)
  await expect(dialog.getByRole("button", { name: "Designing Matcha", exact: true })).toBeFocused()
})

test("the phone reader keeps the gallery's full-height frame and reachable controls", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/designing-matcha/")
  const dialog = sheet(page)
  await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  // Visibility includes the opening pose, even with reduced motion. Measure
  // the viewport frame only once the dialog has finished appearing.
  await expect(dialog).toHaveCSS("opacity", "1")
  expect(await dialog.boundingBox()).toEqual({ x: 0, y: 0, width: 320, height: 568 })
  for (const name of ["Previous note", "Next note", "Close note", "Go back to Notes"]) {
    await expect(dialog.getByRole("button", { name, exact: true })).toBeInViewport()
  }
  const reader = dialog.locator(".writings-scroll")
  await reader.evaluate(element => element.scrollTo(0, element.scrollHeight))
  await expect(dialog.getByRole("heading", { name: "More notes" })).toBeVisible()
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab")
    await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
  }
})

test("the toolbar divider appears only once the article has scrolled", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 520 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/designing-matcha/")
  const dialog = sheet(page)
  const toolbar = dialog.locator(".writings-toolbar")
  const shadow = () => toolbar.evaluate((element) => getComputedStyle(element).boxShadow)
  // The line and its shadow are both fully transparent while the article rests at its top.
  await expect.poll(shadow).toContain("rgba(0, 0, 0, 0)")
  const reader = dialog.locator(".writings-scroll")
  await reader.evaluate((element) => element.scrollTo(0, 20))
  await expect.poll(shadow).toContain("rgba(0, 0, 0, 0.05)")
  await reader.evaluate((element) => element.scrollTo(0, 400))
  await expect(dialog.locator('.writing-contents')).toHaveAttribute('data-stuck', 'true')
  await expect.poll(shadow).not.toContain("rgba(0, 0, 0, 0.05)")
  // Turning to the next note resets the reader to the top, so the divider goes with it.
  await dialog.getByRole("button", { name: "Next note", exact: true }).click()
  await expect(dialog.getByRole("heading", { name: "Designing for active traders", exact: true })).toBeVisible()
  await expect.poll(shadow).toContain("rgba(0, 0, 0, 0)")
})

test("archive orders categories and dates without mutating its entries", () => {
  const entries = [
    { id: "older", category: "Notes", publishedAt: "2024-12-31" },
    { id: "undated", category: "Notes" },
    { id: "january", category: "Tools", publishedAt: "2026-01-01" },
    { id: "september", category: "Tools", publishedAt: "2026-09-01" },
    { id: "middle", category: "Notes", publishedAt: "2025-06-01" },
  ] as const
  expect(groupWritingsByCategory(entries).map(({ category, entries }) => ({ category, ids: entries.map((entry) => entry.id) }))).toEqual([
    { category: "Tools", ids: ["september", "january"] },
    { category: "Notes", ids: ["middle", "older", "undated"] },
  ])
  expect(entries[0].id).toBe("older")
  expect(groupWritingsByCategory([])).toEqual([])
})

test("the review-ready tool can be installed and links to its source", async ({ page }) => {
  await page.context().grantPermissions(["clipboard-write", "clipboard-read"])
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/review-ready-pull-requests/")
  const dialog = sheet(page)
  await expect(dialog.getByRole("heading", { name: "Make pull requests easier to review", exact: true })).toBeFocused()
  const install = dialog.getByRole("region", { name: "Install review-ready-prs" })
  await expect(install.getByText("npx skills add rafaelmedian/skills@review-ready-prs", { exact: true })).toBeVisible()
  await expect(install.getByRole("link", { name: "View source", exact: true })).toHaveAttribute(
    "href", "https://github.com/rafaelmedian/skills/tree/main/skills/review-ready-prs",
  )
  await install.getByRole("button", { name: "Copy install command", exact: true }).click()
  await expect(install.getByRole("status")).toHaveText("Install command copied")
  await expect(dialog.getByRole("region", { name: "More tools" })).toHaveCount(0)
})

test("note navigation follows the archive and resets the reader scroll", async ({ page }) => {
  await page.setViewportSize({ width: 2283, height: 1239 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/designing-matcha/")
  const dialog = sheet(page)
  await dialog.locator(".writings-scroll").evaluate((element) => element.scrollTo(0, 800))
  await dialog.getByRole("button", { name: "Next note", exact: true }).click()
  await expect(dialog.getByRole("heading", { name: "Designing for active traders", exact: true })).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Next note", exact: true })).toBeFocused()
  await expect.poll(() => dialog.locator(".writings-scroll").evaluate((element) => element.scrollTop)).toBe(0)
  await dialog.getByRole("button", { name: "Previous note", exact: true }).click()
  await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Previous note", exact: true })).toBeFocused()
  await dialog.getByRole("button", { name: "Previous note", exact: true }).click()
  await expect(dialog.getByRole("heading", { name: "A song we all know", exact: true })).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Previous note", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeFocused()
  await dialog.locator(".writings-scroll").evaluate((element) => element.scrollTo(0, 800))
  await page.keyboard.press("ArrowRight")
  await expect(dialog.getByRole("heading", { name: "Designing for active traders", exact: true })).toBeFocused()
  await expect.poll(() => dialog.locator(".writings-scroll").evaluate((element) => element.scrollTop)).toBe(0)
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("ArrowUp")
  await expect(dialog.getByRole("heading", { name: "Designing for active traders", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(dialog.getByRole("heading", { name: "A song we all know", exact: true })).toBeFocused()
  // Back puts the list's slide forward; a row of it opens the next sheet.
  await dialog.getByRole("button", { name: "Go back to Notes", exact: true }).click()
  await expect(dialog).toBeHidden()
  await popup(page).getByRole("button", { name: "My project context is moving into Markdown", exact: true }).click()
  await expect(dialog.getByRole("heading", { name: "My project context is moving into Markdown", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(dialog.getByRole("heading", { name: "Make pull requests easier to review", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(dialog.getByRole("heading", { name: "My project context is moving into Markdown", exact: true })).toBeFocused()
})

// The folder holds a place in the preview's sequence like any other tile, so
// the archive's two arrows are the sequence's rather than the list's: they step
// out to the tiles either side of the folder, and the preview's arrows step in.
// Inside a note the same two arrows turn its pages.
test("margin notes hang in the gutters without widening the reader", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  // Wide gallery cards have gutters. Compact cards fold margin notes inline,
  // even when the surrounding desktop viewport is wide enough for them.
  for (const width of [1440, 1000]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto("/notes/ai-design-needs-control/")
    const dialog = sheet(page)
    await expect(dialog.getByRole("heading", { name: "AI design needs more control", exact: true })).toBeVisible()
    const reader = dialog.locator(".writings-scroll")
    // A gutter note is absolutely positioned outside the reading column, so the
    // one thing that can go wrong quietly is a sideways scrollbar on the reader.
    await expect.poll(() => reader.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0)
    const notes = dialog.locator(".writing-margin-note")
    expect(await notes.count()).toBeGreaterThan(0)
    const bounds = await reader.boundingBox()
    for (const box of await notes.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect()))) {
      expect(box.left).toBeGreaterThanOrEqual(bounds!.x)
      expect(box.right).toBeLessThanOrEqual(bounds!.x + bounds!.width)
    }
    const prose = dialog.locator(".writing-reader-prose > p").first()
    const proseBox = (await prose.boundingBox())!
    const noteBox = (await dialog.locator('.writing-margin-note[data-place="right"]').first().boundingBox())!
    if (width < 1320) {
      expect(noteBox.x).toBeCloseTo(proseBox.x, 0)
      continue
    }
    expect(noteBox.x).toBeGreaterThan(proseBox.x + proseBox.width)
    // And it uses the gutter rather than sitting in a sliver of it: a note is
    // most of the width the reading column leaves over on its side.
    const column = (await dialog.locator(".writing-reader").boundingBox())!
    const cardPadding = await reader.evaluate((element) => parseFloat(getComputedStyle(element).paddingRight))
    const gutter = bounds!.x + bounds!.width - cardPadding - (column.x + column.width)
    expect(noteBox.width).toBeGreaterThan(gutter * 0.7)
  }
})

test("the list's drawings stay in the card's gutters and leave at narrow widths", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/")
  const card = popup(page).locator(".preview-gallery-card")
  await expect(popup(page).locator(".preview-gallery-notes-title")).toHaveText("Notes and tools")
  const drawings = popup(page).locator(".writings-drawing")
  expect(await drawings.count()).toBeGreaterThan(0)
  // The drawings hang outside the list's column, so the failure to catch is a
  // sideways scrollbar on the card rather than a drawing that looks wrong.
  await expect.poll(() => card.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0)
  const bounds = (await card.boundingBox())!
  const rows = (await popup(page).locator(".writings-category li").first().boundingBox())!
  let sides = 0
  for (const box of await drawings.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect()))) {
    expect(box.left).toBeGreaterThanOrEqual(bounds.x)
    expect(box.right).toBeLessThanOrEqual(bounds.x + bounds.width)
    // Never over the titles: each one is wholly left of the rows or right of them.
    expect(box.right <= rows.x || box.left >= rows.x + rows.width).toBe(true)
    sides |= box.left >= rows.x + rows.width ? 2 : 1
  }
  expect(sides).toBe(3)

  // Below 1320px the card opens at its compact width, and there is no gutter
  // to draw in however wide the window is. The width is latched when the
  // card opens, so this is a fresh visit rather than a resize.
  await page.setViewportSize({ width: 1200, height: 1000 })
  await page.goto("/notes/")
  await expect(popup(page).locator(".preview-gallery-notes-title")).toHaveText("Notes and tools")
  await expect(drawings.first()).toBeHidden()
})

test("a hovered row boils its drawing through its frames", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/notes/")
  await expect(popup(page).locator(".preview-gallery-notes-title")).toHaveText("Notes and tools")
  await expect(popup(page)).toHaveCSS("opacity", "1")

  // At rest the drawing shows the first frame of its strip and holds still.
  const owner = popup(page).getByRole("region", { name: "Tools" }).locator("li").first()
  const drawing = owner.locator(".writings-drawing")
  await expect(drawing).toHaveCSS("mask-image", /drawing-folder-pencil-frames\.png/)
  await expect(drawing).toHaveCSS("animation-name", "none")
  await expect(drawing).toHaveCSS("mask-position", "0px 0px")
  // Its row wakes it, and it steps through the other frames rather than
  // sliding between them.
  await owner.locator(".writing-entry-trigger").hover()
  await expect(drawing).toHaveCSS("animation-name", "writings-drawing-boil")
  const frames = new Set<string>()
  await expect.poll(async () => {
    frames.add(await drawing.evaluate((element) => getComputedStyle(element).maskPosition))
    return frames.size
  }, { intervals: [40] }).toBe(3)
  expect([...frames].sort()).toEqual(["0px 0px", "100% 0px", "50% 0px"])
  await page.mouse.move(4, 4, { steps: 4 })
  await expect(drawing).toHaveCSS("animation-name", "none")
  await expect(drawing).toHaveCSS("mask-position", "0px 0px")
})

test("the mouse moving onto a notes row strikes one key", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  // Every key click starts one oscillator, its thock, so counting them counts
  // keys. Reduced motion is left off: the sound library mutes under it.
  await page.addInitScript(() => {
    const counted = window as typeof window & { keyClicks: number }
    counted.keyClicks = 0
    const create = AudioContext.prototype.createOscillator
    AudioContext.prototype.createOscillator = function (this: AudioContext) {
      counted.keyClicks++
      return create.call(this)
    }
  })
  await page.goto("/notes/")
  await expect(popup(page).locator(".preview-gallery-notes-title")).toHaveText("Notes and tools")
  await expect(popup(page)).toHaveCSS("opacity", "1")
  // The popup reaches full opacity before its origin wrapper finishes moving.
  // Measure rows only after that travel lands, or these coordinates can point
  // at the next row by the time the mouse gets there.
  await page.locator(".preview-gallery-origin-wrap").evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  )
  const keyClicks = () => page.evaluate(() => (window as typeof window & { keyClicks: number }).keyClicks)

  // One key per row the mouse moves onto: not one per movement inside a row,
  // and none for rows a scroll carries under a still pointer.
  const rows = popup(page).locator(".writing-entry-trigger")
  await page.evaluate(() => { (window as typeof window & { keyClicks: number }).keyClicks = 0 })
  for (let index = 0; index < 4; index++) {
    const box = (await rows.nth(index).boundingBox())!
    await page.mouse.move(box.x + 40, box.y + box.height / 2, { steps: 3 })
    await page.waitForTimeout(100)
  }
  expect(await keyClicks()).toBe(4)
  const last = (await rows.nth(3).boundingBox())!
  for (let step = 1; step <= 5; step++) await page.mouse.move(last.x + 40 + step * 12, last.y + last.height / 2)
  await page.mouse.wheel(0, 240)
  await page.waitForTimeout(300)
  await page.mouse.wheel(0, -240)
  await page.waitForTimeout(300)
  expect(await keyClicks()).toBe(4)
})

test("margin notes fold into the column when the gutters are gone", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/ai-design-needs-control/")
  const dialog = sheet(page)
  await expect(dialog.getByRole("heading", { name: "AI design needs more control", exact: true })).toBeVisible()
  // Both boxes must belong to the settled dialog, not opposite sides of its
  // opening scale transition.
  await expect(dialog).toHaveCSS("opacity", "1")
  const prose = dialog.locator(".writing-reader-prose > p").first()
  const note = dialog.locator(".writing-margin-note").first()
  const proseBox = (await prose.boundingBox())!
  const noteBox = (await note.boundingBox())!
  expect(noteBox.x).toBeGreaterThanOrEqual(proseBox.x)
  expect(noteBox.x + noteBox.width).toBeLessThanOrEqual(proseBox.x + proseBox.width + 1)
  // The note belongs to the paragraph, so it reads after the sentence it marks.
  expect(await prose.textContent()).toContain("And I still typed three paragraphs describing it")
})

test("the contents open from one horizontal row and jump without adding history", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/designing-matcha/")
  const dialog = sheet(page)
  const contents = dialog.getByRole("navigation", { name: "Contents" })
  const trigger = contents.locator(".writing-contents-trigger")
  await expect(trigger).toHaveAccessibleName("Contents: Introduction")
  await expect(trigger).toHaveText("Contents")
  await expect(contents.getByRole("link")).toHaveCount(0)

  // The compact control is one row between the article header and body, on
  // the reading column rather than in either marginalia gutter.
  const [contentsBox, header] = await Promise.all([
    contents.boundingBox(),
    dialog.locator(".writing-reader-header").boundingBox(),
  ])
  expect(Math.round(contentsBox!.x)).toBe(Math.round(header!.x))
  expect(Math.round(contentsBox!.width)).toBe(Math.round(header!.width))
  expect(contentsBox!.y).toBeGreaterThanOrEqual(header!.y + header!.height)
  expect(await contents.evaluate((element) => getComputedStyle(element).borderBottomWidth)).toBe("1px")

  await trigger.click()
  await expect(contents.getByRole("link")).toHaveText([
    "Different reasons to arrive",
    "The space around the trade",
    "A system has to survive the awkward states",
    "What the screens can tell you",
  ])
  // A real fragment underneath, so the static page and a copied link work
  // without the reader.
  const row = contents.getByRole("link", { name: "A system has to survive the awkward states" })
  await expect(row).toHaveAttribute("href", "#a-system-has-to-survive-the-awkward-states")

  // The introduction is not a listed section, so nothing is marked at the top.
  const currentRows = contents.locator("a[aria-current]")
  await expect(currentRows).toHaveCount(0)

  const historyLength = await page.evaluate(() => history.length)
  await row.click()
  const heading = dialog.getByRole("heading", { name: "A system has to survive the awkward states" })
  await expect(heading).toBeFocused()
  await expect(contents.getByRole("link")).toHaveCount(0)
  // The jump preserves the reader's 24px breathing room, so the preceding
  // section remains current until the new heading crosses the rail.
  await expect(trigger).toHaveText("The space around the trade")
  const reader = dialog.locator(".writings-scroll")
  await reader.evaluate((element) => element.scrollBy(0, 24))
  await expect(trigger).toHaveText("A system has to survive the awkward states")
  await expect(trigger).toHaveAccessibleName("Contents: A system has to survive the awkward states")
  await trigger.click()
  await expect(currentRows).toHaveText(["A system has to survive the awkward states"])
  await trigger.click()
  // The card scrolls, not the page.
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await expect(page).toHaveURL(/\/notes\/designing-matcha\/$/)
  expect(await page.evaluate(() => history.length)).toBe(historyLength)

  // A short last section may never climb to the rail, so the end of the note
  // still hands the mark to it.
  await reader.evaluate((element) => element.scrollTo(0, element.scrollHeight))
  await expect(trigger).toHaveText("What the screens can tell you")

  // The gallery closes a note by stepping back through history, so one Back
  // still leaves the note after a jump.
  await dialog.getByRole("button", { name: "Go back to Notes", exact: true }).click()
  await expect(page).toHaveURL(/\/notes\/$/)
  await expect(dialog).toBeHidden()
})

test("the compact contents label changes without animation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/notes/room-to-figure-it-out/")
  const dialog = sheet(page)
  const contents = dialog.getByRole("navigation", { name: "Contents" })
  const heading = dialog.getByRole("heading", { name: "Everyday decisions are practice" })
  await heading.evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }))
  await expect(contents).toHaveAttribute("data-stuck", "true")
  await dialog.locator(".writings-scroll").evaluate((element) => element.scrollBy(0, 24))
  await expect(contents.locator(".writing-contents-current")).toHaveText("Everyday decisions are practice")
  await expect(contents.locator(".writing-contents-current")).toHaveCSS("animation-name", "none")
  await expect(contents.locator(".writing-contents-current")).toHaveCSS("filter", "none")
  await dialog.getByRole("heading", { name: "Leaving is not equally available to everyone", exact: true })
    .evaluate((element) => {
      element.scrollIntoView({ block: "start", behavior: "instant" })
      element.closest(".writings-scroll")!.scrollTop += 30
    })
  await expect(contents.locator(".writing-contents-current")).toHaveText("Leaving is not equally available to everyone")
  expect(await contents.locator(".writing-contents-current").evaluate((element) => element.getAnimations().length)).toBe(0)
})

test("the contents label changes only as section headings cross the pinned row", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/room-to-figure-it-out/")
  const dialog = sheet(page)
  const contents = dialog.getByRole("navigation", { name: "Contents" })
  const trigger = contents.locator(".writing-contents-trigger")
  const scroller = dialog.locator(".writings-scroll")
  const first = dialog.getByRole("heading", { name: "Everyday decisions are practice" })

  const placeHeading = async (offsetFromContents: number) => {
    await first.evaluate((heading, offset) => {
      const reader = heading.closest(".writings-scroll")!
      const rail = reader.querySelector(".writing-contents")!
      reader.scrollTop += heading.getBoundingClientRect().top - rail.getBoundingClientRect().bottom - offset
    }, offsetFromContents)
  }

  await placeHeading(1)
  await expect(contents).toHaveAttribute("data-stuck", "true")
  await expect(trigger).toHaveText("Contents")

  await placeHeading(-1)
  await expect(trigger).toHaveText("Everyday decisions are practice")

  await placeHeading(1)
  await expect(trigger).toHaveText("Contents")
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await expect(scroller).not.toHaveJSProperty("scrollTop", 0)
})

test("the contents row eases out to the modal edges beneath Notes and tools", async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 646 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/notes/project-context-in-markdown/")
  const dialog = sheet(page)
  const contents = dialog.getByRole("navigation", { name: "Contents" })
  const scroller = dialog.locator(".writings-scroll")
  const card = dialog.locator(".preview-gallery-card")
  const readerHeader = dialog.locator(".writing-reader-header")
  await expect(contents).toHaveAttribute("data-stuck", "false")
  await contents.evaluate((element) => {
    element.setAttribute("style", "transition-duration: 2s")
  })
  await scroller.evaluate((element) => element.scrollTo(0, 320))
  await expect(contents).toHaveAttribute("data-stuck", "true")

  await expect.poll(async () => {
    const [movingBox, cardBox, headerBox] = await Promise.all([
      contents.boundingBox(),
      card.boundingBox(),
      readerHeader.boundingBox(),
    ])
    return movingBox!.width > headerBox!.width && movingBox!.width < cardBox!.width - 1
  }).toBe(true)

  await page.waitForTimeout(2000)
  const [contentsBox, scrollerBox, cardBox] = await Promise.all([
    contents.boundingBox(),
    scroller.boundingBox(),
    card.boundingBox(),
  ])
  expect(Math.round(contentsBox!.y)).toBe(Math.round(scrollerBox!.y))
  expect(Math.abs(contentsBox!.x - cardBox!.x)).toBeLessThan(1.1)
  expect(Math.abs(contentsBox!.x + contentsBox!.width - cardBox!.x - cardBox!.width)).toBeLessThan(1.1)
  expect(await contents.evaluate((element) => getComputedStyle(element).position)).toBe("sticky")
  expect(await contents.evaluate((element) => getComputedStyle(element, "::before").opacity)).toBe("1")
  // A correct rail rect is insufficient when an ancestor clips its paint.
  expect(Math.abs(scrollerBox!.x - contentsBox!.x)).toBeLessThan(1.1)
  expect(Math.abs(scrollerBox!.width - contentsBox!.width)).toBeLessThan(1.1)
})

test("a shared section link survives the handoff to the reader", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/designing-matcha/#a-system-has-to-survive-the-awkward-states")
  const dialog = sheet(page)
  const heading = dialog.getByRole("heading", { name: "A system has to survive the awkward states" })
  await expect(heading).toBeVisible()
  const reader = dialog.locator(".writings-scroll")
  await expect.poll(async () => {
    const [headingBox, readerBox] = await Promise.all([heading.boundingBox(), reader.boundingBox()])
    return Math.round(headingBox!.y - readerBox!.y)
  }).toBe(68)
  await dialog.getByRole("button", { name: "Go back to Notes", exact: true }).click()
  await expect(page).toHaveURL(/\/notes\/$/)
})

test("inline contents leave both marginalia gutters available", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/")
  const dialog = sheet(page)
  const entries = popup(page).locator(".writings-category li button")
  await expect(entries.first()).toBeVisible()
  const count = await entries.count()
  for (let index = 0; index < count; index += 1) {
    const id = await entries.nth(index).locator(".writing-entry-title").innerText()
    await entries.nth(index).click()
    await expect(dialog.locator(".writing-reader")).toBeVisible()
    const contents = dialog.getByRole("navigation", { name: "Contents" })
    if (await contents.count()) {
      const column = (await dialog.locator(".writing-reader").boundingBox())!
      const contentsBox = (await contents.boundingBox())!
      const header = (await dialog.locator(".writing-reader-header").boundingBox())!
      expect(Math.round(contentsBox.x), id).toBe(Math.round(header.x))
      expect(Math.round(contentsBox.x + contentsBox.width), id).toBe(Math.round(header.x + header.width))
      // Removing the contents from the left gutter lets authored notes keep
      // their own side instead of being rerouted to the right.
      const notes = await dialog.locator(".writing-margin-note")
        .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON() as DOMRect))
      for (const note of notes) expect(note.right <= column.x || note.left >= column.x + column.width, id).toBe(true)
    }
    await dialog.getByRole("button", { name: "Go back to Notes", exact: true }).click()
    await expect(dialog).toBeHidden()
  }

  // The same row stays in the column when the card becomes compact.
  await page.setViewportSize({ width: 1200, height: 900 })
  await page.goto("/notes/designing-matcha/")
  const contents = dialog.getByRole("navigation", { name: "Contents" })
  await expect(contents).toBeVisible()
  await expect.poll(() => dialog.locator(".writing-reader").evaluate((reader) => {
    const column = reader.getBoundingClientRect()
    const contentsBox = reader.querySelector(".writing-contents")!.getBoundingClientRect()
    const prose = reader.querySelector(".writing-reader-prose")!.getBoundingClientRect()
    return Math.round(contentsBox.x) === Math.round(column.x)
      && contentsBox.bottom <= prose.y
  })).toBe(true)
})

test("More notes show the archive dates beside their titles", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/room-to-figure-it-out/")
  const more = sheet(page).getByRole("region", { name: "More notes" })
  await expect(more.locator("time")).toHaveText(["07/09", "29/07", "16/06"])
  await expect(more.locator("time").first()).toHaveAttribute("aria-hidden", "true")
})

test("an article closes with its acknowledgements above More notes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/designing-matcha/")
  const dialog = sheet(page)
  const credits = dialog.getByRole("region", { name: "Acknowledgements" })
  await expect(credits).toContainText("0x Project")
  const creditsBox = (await credits.boundingBox())!
  const more = (await dialog.getByRole("region", { name: "More notes" }).boundingBox())!
  expect(creditsBox.y + creditsBox.height).toBeLessThanOrEqual(more.y)
})

test("keeps marginalia to two notes an article, one in each gutter", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/")
  const dialog = sheet(page)
  const entries = popup(page).locator(".writings-category li button")
  await expect(entries.first()).toBeVisible()
  const count = await entries.count()
  expect(count).toBeGreaterThan(0)
  for (let index = 0; index < count; index += 1) {
    const id = await entries.nth(index).locator(".writing-entry-title").innerText()
    await entries.nth(index).click()
    await expect(dialog.locator(".writing-reader")).toBeVisible()
    const places = await dialog.locator(".writing-reader-prose .writing-margin-note")
      .evaluateAll((elements) => elements.map((element) => (element as HTMLElement).dataset.place))
    // Marginalia is an aside, not a second column: past a couple an article a
    // reader stops reading the page and starts reading the margin. One is
    // written for each gutter, so neither edge ever grows a stack; where the
    // contents float in the left one, both hang right, one early, one late.
    expect(places.length, id).toBeLessThanOrEqual(2)
    expect(new Set(places).size, id).toBe(places.length)
    // The interjections that used to drop between paragraphs are gone with them.
    await expect(dialog.locator(".writing-aside")).toHaveCount(0)
    await dialog.getByRole("button", { name: "Go back to Notes", exact: true }).click()
    await expect(dialog).toBeHidden()
  }
})

test("prints a highlighted Markdown sample without a sideways read", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/project-context-in-markdown/")
  const dialog = sheet(page)
  const block = dialog.locator(".writing-code-block")
  await expect(block).toBeVisible()
  await expect(dialog.locator(".writing-code-figure figcaption")).toHaveText("PROJECT_STATUS.md, halfway through a week.")

  // A blank line in a status file is a line, so the sample keeps its shape.
  expect(await block.evaluate((element) => element.textContent!.split("\n").length)).toBe(16)

  // The block is the one coloured thing on the site: every token kind takes a
  // hue of its own, and none of them is the colour of the plain text they are
  // marked against.
  const inks = await block.evaluate((element) => {
    const pick = (kind: string) => {
      const span = element.querySelector(`[data-code="${kind}"]`)!
      const style = getComputedStyle(span)
      return { color: style.color, weight: style.fontWeight, text: span.textContent }
    }
    return {
      body: getComputedStyle(element).color,
      mark: pick("mark"), strong: pick("strong"), literal: pick("literal"), link: pick("link"),
    }
  })
  expect(inks.mark.text).toBe("# ")
  expect(inks.strong.text).toBe("Portfolio — status")
  expect(inks.strong.weight).toBe("600")
  const palette = [inks.body, inks.mark.color, inks.strong.color, inks.literal.color, inks.link.color]
  expect(new Set(palette).size).toBe(palette.length)
  // Colour, not grey: a token whose channels are all equal is monochrome.
  for (const kind of [inks.mark, inks.strong, inks.literal, inks.link]) {
    const [red, green, blue] = kind.color.match(/\d+/g)!.map(Number)
    expect(red === green && green === blue, kind.color).toBe(false)
  }

  // The sample is written to the measure, so it never scrolls sideways -- and
  // it must never push the reader itself sideways either.
  await expect.poll(() => block.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0)
  const reader = dialog.locator(".writings-scroll")
  await expect.poll(() => reader.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0)

  // A phone is narrower than the longest line, so there the lines wrap instead.
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(block).toHaveCSS("white-space", "pre-wrap")
  await expect.poll(() => block.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0)
})
