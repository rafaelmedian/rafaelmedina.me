import { expect, type BrowserContext, type Page, test } from "@playwright/test"

const mobileViewport = { width: 390, height: 844 }
const openStreetMapTileUrl = /tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/
const transparentMapTile = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
)

// Work-history chips point at real company sites; the assertions only care that
// the browser went there, so serve a stub rather than depend on the network.
const stubCompanySite = (context: BrowserContext) =>
  context.route(/onit\.com/, (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Onit</title>" }),
  )

// The work cards cascade in on first load, so a card clicked straight after
// `goto` can still be sitting at its pre-start offset -- and the gallery grows
// out of that card's live rect. Settle the cascade before touching a card.
// Safe from hanging: the gallery's View Timeline lives on the parent stage,
// outside this subtree, while every animation inside `.mosaic-rows` finishes.
const settleWorkCards = (page: Page) =>
  page
    .locator(".mosaic-rows")
    .evaluate((element) => Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)))

const pausePageClock = async (page: Page) => {
  await page.clock.install({ time: new Date("2026-08-18T12:00:00Z") })
  await page.clock.pauseAt(new Date("2026-08-18T12:01:00Z"))
}

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

test("does not claim a sitemap modification date for every deployment", async ({ request }) => {
  const response = await request.get("/sitemap.xml")

  expect(response.ok()).toBe(true)
  expect(await response.text()).not.toContain("<lastmod>")
})

test("offers LinkedIn and X actions beside copy email", async ({ page }) => {
  await page.goto("/")

  const actions = page.locator(".mosaic-profile-contact").getByRole("group", { name: "Profile contact actions" })
  const linkedInAction = actions.getByRole("link", { name: "Message on LinkedIn" })
  const xAction = actions.getByRole("link", { name: "Follow on X" })

  await expect(linkedInAction).toHaveAttribute("href", "https://www.linkedin.com/in/rafaelmedian")
  await expect(xAction).toHaveAttribute("href", "https://x.com/rafaelmedian")
})

test("uses the same side padding for every contact action", async ({ page }) => {
  await page.setViewportSize({ width: 487, height: 1381 })
  await page.goto("/")

  const sidePadding = await page
    .getByRole("group", { name: "Profile contact actions" })
    .locator(".mosaic-contact-pill")
    .evaluateAll((actions) =>
      actions.map((action) => {
        const styles = getComputedStyle(action)
        return [Number.parseFloat(styles.paddingLeft), Number.parseFloat(styles.paddingRight)]
      }),
    )

  expect(sidePadding).toHaveLength(3)
  for (const [left, right] of sidePadding) {
    expect(left).toBeCloseTo(right, 5)
    expect(left).toBeCloseTo(sidePadding[0][0], 5)
    expect(left).toBeCloseTo(16, 5)
  }
})

test("matches the desktop contact-pill height at compact desktop widths", async ({ page }) => {
  await page.setViewportSize({ width: 572, height: 1381 })
  await page.goto("/")

  const message = page.getByRole("link", { name: "Message on LinkedIn" })
  await expect(message).toHaveCSS("height", "32px")
  await expect(message).toHaveCSS("min-height", "32px")
})

test("keeps comfortable contact targets on wide touch viewports", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 568, height: 320 },
  })
  const page = await context.newPage()
  await page.goto("/")

  const actions = page
    .getByRole("group", { name: "Profile contact actions" })
    .locator(".mosaic-contact-pill")
  for (const action of await actions.all()) {
    const box = await action.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  }

  await context.close()
})

test("optically centers the X mark in the Follow pill", async ({ page }) => {
  await page.goto("/")

  const xIcon = page.getByRole("link", { name: "Follow on X" }).locator(".mosaic-contact-pill-icon-x")
  const verticalOffset = await xIcon.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m42)

  expect(verticalOffset).toBe(1)
})

test("keeps primary contact actions on one comfortable mobile row", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/")

  const boxes = await page
    .getByRole("group", { name: "Profile contact actions" })
    .locator(".mosaic-contact-pill")
    .evaluateAll((actions) => actions.map((action) => action.getBoundingClientRect().toJSON()))

  expect(boxes).toHaveLength(3)
  expect(new Set(boxes.map(({ y }) => Math.round(y))).size).toBe(1)
  for (const box of boxes) expect(box.height).toBeGreaterThanOrEqual(44)
})

test("keeps company chips compact with comfortable mobile targets", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const chips = page.locator(".mosaic-work-history-chip")
  expect(await chips.count()).toBeGreaterThan(0)
  for (const chip of await chips.all()) {
    const box = await chip.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeLessThanOrEqual(32)
    await expect(chip).toHaveCSS("min-height", "32px")
    await expect(chip).toHaveCSS("position", "relative")
    expect(
      await chip.evaluate((element) => Number.parseFloat(getComputedStyle(element, "::after").height)),
    ).toBeGreaterThanOrEqual(40)
  }
})

test("reserves balanced wrapping for headings", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  await expect(page.locator("#about-section .mosaic-about-section-copy > p").nth(1)).toHaveCSS("text-wrap", "pretty")
  await expect(page.getByRole("button", { name: "Copy email" })).not.toHaveCSS("text-wrap", "balance")
})

test("matches the mobile browser theme color to the page canvas", async ({ page, request }) => {
  await page.goto("/")

  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#ffffff")

  const manifest = await request.get("/site.webmanifest")
  expect(manifest.ok()).toBe(true)
  expect(await manifest.json()).toMatchObject({
    background_color: "#ffffff",
    theme_color: "#ffffff",
  })
})

test("previews the copy reaction without copying on hover", async ({ page }) => {
  await page.goto("/")

  const copyButton = page.locator(".mosaic-profile-contact").getByRole("button")
  const reaction = page.locator(".mosaic-copy-reaction")

  await expect(reaction).toHaveCount(0)
  await copyButton.hover()
  await expect(reaction).toBeVisible()
  await expect(copyButton).toHaveText("Copy email")
  await expect(reaction.locator("source")).toHaveAttribute("srcset", "/reactions/copy-email-before-still.webp")
  await expect(reaction.locator("img")).toHaveAttribute("src", "/reactions/copy-email-before.webp")
})

test("celebrates a copied email below the trigger on the highest hero layer", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-write"])
  await page.goto("/")
  await pausePageClock(page)

  const copyButton = page.locator(".mosaic-profile-contact").getByRole("button")
  const reaction = page.locator(".mosaic-copy-reaction")

  await expect(copyButton).toHaveAccessibleName("Copy email")
  await expect(reaction).toHaveCount(0)
  await copyButton.click()

  await expect(copyButton).toHaveText("Copied!")
  await expect(reaction).toBeVisible()
  await expect(reaction.evaluate((element) => getComputedStyle(element, "::after").content)).resolves.toBe("none")
  const buttonBox = await copyButton.boundingBox()
  const reactionBox = await reaction.boundingBox()
  expect(buttonBox).not.toBeNull()
  expect(reactionBox).not.toBeNull()
  expect(reactionBox!.y).toBeGreaterThanOrEqual(buttonBox!.y + buttonBox!.height)

  const contactLayer = await page.locator(".mosaic-profile-contact").evaluate((element) =>
    Number.parseInt(getComputedStyle(element).zIndex, 10),
  )
  const navigationLayer = await page.locator(".mosaic-social-corner").evaluate((element) =>
    Number.parseInt(getComputedStyle(element).zIndex, 10),
  )
  const reactionLayer = await reaction.evaluate((element) => Number.parseInt(getComputedStyle(element).zIndex, 10))
  const socialCardLayer = await page.locator(".mosaic-x-card").evaluate((element) =>
    Number.parseInt(getComputedStyle(element).zIndex, 10),
  )
  expect(contactLayer).toBeGreaterThan(navigationLayer)
  expect(reactionLayer).toBeGreaterThan(socialCardLayer)

  const image = reaction.locator("img")
  await expect(image).toHaveAttribute("src", "/reactions/copy-email-success.webp")
  await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0)
  await page.clock.fastForward(1_800)
  await expect(copyButton).toHaveText("Copy email")
  await expect(reaction).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(reaction).toHaveCount(0)
})

