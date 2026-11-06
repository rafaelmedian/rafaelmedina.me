import { expect, test } from "@playwright/test"

const origin = "https://rafaelmedina.me"

test("prerendered pages describe their own content and share one author identity", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  for (const [path, type] of [
    ["/", "ProfilePage"],
    ["/resume/", "ProfilePage"],
    ["/notes/", "CollectionPage"],
    ["/notes/skills-i-reach-for/", "WebPage"],
    ["/work/matcha-multiwallet-flow/", "WebPage"],
  ]) {
    await page.goto(path)
    const blocks = page.locator('script[type="application/ld+json"]')
    await expect(blocks).toHaveCount(1)
    const { "@graph": graph } = JSON.parse(await blocks.textContent() ?? "{}")
    const webPage = graph.find((node: { "@id": string }) => node["@id"] === `${origin}${path}#webpage`)
    expect(webPage).toMatchObject({ "@type": type, url: `${origin}${path}`, inLanguage: "en" })
    expect(graph.find((node: { "@type": string }) => node["@type"] === "Person")["@id"]).toBe(`${origin}/#person`)
    if (path === "/notes/skills-i-reach-for/") {
      const article = graph.find((node: { "@type": string }) => node["@type"] === "BlogPosting")
      expect(article).toMatchObject({ headline: "Skills for craft and code", datePublished: "2026-09-17", author: { "@id": `${origin}/#person` } })
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article")
    }
    if (path.startsWith("/work/")) {
      expect(graph.find((node: { "@type": string }) => node["@type"] === "CreativeWork")).toMatchObject({
        name: "Matcha multiwallet flow", creator: { "@id": `${origin}/#person` },
      })
    }
  }
  await context.close()
})

test("gallery navigation keeps structured data in step with the canonical URL", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: /Open Matcha multiwallet flow preview/ }).click()
  const structured = page.locator('script[type="application/ld+json"]')
  await expect(structured).toHaveCount(1)
  await expect.poll(() => structured.textContent()).toContain('"@type":"CreativeWork"')
  await expect.poll(() => structured.textContent()).toContain(`${origin}/work/matcha-multiwallet-flow/#webpage`)
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect.poll(() => structured.textContent()).toContain('"@type":"ProfilePage"')
  await expect.poll(() => structured.textContent()).not.toContain('"@type":"CreativeWork"')
})
