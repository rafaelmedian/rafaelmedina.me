import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

import { expect, type Page, test } from "@playwright/test"
import * as ts from "typescript"

const openDesignSystem = async (page: Page) => {
  await page.goto("/design-system")
  await expect(page.getByRole("heading", { name: "Design system" })).toBeVisible()
}

test("documents the caption dropping out where there is no hover", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await expect(page.locator(".mosaic-row-card-title").first()).toHaveCSS("display", "none")
  await expect(page.locator(".mosaic-row-card-scrim").first()).toHaveCSS("display", "none")
  await openDesignSystem(page)
  const captionRule = page.locator("#elevation .ds-rule")
  await expect(captionRule).toContainText("entire scrim is hidden")
  await expect(captionRule).toContainText("and so is the caption")
  await expect(captionRule).not.toContainText("rgb(20 20 20 / 0.82)")
})

const customPropertyPattern = /^--[\w-]+$/
const cssVariablePattern = /var\((--[\w-]+)/g

const findCssCustomPropertyReferences = (text: string) =>
  new Set(
    [...text.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(cssVariablePattern)].map((match) => match[1]),
  )

const findScriptCustomPropertyReferences = (text: string, fileName = "source.tsx") => {
  const references = new Set<string>()
  const scriptKind = fileName.endsWith(".tsx")
    ? ts.ScriptKind.TSX
    : fileName.endsWith(".js")
      ? ts.ScriptKind.JS
      : ts.ScriptKind.TS
  const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, scriptKind)

  const addCssVariables = (value: string) => {
    for (const match of value.matchAll(cssVariablePattern)) references.add(match[1])
  }

  const isStyleContext = (node: ts.Node) => {
    for (let current: ts.Node | undefined = node.parent; current; current = current.parent) {
      if (ts.isJsxAttribute(current) && current.name.getText(source) === "style") return true
      if (
        ts.isPropertyAssignment(current) &&
        ts.isIdentifier(current.name) &&
        current.name.text === "style"
      ) return true
      if (
        ts.isVariableDeclaration(current) &&
        ts.isIdentifier(current.name) &&
        /style$/i.test(current.name.text)
      ) return true
      if (
        ts.isCallExpression(current) &&
        ts.isPropertyAccessExpression(current.expression) &&
        ["getPropertyValue", "removeProperty", "setProperty"].includes(current.expression.name.text)
      ) return true
    }
    return fileName === "tailwind.config.js"
  }

  const visit = (node: ts.Node) => {
    if (ts.isStringLiteralLike(node) && isStyleContext(node)) addCssVariables(node.text)

    if (ts.isPropertyAssignment(node) && ts.isStringLiteralLike(node.name) && isStyleContext(node)) {
      if (customPropertyPattern.test(node.name.text)) references.add(node.name.text)
    }

    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      ["getPropertyValue", "removeProperty", "setProperty"].includes(node.expression.name.text)
    ) {
      const property = node.arguments[0]
      if (property && ts.isStringLiteralLike(property) && customPropertyPattern.test(property.text)) {
        references.add(property.text)
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(source)
  return references
}

test("grades meaningful non-text colors against the 3:1 threshold", async ({ page }) => {
  // --accent used to sit on the booking pill's status dot, which rested visible
  // and could be read straight off the page. The copy confirmation is its only
  // wearer now, so the live sample has to be earned with a click -- and a real
  // writeText rejects on a page that is not the frontmost one, which several
  // parallel workers guarantee for most of them. The address's fallback for a
  // rejection is a mailto: navigation, so the check would never appear. The
  // colour is the subject here, not the clipboard, so the write is stubbed out.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    })
  })
  await page.goto("/")
  await page.locator(".mosaic-social-corner .mosaic-profile-email").click()
  const icon = page.locator('.mosaic-social-corner .mosaic-profile-email[data-copied="true"] .mosaic-profile-email-icon')
  // The check fades from --ink to --accent, and a colour read mid-transition is
  // neither value -- so wait the transition out before sampling it.
  await icon.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
  const liveAccentColor = await icon.evaluate((element) => getComputedStyle(element).color)

  await openDesignSystem(page)

  const accentSwatch = page.locator("#colour .ds-swatch-card").filter({ hasText: "Copied" })
  const badge = accentSwatch.locator(".ds-ratio")
  const documentedAccentColor = await accentSwatch
    .locator(".ds-swatch")
    .evaluate((swatch) => getComputedStyle(swatch).backgroundColor)

  expect(documentedAccentColor).toBe(liveAccentColor)
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
  await page.goto("/")
  await page.getByRole("button", { name: "Open résumé" }).click()
  const resumeTitleWeight = await page
    .getByRole("dialog", { name: "Work history" })
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
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")

  const curves = await page.evaluate(() => {
    const firstBezier = (value: string) => value.match(/cubic-bezier\([^)]*\)/)?.[0] ?? ""
    const avatar = getComputedStyle(document.querySelector(".mosaic-avatar-coin-inner") as Element)
    const workHistory = getComputedStyle(document.querySelector(".mosaic-work-history") as Element)

    return [
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

test("refreshes token values, specimens, and contrast when the stylesheet changes", async ({ page }) => {
  await openDesignSystem(page)

  await page.addStyleTag({ content: `:root {
    --canvas: #fafafa;
    --accent: #225588;
    --text-md: 1.0625rem;
    --radius-md: 18px;
    --duration-quick: 170ms;
    --ease-standard: cubic-bezier(0.1, 0.2, 0.3, 1);
  }` })

  const accent = page.locator("#colour .ds-swatch-card").filter({ hasText: "Copied" })
  await expect(accent).toContainText("#225588")
  await expect(accent.locator(".ds-swatch")).toHaveCSS("background-color", "rgb(34, 85, 136)")
  await expect(accent.locator(".ds-ratio")).toContainText("7.39:1")
  await expect(page.locator("#typography .ds-type-row").filter({ hasText: "--text-md" })).toContainText("1.0625rem · 17px")
  await expect(page.locator("#space .ds-card").filter({ hasText: "--radius-md" })).toContainText("18px")
  await expect(page.locator("#motion tr").filter({ has: page.locator("td:first-child", { hasText: "--duration-quick" }) })).toContainText("170ms")
  await expect(page.locator("#motion .ds-motion-card").filter({ hasText: "--ease-standard" })).toContainText("cubic-bezier(0.1, 0.2, 0.3, 1)")

  await page.getByRole("searchbox").fill("#225588")
  await expect(accent).toBeVisible()
  await page.addStyleTag({ content: ":root { --accent: #334455; }" })
  await expect(accent).toBeHidden()
  await page.getByRole("searchbox").fill("#334455")
  await expect(accent).toBeVisible()
  await page.getByRole("searchbox").clear()
  await page.addStyleTag({ content: ":root { --accent: rgb(34 85 136); }" })
  await expect(accent.locator(".ds-swatch")).toHaveCSS("background-color", "rgb(34, 85, 136)")
  await expect(accent.locator(".ds-ratio")).toContainText("7.39:1")
})

// Guards the invariant behind the token cleanup: a custom property defined in
// the stylesheets must be consumed somewhere (CSS var(), a JS property read,
// or the Tailwind config) — otherwise it is drift and should be deleted, not
// documented. Prose mentions on the design-system page do not count.
test("every custom property defined in the stylesheets is referenced", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((entry) => {
      const path = join(dir, entry)
      if (statSync(path).isDirectory()) return walk(path)
      return /\.(ts|tsx|css|html)$/.test(path) ? [path] : []
    })

  const definitions = new Set<string>()
  for (const file of walk("src").filter((path) => path.endsWith(".css"))) {
    const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "")
    for (const match of css.matchAll(/^\s*(--[\w-]+)\s*:/gm)) {
      definitions.add(match[1])
    }
  }

  const references = new Set<string>()
  for (const file of [...walk("src"), "tailwind.config.js", "index.html"]) {
    const text = readFileSync(file, "utf8")
    const tokens = file.endsWith(".css") || file.endsWith(".html")
      ? findCssCustomPropertyReferences(text)
      : findScriptCustomPropertyReferences(text, file)
    for (const token of tokens) references.add(token)
  }

  const unreferenced = [...definitions].filter((token) => !references.has(token))
  expect(unreferenced).toEqual([])
})

test("does not count documented custom property names as references", () => {
  const scriptReferences = findScriptCustomPropertyReferences(`
    const documentation = { token: "--documented-only" }
    const documentationWithSyntax = "Use var(--documented-variable) for overlays"
    // Neither \`--comment-only\` nor var(--comment-variable) is a live reference.
    element.style.setProperty("--live-property", "1")
    const style = { "--live-inline-property": "1", zIndex: "var(--live-value)" }
  `)
  const cssReferences = findCssCustomPropertyReferences(`
    /* var(--documented-css-variable) */
    .example { color: var(--live-css-value); }
  `)

  expect([...scriptReferences].sort()).toEqual(["--live-inline-property", "--live-property", "--live-value"])
  expect([...cssReferences]).toEqual(["--live-css-value"])
})