test("dismisses the copied-email reaction as soon as another contact pill is hovered", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-write"])
  await page.goto("/")
  await pausePageClock(page)

  const copyButton = page.getByRole("button", { name: "Copy email" })
  const reaction = page.locator(".mosaic-copy-reaction")

  await copyButton.click()
  await expect(reaction).toBeVisible()

  await page.getByRole("link", { name: "Message on LinkedIn" }).hover()
  await expect(reaction).toHaveCount(0, { timeout: 400 })
})

test("keeps the copy reaction inside a narrow viewport", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-write"])
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await pausePageClock(page)

  const copyButton = page.locator(".mosaic-profile-contact").getByRole("button")
  await copyButton.click()
  await expect(copyButton).toHaveText("Copied!")
  const reaction = page.locator(".mosaic-copy-reaction")
  await reaction.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const reactionBox = await reaction.boundingBox()

  expect(reactionBox).not.toBeNull()
  expect(reactionBox!.x).toBeGreaterThanOrEqual(0)
  expect(reactionBox!.x + reactionBox!.width).toBeLessThanOrEqual(mobileViewport.width)
})

test("previews the X profile while the Follow pill is hovered", async ({ page }) => {
  await page.goto("/")

  const xAction = page.getByRole("link", { name: "Follow on X" })
  const card = page.locator(".mosaic-x-card")

  await expect(card).toHaveAttribute("data-state", "closed")

  await xAction.hover()
  await expect(card).toHaveAttribute("data-state", "open")
  await expect(card).toContainText("@rafaelmedian")

  // The card sits below the pill and must clear the work grid, not hide behind it.
  const cardBox = await card.boundingBox()
  const pillBox = await xAction.boundingBox()
  expect(cardBox!.y).toBeGreaterThan(pillBox!.y + pillBox!.height)

  // Moving onto the card keeps it up; leaving the pair puts it away.
  await page.mouse.move(cardBox!.x + 40, cardBox!.y + 40, { steps: 8 })
  await expect(card).toHaveAttribute("data-state", "open")

  await page.mouse.move(8, cardBox!.y + 320, { steps: 12 })
  await expect(card).toHaveAttribute("data-state", "closed")
})

test("sends every X preview control to the right profile", async ({ page }) => {
  await page.goto("/")

  const xAction = page.getByRole("link", { name: "Follow on X" })
  const card = page.locator(".mosaic-x-card")

  // Closed, the card is inert: its links are out of the tab order.
  await expect(card).toHaveAttribute("inert", "")

  await xAction.focus()
  await expect(card).toHaveAttribute("data-state", "open")
  await expect(card).not.toHaveAttribute("inert", /.*/)
  await expect(card.locator(".mosaic-x-card-follow")).toHaveAttribute(
    "href",
    "https://x.com/intent/follow?screen_name=rafaelmedian",
  )
  await expect(card.locator(".mosaic-x-card-identity")).toHaveAttribute("href", "https://x.com/rafaelmedian")
  await expect(card.locator(".mosaic-x-card-avatar-link")).toHaveAttribute("href", "https://x.com/rafaelmedian")
  await expect(card.locator(".mosaic-x-card-badge")).toHaveAttribute("aria-label", "Verified account")
  await expect(card.locator(".mosaic-x-card-stats")).toContainText("713 Followers")

  // The bio is stored as plain text; its @mentions are linked out like X does.
  await expect(card.locator(".mosaic-x-card-bio")).toHaveText("Designer - Prev at @0xproject / @matchaxyz")
  const mentions = card.locator(".mosaic-x-card-mention")
  await expect(mentions).toHaveCount(2)
  await expect(mentions.nth(0)).toHaveAttribute("href", "https://x.com/0xproject")
  await expect(mentions.nth(1)).toHaveAttribute("href", "https://x.com/matchaxyz")

  // Focus reaches the card's own links, and leaving the pair puts it away.
  await page.keyboard.press("Tab")
  await expect(card.locator(".mosaic-x-card-avatar-link")).toBeFocused()
  await expect(card).toHaveAttribute("data-state", "open")

  await page.keyboard.press("Escape")
  await expect(card).toHaveAttribute("data-state", "closed")
  await expect(xAction).toBeFocused()
})

test("keeps the X preview card inside a narrow hover-capable viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto("/")

  await page.getByRole("link", { name: "Follow on X" }).focus()
  const cardBox = await page.locator(".mosaic-x-card").boundingBox()

  expect(cardBox).not.toBeNull()
  expect(cardBox!.x).toBeGreaterThanOrEqual(0)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(375)
})

test("keeps the X preview card inside a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/")

  await page.getByRole("link", { name: "Follow on X" }).focus()
  const cardBox = await page.locator(".mosaic-x-card").boundingBox()

  expect(cardBox).not.toBeNull()
  expect(cardBox!.x).toBeGreaterThanOrEqual(0)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(320)
})

test("keeps the LinkedIn preview card inside a narrow hover-capable viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto("/")

  await page.getByRole("link", { name: "Message on LinkedIn" }).focus()
  const cardBox = await page.locator(".mosaic-linkedin-card").boundingBox()

  expect(cardBox).not.toBeNull()
  expect(cardBox!.x).toBeGreaterThanOrEqual(0)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(375)
})

test("keeps the reduced-motion X preview card inside a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await page.getByRole("link", { name: "Follow on X" }).focus()
  const cardBox = await page.locator(".mosaic-x-card").boundingBox()

  expect(cardBox).not.toBeNull()
  // Keep a small buffer for platform font metrics and fractional layout
  // rounding instead of balancing the card directly on the viewport edge.
  expect(cardBox!.x).toBeGreaterThanOrEqual(3)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(375)
})

test("plays a clip under the LinkedIn pill only while it is hovered", async ({ page }) => {
  await page.goto("/")

  const linkedinAction = page.getByRole("link", { name: "Message on LinkedIn" })
  const card = page.locator(".mosaic-linkedin-card")
  const media = card.locator("video")

  await expect(card).toHaveAttribute("data-state", "closed")
  // Nothing decodes until the card is actually asked for.
  await expect(media).toHaveJSProperty("paused", true)

  await linkedinAction.hover()
  await expect(card).toHaveAttribute("data-state", "open")

  const cardBox = await card.boundingBox()
  const mediaBox = await media.boundingBox()
  const pillBox = await linkedinAction.boundingBox()
  expect(cardBox!.y).toBeGreaterThan(pillBox!.y + pillBox!.height)
  expect(mediaBox!.width / mediaBox!.height).toBeCloseTo(500 / 280, 1)
  await expect(media).toHaveJSProperty("paused", false)

  await page.mouse.move(8, cardBox!.y + 320, { steps: 12 })
  await expect(card).toHaveAttribute("data-state", "closed")
  await expect(media).toHaveJSProperty("paused", true)
})

test("holds the LinkedIn clip still under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await page.getByRole("link", { name: "Message on LinkedIn" }).hover()
  await expect(page.locator(".mosaic-linkedin-card")).toHaveAttribute("data-state", "open")
  await expect(page.locator(".mosaic-linkedin-card video")).toHaveJSProperty("paused", true)
})

