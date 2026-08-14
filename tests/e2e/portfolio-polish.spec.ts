import { expect, type BrowserContext, type Page, test } from "@playwright/test"

const mobileViewport = { width: 390, height: 844 }

// Work-history chips point at real company sites; the assertions only care that
// the browser went there, so serve a stub rather than depend on the network.
const stubCompanySite = (context: BrowserContext) =>
  context.route(/onit\.com/, (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Onit</title>" }),
  )

// The work cards cascade in on first load, so a card clicked straight after
// `goto` can still be sitting at its pre-start offset -- and the gallery grows
// out of that card's live rect. Settle the cascade before touching a card.
// Safe from hanging: nothing in index.css animates infinitely.
const settleWorkCards = (page: Page) =>
  page
    .locator(".mosaic-rows")
    .evaluate((element) =>
      Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)),
    )

test("hydrates the prerendered portfolio without browser errors", async ({ page, request }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })

  const response = await request.get("/")
  expect(await response.text()).toContain('<div id="root"><')

  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Rafael Medina portfolio" })).toBeAttached()
  expect(errors).toEqual([])
})

test("offers a LinkedIn message action beside copy email", async ({ page }) => {
  await page.goto("/")

  const actions = page.getByRole("group", { name: "Profile contact actions" })
  const socialActions = actions.getByRole("link")

  await expect(socialActions).toHaveCount(1)
  await expect(socialActions).toHaveAccessibleName("Message on LinkedIn")
  await expect(socialActions).toHaveAttribute("href", "https://www.linkedin.com/in/rafaelmedian")
})

test("scrolls to and focuses the about section from the avatar button", async ({ page }) => {
  // Reduced motion makes the scroll instant, so the assertion isn't racing a
  // smooth-scroll animation.
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const trigger = page.locator(".mosaic-avatar-button")

  await expect(trigger).toHaveAccessibleName("Read about Rafael Medina")
  await trigger.focus()
  await trigger.press("Enter")

  const about = page.locator("#about-panel")
  await expect(about).toBeInViewport()
  await expect(about).toBeFocused()
  await expect(about).not.toHaveCSS("outline-style", "none")
})

test("keeps the about section below the portfolio cards", async ({ page }) => {
  await page.goto("/")

  const work = page.locator("#work")
  const about = page.locator("#about-panel")

  await expect(work).toBeVisible()
  await expect(about).toBeVisible()

  const placement = await page.locator("#work, #about-panel").evaluateAll(([workNode, aboutNode]) => {
    const workRect = workNode.getBoundingClientRect()
    const aboutRect = aboutNode.getBoundingClientRect()
    return {
      followsWork: Boolean(workNode.compareDocumentPosition(aboutNode) & Node.DOCUMENT_POSITION_FOLLOWING),
      startsAfterWork: aboutRect.top >= workRect.bottom,
    }
  })

  expect(placement).toEqual({ followsWork: true, startsAfterWork: true })
})

test("exposes the profile name as a heading rather than burying it in a control", async ({ page }) => {
  await page.goto("/")

  // `role="button"` on the wrapper would make its descendants presentational,
  // dropping this heading out of the accessibility tree entirely.
  await expect(page.getByRole("heading", { name: "Rafael Medina", exact: true })).toBeVisible()
  await expect(page.locator(".mosaic-profile-meta")).not.toHaveAttribute("role", "button")

  // The pointer-only hit area must not become a second tab stop with the same
  // label as the avatar button.
  await expect(page.locator(".mosaic-profile-meta")).not.toHaveAttribute("tabindex", "0")
})

