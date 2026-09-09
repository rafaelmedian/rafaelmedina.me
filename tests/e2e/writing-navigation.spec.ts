import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

test("writing URLs follow selection and browser Back and Forward", async ({ page }) => {
  await page.goto("/?ref=portfolio")
  const folder = page.getByRole("button", { name: "Open writings folder" })
  await folder.click()
  const dialog = page.getByRole("dialog")
  await dialog.getByRole("button", { name: "Designing Matcha", exact: true }).click()
  await expect(page).toHaveURL(/\?ref=portfolio&writing=designing-matcha$/)
  await dialog.getByRole("button", { name: "Next note", exact: true }).click()
  await expect(page).toHaveURL(/writing=designing-for-active-traders$/)
  await page.goBack()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
  await expect(folder).toBeFocused()
  await page.goForward()
  await expect(dialog.getByRole("heading", { name: "Designing for active traders", exact: true })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
})

test("a shared writing opens after hydration and refresh and closes locally", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto("/?ref=shared&writing=designing-matcha")
  const title = page.getByRole("heading", { name: "Designing Matcha", exact: true })
  await expect(title).toBeVisible()
  await page.reload()
  await expect(title).toBeVisible()
  await page.getByRole("button", { name: "Go back to Notes", exact: true }).click()
  await expect(page).toHaveURL(/\?ref=shared$/)
  await expect(page.getByRole("button", { name: "Designing Matcha", exact: true })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\?ref=shared$/)
  expect(errors).toEqual([])
})

test("returning to notes clears the writing URL and closing consumes its history entry", async ({ page }) => {
  await page.goto("/?from=previous")
  await page.goto("/?ref=portfolio")
  await page.getByRole("button", { name: "Open writings folder" }).click()
  const dialog = page.getByRole("dialog")
  const entry = dialog.getByRole("button", { name: "Designing Matcha", exact: true })
  await entry.click()
  await dialog.getByRole("button", { name: "Go back to Notes", exact: true }).click()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
  await expect(entry).toBeFocused()
  await entry.click()
  await expect(page).toHaveURL(/writing=designing-matcha$/)
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\?ref=portfolio$/)
  await page.goBack()
  await expect(page).toHaveURL(/\?from=previous$/)
})

test("an unknown writing leaves the folder usable", async ({ page }) => {
  await page.goto("/?writing=missing")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await page.getByRole("button", { name: "Open writings folder" }).click()
  await page.getByRole("button", { name: "Designing Matcha", exact: true }).click()
  await expect(page).toHaveURL(/writing=designing-matcha$/)
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
})

for (const [key, sign, nextTitle] of [
  ["ArrowRight", -1, "Designing for active traders"],
  ["ArrowLeft", 1, "Designing Matcha"],
] as const) {
  test(`notes slide in the project gallery direction for ${key}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await page.setViewportSize({ width: 2554, height: 1239 })
    await page.goto(`/?writing=${key === "ArrowRight" ? "designing-matcha" : "designing-for-active-traders"}`)
    const dialog = page.getByRole("dialog")
    await expect(dialog).toHaveCSS("opacity", "1")
    // The switch is stepped by a JS timer, so a busy runner can pass a whole
    // 190ms leg without painting. Frames race that; the phases do not. Each
    // data-switch-phase change is observed as it lands, with the pose it is
    // heading for read off the transition's own keyframes.
    const poses = await dialog.evaluate(async (element, arrow) => {
      const seen: Array<{ phase: string; x: number; opacity: number; title: string }> = []
      const observer = new MutationObserver(() => {
        const style = getComputedStyle(element)
        const target = (property: string, resting: string) => {
          const transition = element
            .getAnimations()
            .filter((animation): animation is CSSTransition => animation instanceof CSSTransition && animation.transitionProperty === property)
            .at(-1)
          return String(transition?.effect?.getKeyframes().at(-1)?.[property] ?? resting)
        }
        seen.push({
          phase: element.dataset.switchPhase ?? "",
          x: new DOMMatrixReadOnly(target("transform", style.transform)).m41,
          opacity: Number(target("opacity", style.opacity)),
          title: element.querySelector(".writings-page-title")!.textContent!,
        })
      })
      observer.observe(element, { attributes: true, attributeFilter: ["data-switch-phase"] })
      element.dispatchEvent(new KeyboardEvent("keydown", { key: arrow, bubbles: true }))
      await new Promise((resolve) => setTimeout(resolve, 650))
      observer.disconnect()
      return seen
    }, key)
    expect(poses.some(pose => pose.phase === "out" && pose.title !== nextTitle && pose.x * sign > 5 && pose.opacity < 0.8)).toBe(true)
    expect(poses.some(pose => pose.phase === "in" && pose.title === nextTitle && pose.x * sign < -5 && pose.opacity < 0.8)).toBe(true)
    await expect(dialog.getByRole("heading", { name: nextTitle, exact: true })).toBeFocused()
    await expect(dialog).toHaveCSS("opacity", "1")
    // Back at rest the sheet carries no pose of its own: its open and close
    // travel is a Web Animations flight, so the switch hands transform back
    // flat rather than to an identity matrix.
    await expect(dialog).toHaveCSS("transform", "none")
  })
}

test("closing during a note switch cancels the pending selection", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/?writing=designing-matcha")
  const dialog = page.getByRole("dialog")
  await expect(dialog).toHaveCSS("opacity", "1")
  await dialog.evaluate(element => {
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }))
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
  })
  await expect(dialog).toBeHidden()
  await page.waitForTimeout(450)
  await expect(page).toHaveURL(/\/$/)
  await expect(dialog).toHaveCount(0)
})