test("shows an interactive OpenStreetMap view of Punta Cana while local time is hovered", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 })
  await page.route(openStreetMapTileUrl, (route) =>
    route.fulfill({
      contentType: "image/png",
      body: transparentMapTile,
    }),
  )
  await page.goto("/")

  const localTime = page.locator(".mosaic-social-time")
  const card = page.locator(".mosaic-local-time-card")

  await expect(card).toHaveAttribute("data-state", "closed")

  await localTime.hover()
  await expect(card).toHaveAttribute("data-state", "open")
  await expect(card.getByText("Punta Cana", { exact: true })).toBeVisible()
  await expect(card.getByText("Dominican Republic", { exact: true })).toBeVisible()
  // role="img": all map interaction is disabled, so it must not announce as an
  // interactive region, and its children are presentational.
  const map = card.getByRole("img", { name: "Map of Punta Cana, Dominican Republic" })
  await expect(map).toBeVisible()
  await expect(map.getByRole("button")).toHaveCount(0)
  await expect(map.getByRole("link")).toHaveCount(0)
  await expect(map.locator(".mosaic-punta-cana-map-marker")).toBeVisible()
  await expect(card.getByRole("link", { name: "OpenStreetMap contributors" })).toBeVisible()
  await expect(
    card.getByRole("img", { name: "OpenStreetMap screenshot of Punta Cana, Dominican Republic" }),
  ).toBeHidden()

  const cardBox = await card.boundingBox()
  const timeBox = await localTime.boundingBox()
  expect(cardBox).not.toBeNull()
  expect(timeBox).not.toBeNull()
  expect(cardBox!.width).toBeCloseTo(360, 0)
  expect(cardBox!.y).toBeGreaterThan(timeBox!.y + timeBox!.height)

  const workHistoryBox = await page.locator(".mosaic-work-history").boundingBox()
  expect(workHistoryBox).not.toBeNull()
  const overlapPoint = {
    x: Math.max(cardBox!.x, workHistoryBox!.x) + 8,
    y: Math.max(cardBox!.y, workHistoryBox!.y) + 8,
  }
  expect(
    await page.evaluate(
      ({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest(".mosaic-local-time-card")),
      overlapPoint,
    ),
  ).toBe(true)

  await page.mouse.move(cardBox!.x + cardBox!.width / 2, cardBox!.y + cardBox!.height / 2, { steps: 8 })
  await expect(card).toHaveAttribute("data-state", "open")

  await page.mouse.move(8, cardBox!.y + cardBox!.height + 80, { steps: 12 })
  await expect(card).toHaveAttribute("data-state", "closed")
})

test("shows a Punta Cana map screenshot while OpenStreetMap tiles are unavailable", async ({ page }) => {
  await page.route(openStreetMapTileUrl, () => {})
  await page.goto("/")

  await page.locator(".mosaic-social-time").hover()

  const screenshot = page.getByRole("img", {
    name: "OpenStreetMap screenshot of Punta Cana, Dominican Republic",
  })
  await expect(screenshot).toBeVisible()
  await expect.poll(() => screenshot.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0)
})

test("keeps the static Punta Cana map when the interactive map chunk fails", async ({ page }) => {
  await page.route("**/assets/PuntaCanaMap-*.js", (route) => route.abort("failed"))
  await page.goto("/")

  const mapChunkFailure = page.waitForEvent(
    "requestfailed",
    (request) => request.url().includes("/assets/PuntaCanaMap-"),
  )
  await page.locator(".mosaic-social-time").hover()
  await mapChunkFailure
  // React retries the suspended tree before surfacing an unhandled lazy-import
  // rejection, so let that recovery cycle settle before inspecting the page.
  await page.waitForTimeout(500)

  await expect(page.getByRole("heading", { name: "Rafael Medina portfolio" })).toBeVisible()
  await expect(
    page.getByRole("img", {
      name: "OpenStreetMap screenshot of Punta Cana, Dominican Republic",
    }),
  ).toBeVisible()
})

test("matches the local-time trigger corners to its card", async ({ page }) => {
  await page.goto("/")

  await expect(page.locator(".mosaic-social-time")).toHaveCSS("border-radius", "16px")
  await expect(page.locator(".mosaic-local-time-card")).toHaveCSS("border-radius", "16px")
})

test("keeps the local-time hover highlight compact without shrinking its hover target", async ({ page }) => {
  await page.goto("/")

  const hoverTarget = page.locator(".mosaic-local-time-anchor")
  const highlight = page.locator(".mosaic-social-time")
  await highlight.hover()

  const hoverTargetBox = await hoverTarget.boundingBox()
  const highlightBox = await highlight.boundingBox()
  expect(hoverTargetBox).not.toBeNull()
  expect(highlightBox).not.toBeNull()
  expect(hoverTargetBox!.height).toBeGreaterThanOrEqual(40)
  expect(highlightBox!.height).toBeCloseTo(24, 0)
})

test("keeps the local-time card close to the visible trigger", async ({ page }) => {
  await page.goto("/")

  const trigger = page.locator(".mosaic-social-time")
  const card = page.locator(".mosaic-local-time-card")
  await trigger.hover()
  await expect(card).toHaveAttribute("data-state", "open")
  await card.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

  const [triggerBox, cardBox] = await Promise.all([trigger.boundingBox(), card.boundingBox()])
  expect(triggerBox).not.toBeNull()
  expect(cardBox).not.toBeNull()
  expect(cardBox!.y - (triggerBox!.y + triggerBox!.height)).toBeCloseTo(10, 0)
})

test("keeps the local-time card inside a narrow hover-capable viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/")

  await page.locator(".mosaic-social-time").focus()
  const cardBox = await page.locator(".mosaic-local-time-card").boundingBox()

  expect(cardBox).not.toBeNull()
  expect(cardBox!.x).toBeGreaterThanOrEqual(0)
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(320)
})

test("centers the local time on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const box = await page.locator(".mosaic-social-corner").boundingBox()

  expect(box).not.toBeNull()
  expect(box!.x + box!.width / 2).toBeCloseTo(mobileViewport.width / 2, 0)
})

test("uses the larger local-time font at compact desktop widths", async ({ page }) => {
  await page.setViewportSize({ width: 572, height: 1381 })
  await page.goto("/")

  await expect(page.locator(".mosaic-social-time")).toHaveCSS("font-size", "14px")
})

test("stacks local time below the section links on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const navigationBox = await page.getByRole("navigation", { name: "Sections" }).boundingBox()
  const localTimeBox = await page.locator(".mosaic-social-corner").boundingBox()

  expect(navigationBox).not.toBeNull()
  expect(localTimeBox).not.toBeNull()
  expect(localTimeBox!.y).toBeGreaterThanOrEqual(navigationBox!.y + navigationBox!.height)
})

test("keeps local time separate from the navigation", async ({ page }) => {
  await page.goto("/")

  const localTime = page.locator(".mosaic-social-corner")
  await expect(localTime.getByRole("link")).toHaveCount(0)
  await expect(localTime).toContainText("Local time:")
  await expect(localTime.locator(".mosaic-live-time")).toBeVisible()

  const location = page.locator(".mosaic-profile-location")
  await expect(location).toContainText("Punta Cana & NYC")
  await expect(location).toContainText("Available for work")
  await expect(location).not.toContainText("Local time:")
  await expect(page.locator(".mosaic-profile-contact > .mosaic-profile-availability")).toHaveCount(0)
})

