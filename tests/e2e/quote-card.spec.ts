import { expect, type Locator, type Page, test } from "@playwright/test"

const carousel = (page: Page) => page.getByRole("group", { name: "Quotes" })
const active = (page: Page) => carousel(page).locator('.mosaic-quote-slide[data-active="true"]')

async function openHome(page: Page, width = 1440) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
  await page.goto("/")
  await expect(carousel(page)).toBeAttached()
}

async function drag(surface: Locator, page: Page, dx: number, dy = 0) {
  await surface.scrollIntoViewIfNeeded()
  const box = await surface.boundingBox()
  if (!box) throw new Error("Quote surface has no rendered bounds")
  const x = box.x + box.width / 2
  const y = box.y + box.height * 0.25
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx, y + dy, { steps: 5 })
  await page.mouse.up()
}

test("publishes five quotes including restored Simon and Jakub quotes with carousel controls", async ({ page }) => {
  await openHome(page)
  await expect(carousel(page).locator(".mosaic-quote-slide")).toHaveCount(5)
  for (const name of ["Simon Rico", "Jakub Antalik"]) {
    await carousel(page).getByRole("button", { name: `Show quote from ${name}` }).click()
    await expect(active(page)).toContainText(name)
    await expect(active(page)).not.toContainText("Sample quote")
  }
  await expect(carousel(page).locator(".mosaic-quote-arrow")).toHaveCount(0)
  await expect(carousel(page).getByRole("button", { name: "Advance quote" })).toBeAttached()
  await carousel(page).getByRole("button", { name: /Show quote from Phil Liao/ }).click()
  await expect(active(page)).toContainText("Phil Liao")
})

test("exposes 10 by 40 dot targets with 4px gaps and selected emphasis", async ({ page }) => {
  await openHome(page)
  for (const dot of await carousel(page).locator(".mosaic-quote-dot").all()) {
    await expect(dot).toHaveCSS("width", "10px")
    await expect(dot).toHaveCSS("height", "40px")
  }
  const markers = carousel(page).locator(".mosaic-quote-dot span")
  await expect(markers.first()).toHaveCSS("width", "6px")
  const markerGap = await markers.evaluateAll((nodes) => {
    const first = nodes[0]?.getBoundingClientRect()
    const second = nodes[1]?.getBoundingClientRect()
    return first && second ? second.left - first.right : -1
  })
  expect(markerGap).toBeCloseTo(4, 0)
  await expect(carousel(page).locator('.mosaic-quote-dot[aria-pressed="true"] span')).toHaveCSS("opacity", "0.75")
  await expect(carousel(page).locator('.mosaic-quote-dot[aria-pressed="false"] span').first()).toHaveCSS("opacity", "0.3")
})

test("swiping backward wraps and tapping the card advances one quote", async ({ page }) => {
  await openHome(page)
  const surface = carousel(page).getByRole("button", { name: "Advance quote" })
  await drag(surface, page, 80)
  await expect(active(page)).toContainText("Jakub Antalik")
  await surface.click({ position: { x: 30, y: 30 } })
  await expect(active(page)).toContainText("Michael Wong")
})

test("a horizontal drag advances exactly once and a short drag snaps back", async ({ page }) => {
  await openHome(page)
  const surface = carousel(page).getByRole("button", { name: "Advance quote" })
  await drag(surface, page, -80)
  await expect(active(page)).toContainText("BASED FLOYD VIII")
  await page.waitForTimeout(450)
  await expect(active(page)).toContainText("BASED FLOYD VIII")
  await drag(surface, page, -12)
  await expect(active(page)).toContainText("BASED FLOYD VIII")
  await expect(active(page)).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)", { timeout: 1_000 })
})

test("an interrupted drag clears its gesture without selecting or clicking", async ({ page }) => {
  await openHome(page)
  const surface = carousel(page).getByRole("button", { name: "Advance quote" })
  const box = await surface.boundingBox()
  if (!box) throw new Error("Quote surface has no rendered bounds")
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x - 80, y, { steps: 4 })
  await surface.dispatchEvent("pointercancel", { pointerId: 1, pointerType: "mouse", isPrimary: true })
  await page.mouse.up()
  await expect(carousel(page)).toHaveAttribute("data-dragging", "false")
  await expect(active(page)).toContainText("Michael Wong")
})

test("catching an early slide transition follows the pointer without a jump", async ({ page }) => {
  await openHome(page)
  const card = carousel(page)
  const surface = card.getByRole("button", { name: "Advance quote" })
  await surface.scrollIntoViewIfNeeded()
  const box = await surface.boundingBox()
  if (!box) throw new Error("Quote surface has no rendered bounds")
  await card.locator(".mosaic-quote-dot").nth(1).click()
  const slide = active(page)
  const caught = await slide.evaluate((node) => {
    const animation = node.getAnimations()[0]
    if (!animation) throw new Error("Incoming slide did not start a transition")
    animation.pause()
    animation.currentTime = 8
    return Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m41)
  })
  expect(caught).toBeGreaterThan(box.width * 0.7)
  // Selecting a dot can scroll the card, so press through a hit-tested hover
  // rather than the bounds measured before it. A stale point lands off the
  // surface, and the press that never reaches it starts no drag at all.
  const grabX = box.width / 2
  const grabY = box.height * 0.25
  await surface.hover({ position: { x: grabX, y: grabY } })
  const grabbed = await surface.boundingBox()
  if (!grabbed) throw new Error("Quote surface has no rendered bounds")
  await page.mouse.down()
  // The caught transition keeps driving the transform until the drag commits and
  // cancels it. Sampling either side of the move before that commit reads the
  // still-paused transition twice and sees no movement at all.
  await expect(card).toHaveAttribute("data-dragging", "true")
  const offset = () => slide.evaluate((node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m41)
  const before = await offset()
  await page.mouse.move(grabbed.x + grabX + 8, grabbed.y + grabY)
  await expect.poll(async () => (await offset()) - before).toBeCloseTo(8, 0)
  await page.mouse.up()
})

