import { expect, test, type Page } from "@playwright/test"

// Exercise native tabs in full Chromium. The headless shell can receive the
// destination HTML yet leave a modified-click tab on its provisional document.
test.use({ channel: "chromium" })

/** The card's real pixel size next to the one its meta tags promise. */
function socialImageSize(page: Page) {
  return page.evaluate(async () => {
    const content = (property: string) => document.querySelector(`meta[property="${property}"]`)!.getAttribute("content")!
    const image = new Image()
    image.src = new URL(content("og:image")).pathname
    await image.decode()
    return {
      actual: [image.naturalWidth, image.naturalHeight],
      declared: [Number(content("og:image:width")), Number(content("og:image:height"))],
    }
  })
}

test("project pages ship distinct metadata and readable content without JavaScript", async ({ browser, request, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  for (const [slug, title] of [
    ["matcha-multiwallet-flow", "Matcha multiwallet flow"],
    ["protector-booking", "Protector booking"],
  ]) {
    const path = `/work/${slug}/`
    await page.goto(path)
    await expect(page).toHaveTitle(`${title} — Rafael Medina`)
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://rafaelmedina.me${path}`)
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `https://rafaelmedina.me${path}`)
    const image = await page.locator('meta[property="og:image"]').getAttribute("content")
    expect(image).toMatch(/^https:\/\/rafaelmedina.me\/Projects\//)
    expect((await request.get(new URL(image!).pathname)).ok()).toBe(true)
    await expect(page.getByText("Role", { exact: true })).toBeVisible()
    await expect(page.getByText("Outcome", { exact: true })).toBeVisible()
    await expect(page.getByRole("link", { name: "All work" })).toHaveAttribute("href", "/#work")
    const sitemap = await (await request.get("/sitemap.xml")).text()
    expect(sitemap).toContain(`https://rafaelmedina.me${path}`)
  }
  await context.close()
})

// The résumé is a gallery item like a project, so it has a page of its own for
// the same reasons: a shared link has to answer for itself in HTML.
test("the resume page ships its own metadata and the whole history without JavaScript", async ({ browser, request, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()

  await page.goto("/resume/")
  await expect(page).toHaveTitle("Résumé — Rafael Medina")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://rafaelmedina.me/resume/")
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://rafaelmedina.me/resume/")
  const image = await page.locator('meta[property="og:image"]').getAttribute("content")
  expect(image).toBe("https://rafaelmedina.me/rafael-medina-resume-preview.png")
  expect((await request.get(new URL(image!).pathname)).ok()).toBe(true)

  // Jobs are the history list's own children; an entry with two points nests a
  // list of its own inside them.
  await expect(page.getByRole("list", { name: "Work history" }).locator(":scope > li")).toHaveCount(6)
  await expect(page.getByRole("list", { name: "Education" }).getByRole("listitem")).toHaveCount(2)
  // The page's own h1 is "Work history", so the entries under it are h2 and
  // the schools h3: the same component sits under an h2 in the About sheet,
  // where it renders one level down.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Work history")
  await expect(page.getByRole("heading", { level: 2, name: "Senior Product Designer at 0x Project" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "Education" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(2)
  await expect(page.getByRole("link", { name: "View resume PDF" })).toHaveAttribute("href", "/rafael-medina-resume.pdf")
  await expect(page.getByRole("link", { name: "All work" })).toHaveAttribute("href", "/#work")

  const sitemap = await (await request.get("/sitemap.xml")).text()
  expect(sitemap).toContain("https://rafaelmedina.me/resume/")
  await context.close()
})

// A note has a page for the same reason: it is the one long-form thing on the
// site, and a link to one has to answer for itself in HTML rather than depend
// on the folder's reader having loaded.
test("note pages ship their own metadata and the whole article without JavaScript", async ({ browser, request, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  const sitemap = await (await request.get("/sitemap.xml")).text()

  for (const [id, title, image] of [
    // One with a cover of its own, and one that falls back to the site's card.
    ["designing-matcha", "Designing Matcha", "https://rafaelmedina.me/Projects/shot-small-16-poster.webp"],
    ["a-song-we-all-know", "A song we all know", "https://rafaelmedina.me/og-image.png"],
  ]) {
    const path = `/notes/${id}/`
    await page.goto(path)
    await expect(page).toHaveTitle(`${title} — Rafael Medina`)
    await expect(page.getByRole("heading", { level: 1, name: title, exact: true })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://rafaelmedina.me${path}`)
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `https://rafaelmedina.me${path}`)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", image)
    expect((await request.get(new URL(image).pathname)).ok()).toBe(true)
    const description = await page.locator('meta[name="description"]').getAttribute("content")
    expect(description!.length).toBeGreaterThan(60)
    // The whole article, not a stub: prose, the marginalia, and the way out.
    expect(await page.locator(".writing-reader-prose p").count()).toBeGreaterThan(2)
    expect(await page.locator(".writing-margin-note").count()).toBeGreaterThan(0)
    await expect(page.getByRole("link", { name: "All work" })).toHaveAttribute("href", "/#work")
    // Without JavaScript "More articles" is a set of ordinary links.
    await expect(page.locator(".writing-more a").first()).toHaveAttribute("href", /^\/notes\//)
    await expect(page.getByRole("link", { name: "Copy a link to this note" }))
      .toHaveAttribute("href", `https://rafaelmedina.me${path}`)
    expect(sitemap).toContain(`https://rafaelmedina.me${path}`)
  }
  await context.close()
})

test("standalone note annotations remain readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/notes/project-context-in-markdown/")
    const notes = await page.locator(".writing-margin-note").evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect()
      const label = element.querySelector(".writing-margin-note-label")!
      return { width: rect.width, left: rect.left, right: rect.right,
        lines: label.getBoundingClientRect().height / parseFloat(getComputedStyle(label).lineHeight) }
    }))
    expect(notes.length).toBeGreaterThan(0)
    for (const note of notes) {
      expect(note.width).toBeGreaterThan(100)
      expect(note.lines).toBeLessThanOrEqual(4)
      expect(note.left).toBeGreaterThanOrEqual(0)
      expect(note.right).toBeLessThanOrEqual(width)
    }
  }
  await context.close()
})

test("the notes list ships its own page with a link to every note", async ({ browser, request, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  await page.goto("/notes/")
  await expect(page).toHaveTitle("Notes — Rafael Medina")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Notes")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://rafaelmedina.me/notes/")
  // Every note, newest first, each an ordinary link to its own page.
  const rows = page.locator(".writings-year a.writing-entry-trigger")
  await expect(rows).toHaveCount(8)
  await expect(rows.first()).toHaveAttribute("href", "/notes/project-context-in-markdown/")
  await expect(page.getByRole("link", { name: "All work" })).toHaveAttribute("href", "/#work")
  expect(await (await request.get("/sitemap.xml")).text()).toContain("https://rafaelmedina.me/notes/")
  await context.close()
})

// The note's page and its reader are the same article, so the swap at hydration
// has nothing to reconcile: no mismatch, and the reader opens over the URL.
test("a note page hydrates into the reader without replacing its article", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/notes/designing-matcha/")
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  await expect(page).toHaveURL(/\/notes\/designing-matcha\/$/)
  await expect(page).toHaveTitle("Designing Matcha — Rafael Medina")
  await page.reload()
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test("project pages hydrate into the gallery after reload and index navigation", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/work/matcha-multiwallet-flow/")
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha multiwallet flow")
  const socialImage = await socialImageSize(page)
  expect(socialImage.declared).toEqual(socialImage.actual)
  await page.reload()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha multiwallet flow")
  await page.goto("/work/matcha-multiwallet-flow/index.html")
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha multiwallet flow")
  expect(errors).toEqual([])
})

test("homepage project links support a new tab and an inline preview", async ({ page, context }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/")
  // The portrait phase has no work-card animations to await yet. Wait for the
  // complete intro before a modifier key can interrupt the moving click target.
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  const link = page.getByRole("link", { name: /Open Matcha multiwallet flow/ })
  await expect(link).toHaveAttribute("href", "/work/matcha-multiwallet-flow/")
  const opened = context.waitForEvent("page")
  await link.click({ modifiers: ["ControlOrMeta"] })
  const newTab = await opened
  await newTab.bringToFront()
  await newTab.waitForURL("**/work/matcha-multiwallet-flow/", { waitUntil: "domcontentloaded" })
  await expect(newTab).toHaveTitle("Matcha multiwallet flow — Rafael Medina")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await newTab.close()
  await link.click()
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha multiwallet flow")
  await expect(page).toHaveURL(/\/work\/matcha-multiwallet-flow\/$/)
  await expect(page).toHaveTitle("Matcha multiwallet flow — Rafael Medina")
  await page.keyboard.press("Escape")
  await expect(page).toHaveTitle("Rafael Medina — Senior Product Designer")
  expect(errors).toEqual([])
})

// The homepage's card is a screenshot of the homepage, regenerated by hand with
// scripts/build-og-image.mjs. No build step reproduces it, so this is the only
// thing standing between a re-shot card and meta tags that describe the old one.
test("the homepage social card is the size its tags declare", async ({ page }) => {
  await page.goto("/")
  const socialImage = await socialImageSize(page)
  expect(socialImage.declared).toEqual([1200, 630])
  expect(socialImage.actual).toEqual(socialImage.declared)
})

test("the 404 stays readable and uses the shared site styles", async ({ page }) => {
  await page.goto("/404.html")
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex")
  await expect(page.locator('meta[http-equiv="refresh"]')).toHaveCount(0)
  await expect(page.locator(".standalone-description").last()).toHaveCSS("color", "rgb(107, 107, 107)")
  await page.getByRole("link", { name: "Go home" }).click()
  await expect(page).toHaveURL(/\/$/)
})