test("keeps the location and availability copy together at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto("/")

  const place = page.locator(".mosaic-profile-location-place")
  const availability = page.locator(".mosaic-profile-availability")
  const separator = page.locator(".mosaic-profile-location-separator")
  await expect(place).toHaveCSS("white-space", "nowrap")
  await expect(availability).toHaveCSS("white-space", "nowrap")
  await expect(separator).toBeHidden()

  const [placeBox, availabilityBox] = await Promise.all([place.boundingBox(), availability.boundingBox()])
  expect(placeBox).not.toBeNull()
  expect(availabilityBox).not.toBeNull()
  expect(availabilityBox!.y).toBeGreaterThan(placeBox!.y)
})

test("shows current availability with the status dot on the right", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const availability = page.locator(".mosaic-profile-availability")
  await expect(availability).toHaveText("Available for work")
  await page.locator(".mosaic-profile-location").evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  )

  const availabilityBox = await availability.boundingBox()
  const alignment = await availability.evaluate((element) => {
    const textNode = Array.from(element.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
    )
    if (!textNode) return null

    const range = document.createRange()
    range.selectNode(textNode)
    const textBox = range.getBoundingClientRect()
    const dotBox = element.querySelector(".mosaic-availability-dot")?.getBoundingClientRect()
    if (!dotBox) return null

    return {
      dotCenterX: dotBox.x + dotBox.width / 2,
      dotCenterY: dotBox.y + dotBox.height / 2,
      textCenterY: textBox.y + textBox.height / 2,
    }
  })
  expect(availabilityBox).not.toBeNull()
  expect(alignment).not.toBeNull()
  expect(alignment!.dotCenterX).toBeGreaterThan(availabilityBox!.x + availabilityBox!.width / 2)
  expect(alignment!.dotCenterY - alignment!.textCenterY).toBeGreaterThanOrEqual(1)
  expect(alignment!.dotCenterY - alignment!.textCenterY).toBeLessThanOrEqual(2)
})

test("uses a compact availability dot", async ({ page }) => {
  await page.goto("/")

  await expect(page.locator(".mosaic-availability-dot")).toHaveCSS("width", "6px")
  await expect(page.locator(".mosaic-availability-dot")).toHaveCSS("height", "6px")
})

test("reveals the availability dot only while the label is hovered", async ({ page }) => {
  await page.goto("/")

  const availability = page.locator(".mosaic-profile-availability")
  const dot = availability.locator(".mosaic-availability-dot")
  await expect(dot.evaluate((element) => element.getAnimations().length)).resolves.toBe(0)
  await expect(dot).toHaveCSS("opacity", "0")

  await availability.hover()
  await expect(dot).toHaveCSS("opacity", "1")

  await page.mouse.move(1, 1)
  await expect(dot).toHaveCSS("opacity", "0")
})

test("reveals the availability dot without motion when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const availability = page.locator(".mosaic-profile-availability")
  const dot = availability.locator(".mosaic-availability-dot")
  await expect(dot).toHaveCSS("opacity", "0")

  await availability.hover()
  await expect(dot).toHaveCSS("opacity", "1")
  await expect(dot.evaluate((element) => element.getAnimations().length)).resolves.toBe(0)
})

test("places the resume link beside about in the section navigation", async ({ page }) => {
  await page.goto("/")

  const navigation = page.getByRole("navigation", { name: "Sections" })
  const about = navigation.getByRole("link", { name: "About", exact: true })
  const resume = navigation.getByRole("link", { name: "Resume", exact: true })
  await expect(navigation.getByRole("link")).toHaveCount(2)
  await expect(about).toBeVisible()
  await expect(resume).toBeVisible()

  const aboutBox = await about.boundingBox()
  const resumeBox = await resume.boundingBox()
  expect(aboutBox).not.toBeNull()
  expect(resumeBox).not.toBeNull()
  expect(resumeBox!.x).toBeGreaterThanOrEqual(aboutBox!.x + aboutBox!.width)
})

test("keeps the section links compact with the hero tooltip-link corners", async ({ page }) => {
  await page.goto("/")

  const navigation = page.getByRole("navigation", { name: "Sections" })
  const links = navigation.getByRole("link")

  await expect(links).toHaveCount(2)
  for (const link of await links.all()) {
    await expect(link).toHaveCSS("min-height", "32px")
    await expect(link).toHaveCSS("border-radius", "8px")
  }
})

test("preserves the section links' vertical hit area", async ({ page }) => {
  await page.goto("/")

  const about = page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "About", exact: true })
  const hitAreaHeight = await about.evaluate((link) => getComputedStyle(link, "::before").height)

  expect(hitAreaHeight).toBe("40px")
})

test("places the external-link icon after the resume label", async ({ page }) => {
  await page.goto("/")

  const resume = page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Resume", exact: true })
  const iconBox = await resume.locator(".mosaic-social-link-external-icon").boundingBox()
  const labelBox = await resume.evaluate((link) => {
    const labelNode = Array.from(link.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
    if (!labelNode) return null

    const range = document.createRange()
    range.selectNode(labelNode)
    return range.getBoundingClientRect().toJSON()
  })

  expect(iconBox).not.toBeNull()
  expect(labelBox).not.toBeNull()
  expect(iconBox!.x).toBeGreaterThan(labelBox!.x + labelBox!.width)
})

test("reveals an external-link icon when the resume link is hovered", async ({ page }) => {
  await page.goto("/")

  const resume = page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Resume", exact: true })
  const externalIcon = resume.locator(".mosaic-social-link-external-icon")

  await expect(externalIcon).toHaveCSS("opacity", "0")
  await resume.hover()
  await expect(externalIcon).toHaveCSS("opacity", "1")
})

test("gives about links comfortable mobile targets", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const links = page.locator("#about-section .mosaic-about-link")
  expect(await links.count()).toBeGreaterThan(0)
  for (const link of await links.all()) {
    const box = await link.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(40)
  }
})

test("stacks about before work history without tab controls", async ({ page }) => {
  await page.goto("/")

  const about = page.locator("#about-section")
  const workHistory = page.locator("#about-panel-resume")
  await expect(page.getByRole("tablist")).toHaveCount(0)
  await expect(about.getByText(/Hi, I.m Rafael/)).toBeVisible()
  await expect(workHistory.getByRole("heading", { name: "Work history" })).toBeVisible()

  const order = await page.locator("#about-section, #about-panel-resume").evaluateAll(([aboutNode, workNode]) => {
    const aboutRect = aboutNode.getBoundingClientRect()
    const workRect = workNode.getBoundingClientRect()
    return {
      followsAbout: Boolean(aboutNode.compareDocumentPosition(workNode) & Node.DOCUMENT_POSITION_FOLLOWING),
      startsBelowAbout: workRect.top >= aboutRect.bottom,
    }
  })

  expect(order).toEqual({ followsAbout: true, startsBelowAbout: true })
})

test("left aligns the about introduction with the work-history reading axis", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")

  const alignment = await page.locator(".mosaic-about-section-copy, .mosaic-about-work-history-copy").evaluateAll(
    ([aboutCopy, workHistoryCopy]) => {
      const aboutRect = aboutCopy.getBoundingClientRect()
      const workHistoryRect = workHistoryCopy.getBoundingClientRect()
      const hobbies = aboutCopy.querySelector(".mosaic-about-hobbies")
      const fact = aboutCopy.querySelector(".mosaic-about-fact")

      return {
        sharedLeftEdge: Math.round(aboutRect.left) === Math.round(workHistoryRect.left),
        aboutTextAlign: getComputedStyle(aboutCopy).textAlign,
        hobbiesJustification: hobbies ? getComputedStyle(hobbies).justifyContent : null,
        factsJustification: fact ? getComputedStyle(fact).justifyContent : null,
      }
    },
  )

  expect(alignment).toEqual({
    sharedLeftEdge: true,
    aboutTextAlign: "left",
    hobbiesJustification: "flex-start",
    factsJustification: "flex-start",
  })
})