test("keeps gallery controls inside the mobile viewport and exposes a close button", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await settleWorkCards(page)
  await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  // All positional travel belongs to the wrapper, so the popup itself is never
  // transformed while origin motion is on.
  await expect(dialog).toHaveCSS("transform", "none")

  // The gallery flies in from the card it was opened from; measure it at rest.
  await page
    .locator(".preview-gallery-origin-wrap")
    .evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

  // The counter-scale has to land exactly back on identity, or the content is
  // left a fraction of a percent off its true size.
  await expect(page.locator(".preview-gallery-card-inner")).toHaveCSS("transform", "none")

  for (const name of ["Previous preview", "Next preview", "Close preview"]) {
    const control = dialog.getByRole("button", { name })
    await expect(control).toBeVisible()
    const box = await control.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThanOrEqual(44)
    expect(box!.height).toBeGreaterThanOrEqual(44)
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(mobileViewport.width)
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)

  const mediaFrame = dialog.locator(".preview-gallery-media-frame")
  await mediaFrame.evaluate((element) => {
    const startTouch = new Touch({ identifier: 1, target: element, clientX: 300 })
    const endTouch = new Touch({ identifier: 1, target: element, clientX: 180 })
    element.dispatchEvent(
      new TouchEvent("touchstart", {
        bubbles: true,
        changedTouches: [startTouch],
      }),
    )
    element.dispatchEvent(
      new TouchEvent("touchend", {
        bubbles: true,
        changedTouches: [endTouch],
      }),
    )
  })
  await expect(dialog.getByText("2 / 12", { exact: true })).toBeVisible()

  await dialog.getByRole("button", { name: "Close preview" }).click()
  await expect(dialog).toBeHidden()
})

test("treats a mostly vertical touch gesture as scrolling rather than gallery paging", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
    viewport: mobileViewport,
  })
  const page = await context.newPage()
  await page.goto("/")
  await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).tap()

  const card = page.locator(".preview-gallery-card")
  await card.evaluate((element) => {
    const start = new Touch({ identifier: 1, target: element, clientX: 240, clientY: 180 })
    const end = new Touch({ identifier: 1, target: element, clientX: 170, clientY: 480 })
    element.dispatchEvent(
      new TouchEvent("touchstart", { bubbles: true, changedTouches: [start], touches: [start] }),
    )
    element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }))
  })

  await expect(page.locator(".preview-gallery-count")).toHaveText("1 / 12")
  await context.close()
})

test("clears a cancelled gallery gesture before accepting the next horizontal swipe", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
    viewport: mobileViewport,
  })
  const page = await context.newPage()
  await page.goto("/")
  await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).tap()

  const card = page.locator(".preview-gallery-card")
  await card.evaluate((element) => {
    const cancelledStart = new Touch({
      identifier: 1,
      target: element,
      clientX: 260,
      clientY: 180,
    })
    element.dispatchEvent(
      new TouchEvent("touchstart", {
        bubbles: true,
        changedTouches: [cancelledStart],
        touches: [cancelledStart],
      }),
    )
    element.dispatchEvent(
      new TouchEvent("touchcancel", { bubbles: true, changedTouches: [cancelledStart] }),
    )

    const staleEnd = new Touch({ identifier: 1, target: element, clientX: 160, clientY: 180 })
    element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [staleEnd] }))
  })
  await expect(page.locator(".preview-gallery-count")).toHaveText("1 / 12")

  await card.evaluate((element) => {
    const start = new Touch({ identifier: 2, target: element, clientX: 280, clientY: 180 })
    const end = new Touch({ identifier: 2, target: element, clientX: 180, clientY: 190 })
    element.dispatchEvent(
      new TouchEvent("touchstart", { bubbles: true, changedTouches: [start], touches: [start] }),
    )
    element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }))
  })
  await expect(page.locator(".preview-gallery-count")).toHaveText("2 / 12")
  await context.close()
})

test("returns focus to the originating project after closing the gallery", async ({ page }) => {
  await page.goto("/")
  await settleWorkCards(page)
  const trigger = page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ })
  await trigger.focus()
  await trigger.press("Enter")
  // The gallery chunk is lazy: an Escape fired before it mounts closes
  // nothing, and the dialog then opens after the assertion.
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})

test("opens the gallery after an intent prefetch fails", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))

  let releaseFailedPrefetch: (() => void) | undefined
  const failedPrefetch = new Promise<void>((resolve) => {
    releaseFailedPrefetch = resolve
  })
  const galleryChunk = "**/assets/PreviewGalleryDialog-*.js"

  await page.route(galleryChunk, async (route) => {
    await route.abort("failed")
    releaseFailedPrefetch?.()
  })
  await page.goto("/")
  await settleWorkCards(page)

  const trigger = page.getByRole("button", { name: /Open Matcha - Mobile Screens preview/ })
  await trigger.hover()
  await failedPrefetch
  await page.unroute(galleryChunk)
  await trigger.click()

  await expect(page.getByRole("dialog")).toBeVisible()
  expect(errors).toEqual([])
})

