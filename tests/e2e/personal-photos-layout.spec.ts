import { expect, test, type Page } from "@playwright/test"

/** The grid now appears with the shared avatar intro. */
async function openHome(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
}

/** Starts the visit with the grid already picked, as a returning visitor
    who left it on the grid would. */
async function preferGrid(page: Page) {
  await page.addInitScript(() => localStorage.setItem("personal-photos-layout", "grid"))
}

const dialog = (page: Page) => page.getByRole("dialog", { name: "Personal photos" })
const globe = (page: Page) => page.getByRole("region", { name: "Photo globe" })
const grid = (page: Page) => page.getByRole("region", { name: "Photo sheet" })
const toggle = (page: Page, name: "Grid" | "Sphere") => dialog(page).getByRole("group", { name: "Layout" }).getByRole("button", { name })
/** Opened beside the prints rather than on one, so no photo is held. */
const openFromLabel = (page: Page) => page.locator(".personal-photos-label").click()

test("the toggle turns the open sheet between the globe and a grid, and the choice holds for the next visit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)

  // The globe is the default.
  await openFromLabel(page)
  await expect(globe(page)).toBeVisible()
  await expect(toggle(page, "Sphere")).toHaveAttribute("aria-pressed", "true")
  await expect(toggle(page, "Grid")).toHaveAttribute("aria-pressed", "false")

  // A press on the toggle is not a press on the stage: it neither closes the
  // dialog nor leaves the globe behind in the grid.
  await toggle(page, "Grid").click()
  await expect(dialog(page)).toBeVisible()
  await expect(grid(page)).toBeVisible()
  await expect(toggle(page, "Grid")).toHaveAttribute("aria-pressed", "true")
  await expect(page.locator(".personal-photos-sphere, .personal-photos-pebbles")).toHaveCount(0)
  const layout = await grid(page).evaluate((element) => {
    const slides = Array.from(element.querySelectorAll<HTMLElement>(".personal-photos-slide"))
    return {
      ids: slides.map((slide) => slide.dataset.photoId),
      columns: new Set(slides.map((slide) => Math.round(slide.getBoundingClientRect().left))).size,
      scrollTop: element.scrollTop,
      scrolls: element.scrollHeight > element.clientHeight,
    }
  })
  // Every photo once, with no decorative copies: the grid is the set itself.
  expect(new Set(layout.ids).size).toBe(layout.ids.length)
  expect(layout.ids.every(Boolean)).toBe(true)
  expect(layout.columns).toBe(3)
  expect(layout.scrollTop).toBe(0)
  expect(layout.scrolls).toBe(true)

  // The next visit opens on the grid.
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await openFromLabel(page)
  await expect(grid(page)).toBeVisible()

  // And back: the globe returns, and so does the choice.
  await toggle(page, "Sphere").click()
  await expect(globe(page)).toBeVisible()
  await expect(page.locator(".personal-photos-sphere .personal-photos-slide[data-photo-id]")).toHaveCount(layout.ids.length)
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await openFromLabel(page)
  await expect(globe(page)).toBeVisible()
})

test("on the grid a print click holds nothing: one Escape closes, and the margin closes where a photo does not", async ({ page }) => {
  await preferGrid(page)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  const trigger = page.getByRole("button", { name: "Personal life", exact: true })

  await trigger.locator(".personal-photos-print").nth(3).click()
  await expect(grid(page)).toBeVisible()
  // The prints are the first photos, so they sit across the top row.
  expect(await grid(page).evaluate((element) => element.scrollTop)).toBe(0)
  await page.keyboard.press("Escape")
  await expect(dialog(page)).toBeHidden()
  await expect(trigger).toBeFocused()

  await page.keyboard.press("Enter")
  await expect(grid(page)).toBeVisible()
  await grid(page).locator(".personal-photos-slide").first().click()
  await expect(dialog(page)).toBeVisible()
  await page.mouse.click(10, 450)
  await expect(dialog(page)).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("a scrolled grid glides back to its first row before the prints fly home", async ({ page }) => {
  await preferGrid(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await openHome(page)
  await openFromLabel(page)
  await expect(grid(page)).toBeVisible()
  await expect(page.locator(".personal-photos-flight")).toHaveCount(0)
  await page.keyboard.press("End")
  const bottom = await grid(page).evaluate((element) => element.scrollHeight - element.clientHeight)
  await expect.poll(() => grid(page).evaluate((element) => element.scrollTop)).toBeGreaterThan(bottom - 1)

  // Sampled in the page, every frame from the Escape to the first flight, so
  // the rewind is caught mid-way rather than across a protocol round trip.
  const rewind = page.evaluate(() => new Promise<{ scrolls: number[]; scrollAtFlight: number }>((resolve) => {
    const sheet = document.querySelector<HTMLElement>(".personal-photos-sheet")!
    const scrolls: number[] = []
    let frame = 0
    const sample = () => {
      scrolls.push(sheet.scrollTop)
      frame = requestAnimationFrame(sample)
    }
    sample()
    const observer = new MutationObserver(() => {
      if (!document.querySelector(".personal-photos-flight")) return
      observer.disconnect()
      cancelAnimationFrame(frame)
      resolve({ scrolls, scrollAtFlight: sheet.scrollTop })
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }))
  await page.keyboard.press("Escape")
  const { scrolls, scrollAtFlight } = await rewind
  expect(scrolls.some((top) => top > 0 && top < bottom - 50)).toBe(true)
  expect(scrollAtFlight).toBe(0)
  await expect(dialog(page)).toBeHidden()
})

test("on a phone the grid keeps two columns and the toggle clears the first row", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 390, height: 844 })
  await openHome(page)
  await page.getByRole("button", { name: "Personal life", exact: true }).click()
  await expect(globe(page)).toBeVisible()
  await toggle(page, "Grid").click()
  await expect(grid(page)).toBeVisible()
  // Read a frame on. The global reduced-motion policy leaves every element a
  // 1e-05s `all` transition rather than none, so the stage's grid padding
  // lands on the frame after the switch, not the one it is asked for in.
  const { columns, toggleBottom, firstRowTop, sideways } = await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const slides = Array.from(document.querySelectorAll<HTMLElement>(".personal-photos-masonry .personal-photos-slide"))
    return {
      columns: new Set(slides.map((slide) => Math.round(slide.getBoundingClientRect().left))).size,
      toggleBottom: document.querySelector(".personal-photos-layout")!.getBoundingClientRect().bottom,
      firstRowTop: Math.min(...slides.map((slide) => slide.getBoundingClientRect().top)),
      sideways: document.documentElement.scrollWidth - innerWidth,
    }
  })
  expect(columns).toBe(2)
  expect(toggleBottom).toBeLessThan(firstRowTop)
  expect(sideways).toBeLessThanOrEqual(0)
})