test("separates work history from about with a content-width divider", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/")

  const divider = await page.locator(".mosaic-about-work-history-copy").evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      width: Math.round(element.getBoundingClientRect().width),
      borderTopWidth: styles.borderTopWidth,
      borderTopStyle: styles.borderTopStyle,
      borderTopColor: styles.borderTopColor,
      paddingTop: styles.paddingTop,
    }
  })

  expect(divider).toEqual({
    width: 544,
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: "rgba(0, 0, 0, 0.08)",
    paddingTop: "48px",
  })
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

test("keeps every project row together inside the takeover stage", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  const rows = stage.locator(".mosaic-row")

  await expect(rows).toHaveCount(4)

  const gaps = await rows.evaluateAll((elements) =>
    elements.slice(1).map((element, index) => {
      const previousRect = elements[index].getBoundingClientRect()
      return Math.round(element.getBoundingClientRect().top - previousRect.bottom)
    }),
  )

  expect(gaps).toEqual([16, 16, 16])
})

test("leaves breathing room after the final project row before the about takeover", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))

  const endSpacing = await stage.evaluate((element) => {
    const lastRow = element.querySelector(".mosaic-row:last-child")
    if (!lastRow) return null

    return Math.round(element.getBoundingClientRect().bottom - lastRow.getBoundingClientRect().bottom)
  })

  expect(endSpacing).toBe(32)
})

test("pins the complete project grid when its bottom reaches the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))

  const placement = await stage.evaluate((element) => {
    const aboutNode = document.querySelector("#about-panel")
    if (!aboutNode) return null
    const stageRect = element.getBoundingClientRect()
    return {
      stageTop: Math.round(stageRect.top),
      stageBottom: Math.round(stageRect.bottom),
      stageHeight: Math.round(stageRect.height),
      stagePosition: getComputedStyle(element).position,
      aboutTop: Math.round(aboutNode.getBoundingClientRect().top),
    }
  })

  expect(placement).toEqual({
    stageTop: -847,
    stageBottom: 913,
    stageHeight: 1760,
    stagePosition: "sticky",
    aboutTop: 913,
  })
})

test("scrolls the about surface over the pinned project grid", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))
  await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight / 2)))

  const placement = await stage.evaluate((element) => {
    const aboutNode = document.querySelector("#about-panel")
    if (!aboutNode) return null
    const stageRect = element.getBoundingClientRect()
    const aboutRect = aboutNode.getBoundingClientRect()
    const topmostNode = document.elementFromPoint(aboutRect.left + aboutRect.width / 2, aboutRect.top + 24)
    return {
      stageBottom: Math.round(stageRect.bottom),
      aboutTop: Math.round(aboutRect.top),
      aboutOwnsCoveredArea: Boolean(topmostNode?.closest("#about-panel")),
    }
  })

  expect(placement).toEqual({ stageBottom: 913, aboutTop: 456, aboutOwnsCoveredArea: true })
})

test("retreats the complete project grid as one surface during takeover", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))
  await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight / 2)))
  await page.evaluate(() => new Promise(requestAnimationFrame))

  const retreat = await stage.evaluate((element) => {
    const styles = getComputedStyle(element)
    return { opacity: Number.parseFloat(styles.opacity), transform: styles.transform }
  })
  const card = stage.locator(".mosaic-row-card").first()

  expect(retreat.opacity).toBeLessThan(0.95)
  expect(retreat.transform).not.toBe("none")
  await expect(card).toHaveCSS("opacity", "1")
  await expect(card).toHaveCSS("transform", "none")
})

test("keeps the takeover cover but removes retreat motion for reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))
  await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight / 2)))

  const stageBottom = await stage.evaluate((element) => Math.round(element.getBoundingClientRect().bottom))
  const aboutTop = await page.locator("#about-panel").evaluate((element) =>
    Math.round(element.getBoundingClientRect().top),
  )

  expect(stageBottom).toBe(913)
  expect(aboutTop).toBe(456)
  await expect(stage).toHaveCSS("opacity", "1")
  await expect(stage).toHaveCSS("transform", "none")
})

test("releases the about sheet into normal document scrolling after takeover", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 700 })
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  const about = page.locator("#about-panel")
  await stage.evaluate((element) => element.scrollIntoView({ block: "end" }))
  await page.evaluate(() => window.scrollBy(0, window.innerHeight))

  const beforeTop = await about.evaluate((element) => element.getBoundingClientRect().top)
  await page.evaluate(() => window.scrollBy(0, 80))

  const placement = await about.evaluate(
    (element, initialTop) => ({
      position: getComputedStyle(element).position,
      distanceMoved: Math.round(initialTop - element.getBoundingClientRect().top),
    }),
    beforeTop,
  )

  expect(placement).toEqual({ position: "relative", distanceMoved: 80 })
})

test("uses normal-flow project and about sections on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const stage = page.locator(".mosaic-takeover-stage")
  const placement = await page.locator("#work, #about-panel").evaluateAll(([workNode, aboutNode]) => ({
    overlap: Math.round(workNode.getBoundingClientRect().bottom - aboutNode.getBoundingClientRect().top),
    hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))

  await expect(stage).toHaveCSS("display", "contents")
  expect(placement).toEqual({ overlap: 0, hasHorizontalOverflow: false })
})

test("uses a full-bleed white viewport surface for about on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 913 })
  await page.goto("/")

  const surface = await page.locator("#about-panel").evaluate((element) => {
    const panel = element.querySelector(".mosaic-about-panel")
    if (!panel) return null
    const rect = element.getBoundingClientRect()
    const panelStyles = getComputedStyle(panel)
    return {
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      minHeight: Math.round(Number.parseFloat(panelStyles.minHeight)),
      radius: panelStyles.borderRadius,
      borderWidth: panelStyles.borderTopWidth,
      background: panelStyles.backgroundColor,
    }
  })

  expect(surface).toEqual({
    left: 0,
    width: 1728,
    minHeight: 913,
    radius: "0px",
    borderWidth: "0px",
    background: "rgb(255, 255, 255)",
  })
})

test("matches the selected-work bottom padding to the card spacing on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const spacing = await page.locator("#selected-work-previews").evaluate((element) => {
    const styles = getComputedStyle(element)
    return { bottomPadding: styles.paddingBottom, cardGap: styles.rowGap }
  })

  expect(spacing).toEqual({ bottomPadding: "16px", cardGap: "16px" })
})

test("shows every project immediately on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const rows = page.locator(".mosaic-row")
  await expect(rows).toHaveCount(4)
  await expect(rows.first()).toBeVisible()
  await expect(rows.nth(1)).toBeVisible()
  await expect(rows.last()).toBeVisible()
  await expect(page.getByRole("button", { name: /View \d+ more projects/ })).toHaveCount(0)
})

test("keeps the selected work label out of the visual layout", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const heading = page.getByRole("heading", { name: "Selected work" })
  await expect(heading).toHaveText("Selected work")
  await expect(heading).toHaveClass("sr-only")
})

test("uses eight pixel mobile gutters and taller project cards", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const cardBox = await page.locator(".mosaic-row-card").first().boundingBox()
  expect(cardBox).not.toBeNull()
  expect(cardBox!.x).toBe(8)
  expect(cardBox!.x + cardBox!.width).toBe(mobileViewport.width - 8)
  expect(cardBox!.height).toBeGreaterThanOrEqual(340)
})

test("keeps Dark mode beside Protector", async ({ page }) => {
  await page.goto("/")

  const protectorCard = page.getByRole("button", { name: /Open Protector/ })
  const row = page.locator(".mosaic-row").filter({ has: protectorCard })

  await expect(row.getByRole("button", { name: /Open Matcha Dark mode/ })).toHaveCount(1)
})