test("switches the about card between about me and resume", async ({ page }) => {
  await page.goto("/")
  const panel = page.locator("#about-panel")

  await expect(panel).toContainText(/Hi, I.m Rafael/)

  await panel.getByRole("tab", { name: "resume" }).click()
  await expect(panel.getByRole("tab", { name: "resume" })).toHaveAttribute("aria-selected", "true")
  await expect(panel).not.toContainText(/Hi, I.m Rafael/)

  const entries = panel.locator(".mosaic-about-resume-entry")
  await expect(entries.first()).toContainText("0x Project")
  await expect(panel).toContainText("Incubeta")
  await expect(panel).toContainText("NOVA Community College")
  await expect(panel).toContainText("ITLA")
  await expect(panel).not.toContainText("hellorafaelmedina@gmail.com")
  await expect(panel).not.toContainText("786 9580")

  await expect(panel.getByRole("button", { name: /Briefcase sticker/ })).toBeVisible()
  await expect(panel.getByRole("button", { name: /Palm tree sticker/ })).toHaveCount(0)

  await panel.getByRole("tab", { name: "resume" }).press("ArrowLeft")
  await expect(panel.getByRole("tab", { name: "about me" })).toHaveAttribute("aria-selected", "true")
  await expect(panel).toContainText(/Hi, I.m Rafael/)
})

test("lets keyboard users move and reset about stickers", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.locator(".mosaic-avatar-button").click()

  const sticker = page.getByRole("button", { name: /Palm tree sticker/ })
  await expect(sticker).toBeVisible()
  await sticker.focus()

  const initialBox = await sticker.boundingBox()
  expect(initialBox).not.toBeNull()

  await sticker.press("ArrowRight")
  await expect
    .poll(async () => (await sticker.boundingBox())?.x)
    .toBeGreaterThan(initialBox!.x)

  await sticker.press("Home")
  await expect.poll(async () => (await sticker.boundingBox())?.x).toBeCloseTo(initialBox!.x, 0)
  await expect(sticker).toBeFocused()
})

test("keeps moved about stickers recoverable inside the panel", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.locator(".mosaic-avatar-button").click()

  const panel = page.locator(".mosaic-about-panel")
  const sticker = page.getByRole("button", { name: /Palm tree sticker/ })
  const panelBox = await panel.boundingBox()
  const stickerBox = await sticker.boundingBox()
  expect(panelBox).not.toBeNull()
  expect(stickerBox).not.toBeNull()

  await sticker.focus()
  for (let step = 0; step < 100; step += 1) {
    await sticker.press("ArrowRight")
  }

  const movedBox = await sticker.boundingBox()
  expect(movedBox).not.toBeNull()
  expect(movedBox!.x).toBeGreaterThan(stickerBox!.x + 500)
  expect(movedBox!.x).toBeGreaterThanOrEqual(panelBox!.x)
  expect(movedBox!.x + movedBox!.width).toBeLessThanOrEqual(panelBox!.x + panelBox!.width)
})

test("keeps desktop gallery navigation fixed near the modal top", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  const card = dialog.locator(".preview-gallery-card")
  const rail = dialog.locator(".preview-gallery-rail")
  const previous = rail.getByRole("button", { name: "Previous preview" })
  const next = rail.getByRole("button", { name: "Next preview" })

  await expect(rail).toBeVisible()
  await expect(previous).toHaveAttribute("aria-keyshortcuts", "ArrowUp ArrowLeft")
  await expect(next).toHaveAttribute("aria-keyshortcuts", "ArrowDown ArrowRight")
  await expect(card).toHaveCSS("border-bottom-left-radius", "28px")
  await expect(card).toHaveCSS("border-bottom-right-radius", "28px")

  const initialDialogBox = await dialog.boundingBox()
  const initialRailBox = await rail.boundingBox()
  expect(initialDialogBox).not.toBeNull()
  expect(initialRailBox).not.toBeNull()
  expect(initialDialogBox!.y).toBeCloseTo(80, 0)
  expect(initialRailBox!.x - (initialDialogBox!.x + initialDialogBox!.width)).toBeCloseTo(16, 0)
  expect(initialRailBox!.y + initialRailBox!.height / 2 - initialDialogBox!.y).toBeCloseTo(128, 0)

  await next.click()
  await next.click()
  await expect(dialog.locator(".preview-gallery-count")).toHaveText("3 / 12")

  const changedDialogBox = await dialog.boundingBox()
  const changedRailBox = await rail.boundingBox()
  expect(changedDialogBox).not.toBeNull()
  expect(changedRailBox).not.toBeNull()
  expect(changedDialogBox!.y).toBeCloseTo(initialDialogBox!.y, 0)
  expect(changedRailBox!.x).toBeCloseTo(initialRailBox!.x, 0)
  expect(changedRailBox!.y).toBeCloseTo(initialRailBox!.y, 0)

  await previous.click()
  await expect(dialog.locator(".preview-gallery-count")).toHaveText("2 / 12")
})

