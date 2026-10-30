import { expect, test, type Page } from "@playwright/test"

// The portrait ships inside the page, so holding the intro means holding its decode.
async function holdPortrait(page: Page) {
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode
    const hold = new Promise<void>((resolve) => {
      (window as unknown as { releasePortrait: () => void }).releasePortrait = resolve
    })
    HTMLImageElement.prototype.decode = function () {
      return this.classList.contains("mosaic-avatar-portrait") ? hold.then(() => decode.call(this)) : decode.call(this)
    }
  })
}
const releasePortrait = (page: Page) => page.evaluate(() => (window as unknown as { releasePortrait: () => void }).releasePortrait())

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`animates the stationary portrait before staggering content at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    // Hold the portrait so we can inspect the pre-reveal frame reliably.
    await holdPortrait(page)
    await page.addInitScript(() => {
      const phases: string[] = []
      Object.assign(window, { introPhases: phases })
      new MutationObserver(() => {
        const phase = document.documentElement.dataset.avatarIntro ?? "done"
        if (phase !== "pending" && phases.at(-1) !== phase) phases.push(phase)
      }).observe(document, { attributes: true, subtree: true, attributeFilter: ["data-avatar-intro"] })
    })
    // And the stylesheet, which is what holds the top section's beat open.
    let releaseStyles!: () => void
    const stylesReady = new Promise<void>((resolve) => { releaseStyles = resolve })
    await page.route("**/assets/index-*.css", async (route) => {
      await stylesReady
      await route.continue()
    })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const html = page.locator("html")
    const portrait = page.locator(".mosaic-avatar-face-front")
    const avatar = page.locator(".mosaic-avatar-button")
    const portraitAnimation = page.locator(".mosaic-avatar-coin-inner")
    await expect(html).toHaveAttribute("data-avatar-intro", "pending")
    await expect(portraitAnimation).toHaveCSS("opacity", "0")
    const start = await avatar.boundingBox()
    expect(Math.abs(start!.x + start!.width / 2 - viewport.width / 2)).toBeLessThan(1)
    expect(start!.y).toBeLessThan(100)
    await expect(page.locator(".mosaic-profile-meta")).toBeHidden()
    await expect(page.locator("#work")).toBeHidden()
    await releasePortrait(page)

    await expect(html).toHaveAttribute("data-avatar-intro", "portrait")
    await expect(portraitAnimation).toHaveCSS("animation-name", "avatar-intro-face")
    await expect(page.locator("#work")).toBeHidden()

    await expect(html).toHaveAttribute("data-avatar-intro", "revealing")
    const end = await avatar.boundingBox()
    expect(end).toEqual(start)

    const delays = await page.locator([
      ".mosaic-profile-meta",
      ".mosaic-work-history",
      ".mosaic-profile-location",
      ".mosaic-profile-contact",
      ".mosaic-section-corner",
    ].join(",")).evaluateAll((elements) => elements.map((element) => {
      const style = getComputedStyle(element)
      return {
        animationName: style.animationName,
        delay: Number.parseFloat(style.animationDelay) * 1000,
      }
    }))
    expect(delays).toHaveLength(5)
    expect(delays.map(({ animationName }) => animationName)).toEqual(Array(5).fill("avatar-intro-content"))
    // The top section staggers in 60ms steps, with the tiles held back.
    expect(delays.map(({ delay }) => delay).sort((a, b) => a - b)).toEqual([0, 60, 60, 120, 180])
    await expect(page.locator("#work")).toBeHidden()
    releaseStyles()

    // An animated blur drops the reveal off the compositor, where the cold
    // load's main-thread work stalls it.
    const revealKeyframes = await page.evaluate(() => [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .find((rule) => rule instanceof CSSKeyframesRule && rule.name === "avatar-intro-content")?.cssText)
    expect(revealKeyframes).toContain("opacity")
    expect(revealKeyframes).not.toContain("filter")

    await expect(html).not.toHaveAttribute("data-avatar-intro")
    // Read from a recorder: a 360ms phase can pass between two polls under load.
    expect(await page.evaluate(() => (window as unknown as { introPhases: string[] }).introPhases))
      .toEqual(["portrait", "revealing", "tiles", "done"])
    await expect(portrait).toBeVisible()
    await expect(page.locator("#work")).toHaveCSS("opacity", "1")
  })
}

test("bypasses the intro for reduced motion and section links", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro", "pending")
  await expect(page.locator("#work")).toBeVisible()
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/#about-panel")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro", "pending")
  await expect(page.locator("#about-panel")).toBeInViewport()
})

test("reveals the page when the portrait fails to decode", async ({ page }) => {
  await page.addInitScript(() => {
    HTMLImageElement.prototype.decode = () => Promise.reject(new Error("corrupt"))
  })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro", "pending")
  await expect(page.locator("#work")).toBeVisible()
})

test("keeps prerendered content readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro", "pending")
  await expect(page.locator(".mosaic-profile-meta")).toBeVisible()
  await expect(page.locator("#work")).toBeVisible()
  await expect(page.locator(".mosaic-row-media").first()).toHaveCSS("opacity", "1")
  await expect(page.locator(".mosaic-row-media-skeleton").first()).toBeHidden()
  const videos = page.locator("video.mosaic-row-media")
  for (const video of await videos.all()) {
    const artwork = await video.evaluate(element =>
      (element as HTMLVideoElement).poster || getComputedStyle(element).backgroundImage)
    expect(artwork).toContain("-poster.webp")
  }
  await context.close()
})

test("releases prerendered content if the application bundle never arrives", async ({ page }) => {
  await page.route("**/assets/index-*.js", (route) => route.abort())
  await page.goto("/")
  await expect(page.locator("#work")).toBeVisible()
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
})

test("releases prerendered content if the portrait and the bundle both stall", async ({ page }) => {
  await holdPortrait(page)
  await page.route("**/assets/index-*.js", () => undefined)
  await page.goto("/", { waitUntil: "commit" })
  await expect(page.locator("#work")).toBeHidden()
  await expect(page.locator("#work")).toBeVisible({ timeout: 6000 })
})

test("the hero needs nothing but the HTML, and nothing gets ahead of it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  let releaseStyles!: () => void
  const stylesReady = new Promise<void>((resolve) => { releaseStyles = resolve })
  const artwork: string[] = []
  page.on("request", (request) => {
    if (/\/(Projects|writings|images|people|reactions)\//.test(request.url())) artwork.push(request.url())
  })
  await page.route("**/assets/*.js", () => undefined)
  await page.route("**/assets/index-*.css", async (route) => {
    await stylesReady
    await route.continue()
  })
  await page.goto("/", { waitUntil: "commit" })

  // No script, no stylesheet: the face and the top section still arrive in order.
  await expect(page.locator("html")).toHaveAttribute("data-avatar-intro", "portrait")
  await expect(page.locator(".mosaic-avatar-face-front .mosaic-avatar-portrait")).toBeVisible()
  await expect(page.locator(".mosaic-avatar-face-front .mosaic-avatar-portrait")).toHaveJSProperty("complete", true)
  await expect(page.locator("html")).toHaveAttribute("data-avatar-intro", "revealing")
  const name = page.getByRole("heading", { level: 1 })
  await expect(name).toBeVisible()
  await expect(page.locator(".mosaic-contact-pill-linkedin")).toBeVisible()

  // The tiles wait for their stylesheet, however long it takes.
  await page.waitForTimeout(1200)
  await expect(page.locator("html")).toHaveAttribute("data-avatar-intro", "revealing")
  await expect(page.locator("#work")).toBeHidden()
  expect(artwork).toEqual([])

  const measure = () => page.evaluate(() => [".mosaic-avatar-coin", ".mosaic-profile-meta", ".mosaic-work-history", ".mosaic-profile-contact", ".mosaic-section-corner"]
    .map((selector) => { const box = document.querySelector(selector)!.getBoundingClientRect(); return [box.x, box.y, box.width, box.height].map(Math.round) }))
  const before = await measure()
  releaseStyles()
  await expect(page.locator("html")).toHaveAttribute("data-avatar-intro", "tiles")
  await expect(page.locator("#work")).toBeVisible()
  // The inlined CSS laid the hero out exactly as the full stylesheet does.
  expect(await measure()).toEqual(before)
  await expect.poll(() => artwork.length).toBeGreaterThan(0)
  await expect(page.locator("video.mosaic-row-media").first()).toHaveAttribute("poster", /poster\.webp$/)
})

test("reveals the hero and shimmering tiles before the bundle arrives", async ({ page }) => {
  let releaseBundle!: () => void
  const bundleReady = new Promise<void>((resolve) => { releaseBundle = resolve })
  await page.route("**/assets/index-*.js", async (route) => {
    await bundleReady
    await route.continue()
  })
  await page.goto("/", { waitUntil: "commit" })

  await expect(page.locator("html")).toHaveAttribute("data-avatar-intro", "portrait")
  await expect(page.locator(".mosaic-profile-meta")).toBeHidden()
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  await expect(page.locator(".mosaic-avatar-face-front")).toBeVisible()
  await expect(page.locator(".mosaic-profile-meta")).toBeVisible()

  const tile = page.locator(".mosaic-row-card").filter({ has: page.locator("video.mosaic-row-media") }).first()
  const skeleton = tile.locator(".mosaic-row-media-skeleton")
  await expect(skeleton).toHaveCSS("opacity", "1")
  await expect(skeleton.locator(".mosaic-row-media-skeleton-sweep")).toHaveCSS("animation-name", "mosaic-media-shimmer")
  await expect(tile.locator(".mosaic-row-media")).toHaveCSS("opacity", "0")

  releaseBundle()
  await expect(skeleton).toHaveCSS("opacity", "0")
  await expect(tile.locator(".mosaic-row-media")).toHaveCSS("opacity", "1")
  await expect(skeleton.locator(".mosaic-row-media-skeleton-sweep")).toHaveCSS("animation-name", "none")
})

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`holds each tile's placeholder in its artwork's box at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
    const offsets = await page.locator(".mosaic-row-media-skeleton").evaluateAll((skeletons) => skeletons.map((skeleton) => {
      const box = skeleton.getBoundingClientRect()
      const media = skeleton.nextElementSibling!.getBoundingClientRect()
      return Math.max(
        Math.abs(box.x - media.x),
        Math.abs(box.y - media.y),
        Math.abs(box.width - media.width),
        Math.abs(box.height - media.height),
      )
    }))
    expect(offsets.length).toBeGreaterThan(5)
    for (const offset of offsets) expect(offset).toBeLessThan(1)

    // The wallet flow sits in the middle of a mat: its placeholder has that
    // shape, and leaves the file's empty margins alone.
    const wallet = page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).locator(".mosaic-row-media-skeleton")
    const drawn = await wallet.evaluate((svg: SVGSVGElement) => {
      const box = svg.querySelector("clipPath path") as SVGPathElement
      const { x, y, width, height } = box.getBBox()
      return { x, y, width, height, frame: svg.viewBox.baseVal.width, frameHeight: svg.viewBox.baseVal.height }
    })
    expect(drawn.x).toBeGreaterThan(0)
    expect(drawn.y).toBeGreaterThan(0)
    expect(drawn.width).toBeLessThan(drawn.frame * 0.95)
    expect(drawn.height).toBeLessThan(drawn.frameHeight * 0.95)

    // Stacking artwork over its placeholder must not reach the marketing wall,
    // whose posts are grid items with no placeholder.
    const posts = await page.locator(".mosaic-row-media-wall .mosaic-row-media").evaluateAll((images) => images.map((image) => {
      const { x, y } = image.getBoundingClientRect()
      return `${Math.round(x)},${Math.round(y)}`
    }))
    expect(posts.length).toBeGreaterThan(5)
    expect(new Set(posts).size).toBe(posts.length)
  })
}