test("restores the former three projects to the third row", async ({ page }) => {
  await page.goto("/")

  const tokenCard = page.getByRole("button", { name: /Open Matcha - Token Page/ })
  const row = page.locator(".mosaic-row").filter({ has: tokenCard })
  const cards = row.locator(".mosaic-row-card")

  await expect(cards).toHaveCount(3)
  await expect(cards.nth(0)).toHaveAttribute("aria-label", /Open Matcha - Token Page/)
  await expect(cards.nth(1)).toHaveAttribute("aria-label", /Open Matcha Trade Page/)
  await expect(cards.nth(2)).toHaveAttribute("aria-label", /Open Matcha Trade module/)
})

test("keeps the restored third-row projects equal width", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1239 })
  await page.goto("/")

  const tokenCard = page.getByRole("button", { name: /Open Matcha - Token Page/ })
  const tradePageCard = page.getByRole("button", { name: /Open Matcha Trade Page/ })
  const tradeModuleCard = page.getByRole("button", { name: /Open Matcha Trade module/ })
  const row = page.locator(".mosaic-row").filter({ has: tokenCard })
  await expect(row.locator(".mosaic-row-item")).toHaveCount(3)

  const [tokenBox, tradePageBox, tradeModuleBox] = await Promise.all([
    tokenCard.boundingBox(),
    tradePageCard.boundingBox(),
    tradeModuleCard.boundingBox(),
  ])
  expect(tokenBox).not.toBeNull()
  expect(tradePageBox).not.toBeNull()
  expect(tradeModuleBox).not.toBeNull()
  expect(tokenBox!.width).toBeCloseTo(tradePageBox!.width, 0)
  expect(tradePageBox!.width).toBeCloseTo(tradeModuleBox!.width, 0)
})

test("adds four more projects in the fourth row", async ({ page }) => {
  await page.goto("/")

  const rows = page.locator(".mosaic-row")
  const lastRow = rows.last()
  const cards = lastRow.locator(".mosaic-row-card")

  await expect(rows).toHaveCount(4)
  await expect(cards).toHaveCount(4)
  await expect(cards.nth(0)).toHaveAttribute("aria-label", /Open Matcha - Mobile Screens/)
  await expect(cards.nth(1)).toHaveAttribute("aria-label", /Open Matcha - Mobile navigation/)
  await expect(cards.nth(2)).toHaveAttribute("aria-label", /Open Matcha Pro/)
  await expect(cards.nth(3)).toHaveAttribute("aria-label", /Open Matcha - Security Audit/)
  await expect(cards.nth(0).locator("img")).toHaveAttribute("src", /shot-small-14\.jpg$/)
  await expect(cards.nth(1).locator("img")).toHaveAttribute("src", /shot-small-15\.jpg$/)
  await expect(cards.nth(2).locator("img")).toHaveAttribute("src", /shot-small-23\.jpg$/)
  await expect(cards.nth(3).locator("video")).toHaveAttribute("poster", "/Projects/shot-small-20-poster.webp")
})

test("keeps the fourth-row projects equal width", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1239 })
  await page.goto("/")

  const cards = page.locator(".mosaic-row").last().locator(".mosaic-row-card")
  await expect(cards).toHaveCount(4)
  const widths = await cards.evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().width)),
  )

  expect(new Set(widths).size).toBe(1)
})

test("moves directly from selected work to about without a repeated contact card", async ({ page }) => {
  await page.goto("/")

  await expect(page.locator(".mosaic-work-contact")).toHaveCount(0)
  const placement = await page.locator("#work, #about-panel").evaluateAll(([work, about]) =>
    Boolean(work.compareDocumentPosition(about) & Node.DOCUMENT_POSITION_FOLLOWING),
  )
  expect(placement).toBe(true)
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

  const trigger = page.getByRole("button", { name: /Open Matcha - Token Page preview/ })
  await trigger.hover()
  await failedPrefetch
  await page.unroute(galleryChunk)
  await trigger.click()

  await expect(page.getByRole("dialog")).toBeVisible()
  expect(errors).toEqual([])
})

test("shows about and the complete work history together", async ({ page }) => {
  await page.goto("/")
  const panel = page.locator("#about-panel")

  await expect(panel.getByText(/Hi, I.m Rafael/)).toBeVisible()
  await expect(panel.getByRole("heading", { name: "Work history" })).toBeVisible()

  const entries = panel.locator(".mosaic-about-resume-entry")
  await expect(entries.first()).toContainText("Stealth")
  await expect(entries.first()).toContainText("Founder · Mar 2026 - Present")
  await expect(entries.first()).toContainText("Building a mobile wallet product.")
  await expect(entries.nth(1)).toContainText("0x Project")
  await expect(panel).toContainText("Incubeta")
  await expect(panel).toContainText("NOVA Community College")
  await expect(panel).toContainText("ITLA")
  await expect(panel).not.toContainText("hellorafaelmedina@gmail.com")
  await expect(panel).not.toContainText("786 9580")
  await expect(panel.getByRole("link", { name: "Download résumé PDF" })).toHaveCount(0)
  await expect(page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Resume", exact: true })).toHaveAttribute(
    "href",
    "/rafael-medina-resume.pdf",
  )
  await expect(page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Resume", exact: true })).toHaveAttribute(
    "target",
    "_blank",
  )

  await expect(panel.getByRole("button", { name: /Palm tree sticker/ })).toBeVisible()
  await expect(panel.getByRole("button", { name: /Briefcase sticker/ })).toBeVisible()
})

test("keeps work-history stickers inside the work-history section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/#about-panel-resume")

  const workHistory = page.locator("#about-panel-resume")
  const sticker = page.getByRole("button", { name: /Briefcase sticker/ })

  await expect(sticker).toBeVisible()
  expect(await sticker.evaluate((element) => element.parentElement?.id)).toBe("about-panel-resume")

  const bounds = await Promise.all([workHistory.boundingBox(), sticker.boundingBox()])
  expect(bounds[0]).not.toBeNull()
  expect(bounds[1]).not.toBeNull()
  expect(bounds[1]!.x).toBeGreaterThanOrEqual(bounds[0]!.x)
  expect(bounds[1]!.x + bounds[1]!.width).toBeLessThanOrEqual(bounds[0]!.x + bounds[0]!.width)
})

test("spreads each sticker set across the full desktop section gutters", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1239 })
  await page.goto("/#about-panel")

  const layouts = await page.locator("#about-section, #about-panel-resume").evaluateAll((sections) =>
    sections.map((section) => {
      const sectionRect = section.getBoundingClientRect()
      const stickers = Array.from(section.querySelectorAll<HTMLElement>(".mosaic-about-sticker"))
      const centers = stickers.map((sticker) => {
        const rect = sticker.getBoundingClientRect()
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      })
      const nearestEdgeInsets = centers.map(({ x }) =>
        Math.min(x - sectionRect.left, sectionRect.right - x),
      )
      const verticalCenters = centers.map(({ y }) => y)

      return {
        stickerCount: stickers.length,
        allInOuterGutters: nearestEdgeInsets.every((inset) => inset <= sectionRect.width * 0.08),
        verticalCoverage:
          verticalCenters.length > 0
            ? (Math.max(...verticalCenters) - Math.min(...verticalCenters)) / sectionRect.height
            : 0,
      }
    }),
  )

  expect(layouts).toHaveLength(2)
  for (const layout of layouts) {
    expect(layout.stickerCount).toBe(8)
    expect(layout.allInOuterGutters).toBe(true)
    expect(layout.verticalCoverage).toBeGreaterThan(0.75)
  }
})

