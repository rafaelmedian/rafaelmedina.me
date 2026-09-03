import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

import { expect, type Page, test } from "@playwright/test"
import * as ts from "typescript"

const openDesignSystem = async (page: Page) => {
  await page.goto("/design-system")
  await expect(page.getByRole("heading", { name: "Design system" })).toBeVisible()
}

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
  for (const file of ["src/index.css", "src/components/design-system.css"]) {
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
