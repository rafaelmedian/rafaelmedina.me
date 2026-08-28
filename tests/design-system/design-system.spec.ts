import { expect, type Page, test } from "@playwright/test"

const openDesignSystem = async (page: Page) => {
  await page.goto("/design-system")
  await expect(page.getByRole("heading", { name: "Design system" })).toBeVisible()
}

test("grades meaningful non-text colors against the 3:1 threshold", async ({ page }) => {
  await page.goto("/")
  const liveAvailabilityColor = await page
    .locator(".mosaic-availability-dot")
    .evaluate((dot) => getComputedStyle(dot).backgroundColor)

  await openDesignSystem(page)

  const availabilitySwatch = page.locator("#colour .ds-swatch-card").filter({ hasText: "Available" })
  const badge = availabilitySwatch.locator(".ds-ratio")
  const documentedAvailabilityColor = await availabilitySwatch
    .locator(".ds-swatch")
    .evaluate((swatch) => getComputedStyle(swatch).backgroundColor)

  expect(documentedAvailabilityColor).toBe(liveAvailabilityColor)
  await expect(badge).toHaveAttribute("data-pass", "pass")
  await expect(badge).toContainText("AA non-text")
})

test("documents the computed corner-navigation stacking layers", async ({ page }) => {
  await page.goto("/")

  const layers = await page.evaluate(() => ({
    sections: getComputedStyle(document.querySelector(".mosaic-section-corner") as Element).zIndex,
    social: getComputedStyle(document.querySelector(".mosaic-social-corner") as Element).zIndex,
  }))

  await openDesignSystem(page)
  const stacking = page.locator("#layout .ds-subhead").filter({ hasText: "Stacking" }).locator("..")

  await expect(stacking).toContainText(`${layers.sections} / ${layers.social}`)
})

test("documents the computed navigation hit area", async ({ page }) => {
  await page.goto("/")

  const hitArea = await page
    .getByRole("navigation", { name: "Sections" })
    .getByRole("link", { name: "About", exact: true })
    .evaluate((link) => getComputedStyle(link, "::before").height)

  await openDesignSystem(page)
  const controlsCaption = page.locator("#components .ds-caption").filter({ hasText: "tap target" })

  await expect(controlsCaption).toContainText(hitArea)
})

test("documents the computed resume-title weight", async ({ page }) => {
  await page.goto("/#about-panel-resume")
  const resumeTitleWeight = await page
    .locator(".mosaic-about-resume-title")
    .first()
    .evaluate((title) => getComputedStyle(title).fontWeight)

  await openDesignSystem(page)
  const weightRow = page
    .locator("#typography table tbody tr")
    .filter({ has: page.getByRole("cell", { name: resumeTitleWeight, exact: true }) })

  await expect(weightRow).toContainText("résumé titles and companies")
})

test("documents component-specific motion curves that still ship", async ({ page }) => {
  await page.goto("/")

  const curves = await page.evaluate(() => {
    const firstBezier = (value: string) => value.match(/cubic-bezier\([^)]*\)/)?.[0] ?? ""
    const hero = getComputedStyle(document.querySelector(".mosaic-hero") as Element)
    const avatar = getComputedStyle(document.querySelector(".mosaic-avatar-coin-inner") as Element)
    const workHistory = getComputedStyle(document.querySelector(".mosaic-work-history") as Element)

    return [
      firstBezier(hero.transitionTimingFunction),
      firstBezier(avatar.transitionTimingFunction),
      firstBezier(workHistory.getPropertyValue("--mosaic-popover-exit-ease")),
    ]
  })

  await page
    .locator(".mosaic-rows")
    .evaluate((element) => Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)))
  await page.locator(".mosaic-row-card").first().click()
  const galleryCurve = await page.locator(".preview-gallery-popup").evaluate((popup) => {
    const value = getComputedStyle(popup).getPropertyValue("--pg-open-ease")
    return value.match(/cubic-bezier\([^)]*\)/)?.[0] ?? ""
  })
  curves.push(galleryCurve)

  await openDesignSystem(page)
  const documentedCurves = await page.locator("#motion code").allTextContents()

  for (const curve of curves) {
    expect(documentedCurves).toContain(curve)
  }
})