test("travels one role-bearing work-history popover between company triggers without shifting the page", async ({ page }) => {
  await page.goto("/")
  const location = page.locator(".mosaic-profile-location")
  await location.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const initialLocationBox = await location.boundingBox()
  const popover = page.locator(".mosaic-work-history-popover")
  const onit = page.getByRole("link", { name: "Onit", exact: true })

  await onit.hover()
  await expect(popover).toBeVisible()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Onit")
  await expect(popover.locator(".mosaic-work-history-popover-role")).toHaveText("Frontend dev and designer")
  const visitLink = popover.getByRole("link", { name: "Visit onit.com" })
  await expect(visitLink).toBeVisible()
  await expect(popover).toHaveCSS("text-align", "left")
  await expect(visitLink).toHaveCSS("background-color", "rgb(242, 242, 242)")
  await expect(page.locator(".mosaic-work-history")).toHaveCSS("z-index", "40")
  await expect(popover).toHaveAttribute("data-side", "above")
  await expect(popover.locator(".mosaic-work-history-popover-arrow")).toHaveCSS("border-radius", "3px")
  const longestPopoverTransition = await popover.evaluate((element) =>
    Math.max(
      ...getComputedStyle(element)
        .transitionDuration.split(",")
        .map((duration) => Number.parseFloat(duration) * (duration.includes("ms") ? 0.001 : 1)),
    ),
  )
  expect(longestPopoverTransition).toBeLessThanOrEqual(0.14)

  const onitPopoverBox = await popover.boundingBox()
  const onitLocationBox = await location.boundingBox()
  expect(initialLocationBox).not.toBeNull()
  expect(onitPopoverBox).not.toBeNull()
  expect(onitLocationBox!.y).toBeCloseTo(initialLocationBox!.y, 0)

  await page.getByRole("link", { name: "Moody's", exact: true }).hover()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Moody's")
  await expect(popover.locator(".mosaic-work-history-popover-role")).toHaveText("Frontend dev and designer")
  expect(
    await popover.evaluate(
      (element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState !== "finished").length,
    ),
  ).toBe(0)
  expect((await page.locator(".mosaic-work-history-popover").count())).toBe(1)
  expect((await popover.boundingBox())!.x).not.toBe(onitPopoverBox!.x)
  expect((await location.boundingBox())!.y).toBeCloseTo(initialLocationBox!.y, 0)

  await page.getByRole("link", { name: "0x.org and Matcha.xyz", exact: true }).hover()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("0x.org and Matcha.xyz")

  await page.getByRole("link", { name: "Google", exact: true }).hover()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Google")
  await expect(popover.locator(".mosaic-work-history-popover-role")).toHaveText("Design collab")

  await page.getByRole("link", { name: "Protector and Patrol", exact: true }).hover()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Protector and Patrol")
  await expect(popover.locator(".mosaic-work-history-popover-role")).toHaveText("Design collab")
})

test("opens the work-history popover from the keyboard and links each chip to its company", async ({
  context,
  page,
}) => {
  await page.goto("/")
  const onit = page.getByRole("link", { name: "Onit", exact: true })
  const popover = page.locator(".mosaic-work-history-popover")

  await onit.focus()
  await expect(popover).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(popover).toBeHidden()
  await expect(onit).toBeFocused()

  await expect(onit).toHaveAttribute("href", "https://www.onit.com")
  await expect(onit).toHaveAttribute("target", "_blank")
  await expect(page.getByRole("link", { name: "Google", exact: true })).toHaveAttribute("href", "https://www.google.com")

  // Pointer users already saw the panel on hover, so the click travels.
  await stubCompanySite(context)
  const opened = page.waitForEvent("popup")
  await onit.click()
  const companyTab = await opened
  await companyTab.waitForLoadState()
  expect(companyTab.url()).toContain("onit.com")
  await expect(companyTab).toHaveTitle("Onit")
  await companyTab.close()
})

