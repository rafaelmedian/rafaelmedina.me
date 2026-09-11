import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

test("long gallery cards keep equal top and bottom desktop gutters", async ({ page }) => {
  for (const viewport of [{ width: 2394, height: 1279 }, { width: 1024, height: 768 }]) {
    await page.setViewportSize(viewport)
    await page.goto("/work/protector-booking/")
    const card = page.locator(".preview-gallery-card")
    await expect(card).toBeVisible()
    await expect.poll(async () => card.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return Math.abs(rect.top - (window.innerHeight - rect.bottom))
    })).toBeLessThan(1)
  }
})

test("project URLs follow selection and browser Back and Forward", async ({ page }) => {
  await page.goto("/?ref=portfolio")
  const trigger = page.getByRole("link", { name: /Open Matcha multiwallet flow/ })
  await trigger.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page).toHaveURL(/\/work\/matcha-multiwallet-flow\/\?ref=portfolio$/)
  await page.getByRole("button", { name: "Next preview", exact: true }).click()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha homepage")
  await expect(page).toHaveURL(/\/work\/matcha-homepage\/\?ref=portfolio$/)
  await expect(page).toHaveTitle("Matcha homepage — Rafael Medina")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://rafaelmedina.me/work/matcha-homepage/")
  await page.goBack()
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
  await expect(page).toHaveTitle("Rafael Medina — Senior Product Designer")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://rafaelmedina.me/")
  await expect(trigger).toBeFocused()
  await page.goForward()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha homepage")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
})

test("closing a locally opened project consumes its history entry", async ({ page }) => {
  await page.goto("/?from=previous")
  await page.goto("/?ref=portfolio")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  await expect(page.getByRole("dialog")).toBeVisible()

  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)

  await page.goBack()
  await expect(page).toHaveURL(/\?from=previous$/)
})

test("browser Back during a preview switch keeps the gallery closed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/?ref=portfolio")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  await expect(page.getByRole("dialog")).toBeVisible()

  await page.getByRole("button", { name: "Next preview", exact: true }).click()
  await page.goBack()
  await expect(page).toHaveURL(/\?ref=portfolio$/)

  // Cross the delayed preview-selection boundary; a stale callback must not
  // write the next project back into the URL and reopen the dialog.
  await page.waitForTimeout(300)
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
})

test("a bookmarked project opens after hydration and refresh and closes locally", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/?ref=shared&project=preview-protector")
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Protector booking")
  await page.reload()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Protector booking")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=shared$/)
  expect(errors).toEqual([])
})

test("a shared project path opens over the gallery and closes into it", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/work/popparazi-v1/?ref=shared")
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Popparazi V1")
  await expect(page.getByRole("button", { name: "Next preview", exact: true })).toBeVisible()

  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\/\?ref=shared$/)
  await expect(page.getByRole("heading", { name: "Rafael Medina", exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test("Matcha contents appears after the first section and keeps author credits distinct from signatures", async ({ page }) => {
  await page.setViewportSize({ width: 2394, height: 400 })
  await page.goto("/work/matcha-homepage/")

  const dialog = page.getByRole("dialog")
  await expect(dialog).toHaveAccessibleName("Matcha homepage")
  await expect(dialog.getByRole("heading", { name: "Helping people find their next token" })).toBeVisible()
  await expect(dialog.locator(".project-case-study-kicker")).toHaveCount(0)
  const contents = dialog.locator('.writing-contents[aria-label="Case study contents"]')
  await expect(contents).toBeHidden()
  await expect(contents.locator(".article-contents-title")).toHaveCount(0)
  await expect(dialog.locator(".project-case-study-introduction li")).toHaveCount(2)
  await expect(dialog.locator(".preview-gallery-team")).toBeVisible()
  const cardSurface = dialog.locator(".preview-gallery-card")
  await cardSurface.evaluate((element) => {
    const second = element.querySelectorAll(".project-case-study-section")[1]
    element.scrollTop += second.getBoundingClientRect().top - element.getBoundingClientRect().top - 44
  })
  await expect(contents).toBeVisible()
  await expect(contents.getByRole("button")).toHaveText("Discovery before a decision")
  await expect(contents.locator('[aria-current="location"]')).toHaveText("Discovery before a decision")
  await contents.getByRole("button").click()
  await expect(contents.getByRole("link")).toHaveCount(3)
  const originalUrl = page.url()
  await contents.getByRole("link", { name: "Discovery before a decision", exact: true }).click()
  await expect(page).toHaveURL(originalUrl)
  await expect(contents.getByRole("button")).toHaveAttribute("aria-expanded", "false")
  await expect(contents).toHaveCSS("position", "sticky")
  const stickyTop = (await contents.boundingBox())?.y
  expect(stickyTop).toBeCloseTo((await cardSurface.boundingBox())!.y, 0)
  expect((await contents.boundingBox())!.width).toBeCloseTo((await cardSurface.boundingBox())!.width, 0)
  await cardSurface.evaluate((element) => (element as HTMLElement).scrollBy({ top: 320, behavior: "instant" }))
  await expect(contents.getByRole("button")).toHaveText("Finding the next step")
  expect((await contents.boundingBox())?.y).toBeCloseTo(stickyTop ?? 0, 0)
  await expect(dialog.locator(".project-case-study-section")).toHaveCount(3)
  await expect(dialog.locator(".preview-gallery-media-frame")).toHaveCount(1)
  await expect(dialog.locator(".project-case-study-media")).toHaveCount(0)

  const bodySizes = await dialog.locator(".project-case-study-list li, .preview-gallery-description")
    .evaluateAll((elements) => [...new Set(elements.map((element) => getComputedStyle(element).fontSize))])
  expect(bodySizes).toEqual(["14px"])

  const signatures = dialog.locator(".project-case-study-signatures")
  await expect(signatures).toHaveCount(0)
  await expect(dialog.locator(".project-case-study-copy p")).toHaveCount(0)
  await expect(dialog.locator(".project-case-study-copy li")).toHaveCount(5)

  await cardSurface.evaluate(element => { element.scrollTop = 0 })
  await expect(contents).toBeHidden()
  await expect(contents.locator(".writing-contents-current")).toHaveText("Contents")
  await expect(contents.locator('[aria-current="location"]')).toHaveCount(0)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  const story = page.getByRole("dialog").locator(".project-case-study-body")
  await expect(story).toBeVisible()
  expect(await story.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
})

test("an unknown project URL keeps the portfolio usable", async ({ page }) => {
  await page.goto("/?project=missing")
  await expect(page.getByRole("heading", { name: "Rafael Medina", exact: true })).toBeVisible()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await page.getByRole("link", { name: /Open Matcha multiwallet flow/ }).click()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha multiwallet flow")
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
})

test("closing About clears its hash without removing other query parameters", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/?ref=portfolio")
  await page.getByRole("link", { name: "About", exact: true }).click()
  await expect(page).toHaveURL(/\?ref=portfolio#about-panel$/)
  await page.getByRole("button", { name: "Close about", exact: true }).click()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
  await expect(page.locator("#portfolio-title")).toBeFocused()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test("closing a locally opened About section consumes its history entry", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/?from=previous")
  await page.goto("/?ref=portfolio")
  await page.getByRole("link", { name: "About", exact: true }).click()

  await page.getByRole("button", { name: "Close about", exact: true }).click()
  await expect(page).toHaveURL(/\?ref=portfolio$/)

  await page.goBack()
  await expect(page).toHaveURL(/\?from=previous$/)
})

test("the avatar opens chat without replacing the portfolio URL", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Ask about Rafael Medina" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page).toHaveURL(/\/$/)
})