for (const interrupt of ["keyboard", "resize", "reduced motion"] as const) {
  test(`ends a pending intro on ${interrupt} without replaying it`, async ({ page }) => {
    // Keep the portrait pending instead of racing its decode and animation.
    await holdPortrait(page)
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await expect(page.locator("#work")).toBeHidden()
    if (interrupt === "keyboard") await page.keyboard.press("Tab")
    if (interrupt === "resize") await page.setViewportSize({ width: 390, height: 844 })
    if (interrupt === "reduced motion") await page.emulateMedia({ reducedMotion: "reduce" })
    await expect(page.locator("#work")).toBeVisible()
    await releasePortrait(page)
    await page.waitForLoadState("load")
    await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro", "pending")
    if (interrupt === "keyboard") await expect(page.locator(".skip-link")).toBeFocused()
  })
}


test("avatar greeting plays on hover and opens the conversation on request", async ({ page }) => {
  await page.goto("/")
  const avatar = page.locator(".mosaic-avatar-button")
  const teaser = avatar.locator("video")
  await expect(teaser).toHaveCount(0)
  await avatar.hover()
  await expect(teaser).toBeVisible()
  await expect.poll(() => teaser.evaluate(video => (video as HTMLVideoElement).currentTime)).toBeGreaterThan(0)
  await page.mouse.move(0, 0)
  await expect(teaser).toHaveCount(0)
  await avatar.click()
  await expect(page.getByRole("dialog", { name: "Chat with Rafael Medina" })).toBeVisible()
  await expect(page.locator("video[data-recording][src]")).toHaveCount(0)
  await page.keyboard.press("Escape")
  await expect(avatar).toBeFocused()
  // Focus coming home from the booking must not restart the greeting.
  await expect(teaser).toHaveCount(0)
  await page.mouse.move(0, 0)
  await expect(teaser).toHaveCount(0)
  // A fresh hover asks again, and so does coming back by keyboard.
  await avatar.hover()
  await expect(teaser).toBeVisible()
  await page.mouse.move(0, 0)
  await page.keyboard.press("Tab")
  await page.keyboard.press("Shift+Tab")
  await expect(avatar).toBeFocused()
  await expect(teaser).toBeVisible()
})

test("reduced motion keeps the avatar greeting still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const avatar = page.locator(".mosaic-avatar-button")
  await avatar.hover()
  await expect(avatar.locator("video")).toHaveCount(0)
  await avatar.focus()
  await expect(avatar.locator("video")).toHaveCount(0)
})