test("reveals the work-history popover for a touch pointer on a hover-capable device", async ({ page }) => {
  await page.goto("/")
  const onit = page.getByRole("link", { name: "Onit", exact: true })
  const popover = page.locator(".mosaic-work-history-popover")

  await onit.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), { once: true })
    element.dispatchEvent(
      new PointerEvent("click", { bubbles: true, cancelable: true, pointerType: "touch" }),
    )
  })

  await expect(popover).toBeVisible()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Onit")
})

test("settles work-history tilt when the pointer exits before the next frame", async ({ page }) => {
  await page.goto("/")

  const tilt = await page.locator(".mosaic-work-history-chip").first().evaluate(async (trigger) => {
    const container = trigger.closest<HTMLElement>(".mosaic-work-history")
    if (!container) throw new Error("Missing work-history container")

    const box = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: box.right,
        clientY: box.top,
      }),
    )
    trigger.dispatchEvent(
      new PointerEvent("pointerout", {
        bubbles: true,
        clientX: box.right + 1,
        clientY: box.top,
        relatedTarget: document.body,
      }),
    )

    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

    return {
      anchorX: container.style.getPropertyValue("--mosaic-popover-anchor-x"),
      tiltY: container.style.getPropertyValue("--mosaic-popover-tilt-y"),
    }
  })

  expect(tilt).toEqual({ anchorX: "0px", tiltY: "0deg" })
})

test("settles queued work-history tilt when Escape closes the popover", async ({ page }) => {
  await page.goto("/")

  const trigger = page.locator(".mosaic-work-history-chip").first()
  const popover = page.locator(".mosaic-work-history-popover")
  await trigger.focus()
  await expect(popover).toBeVisible()

  const tilt = await trigger.evaluate(async (element) => {
    const container = element.closest<HTMLElement>(".mosaic-work-history")
    if (!container) throw new Error("Missing work-history container")

    const box = element.getBoundingClientRect()
    element.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: box.right,
        clientY: box.top,
      }),
    )
    document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }))

    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

    return {
      anchorX: container.style.getPropertyValue("--mosaic-popover-anchor-x"),
      tiltY: container.style.getPropertyValue("--mosaic-popover-tilt-y"),
    }
  })

  await expect(popover).toBeHidden()
  expect(tilt).toEqual({ anchorX: "0px", tiltY: "0deg" })
})

test("toggles the work-history popover on tap and navigates through its link", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: mobileViewport })
  await stubCompanySite(context)
  const page = await context.newPage()
  await page.goto("/")

  const onit = page.getByRole("link", { name: "Onit", exact: true })
  const popover = page.locator(".mosaic-work-history-popover")

  await onit.tap()
  await expect(popover).toBeVisible()
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Onit")

  // A second tap on the chip dismisses the popover instead of navigating away.
  await onit.tap()
  await expect(popover).toBeHidden()

  await onit.tap()
  await expect(popover).toBeVisible()

  const opened = page.waitForEvent("popup")
  await popover.getByRole("link", { name: "Visit onit.com" }).tap()
  const companyTab = await opened
  await companyTab.waitForLoadState()
  expect(companyTab.url()).toContain("onit.com")

  await context.close()
})

test("keeps the work-history popover positioned with reduced motion", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const onit = page.getByRole("link", { name: "Onit", exact: true })
  const popover = page.locator(".mosaic-work-history-popover")
  await onit.focus()
  await expect(popover).toBeVisible()

  const triggerBox = await onit.boundingBox()
  const popoverBox = await popover.boundingBox()
  expect(triggerBox).not.toBeNull()
  expect(popoverBox).not.toBeNull()
  expect(popoverBox!.x).toBeGreaterThanOrEqual(0)
  expect(popoverBox!.x + popoverBox!.width).toBeLessThanOrEqual(mobileViewport.width)
  expect(popoverBox!.y + popoverBox!.height).toBeLessThanOrEqual(triggerBox!.y)
})

