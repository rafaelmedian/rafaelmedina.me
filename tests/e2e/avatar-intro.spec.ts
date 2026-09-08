import { expect, test } from "@playwright/test"

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`animates the stationary portrait before staggering content at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    // Hold the actual asset so we can inspect the pre-reveal frame reliably.
    let releasePortrait!: () => void
    const portraitReady = new Promise<void>((resolve) => { releasePortrait = resolve })
    await page.route("**/profile-photo*.webp", async (route) => {
      await portraitReady
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
    releasePortrait()

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
      ".mosaic-row:first-child",
    ].join(",")).evaluateAll((elements) => elements.map((element) => {
      const style = getComputedStyle(element)
      return {
        animationName: style.animationName,
        delay: Number.parseFloat(style.animationDelay) * 1000,
      }
    }))
    expect(delays).toHaveLength(6)
    expect(delays.map(({ animationName }) => animationName)).toEqual(Array(6).fill("avatar-intro-content"))
    expect(delays.map(({ delay }) => delay).sort((a, b) => a - b)).toEqual([0, 60, 120, 180, 240, 300])

    await expect(html).not.toHaveAttribute("data-avatar-intro")
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

test("reveals the page when the portrait fails to load", async ({ page }) => {
  await page.route("**/profile-photo*.webp", (route) => route.abort())
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
  await context.close()
})

test("releases prerendered content if the application bundle never arrives", async ({ page }) => {
  await page.route("**/assets/index-*.js", (route) => route.abort())
  await page.goto("/")
  await expect(page.locator("#work")).toBeHidden()
  await expect(page.locator("#work")).toBeVisible({ timeout: 6000 })
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro", "pending")
})

for (const interrupt of ["keyboard", "resize", "reduced motion"] as const) {
  test(`ends a pending intro on ${interrupt} without replaying it`, async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("#work")).toBeHidden()
    if (interrupt === "keyboard") await page.keyboard.press("Tab")
    if (interrupt === "resize") await page.setViewportSize({ width: 390, height: 844 })
    if (interrupt === "reduced motion") await page.emulateMedia({ reducedMotion: "reduce" })
    await expect(page.locator("#work")).toBeVisible()
    await page.waitForLoadState("load")
    await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro", "pending")
    if (interrupt === "keyboard") await expect(page.locator(".skip-link")).toBeFocused()
  })
}
