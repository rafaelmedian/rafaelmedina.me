import { expect, test } from "@playwright/test"

const hintText = "Drag to explore"

for (const width of [1440, 390]) {
  test(`photo wall opens without drag guidance at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto("/")
    await page.locator(".personal-photos-label").click()
    const dialog = page.getByRole("dialog", { name: "Personal photos" })
    await expect(dialog).toBeVisible()
    const hint = dialog.getByText(hintText, { exact: true })
    const wall = dialog.getByRole("region", { name: "Photo wall", exact: true })
    await expect(hint).toBeHidden()
    await expect(dialog.getByRole("button", { name: /^(Zoom in|Zoom out|Reset view)$/ })).toHaveCount(0)
    await wall.press("ArrowRight")
    await expect(hint).toBeHidden()
    const details = dialog.getByRole("button", { name: "Photo details", exact: true })
    await expect(details.locator("svg")).toBeVisible()
    await details.press("Enter")
    await expect(details).toHaveAttribute("aria-expanded", "true")
    await dialog.getByRole("button", { name: "Close photo wall" }).click()
    await expect(dialog).toBeHidden()
    await page.locator(".personal-photos-label").click()
    await expect(dialog).toBeVisible()
    await expect(hint).toBeHidden()
    await page.reload()
    await page.locator(".personal-photos-label").click()
    await expect(dialog).toBeVisible()
    await expect(hint).toBeHidden()
  })
}

test("reduced-motion keyboard zoom keeps its bounds", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.locator(".personal-photos-label").click()
  const dialog = page.getByRole("dialog", { name: "Personal photos" })
  const wall = dialog.getByRole("region", { name: "Photo wall", exact: true })
  const hint = dialog.getByText(hintText, { exact: true })
  await expect(hint).toBeHidden()
  for (let i = 0; i < 8; i++) await wall.press("+")
  const scale = () => wall.locator(".personal-photos-masonry").evaluate(node => new DOMMatrix(getComputedStyle(node).transform).a)
  expect(await scale()).toBe(2.5)
  for (let i = 0; i < 15; i++) await wall.press("-")
  expect(await scale()).toBe(0.4)
  await wall.press("0")
  expect(await scale()).toBe(1)
})
