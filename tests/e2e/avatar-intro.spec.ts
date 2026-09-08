import { expect, test } from "@playwright/test"

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`keeps the header portrait still before revealing content at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    // Hold the actual asset so we can inspect the pre-reveal frame reliably.
    let releasePortrait!: () => void
    const portraitReady = new Promise<void>((resolve) => { releasePortrait = resolve })
    await page.route("**/profile-photo*.webp", async (route) => {
      await portraitReady
      await route.continue()
    })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const portrait = page.locator(".mosaic-avatar-face-front")
    await expect(portrait).toBeVisible()
    const start = await portrait.boundingBox()
    expect(Math.abs(start!.x + start!.width / 2 - viewport.width / 2)).toBeLessThan(1)
    expect(start!.y).toBeLessThan(100)
    await expect(page.locator(".mosaic-profile-meta")).toBeHidden()
    await expect(page.locator("#work")).toBeHidden()
    releasePortrait()

    // Every frame must keep the actual face at its final header geometry.
    const frames = await page.evaluate(async () => {
      const samples: { x: number; y: number; width: number; hidden: boolean }[] = []
      const portrait = document.querySelector(".mosaic-avatar-face-front")!
      while (document.documentElement.dataset.avatarIntro === "pending") {
        const rect = portrait.getBoundingClientRect()
        samples.push({
          x: rect.x, y: rect.y, width: rect.width,
          hidden: getComputedStyle(document.querySelector("#work")!).visibility === "hidden",
        })
        await new Promise(requestAnimationFrame)
      }
      return samples
    })
    expect(frames.length).toBeGreaterThan(2)
    expect(frames.every((sample) => sample.hidden)).toBe(true)
    const end = await portrait.boundingBox()
    for (const frame of [...frames, start!]) {
      expect(frame.x).toBeCloseTo(end!.x, 1)
      expect(frame.y).toBeCloseTo(end!.y, 1)
      expect(frame.width).toBeCloseTo(end!.width, 1)
    }
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
