import { expect, test } from "@playwright/test"
import { writingSummaries } from "../../src/data/writingIndex"
import { groupWritingsByYear } from "../../src/lib/writings"

test("gallery controls scroll an overflowing notes list with the keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/")
  const popup = page.locator(".preview-gallery-popup")
  const scroller = popup.locator(".notes-gallery-viewport")
  const next = popup.getByRole("button", { name: "Next preview", exact: true })
  await next.focus()
  await expect.poll(() => scroller.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0)
  for (const key of ["ArrowDown", "PageDown", "End"]) {
    await page.keyboard.press(key)
    await expect.poll(() => scroller.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
    await expect(next).toBeFocused()
    await page.keyboard.press("Home")
    await expect.poll(() => scroller.evaluate(element => element.scrollTop)).toBe(0)
  }
})

for (const width of [1440, 390]) {
  test(`note paging stays horizontal without a vertical dip at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await page.goto("/notes/designing-matcha/")
    const popup = page.locator(".preview-gallery-popup")
    await expect(popup.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
    await expect(popup).toHaveCSS("opacity", "1")
    await popup.evaluate(element => element.closest(".preview-gallery-shell")!.getAnimations({ subtree: true })
      .forEach(animation => animation.finish()))

    for (const key of ["ArrowRight", "ArrowLeft"]) {
      const frames = await popup.locator(".notes-gallery-page").evaluate(async (element, arrow) => {
        const original = element.getBoundingClientRect()
        const card = element.closest(".preview-gallery-card")!
        const originalCard = card.getBoundingClientRect()
        const samples: Array<{ x: number; y: number; cardY: number; cardHeight: number }> = []
        element.dispatchEvent(new KeyboardEvent("keydown", { key: arrow, bubbles: true }))
        const end = performance.now() + 650
        await new Promise<void>(resolve => {
          const sample = () => {
            const box = element.getBoundingClientRect()
            const cardBox = card.getBoundingClientRect()
            samples.push({ x: box.x - original.x, y: box.y - original.y,
              cardY: cardBox.y - originalCard.y, cardHeight: cardBox.height - originalCard.height })
            if (performance.now() < end) requestAnimationFrame(sample)
            else resolve()
          }
          requestAnimationFrame(sample)
        })
        return samples
      }, key)
      expect(frames.some(frame => Math.abs(frame.x) > 5)).toBe(true)
      expect(Math.max(...frames.map(frame => Math.abs(frame.y)))).toBeLessThan(1)
      expect(frames.every(frame => Math.abs(frame.cardY) < 1 && Math.abs(frame.cardHeight) < 1)).toBe(true)
    }
  })
}

test("nested page turns keep one opaque frame and bring Back in horizontally", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/notes/")
  const popup = page.locator(".preview-gallery-popup")
  await expect(popup.getByRole("button", { name: "Designing Matcha", exact: true })).toBeVisible()
  await expect(popup).toHaveCSS("opacity", "1")
  await popup.evaluate(element => element.closest(".preview-gallery-shell")!.getAnimations({ subtree: true })
    .forEach(animation => animation.finish()))

  const frames = await popup.evaluate(async element => {
    const original = element.getBoundingClientRect()
    const title = element.querySelector(".preview-gallery-notes-title")!
    const titleTop = title.getBoundingClientRect().top
    const samples: Array<{ same: boolean; top: number; width: number; height: number; opacity: number;
      titleTop: number; backX: number; backY: number; dialogs: number; backdrops: number }> = []
    const button = element.querySelector<HTMLButtonElement>('[data-writing-id="designing-matcha"]')!
    button.click()
    const end = performance.now() + 700
    await new Promise<void>(resolve => {
      const sample = () => {
        const box = element.getBoundingClientRect()
        const back = getComputedStyle(element.querySelector(".notes-gallery-back")!)
        const pose = new DOMMatrixReadOnly(back.transform)
        samples.push({ same: element === document.querySelector('[role="dialog"]'),
          top: box.top - original.top, width: box.width - original.width, height: box.height,
          opacity: Number(getComputedStyle(element.querySelector(".preview-gallery-card")!).opacity),
          titleTop: title.getBoundingClientRect().top - titleTop, backX: pose.m41, backY: pose.m42,
          dialogs: document.querySelectorAll('[role="dialog"]').length,
          backdrops: document.querySelectorAll(".preview-gallery-backdrop").length })
        if (performance.now() < end) requestAnimationFrame(sample)
        else resolve()
      }
      requestAnimationFrame(sample)
    })
    return samples
  })
  expect(frames.length).toBeGreaterThan(5)
  expect(frames.every(frame => frame.same && frame.dialogs === 1 && frame.backdrops === 1)).toBe(true)
  expect(frames.every(frame => Math.abs(frame.top) < 1 && Math.abs(frame.width) < 1 && Math.abs(frame.titleTop) < 1)).toBe(true)
  expect(frames.every(frame => frame.opacity === 1 && frame.backY === 0)).toBe(true)
  expect(frames.some(frame => frame.backX < -5)).toBe(true)
  expect(frames.at(-1)!.backX).toBeCloseTo(0)
  expect(frames.at(-1)!.height).toBeGreaterThan(frames[0].height)
  await expect(popup.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeFocused()
})

test("rapid paging settles on the latest note and dismissal cancels the turn", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/notes/designing-matcha/")
  const popup = page.locator(".preview-gallery-popup")
  await expect(popup.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  const notes = groupWritingsByYear(writingSummaries).flatMap(group => group.entries)
  const index = notes.findIndex(note => note.id === "designing-matcha")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("ArrowRight")
  const next = notes[(index + 2) % notes.length]
  await expect(page).toHaveURL(new RegExp(`/notes/${next.id}/$`))
  await expect(popup.getByRole("heading", { name: next.title, exact: true })).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.press("Escape")
  await expect(page).toHaveURL(/\/notes\/$/)
  await expect(popup).not.toHaveAttribute("data-reading-note")
  await expect(popup.locator(".notes-gallery-page")).toHaveAttribute("data-switch-phase", "idle")
  await page.keyboard.press("Escape")
  await expect(popup).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
  await page.waitForTimeout(450)
  await expect(popup).toBeHidden()
})

test("the list keeps its scroll position and the reader adapts without another dialog", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/notes/")
  const popup = page.locator(".preview-gallery-popup")
  const entry = popup.getByRole("button", { name: "Designing Matcha", exact: true })
  await entry.scrollIntoViewIfNeeded()
  const scroller = popup.locator(".notes-gallery-viewport")
  const listScroll = await scroller.evaluate(element => element.scrollTop)
  const original = await popup.elementHandle()
  await entry.click()
  await expect(popup.getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  for (const width of [1440, 1024, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await expect.poll(async () => {
      const box = (await popup.boundingBox())!
      return box.y + box.height
    }).toBeCloseTo(width < 700 ? 900 : 884, 0)
    expect(await original!.evaluate(element => element === document.querySelector('[role="dialog"]'))).toBe(true)
    await expect.poll(() => scroller.evaluate(element => element.scrollWidth - element.clientWidth)).toBe(0)
  }
  await page.setViewportSize({ width: 390, height: 568 })
  await popup.getByRole("button", { name: "Go back to Notes", exact: true }).click()
  await expect(entry).toBeFocused()
  await expect.poll(() => scroller.evaluate(element => element.scrollTop)).toBe(listScroll)
})