test("moves the work-history popover below its trigger near the viewport top", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const onit = page.getByRole("link", { name: "Onit", exact: true })
  const popover = page.locator(".mosaic-work-history-popover")
  await onit.focus()
  await expect(popover).toBeVisible()
  await expect(popover).toHaveAttribute("data-side", "above")

  await page.evaluate(() => window.scrollBy(0, 180))
  await expect(popover).toHaveAttribute("data-side", "below")
  await popover.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

  const triggerBox = await onit.boundingBox()
  const popoverBox = await popover.boundingBox()
  expect(triggerBox).not.toBeNull()
  expect(popoverBox).not.toBeNull()
  expect(popoverBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height)
  expect(popoverBox!.y + popoverBox!.height).toBeLessThanOrEqual(mobileViewport.height)
})

test("shows project captions and contains Protector artwork on touch layouts", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const firstCaption = page.locator(".mosaic-row-card-title").first()
  await expect(firstCaption).toBeVisible()
  await expect(firstCaption).toHaveCSS("opacity", "1")

  const protectorMedia = page.locator(".mosaic-row-card-preview-protector .mosaic-row-media")
  await expect(protectorMedia).toHaveCSS("object-fit", "contain")
  await expect(protectorMedia).toHaveCSS("transform", "none")
})

test("renders intrinsic media dimensions and does not autoplay under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const image = page.locator(".mosaic-row-card img.mosaic-row-media").first()
  await expect(image).toHaveAttribute("width", /\d+/)
  await expect(image).toHaveAttribute("height", /\d+/)

  const video = page.locator(".mosaic-row-card video.mosaic-row-media").first()
  await expect(video).toHaveAttribute("poster", /\S+/)
  expect(await video.evaluate((element: HTMLVideoElement) => element.autoplay)).toBe(false)

  await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).click()
  const previewVideo = page.getByRole("dialog").locator("video")
  expect(await previewVideo.evaluate((element: HTMLVideoElement) => element.autoplay)).toBe(false)
  expect(await previewVideo.evaluate((element: HTMLVideoElement) => element.controls)).toBe(true)
})

test("loads video sources near the viewport and pauses them after they leave it", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const deferredVideo = page.locator(".mosaic-row-card video.mosaic-row-media").last()
  await expect(deferredVideo).not.toHaveAttribute("src")

  await deferredVideo.scrollIntoViewIfNeeded()
  await expect(deferredVideo).toHaveAttribute("src", /shot-small-20\.webm/)

  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(() => deferredVideo.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true)
})

for (const viewport of [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`keeps the primary layout inside a ${viewport.width}px viewport`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/")

    for (const selector of [".mosaic-social-corner", ".mosaic-work-history", ".mosaic-rows"]) {
      const box = await page.locator(selector).boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width)
    }

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    ).toBe(false)
  })
}

test("constrains the desktop mosaic at wide viewport sizes", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto("/")

  const shell = await page.locator(".mosaic-shell").boundingBox()
  const firstRow = await page.locator(".mosaic-row").first().boundingBox()
  expect(shell).not.toBeNull()
  expect(shell!.width).toBeLessThanOrEqual(1560)
  expect(firstRow).not.toBeNull()
  // Rows are a flat 420px from the 900px breakpoint up (see .mosaic-row in index.css).
  expect(firstRow!.height).toBe(420)
})

// The first-load card cascade is CSS driven off a class and two custom
// properties in the prerendered HTML, because animations start at first paint
// long before hydration. Moving any of it into an effect breaks this test.
test("ships the work-card intro in the prerendered markup", async ({ request }) => {
  const html = await (await request.get("/")).text()
  expect(html).toContain("mosaic-work-intro")
  expect(html).toContain("--work-intro-row:3")
  expect(html).toContain("--work-intro-col:2")
})

test("keeps the work-card entrance free of scale and horizontal travel", async ({ page }) => {
  await page.goto("/")

  // Read the keyframe source rather than a live animation: the mosaic row height
  // is asserted at exactly 420px above, and only opacity plus translateY leave
  // that measurement alone.
  const keyframes = await page.evaluate(() => {
    const wanted = ["mosaic-intro-rise"]
    const found: Record<string, string[]> = {}
    for (const sheet of [...document.styleSheets]) {
      for (const rule of [...sheet.cssRules]) {
        if (rule instanceof CSSKeyframesRule && wanted.includes(rule.name)) {
          found[rule.name] = [...rule.cssRules].map((frame) => (frame as CSSKeyframeRule).style.transform)
        }
      }
    }
    return found
  })

  expect(Object.keys(keyframes)).toEqual(["mosaic-intro-rise"])
  for (const transforms of Object.values(keyframes)) {
    for (const transform of transforms) {
      expect(transform === "" || /^translateY\([^)]+\)$/.test(transform)).toBe(true)
    }
  }
})

