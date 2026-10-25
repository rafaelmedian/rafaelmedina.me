import { expect, test } from "@playwright/test"

// A case-study screenshot grows out of the card to fill the screen. The zoom
// owns Escape: it shrinks back into the card, the gallery stays open where the
// reader left it, and focus returns to the picture they pressed.
test("a case-study image zooms and Escape puts it back without closing the gallery", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/work/moodys-design-sprints/")
  const gallery = page.getByRole("dialog").first()
  await expect(gallery).toBeVisible()

  const trigger = page.getByRole("button", { name: "Enlarge: An analyst’s comment beside the passage it explains" })
  await trigger.scrollIntoViewIfNeeded()
  const card = page.locator(".preview-gallery-card").first()
  await expect.poll(() => card.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
  const scrolled = await card.evaluate(element => element.scrollTop)

  await trigger.click()
  const zoom = page.locator("dialog.image-zoom[open]")
  await expect(zoom).toBeVisible()
  await expect(zoom).toHaveAttribute("data-ready", "true")
  await expect(zoom.getByRole("button", { name: "Close" })).toBeFocused()
  // The enlarged picture is wider than the one in the column.
  const inline = await trigger.locator("img").boundingBox()
  await expect.poll(async () => (await zoom.locator("img").boundingBox())?.width ?? 0)
    .toBeGreaterThan(inline!.width * 1.4)
  // Opening the zoom must not move the card behind it.
  expect(await card.evaluate(element => element.scrollTop)).toBe(scrolled)

  await page.keyboard.press("Escape")
  await expect(page.locator("dialog.image-zoom")).toHaveCount(0)
  await expect(gallery).toBeVisible()
  await expect(trigger).toBeFocused()
  expect(await card.evaluate(element => element.scrollTop)).toBe(scrolled)
})

test("a press anywhere on the zoom closes it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/work/twilio-admiral/")
  const trigger = page.getByRole("button", { name: "Enlarge: Editing an access policy, before and after" })
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  const zoom = page.locator("dialog.image-zoom[open]")
  await expect(zoom).toHaveAttribute("data-ready", "true")
  await zoom.click({ position: { x: 24, y: 24 } })
  await expect(page.locator("dialog.image-zoom")).toHaveCount(0)
  await expect(page.getByRole("dialog").first()).toBeVisible()
})

// Prototype loops cost nothing until a reader opens the project and reaches
// them, and someone who asked for reduced motion never downloads them.
test("prototype loops load only once their still is in view", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const loops: string[] = []
  page.on("request", (request) => {
    if (/onit-process-builder-.*\.webm$/.test(request.url())) loops.push(request.url())
  })
  await page.goto("/work/onit-process-builder/")
  await expect(page.getByRole("dialog").first()).toBeVisible()
  expect(loops).toHaveLength(0)

  const trigger = page.getByRole("button", { name: "Enlarge: Editing an action block" })
  await trigger.scrollIntoViewIfNeeded()
  await expect.poll(() => loops.length).toBeGreaterThan(0)
  await expect(trigger.locator("video")).toHaveAttribute("data-started", "true")
})

test("reduced motion keeps the prototype stills", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  const loops: string[] = []
  page.on("request", (request) => {
    if (request.url().endsWith(".webm") && request.url().includes("onit-process-builder-")) loops.push(request.url())
  })
  await page.goto("/work/onit-process-builder/")
  const trigger = page.getByRole("button", { name: "Enlarge: Editing an action block" })
  await trigger.scrollIntoViewIfNeeded()
  await expect(trigger.locator("img")).toBeVisible()
  await page.waitForTimeout(500)
  expect(loops).toHaveLength(0)
  await expect(trigger.locator("video")).toHaveCount(0)
})

test("every project carries its year ahead of the title", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/work/moodys-design-sprints/")
  const dialog = page.getByRole("dialog").first()
  await expect(dialog.locator(".preview-gallery-heading")).toHaveText(/^2021\s*Moody’s Research Views$/)
  // Beside the heading, not inside it, so the dialog is still named for the project.
  await expect(dialog.locator(".preview-gallery-title")).toHaveText("Moody’s Research Views")
  await expect(dialog).toHaveAccessibleName("Moody’s Research Views")
})
