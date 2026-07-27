import { expect, test } from "@playwright/test"

const mobileViewport = { width: 390, height: 844 }

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

test("keeps gallery controls inside the mobile viewport and exposes a close button", async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto("/")
  await page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)")

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

test("returns focus to the originating project after closing the gallery", async ({ page }) => {
  await page.goto("/")
  const trigger = page.getByRole("button", { name: /Open Matcha - Multiwallet flow/ })
  await trigger.focus()
  await trigger.press("Enter")
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})

test("keeps a semantic disclosure control while work-history details are expanded", async ({ page }) => {
  await page.goto("/")
  const disclosure = page.getByRole("button", { name: "0x.org and Matcha.xyz" })
  await disclosure.click()

  const expandedControl = page.getByRole("button", { name: "Collapse 0x.org and Matcha.xyz details" })
  await expect(expandedControl).toHaveAttribute("aria-expanded", "true")
  const controlledId = await expandedControl.getAttribute("aria-controls")
  expect(controlledId).toBeTruthy()
  await expect(page.locator(`#${controlledId}`)).toBeVisible()

  await expandedControl.focus()
  await expandedControl.press("Enter")
  await expect(page.getByRole("button", { name: "0x.org and Matcha.xyz" })).toBeVisible()
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