// No work card may be on screen before the header is. The top row was once
// exempted from the fade to protect LCP, which made it opaque at first paint --
// cards visible above a header that had not arrived yet. That exemption costs
// +1240ms of LCP to undo and is deliberately not coming back; see index.css.
test("hides every work card at first paint, including the top row", async ({ page }) => {
  await page.goto("/")

  const rows = await page.evaluate(() =>
    [...document.querySelectorAll(".mosaic-row")].map((row) => ({
      names: [
        ...new Set(
          [...row.querySelectorAll(".mosaic-row-item")].map((el) => getComputedStyle(el).animationName),
        ),
      ],
      // The from-state is what is on screen at first paint, since every card
      // holds it through its delay via `both`.
      opacities: [
        ...new Set(
          [...row.querySelectorAll(".mosaic-row-item")].map((el) => getComputedStyle(el).opacity),
        ),
      ],
    })),
  )

  expect(rows.length).toBeGreaterThan(1)
  for (const row of rows) {
    expect(row.names).toEqual(["mosaic-intro-rise"])
    expect(row.opacities).toEqual(["0"])
  }
})

test("does not delay content behind an entrance under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  // A one-shot read on purpose. The global reduced-motion reset zeroes
  // animation-duration but not animation-delay, so a delayed `both`-filled
  // entrance stays invisible for its whole delay -- and toHaveCSS would retry
  // right past that window.
  for (const selector of [".mosaic-row-item", ".mosaic-hero-profile-animated > *"]) {
    const state = await page
      .locator(selector)
      .first()
      .evaluate((element) => {
        const style = getComputedStyle(element)
        return { animationName: style.animationName, opacity: style.opacity }
      })
    expect(state.animationName).toBe("none")
    expect(state.opacity).toBe("1")
  }
})

test("does not replay the work-card intro when reduced motion is disabled later", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const rows = page.locator(".mosaic-rows")
  await expect(rows).not.toHaveClass(/mosaic-work-intro/)

  await page.emulateMedia({ reducedMotion: "no-preference" })
  const states = await page.locator(".mosaic-row-item").evaluateAll((items) =>
    items.map((item) => {
      const style = getComputedStyle(item)
      return { animationName: style.animationName, opacity: style.opacity }
    }),
  )

  expect(states.every(({ animationName, opacity }) => animationName === "none" && opacity === "1")).toBe(true)
})

// The hero and the mosaic are two beats, not one. When the first card started
// before the last hero item, the cascades overlapped and read as a single wash.
test("starts the work-card intro after the hero cascade is fully in flight", async ({ page }) => {
  await page.goto("/")

  const { lastHeroDelay, firstCardDelay } = await page.evaluate(() => {
    const delayOf = (element: Element) => parseFloat(getComputedStyle(element).animationDelay)
    const hero = [...document.querySelectorAll(".mosaic-hero-profile-animated > *")]
    const cards = [...document.querySelectorAll(".mosaic-row-item")]
    return {
      lastHeroDelay: Math.max(...hero.map(delayOf)),
      firstCardDelay: Math.min(...cards.map(delayOf)),
    }
  })

  expect(lastHeroDelay).toBeGreaterThan(0)
  expect(firstCardDelay).toBeGreaterThan(lastHeroDelay)
})

test("keeps the work-card entrance inside its delay budget", async ({ page }) => {
  await page.goto("/")

  const maxDelay = await page.evaluate(() =>
    Math.max(
      ...[...document.querySelectorAll(".mosaic-row-item")].map((element) =>
        parseFloat(getComputedStyle(element).animationDelay),
      ),
    ),
  )
  // Last card starts at 520ms + 3 x 70ms + 2 x 32ms = 754ms. The ceiling is
  // deliberately loose -- it guards against a runaway intro, not the exact base.
  expect(maxDelay).toBeLessThanOrEqual(0.85)
})