test("a vertical touch scroll leaves the selected quote unchanged", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "CDP touch input is Chromium-specific")
  await openHome(page, 390)
  const surface = carousel(page).getByRole("button", { name: "Advance quote" })
  await surface.scrollIntoViewIfNeeded()
  const box = await surface.boundingBox()
  if (!box) throw new Error("Quote surface has no rendered bounds")
  const client = await page.context().newCDPSession(page)
  const x = box.x + box.width / 2
  const y = box.y + box.height * 0.7
  const before = await page.evaluate(() => scrollY)
  await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] })
  await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - 140 }] })
  await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before)
  await expect(active(page)).toContainText("Michael Wong")
})

test("the focused quote author opens the full X preview and Escape closes it", async ({ page }) => {
  await openHome(page)
  const author = active(page).getByRole("button", { name: "Michael Wong on X" })
  await expect(author).toHaveText("Michael Wong")
  await expect(author.locator("img, .mosaic-quote-role")).toHaveCount(0)
  await carousel(page).scrollIntoViewIfNeeded()
  await author.focus()
  const preview = page.locator(".mosaic-quote-profile-popup .mosaic-x-card")
  await expect(preview).toBeVisible()
  await expect(preview.getByRole("link", { name: "Follow" })).toBeVisible()
  await expect(page.locator(".mosaic-quote-profile-positioner")).toHaveAttribute("data-side", "top")
  await expect(preview).toContainText(/Following|Followers/)
  await page.keyboard.press("Tab")
  await expect(preview.getByRole("link", { name: "MW on X" })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(preview).toBeHidden()
  await expect(author).toBeFocused()
  const trigger = active(page).getByRole("button", { name: "Michael Wong on X" })
  await trigger.hover()
  const triggerStyle = await trigger.evaluate((node) => {
    const style = getComputedStyle(node)
    return { hitHeight: Number.parseFloat(getComputedStyle(node, "::before").minHeight), background: style.backgroundColor }
  })
  expect(triggerStyle.hitHeight).toBeGreaterThanOrEqual(40)
  expect(triggerStyle.background).not.toBe("rgba(0, 0, 0, 0)")
  await carousel(page).getByRole("button", { name: /Show quote from Phil Liao/ }).click()
  await active(page).getByRole("button", { name: "Phil Liao on X" }).focus()
  await expect(page.locator(".mosaic-quote-profile-popup .mosaic-x-card")).toContainText("Phil 🍵")
})

test("opens the interactive profile popover on touch", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.goto("/")
  const card = carousel(page)
  await card.getByRole("button", { name: "Michael Wong on X" }).tap()
  const preview = page.locator(".mosaic-quote-profile-popup .mosaic-x-card")
  await expect(preview).toBeVisible()
  await expect(preview.getByRole("link", { name: "Follow" })).toBeVisible()
  await context.close()
})


for (const width of [390, 768, 1440]) {
  test(`keeps content and controls contained through About at ${width}px`, async ({ page }) => {
    await openHome(page, width)
    expect(await carousel(page).evaluate((card) => {
      const outer = card.getBoundingClientRect()
      return [...card.querySelectorAll('[data-active="true"] blockquote, [data-active="true"] figcaption, .mosaic-quote-dots')].every((part) => {
        const rect = part.getBoundingClientRect()
        return rect.left >= outer.left - 1 && rect.right <= outer.right + 1 && rect.top >= outer.top - 1 && rect.bottom <= outer.bottom + 1
      })
    })).toBe(true)
    await page.goto("/#about-panel")
    const about = page.locator("#about-panel")
    await about.scrollIntoViewIfNeeded()
    await expect(about).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })
}

test("reduced motion settles quote changes immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openHome(page)
  await carousel(page).getByRole("button", { name: /Show quote from Phil Liao/ }).click()
  await expect(active(page)).toContainText("Phil Liao")
  expect(await carousel(page).locator(".mosaic-quote-slide").evaluateAll((slides) => slides.every((slide) =>
    getComputedStyle(slide).transitionDuration.split(", ").every((duration) => Number.parseFloat(duration) <= 0.001),
  ))).toBe(true)
})


test("keeps every quote inside the four-tile row at compact desktop widths", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const width of [700, 768, 899]) {
    await openHome(page, width)
    await carousel(page).scrollIntoViewIfNeeded()
    await page.evaluate(() => document.fonts.ready)
    const bounds = await carousel(page).evaluate((element) => {
      const card = element.getBoundingClientRect()
      return Array.from(element.querySelectorAll("blockquote, .mosaic-quote-credit")).map((node) => {
        const rect = node.getBoundingClientRect()
        return { top: rect.top - card.top, bottom: card.bottom - rect.bottom }
      })
    })
    for (const box of bounds) {
      expect(box.top, `${width}px top clearance`).toBeGreaterThanOrEqual(0)
      expect(box.bottom, `${width}px bottom clearance`).toBeGreaterThanOrEqual(0)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
