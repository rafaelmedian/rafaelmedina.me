import { expect, test } from "@playwright/test"
import { groupWritingsByYear } from "../../src/lib/writings"

for (const viewport of [{ width: 2283, height: 1239 }, { width: 1024, height: 768 }]) {
  test(`notes sit within viewport margins and preserve reading at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    const folder = page.getByRole("button", { name: "Open writings folder" })
    await folder.click()
    const dialog = page.getByRole("dialog")
    const original = (await dialog.boundingBox())!
    // The dialog hangs from the line a project preview opens on -- 8vh, and
    // 5vh from 1320px where the preview goes wide -- over a 1rem bottom gutter.
    const top = viewport.height * (viewport.width >= 1320 ? 0.05 : 0.08)
    const room = viewport.height - top - 16
    expect(original.y).toBeCloseTo(top, 0)
    // The sheet is as tall as the page in front of it: the toolbar plus the
    // archive, so the list stops at its last row rather than leaving empty
    // paper below it.
    const listFit = await dialog.evaluate((element) =>
      element.querySelector(".writings-toolbar")!.getBoundingClientRect().height +
      element.querySelector(".writings-archive")!.getBoundingClientRect().height,
    )
    expect(original.height).toBeCloseTo(listFit, 0)
    expect(original.height).toBeLessThan(room)
    expect(await dialog.evaluate((element) => getComputedStyle(element).borderRadius)).toBe("24px")
    // Growing is the only sizing there is: no expand control, and the sheet
    // still hangs from the same line once it has grown.
    await expect(dialog.getByRole("button", { name: /Expand modal|Restore modal size/ })).toHaveCount(0)
    await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
    const reading = (await dialog.boundingBox())!
    expect(reading.height).toBeCloseTo(room, 0)
    expect(reading.y).toBeCloseTo(top, 0)
    expect(reading.width).toBe(original.width)
    const reader = dialog.locator('[data-page-id="2"]')
    await reader.evaluate((element) => element.scrollTo(0, 400))
    expect(await dialog.boundingBox()).toEqual(reading)
    expect((await dialog.getByRole("heading", { name: "Notes", exact: true }).boundingBox())!.y).toBeLessThan(original.y + 80)
    await expect(dialog.getByRole("button", { name: "Next note" })).toBeInViewport()
    await expect.poll(() => reader.evaluate((element) => element.scrollTop)).toBe(400)
    await expect(dialog.getByRole("heading", { name: "Designing Matcha", exact: true })).toHaveCount(1)
    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeVisible()
    await folder.click()
    expect(await dialog.boundingBox()).toEqual(original)
  })
}

test("the header Notes link opens the folder on the project preview's line", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const card = page.locator(".mosaic-row-card").first()
  await card.scrollIntoViewIfNeeded()
  await card.click()
  const preview = page.locator(".preview-gallery-popup")
  await expect(preview).toBeVisible()
  const previewTop = (await preview.boundingBox())!.y
  await page.keyboard.press("Escape")
  await expect(preview).toBeHidden()
  await page.evaluate(() => window.scrollTo(0, 0))

  const notes = page.getByRole("navigation", { name: "Sections" }).getByRole("button", { name: "Notes", exact: true })
  await notes.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByRole("button", { name: "Designing Matcha", exact: true })).toBeVisible()
  // The two modals share a top edge, so moving between them holds the header still.
  expect((await dialog.boundingBox())!.y).toBeCloseTo(previewTop, 0)

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  // Focus returns to the header link, not to the folder tile down in the mosaic.
  await expect(notes).toBeFocused()
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
})

test("the notes sheet flies out of the control that opened it and back into it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  // Hold Web Animations at their first frame: the flight is 200ms out and 160ms
  // back, and both would be over before an assertion could read them.
  await page.evaluate(() => {
    const animate = Element.prototype.animate
    const flights: Animation[] = []
    Object.assign(window, { flights })
    Element.prototype.animate = function (this: Element, ...args: Parameters<Element["animate"]>) {
      const animation = animate.apply(this, args)
      animation.pause()
      flights.push(animation)
      return animation
    }
  })

  // The flight's endpoints, then out of the way: finishing it hands the sheet
  // back to the stylesheet, so whatever is measured next is its resting box.
  const flight = () => page.evaluate(() => {
    const { flights } = window as unknown as { flights: Animation[] }
    const animation = flights[flights.length - 1]
    const frames = animation.effect!.getKeyframes()
    const pose = (transform: unknown) => {
      const [, x, y, scale] = String(transform)
        .match(/translate3d\((-?[\d.]+)px, (-?[\d.]+)px, 0px\) scale\(([\d.]+)\)/)!
      return { x: Number(x), y: Number(y), scale: Number(scale) }
    }
    animation.finish()
    return {
      duration: animation.effect!.getTiming().duration,
      from: pose(frames[0].transform),
      to: pose(frames[frames.length - 1].transform),
    }
  })

  const folder = page.getByRole("button", { name: "Open writings folder" })
  await folder.scrollIntoViewIfNeeded()
  const tile = (await folder.boundingBox())!
  await folder.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  const open = await flight()
  const sheet = (await dialog.boundingBox())!
  // The sheet's own pose is flat while the flight owns it: a running transition
  // outranks an animation, so any scale left in CSS would overwrite the travel.
  await expect(dialog).toHaveCSS("transform", "none")

  const bearing = {
    x: tile.x + tile.width / 2 - (sheet.x + sheet.width / 2),
    y: tile.y + tile.height / 2 - (sheet.y + sheet.height / 2),
  }
  expect(open.duration).toBe(200)
  // Direction, not distance: the travel is capped, so a tile anywhere on screen
  // only says which way the sheet came from.
  expect(open.from.x * bearing.x + open.from.y * bearing.y).toBeGreaterThan(0)
  expect(Math.hypot(open.from.x, open.from.y)).toBeCloseTo(44, 0)
  expect(open.from.scale).toBeLessThan(1)
  expect(open.to).toEqual({ x: 0, y: 0, scale: 1 })

  await page.keyboard.press("Escape")
  const close = await flight()
  expect(close.duration).toBe(160)
  expect(close.from).toEqual({ x: 0, y: 0, scale: 1 })
  // The close is the open run backwards, as a project preview's is: the sheet
  // leaves on the bearing it arrived on rather than shrinking where it stands.
  expect(close.to.x).toBeCloseTo(open.from.x, 1)
  expect(close.to.y).toBeCloseTo(open.from.y, 1)
  expect(close.to.scale).toBe(open.from.scale)
  await expect(dialog).toBeHidden()
})

test("the phone sheet moves navigation onto the title line", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  const dialog = page.getByRole("dialog")
  expect(await dialog.boundingBox()).toEqual({ x: 8, y: 8, width: 304, height: 552 })
  const titleRow = (await dialog.locator(".writings-toolbar-leading").boundingBox())!
  const close = (await dialog.getByRole("button", { name: "Close writings" }).boundingBox())!
  expect(close.y).toBe(titleRow.y)
  expect(close.x + close.width).toBe(292)
  await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
  const prev = (await dialog.getByRole("button", { name: "Previous note" }).boundingBox())!
  const title = (await dialog.getByRole("heading", { name: "Notes", exact: true }).boundingBox())!
  expect(prev.y).toBe(titleRow.y)
  expect(prev.x).toBeGreaterThanOrEqual(title.x + title.width)
  // Reading and browsing leave the close button where the list put it.
  expect(await dialog.getByRole("button", { name: "Close writings" }).boundingBox()).toEqual(close)
  // No bottom bar: the article scrolls to the foot of the sheet.
  const reader = (await dialog.locator('[data-page-id="2"]').boundingBox())!
  expect(reader.y + reader.height).toBe(560)
})

test("the toolbar divider appears only once a page has scrolled", async ({ page }) => {
  // Short enough that the archive itself overflows, not just a note.
  await page.setViewportSize({ width: 1440, height: 520 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  const dialog = page.getByRole("dialog")
  const toolbar = dialog.locator(".writings-toolbar")
  const shadow = () => toolbar.evaluate((element) => getComputedStyle(element).boxShadow)
  // The line and its shadow are both fully transparent while a page rests at its top.
  await expect.poll(shadow).toContain("rgba(0, 0, 0, 0)")

  const archive = dialog.locator('[data-page-id="1"]')
  // The list is eight rows of --text-sm, so its overflow is shorter than the
  // request: take the offset the browser actually settles on and assert on that.
  await archive.evaluate((element) => element.scrollTo(0, 200))
  const archiveOffset = await archive.evaluate((element) => element.scrollTop)
  expect(archiveOffset).toBeGreaterThan(0)
  await expect.poll(shadow).toContain("rgba(0, 0, 0, 0.05)")

  // Opening a note resets the reader to the top, so the divider goes with it.
  await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
  await expect.poll(shadow).toContain("rgba(0, 0, 0, 0)")
  const reader = dialog.locator('[data-page-id="2"]')
  await reader.evaluate((element) => element.scrollTo(0, 400))
  await expect.poll(shadow).toContain("rgba(0, 0, 0, 0.05)")

  // Back on the list the divider follows the archive's retained offset, not the reader's.
  await dialog.getByRole("button", { name: "Go back to Notes", exact: true }).click()
  await expect.poll(() => archive.evaluate((element) => element.scrollTop)).toBe(archiveOffset)
  await expect.poll(shadow).toContain("rgba(0, 0, 0, 0.05)")
  await archive.evaluate((element) => element.scrollTo(0, 0))
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

test("notes stay in the larger modal and the back button restores the simple list", async ({ page }) => {
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
  // The article is taller than the list, so the sheet grows to hold it. Only
  // the height moves -- the column is the same width on both pages.
  const after = (await dialog.boundingBox())!
  expect(after.width).toBe(before.width)
  expect(after.height).toBeGreaterThan(before.height)
  const toolbar = dialog.locator(".writings-toolbar")
  await expect(toolbar).toHaveText("Notes")
  await expect(dialog.getByRole("heading", { name: "A system has to survive the awkward states", exact: true })).toBeVisible()
  const image = dialog.getByRole("img", { name: "Matcha homepage", exact: true })
  await image.scrollIntoViewIfNeeded()
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  expect(await dialog.locator('.writings-scroll[data-page-id="2"]').evaluate((element) => element.scrollHeight > element.clientHeight * 3)).toBe(true)
  await expect(toolbar).toBeInViewport()
  await dialog.getByRole("button", { name: "Go back to Notes", exact: true }).click()
  await expect(entry).toBeFocused()
  await expect(dialog.locator(".writings-year > h3")).toHaveText(["2026", "2025"])
  // Going back returns the sheet to the archive's height.
  expect((await dialog.boundingBox())!.height).toBe(before.height)
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


test("a back button leads the title and returns to the list", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  const dialog = page.getByRole("dialog")
  const title = dialog.getByRole("heading", { name: "Notes", exact: true })
  const entry = dialog.getByRole("button", { name: "Designing Matcha", exact: true })
  await dialog.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  // The list has nowhere to go back to, so the control collapses out of the
  // accessibility tree and the title rests on the column's left edge.
  await expect(dialog.getByRole("button", { name: "Go back to Notes", exact: true })).toHaveCount(0)
  const anchor = (await title.boundingBox())!
  await entry.click()
  await expect(dialog.locator(".writing-reader-date time")).toHaveText("March 2, 2026")
  await expect(dialog.locator(".writing-reader-date time")).toHaveAttribute("datetime", "2026-03-02")
  const reader = dialog.locator('[data-page-id="2"]')
  await expect(reader).toHaveAttribute("aria-hidden", "false")
  await expect(dialog.locator('[data-page-id="1"]')).toHaveAttribute("inert", "")
  await expect(dialog.getByRole("img", { name: "Matcha discovery homepage with token search and market overview" })).toBeVisible()
  // Reading swaps the year crumb for a back arrow that leads the title.
  await expect(dialog.locator(".writings-toolbar")).toHaveText("Notes")
  const back = dialog.getByRole("button", { name: "Go back to Notes", exact: true })
  await expect(back).toBeVisible()
  // On a sheet this wide the arrow hangs in the left gutter, so the title holds
  // the column edge it had on the list instead of being pushed across.
  await expect.poll(async () => (await back.boundingBox())!.width).toBeGreaterThan(0)
  const arrow = (await back.boundingBox())!
  expect((await title.boundingBox())!.x).toBe(anchor.x)
  expect(arrow.x + arrow.width).toBeLessThanOrEqual(anchor.x)
  await back.click()
  await expect(entry).toBeFocused()
  await expect.poll(async () => (await title.boundingBox())!.x).toBe(anchor.x)
  await entry.click()
  await back.click()
  await dialog.getByRole("button", { name: "From quote to confirmation", exact: true }).click()
  await back.click()
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
  await dialog.getByRole("button", { name: "Go back to Notes", exact: true }).click()
  await expect(dialog.getByRole("button", { name: "A song we all know", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(dialog).toHaveAttribute("data-reading", "false")
  await dialog.getByRole("button", { name: "My project context is moving into Markdown", exact: true }).click()
  await page.keyboard.press("ArrowLeft")
  await expect(dialog.getByRole("heading", { name: "From quote to confirmation", exact: true })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(dialog.getByRole("heading", { name: "My project context is moving into Markdown", exact: true })).toBeFocused()
})

test("margin notes hang in the gutters without widening the reader", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  // 1440 is the sheet at its full width; 1000 is where the gutters first open
  // and the sheet is still narrower than it wants to be, so a note has the
  // least room it will ever have. The width is derived from what the reading
  // column leaves over precisely so both hold.
  for (const width of [1440, 1000]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto("/?writing=ai-design-needs-control")
    const dialog = page.getByRole("dialog")
    await expect(dialog.getByRole("heading", { name: "AI design needs more control", exact: true })).toBeVisible()
    const reader = dialog.locator('.writings-scroll[data-page-id="2"]')
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
    expect(noteBox.x).toBeGreaterThan(proseBox.x + proseBox.width)
    // And it uses the gutter rather than sitting in a sliver of it: a note is
    // most of the width the reading column leaves over on its side.
    const column = (await dialog.locator(".writing-reader").boundingBox())!
    const gutter = bounds!.x + bounds!.width - (column.x + column.width)
    expect(noteBox.width).toBeGreaterThan(gutter * 0.7)
  }
})

test("archive drawings stay in the gutters and leave the list at narrow widths", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  const dialog = page.getByRole("dialog")
  const archive = dialog.locator('.writings-scroll[data-page-id="1"]')
  await expect(dialog.getByRole("heading", { name: "Notes", exact: true })).toBeVisible()
  const drawings = dialog.locator(".writings-drawing")
  expect(await drawings.count()).toBeGreaterThan(0)
  // The drawings hang outside the reading column, so the failure to catch is a
  // sideways scrollbar on the archive rather than a drawing that looks wrong.
  await expect.poll(() => archive.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0)
  const bounds = (await archive.boundingBox())!
  const rows = (await dialog.locator(".writings-year li").first().boundingBox())!
  let sides = 0
  for (const box of await drawings.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect()))) {
    expect(box.left).toBeGreaterThanOrEqual(bounds.x)
    expect(box.right).toBeLessThanOrEqual(bounds.x + bounds.width)
    // Never over the titles: each one is wholly left of the rows or right of them.
    expect(box.right <= rows.x || box.left >= rows.x + rows.width).toBe(true)
    sides |= box.left >= rows.x + rows.width ? 2 : 1
  }
  expect(sides).toBe(3)

  // Below the width the margin notes move out at there is no gutter to draw in.
  await page.setViewportSize({ width: 820, height: 1000 })
  await expect(drawings.first()).toBeHidden()
})

test("margin notes fold into the column when the gutters are gone", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/?writing=ai-design-needs-control")
  const dialog = page.getByRole("dialog")
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
  await page.goto("/?writing=designing-matcha")
  const dialog = page.getByRole("dialog")
  const credits = dialog.getByRole("region", { name: "Acknowledgements" })
  await expect(credits).toContainText("0x Project")
  const creditsBox = (await credits.boundingBox())!
  const more = (await dialog.getByRole("region", { name: "More articles" }).boundingBox())!
  expect(creditsBox.y + creditsBox.height).toBeLessThanOrEqual(more.y)
})

test("keeps marginalia to two notes an article, one in each gutter", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const folder = page.getByRole("button", { name: "Open writings folder" })
  await folder.click()
  const dialog = page.getByRole("dialog")
  const entries = dialog.locator(".writings-year li button")
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
  }
})

test("prints a highlighted Markdown sample without a sideways read", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/?writing=project-context-in-markdown")
  const dialog = page.getByRole("dialog")
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
  const reader = dialog.locator('.writings-scroll[data-page-id="2"]')
  await expect.poll(() => reader.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0)

  // A phone is narrower than the longest line, so there the lines wrap instead.
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(block).toHaveCSS("white-space", "pre-wrap")
  await expect.poll(() => block.evaluate((element) => element.scrollWidth - element.clientWidth)).toBe(0)
})
