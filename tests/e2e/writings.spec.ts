import { expect, test } from "@playwright/test"
import { groupWritingsByYear } from "../../src/lib/writings"

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
  await expect(folder.locator(".writings-tile-label")).toHaveText("Writings & notes")
  await folder.click()
  // The same popup a project opens, on the list's own address, counted in the
  // sequence at the tile's place: after the two projects of the first row.
  await expect(popup(page)).toBeVisible()
  await expect(page).toHaveURL(/\/notes\/$/)
  await expect(page).toHaveTitle("Notes — Rafael Medina")
  await expect(popup(page)).toHaveAttribute("data-preview-kind", "writings")
  await expect(popup(page).locator(".preview-gallery-count")).toHaveText("3 / 14")
  await expect(popup(page).getByRole("heading", { name: "Notes", exact: true })).toBeVisible()
  await expect(popup(page).locator(".writings-year > h3")).toHaveText(["2026", "2025"])
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
  // The held visual surface is removed from the active modal tree by the
  // reader, so assistive technology still encounters one dialog.
  await expect(page.getByRole("dialog")).toHaveCount(1)
  await expect(sheet(page).getByRole("heading", { name: "Designing Matcha", exact: true })).toBeFocused()
  await expect(sheet(page).locator(".writings-toolbar")).toHaveText("Notes")
  await expect(sheet(page).locator(".writing-reader-date time")).toHaveText("March 2, 2026")
  await expect(sheet(page).getByRole("img", { name: "Matcha discovery homepage with token search and market overview" })).toBeVisible()
  // The sheet is the one surface with a back arrow, and it never collapses:
  // there is always the list to go back to.
  const back = sheet(page).getByRole("button", { name: "Go back to Notes", exact: true })
  await expect(back).toBeVisible()
  const arrow = (await back.boundingBox())!
  const title = (await sheet(page).getByRole("heading", { name: "Notes", exact: true }).boundingBox())!
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
    // 5vh from 1320px where the preview goes wide -- over a 1rem bottom gutter.
    const top = viewport.height * (viewport.width >= 1320 ? 0.05 : 0.08)
    const room = viewport.height - top - 16
    expect(reading.y).toBeCloseTo(top, 0)
    // An article is taller than the room, so the sheet takes all of it.
    expect(reading.height).toBeCloseTo(room, 0)
    expect(await dialog.evaluate((element) => getComputedStyle(element).borderBottomLeftRadius)).toBe("24px")
    // Growing is the only sizing there is: no expand control.
    await expect(dialog.getByRole("button", { name: /Expand modal|Restore modal size/ })).toHaveCount(0)
    const reader = dialog.locator(".writings-scroll")
    await reader.evaluate((element) => element.scrollTo(0, 400))
    await expect.poll(() => dialog.boundingBox()).toEqual(reading)
    expect((await dialog.getByRole("heading", { name: "Notes", exact: true }).boundingBox())!.y).toBeLessThan(reading.y + 80)
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
  await expect.poll(async () => (await dialog.boundingBox())!.height).toBeCloseTo(934, 0)
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
  expect(await dialog.boundingBox()).toEqual({ x: 0, y: 0, width: 320, height: 568 })
  for (const name of ["Previous note", "Next note", "Close note", "Go back to Notes"]) {
    await expect(dialog.getByRole("button", { name, exact: true })).toBeInViewport()
  }
  const reader = dialog.locator(".writings-scroll")
  await reader.evaluate(element => element.scrollTo(0, element.scrollHeight))
  await expect(dialog.getByRole("heading", { name: "More articles" })).toBeVisible()
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
  await reader.evaluate((element) => element.scrollTo(0, 400))
  await expect.poll(shadow).toContain("rgba(0, 0, 0, 0.05)")
  // Turning to the next note resets the reader to the top, so the divider goes with it.
  await dialog.getByRole("button", { name: "Next note", exact: true }).click()
  await expect(dialog.getByRole("heading", { name: "Designing for active traders", exact: true })).toBeVisible()
  await expect.poll(shadow).toContain("rgba(0, 0, 0, 0)")
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
  await expect(dialog.getByRole("heading", { name: "From quote to confirmation", exact: true })).toBeFocused()
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
    const gutter = bounds!.x + bounds!.width - (column.x + column.width)
    expect(noteBox.width).toBeGreaterThan(gutter * 0.7)
  }
})

test("the list's drawings stay in the card's gutters and leave at narrow widths", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/")
  const card = popup(page).locator(".preview-gallery-card")
  await expect(popup(page).getByRole("heading", { name: "Notes", exact: true })).toBeVisible()
  const drawings = popup(page).locator(".writings-drawing")
  expect(await drawings.count()).toBeGreaterThan(0)
  // The drawings hang outside the list's column, so the failure to catch is a
  // sideways scrollbar on the card rather than a drawing that looks wrong.
  await expect.poll(() => card.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0)
  const bounds = (await card.boundingBox())!
  const rows = (await popup(page).locator(".writings-year li").first().boundingBox())!
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
  await expect(popup(page).getByRole("heading", { name: "Notes", exact: true })).toBeVisible()
  await expect(drawings.first()).toBeHidden()
})

test("margin notes fold into the column when the gutters are gone", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/ai-design-needs-control/")
  const dialog = sheet(page)
  await expect(dialog.getByRole("heading", { name: "AI design needs more control", exact: true })).toBeVisible()
  const prose = dialog.locator(".writing-reader-prose > p").first()
  const note = dialog.locator(".writing-margin-note").first()
  const proseBox = (await prose.boundingBox())!
  const noteBox = (await note.boundingBox())!
  expect(noteBox.x).toBeGreaterThanOrEqual(proseBox.x)
  expect(noteBox.x + noteBox.width).toBeLessThanOrEqual(proseBox.x + proseBox.width + 1)
  // The note belongs to the paragraph, so it reads after the sentence it marks.
  expect(await prose.textContent()).toContain("And I still typed three paragraphs describing it")
})

test("an article closes with its acknowledgements above More articles", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/designing-matcha/")
  const dialog = sheet(page)
  const credits = dialog.getByRole("region", { name: "Acknowledgements" })
  await expect(credits).toContainText("0x Project")
  const creditsBox = (await credits.boundingBox())!
  const more = (await dialog.getByRole("region", { name: "More articles" }).boundingBox())!
  expect(creditsBox.y + creditsBox.height).toBeLessThanOrEqual(more.y)
})

test("keeps marginalia to two notes an article, one in each gutter", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/")
  const dialog = sheet(page)
  const entries = popup(page).locator(".writings-year li button")
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
    // reader stops reading the page and starts reading the margin. One goes in
    // each gutter, so neither edge ever grows a stack.
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