test("gives work history more top breathing room without disconnecting it from about", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/#about-panel")

  const gap = await page.evaluate(() => {
    const closing = document.querySelector(".mosaic-about-closing")
    const heading = document.querySelector("#about-work-history-heading")
    if (!closing || !heading) return Number.POSITIVE_INFINITY
    return Math.round(heading.getBoundingClientRect().top - closing.getBoundingClientRect().bottom)
  })

  expect(gap).toBeGreaterThanOrEqual(72)
  expect(gap).toBeLessThanOrEqual(80)
})

test("left aligns the work-history reading hierarchy", async ({ page }) => {
  await page.goto("/#about-panel-resume")

  const alignment = await page.locator("#about-panel-resume").evaluate((section) => {
    const heading = section.querySelector("#about-work-history-heading")
    const company = section.querySelector(".mosaic-about-resume-company")
    return {
      section: getComputedStyle(section).textAlign,
      heading: heading ? getComputedStyle(heading).textAlign : null,
      companyJustification: company ? getComputedStyle(company).justifyContent : null,
    }
  })

  expect(alignment).toEqual({ section: "left", heading: "left", companyJustification: "flex-start" })
})

test("reveals company logo tooltips on hover and keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/#about-panel-resume")

  const trigger = page.getByRole("button", { name: "Show 0x Project logos" })
  const tooltip = page.getByRole("tooltip", { name: "0x Project logos" })

  await expect(tooltip).toBeHidden()
  await trigger.hover()
  await expect(tooltip).toBeVisible()
  await page.mouse.move(0, 0)
  await expect(tooltip).toBeHidden()
  await trigger.focus()
  await expect(tooltip).toBeVisible()
  await expect(tooltip.locator("img")).toHaveCount(2)
})

test("keeps each employer as the accessible work-history heading", async ({ page }) => {
  await page.goto("/#about-panel-resume")

  await expect(page.getByRole("heading", { name: "0x Project", exact: true })).toBeVisible()
  await expect(page.getByRole("button", { name: "Show 0x Project logos" })).toBeVisible()
})

test("keeps focus on a company trigger when Escape dismisses its logo tooltip", async ({ page }) => {
  await page.goto("/#about-panel-resume")

  const trigger = page.getByRole("button", { name: "Show 0x Project logos" })
  const tooltip = page.getByRole("tooltip", { name: "0x Project logos" })
  await trigger.focus()
  await expect(tooltip).toBeVisible()

  await trigger.press("Escape")

  await expect(tooltip).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("defers resume-only company logos until their tooltip opens", async ({ page }) => {
  const boldVoiceLogoPath = "/logos/boldvoice.png"
  const requestedLogoPaths: string[] = []
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname
    if (path.startsWith("/logos/")) requestedLogoPaths.push(path)
  })

  await page.goto("/")
  await page.waitForLoadState("networkidle")
  expect(requestedLogoPaths).not.toContain(boldVoiceLogoPath)

  const request = page.waitForRequest((candidate) => new URL(candidate.url()).pathname === boldVoiceLogoPath)
  await page.getByRole("button", { name: "Show BoldVoice logos" }).focus()
  await request
})

test("opens work history directly from its deep link", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#about-panel-resume")

  await expect(page).toHaveURL(/#about-panel-resume$/)
  await expect(page.locator("#about-panel-resume")).toBeInViewport()
  await expect(page.getByRole("heading", { name: "Work history" })).toBeVisible()
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
  // --radius-lg. The dialog's bottom corners used to be a 28px one-off; they
  // were folded into the four-step radius scale (see /design-system).
  await expect(card).toHaveCSS("border-bottom-left-radius", "24px")
  await expect(card).toHaveCSS("border-bottom-right-radius", "24px")

  const initialDialogBox = await dialog.boundingBox()
  const initialRailBox = await rail.boundingBox()
  expect(initialDialogBox).not.toBeNull()
  expect(initialRailBox).not.toBeNull()
  expect(initialDialogBox!.y).toBeCloseTo(50, 0)
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

test("does not use dots to navigate between projects in the main feed", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.locator(".preview-gallery-picker")).toHaveCount(0)
  await expect(dialog.getByRole("button", { name: /previous .* image/i })).toHaveCount(0)
  await expect(dialog.getByRole("button", { name: /next .* image/i })).toHaveCount(0)
})

test("opens the gallery wide without clipping navigation at the large desktop breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 1320, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toHaveAttribute("data-wide", "true")
  await expect(dialog.getByRole("button", { name: "Exit wide view" })).toHaveAttribute("aria-pressed", "true")
  const wideDialogBox = await dialog.boundingBox()
  expect(wideDialogBox?.width).toBeCloseTo(1090, 0)
  expect(wideDialogBox?.y).toBeCloseTo(50, 0)

  const nextPreviewBox = await dialog.getByRole("button", { name: "Next preview" }).boundingBox()
  expect(nextPreviewBox).not.toBeNull()
  expect(nextPreviewBox!.x + nextPreviewBox!.width).toBeLessThanOrEqual(1320)

  await page.setViewportSize({ width: 1280, height: 1000 })
  await page.reload()
  await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).click()

  await expect(dialog).not.toHaveAttribute("data-wide", "true")
  await expect(dialog.getByRole("button", { name: "Expand preview" })).toHaveAttribute("aria-pressed", "false")
  expect((await dialog.boundingBox())?.y).toBeCloseTo(80, 0)
})

test("expands and restores the gallery without losing the selected preview", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  const nextProject = dialog
    .getByRole("group", { name: "Preview navigation" })
    .getByRole("button", { name: "Next preview" })
  await nextProject.click()
  await nextProject.click()
  await expect(dialog.getByRole("heading", { name: "Popparazi V1" })).toBeVisible()

  const expand = dialog.getByRole("button", { name: "Expand preview" })
  const mediaFrame = dialog.locator(".preview-gallery-media-frame")
  const [expandBox, mediaFrameBox] = await Promise.all([expand.boundingBox(), mediaFrame.boundingBox()])
  expect(expandBox).not.toBeNull()
  expect(mediaFrameBox).not.toBeNull()
  expect(mediaFrameBox!.x + mediaFrameBox!.width - (expandBox!.x + expandBox!.width)).toBeCloseTo(11, 0)
  expect(expandBox!.y - mediaFrameBox!.y).toBeCloseTo(11, 0)

  const compactWidth = (await dialog.boundingBox())!.width
  await expand.click()

  await expect(dialog).toHaveAttribute("data-wide", "true")
  await expect(dialog.getByRole("button", { name: "Exit wide view" })).toHaveAttribute("aria-pressed", "true")
  await expect(dialog.getByRole("heading", { name: "Popparazi V1" })).toBeVisible()
  await expect.poll(async () => (await dialog.boundingBox())!.width).toBeGreaterThan(compactWidth * 1.8)
  expect((await dialog.boundingBox())?.y).toBeCloseTo(50, 0)

  await dialog.getByRole("button", { name: "Exit wide view" }).click()
  await expect(dialog).not.toHaveAttribute("data-wide", "true")
  await expect(dialog.getByRole("button", { name: "Expand preview" })).toHaveAttribute("aria-pressed", "false")
  await expect.poll(async () => (await dialog.boundingBox())!.width).toBeCloseTo(compactWidth, 0)
})

