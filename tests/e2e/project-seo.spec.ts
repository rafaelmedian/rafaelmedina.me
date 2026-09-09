import { expect, test } from "@playwright/test"

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

test("project pages hydrate into the gallery after reload and index navigation", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/work/matcha-multiwallet-flow/")
  await expect(page.getByRole("dialog")).toHaveAccessibleName("Matcha multiwallet flow")
  const socialImage = await page.evaluate(async () => {
    const content = (property: string) => document.querySelector(`meta[property="${property}"]`)!.getAttribute("content")!
    const image = new Image()
    image.src = new URL(content("og:image")).pathname
    await image.decode()
    return {
      actual: [image.naturalWidth, image.naturalHeight],
      declared: [Number(content("og:image:width")), Number(content("og:image:height"))],
    }
  })
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
  await expect(page).toHaveTitle("Rafael Medina — Product Designer")
  expect(errors).toEqual([])
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
