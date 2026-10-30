import { expect, test, type Page } from "@playwright/test"

const forceInter = (page: Page) => page.addStyleTag({
  content: `:root { --font-ui: "Inter Variable", sans-serif !important; }`,
})

function trackFontRequests(page: Page) {
  const paths: string[] = []
  page.on("request", (request) => {
    const { pathname } = new URL(request.url())
    if (pathname.startsWith("/fonts/")) paths.push(pathname)
  })
  return paths
}

for (const route of ["/", "/notes/designing-matcha/", "/resume/", "/work/twilio-admiral/"]) {
  test(`${route} downloads only core font files`, async ({ page }) => {
    const fonts = trackFontRequests(page)
    await page.goto(route)
    await forceInter(page)
    await expect.poll(() => fonts).toContain("/fonts/Inter-core.woff2")
    await page.evaluate(() => document.fonts.ready)
    expect(fonts).toContain("/fonts/Handlee-core.woff2")
    expect(fonts.filter((path) => path.includes("-extended"))).toEqual([])
  })
}

test("a character outside the core pulls in only that font's extended file", async ({ page }) => {
  const fonts = trackFontRequests(page)
  await page.goto("/resume/")
  await forceInter(page)
  await page.evaluate(() => {
    const paragraph = document.createElement("p")
    paragraph.style.fontFamily = "var(--font-ui)"
    paragraph.textContent = "Peñón"
    document.body.append(paragraph)
  })
  await expect.poll(() => fonts).toContain("/fonts/Inter-extended.woff2")
  expect(fonts).not.toContain("/fonts/Handlee-extended.woff2")
})