test("fills the expanded card width with cropped project artwork", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 545 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.getByRole("button", { name: /Open Protector preview/ }).click()

  const dialog = page.getByRole("dialog")
  await dialog.getByRole("button", { name: "Expand preview" }).click()
  await expect(dialog).toHaveAttribute("data-wide", "true")

  const card = dialog.locator(".preview-gallery-card")
  const mediaFrame = dialog.locator(".preview-gallery-media-frame")
  const [cardBox, mediaFrameBox, horizontalInset] = await Promise.all([
    card.boundingBox(),
    mediaFrame.boundingBox(),
    card.evaluate((element) => {
      const styles = getComputedStyle(element)
      return [styles.borderLeftWidth, styles.paddingLeft, styles.paddingRight, styles.borderRightWidth]
        .map(Number.parseFloat)
        .reduce((total, value) => total + value, 0)
    }),
  ])

  expect(cardBox).not.toBeNull()
  expect(mediaFrameBox).not.toBeNull()
  expect(mediaFrameBox!.width).toBeCloseTo(cardBox!.width - horizontalInset, 0)
})

test("keeps the expanded gallery scrollable without visible scrollbars", async ({ playwright, baseURL }) => {
  const browser = await playwright.chromium.launch({ ignoreDefaultArgs: ["--hide-scrollbars"] })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()

  try {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto(baseURL ?? "/")
    await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toHaveAttribute("data-wide", "true")

    const card = dialog.locator(".preview-gallery-card")
    await expect.poll(() => card.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true)

    const scrollbarGutter = await card.evaluate((element) => ({
      horizontal: element.offsetHeight - element.clientHeight,
      vertical: element.offsetWidth - element.clientWidth,
    }))

    expect(scrollbarGutter).toEqual({ horizontal: 2, vertical: 2 })

    await card.hover()
    await page.mouse.wheel(0, 240)
    await expect.poll(() => card.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  } finally {
    await browser.close()
  }
})

test("travels one role-bearing work-history popover between company triggers without shifting the page", async ({ page }) => {
  await page.goto("/")
  const location = page.locator(".mosaic-profile-location")
  await location.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const initialLocationBox = await location.boundingBox()
  const popover = page.locator(".mosaic-work-history-popover")
  const onit = page.getByRole("link", { name: "Onit", exact: true })
  const initialOnitBox = await onit.boundingBox()

  const closedTransform = await popover.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform))
  expect(closedTransform.a).toBeCloseTo(1, 2)
  expect(closedTransform.d).toBeCloseTo(1, 2)
  expect(closedTransform.m42).toBeCloseTo(-6, 1)

  await onit.hover()
  await expect(popover).toBeVisible()
  await popover.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const openTransform = await popover.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform))
  expect(openTransform.a).toBeCloseTo(1, 2)
  expect(openTransform.d).toBeCloseTo(1, 2)
  const openOnitBox = await onit.boundingBox()
  expect(initialOnitBox).not.toBeNull()
  expect(openOnitBox!.x).toBeCloseTo(initialOnitBox!.x, 1)
  expect(openOnitBox!.y).toBeCloseTo(initialOnitBox!.y, 1)
  await expect(popover.locator(".mosaic-work-history-popover-name")).toHaveText("Onit")
  await expect(popover.locator(".mosaic-work-history-popover-role")).toHaveText("Frontend dev and designer")
  const visitLink = popover.getByRole("link", { name: "Visit onit.com" })
  await expect(visitLink).toBeVisible()
  await expect(popover).toHaveCSS("text-align", "left")
  await expect(visitLink).toHaveCSS("background-color", "rgb(242, 242, 242)")
  await expect(page.locator(".mosaic-work-history")).toHaveCSS("z-index", "40")
  await expect(popover).toHaveAttribute("data-side", "below")
  await expect(popover.locator(".mosaic-work-history-popover-arrow")).toHaveCount(0)
  await expect(popover).toHaveCSS("padding-top", "15px")
  await expect(popover).toHaveCSS("padding-right", "16px")
  await expect(popover).toHaveCSS("padding-bottom", "17px")
  await expect(popover).toHaveCSS("padding-left", "16px")
  const longestPopoverTransition = await popover.evaluate((element) =>
    Math.max(
      ...getComputedStyle(element)
        .transitionDuration.split(",")
        .map((duration) => Number.parseFloat(duration) * (duration.includes("ms") ? 0.001 : 1)),
    ),
  )
  expect(longestPopoverTransition).toBeCloseTo(0.24, 2)
  await expect(popover).toHaveCSS("transition-property", "transform, opacity, visibility")

  const onitPopoverBox = await popover.boundingBox()
  const onitTriggerBox = await onit.boundingBox()
  const onitLocationBox = await location.boundingBox()
  expect(initialLocationBox).not.toBeNull()
  expect(onitPopoverBox).not.toBeNull()
  expect(onitTriggerBox).not.toBeNull()
  expect(onitPopoverBox!.y).toBeGreaterThan(onitTriggerBox!.y + onitTriggerBox!.height)
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

test("keeps a work-history pill engaged while the pointer moves into its card", async ({ page }) => {
  await page.goto("/")

  const onit = page.getByRole("link", { name: "Onit", exact: true })
  const popover = page.locator(".mosaic-work-history-popover")

  await onit.hover()
  await expect(popover).toBeVisible()

  const popoverBox = await popover.boundingBox()
  expect(popoverBox).not.toBeNull()
  await page.mouse.move(popoverBox!.x + popoverBox!.width / 2, popoverBox!.y + 12, { steps: 8 })

  await expect(popover).toBeVisible()
  await expect(onit).toHaveClass(/\bis-active\b/)
  await expect(onit).toHaveCSS("background-color", "rgb(233, 233, 233)")
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

test("keeps the work-history popover stationary while the pointer moves within a link", async ({ page }) => {
  await page.goto("/")

  const trigger = page.getByRole("link", { name: "Onit", exact: true })
  const popover = page.locator(".mosaic-work-history-popover")
  const triggerBox = await trigger.boundingBox()
  expect(triggerBox).not.toBeNull()

  const movePointerTo = (relativeX: number) =>
    trigger.evaluate(async (element, x) => {
      const box = element.getBoundingClientRect()
      element.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          clientX: box.left + x,
          clientY: box.top + box.height / 2,
        }),
      )
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    }, relativeX)

  await trigger.focus()
  await expect(popover).toBeVisible()
  await movePointerTo(1)
  await popover.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const leftX = (await popover.boundingBox())!.x

  await movePointerTo(triggerBox!.width - 1)
  await popover.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const rightX = (await popover.boundingBox())!.x

  expect(rightX).toBeCloseTo(leftX, 1)
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
  expect(popoverBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height)
})

test("keeps the work-history popover below its trigger while scrolling", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const onit = page.getByRole("link", { name: "Onit", exact: true })
  const popover = page.locator(".mosaic-work-history-popover")
  await onit.focus()
  await expect(popover).toBeVisible()
  await expect(popover).toHaveAttribute("data-side", "below")

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

test("keeps project images free of captions on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")

  const firstCaption = page.locator(".mosaic-row-card-title").first()
  await expect(firstCaption).toBeHidden()
  expect(
    await page.locator(".mosaic-row-card").first().evaluate((card) => getComputedStyle(card, "::after").opacity),
  ).toBe("0")

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
  expect(html).toContain("--work-intro-row:2")
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

test("does not show a motion toggle beside the section links", async ({ page }) => {
  await page.goto("/")

  const navigation = page.getByRole("navigation", { name: "Sections" })
  await expect(navigation.getByRole("button", { name: /motion/i })).toHaveCount(0)

  const video = page.locator(".mosaic-row-card video.mosaic-row-media").first()
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused)).toBe(true)
})

test("hides the motion toggle when reduced motion already pauses previews", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const navigation = page.getByRole("navigation", { name: "Sections" })
  await expect(navigation.getByRole("button", { name: /motion/i })).toHaveCount(0)
  await expect(page.locator(".mosaic-row-card video.mosaic-row-media").first()).toHaveJSProperty("paused", true)
})
