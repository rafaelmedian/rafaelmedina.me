import { expect, test } from "@playwright/test"

test("keeps reader chunks off the initial load and opens them on demand", async ({ page }) => {
  const scripts: string[] = []
  page.on("request", request => { if (request.resourceType() === "script") scripts.push(request.url()) })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveAttribute("data-avatar-intro")
  // WritingArticle carries 34KB of prose that only a note's own reader or its
  // own page needs, so it is checked alongside the readers that pull it in.
  expect(scripts.some(url => /WritingsReader|WritingArticle|PersonalPhotosSheet/.test(url))).toBe(false)
  // The tile opens the gallery on the list of notes; the reader is warmed
  // while that list is on screen, so a row opens without a wait.
  await page.getByRole("button", { name: "Open writings folder" }).click()
  await expect(page.locator(".preview-gallery-popup")).toBeVisible()
  await expect.poll(() => scripts.some(url => url.includes("WritingsReader"))).toBe(true)
  await expect.poll(() => scripts.some(url => url.includes("WritingArticle"))).toBe(true)
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await page.getByRole("button", { name: "Personal life" }).click()
  await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
  expect(scripts.some(url => url.includes("PersonalPhotosSheet"))).toBe(true)
})

test("opens a directly linked note without requiring the folder first", async ({ page }) => {
  await page.goto("/?writing=designing-matcha")
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page).toHaveURL(/\/notes\/$/)
  await expect(page.locator(".writings-dialog")).toBeHidden()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page).not.toHaveURL(/writing=/)
})

for (const { chunk, triggerName, dialogName, retryLabel } of [
  { chunk: "PersonalPhotosSheet", triggerName: "Personal life", dialogName: "Personal photos", retryLabel: "Try opening photos again" },
]) {
  test(`${chunk} can be cancelled while its download is pending`, async ({ page }) => {
    let release!: () => void
    const held = new Promise<void>(resolve => { release = resolve })
    await page.route(`**/${chunk}-*.js*`, async route => { await held; await route.continue() })
    await page.goto("/")
    const trigger = page.getByRole("button", { name: triggerName, exact: true })
    await trigger.click()
    await expect(page.locator('[aria-busy="true"]')).toBeVisible()
    await page.keyboard.press("Escape")
    release()
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
    await expect(page.getByRole("dialog")).toHaveCount(0)
    // A later activation uses the loaded module and still opens normally.
    await page.getByRole("button", { name: triggerName, exact: true }).click()
    await expect(page.getByRole("dialog", { name: dialogName, exact: true })).toBeVisible()
  })

  for (const destination of ["project", "other reader"]) {
    test(`${chunk} ignores a pending open after selecting ${destination}`, async ({ page }) => {
      let release!: () => void
      const held = new Promise<void>(resolve => { release = resolve })
      await page.route(`**/${chunk}-*.js*`, async route => { await held; await route.continue() })
      await page.goto("/")
      await page.getByRole("button", { name: triggerName, exact: true }).click()
      await expect(page.locator('[aria-busy="true"]')).toBeVisible()
      if (destination === "project") {
        await page.locator(".mosaic-row-card").first().click()
        await expect(page.locator(".preview-gallery-popup")).toBeVisible()
      } else {
        await page.getByRole("button", { name: "Open writings folder", exact: true }).click()
        await expect(page.locator(".preview-gallery-popup")).toBeVisible()
      }
      release()
      await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
      await expect(page.getByRole("dialog", { name: dialogName, exact: true, includeHidden: true })).toHaveCount(0)
      await expect(page.locator('[role="dialog"]:visible')).toHaveCount(1)
      await page.keyboard.press("Escape")
      await expect(page.locator('[role="dialog"]:visible')).toHaveCount(0)
      await page.getByRole("button", { name: triggerName, exact: true }).click()
      await expect(page.getByRole("dialog", { name: dialogName, exact: true })).toBeVisible()
    })
  }

  test(`${chunk} retries a failed download without losing the page`, async ({ page }) => {
    let fail = true
    await page.route(`**/${chunk}-*.js*`, route => fail ? route.abort("failed") : route.continue())
    await page.goto("/")
    await page.getByRole("button", { name: triggerName, exact: true }).click()
    await expect(page.getByText(retryLabel, { exact: true })).toBeVisible()
    await expect(page.getByRole("dialog")).toHaveCount(0)
    fail = false
    // Photo button's accessible name includes its loading/error label.
    await page.getByRole("button", { name: chunk === "PersonalPhotosSheet" ? retryLabel : triggerName, exact: true }).click()
    await expect(page.getByRole("dialog", { name: dialogName, exact: true })).toBeVisible()
  })
}


/* The reader is fetched by a row of the notes list, which is a slide of the
   gallery, so its cases are their own: the trigger is a row, the busy state is
   on that row, and the retry labels are printed under the list's heading. */
const notesRow = (page: import("@playwright/test").Page, title = "Designing Matcha") =>
  page.locator(".preview-gallery-popup").getByRole("button", { name: title, exact: true })
const openNotesList = async (page: import("@playwright/test").Page) => {
  await page.getByRole("button", { name: "Open writings folder", exact: true }).click()
  await expect(page.locator(".preview-gallery-popup")).toBeVisible()
}

test("WritingsReader can be cancelled while its download is pending", async ({ page }) => {
  let release!: () => void
  const held = new Promise<void>(resolve => { release = resolve })
  await page.route("**/WritingsReader-*.js*", async route => { await held; await route.continue() })
  await page.goto("/")
  await openNotesList(page)
  await notesRow(page).click()
  await expect(notesRow(page)).toHaveAttribute("aria-busy", "true")
  // Closing the list retires the request; the download still lands, unused.
  await page.keyboard.press("Escape")
  await expect(page.locator(".preview-gallery-popup")).toBeHidden()
  release()
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
  await expect(page.locator(".writings-dialog")).toHaveCount(0)
  await expect(page).toHaveURL(/\/$/)
  // A later press uses the loaded module and still opens normally.
  await openNotesList(page)
  await notesRow(page).click()
  await expect(page.locator(".writings-dialog").getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
})

for (const destination of ["project", "other reader"]) {
  test(`WritingsReader ignores a pending open after selecting ${destination}`, async ({ page }) => {
    let release!: () => void
    const held = new Promise<void>(resolve => { release = resolve })
    await page.route("**/WritingsReader-*.js*", async route => { await held; await route.continue() })
    await page.goto("/")
    await openNotesList(page)
    await notesRow(page).click()
    await expect(notesRow(page)).toHaveAttribute("aria-busy", "true")
    if (destination === "project") {
      // Paging the gallery is a selection of its own.
      await page.keyboard.press("ArrowRight")
      await expect(page).toHaveURL(/\/work\/popparazi-v1\/$/)
    } else {
      await page.keyboard.press("Escape")
      await expect(page.locator(".preview-gallery-popup")).toBeHidden()
      await page.getByRole("button", { name: "Personal life", exact: true }).click()
      await expect(page.getByRole("dialog", { name: "Personal photos", exact: true })).toBeVisible()
    }
    release()
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
    await expect(page.locator(".writings-dialog")).toHaveCount(0)
    await expect(page.locator('[role="dialog"]:visible')).toHaveCount(1)
    await page.keyboard.press("Escape")
    await expect(page.locator('[role="dialog"]:visible')).toHaveCount(0)
    await openNotesList(page)
    await notesRow(page).click()
    await expect(page.locator(".writings-dialog").getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  })
}

test("WritingsReader retries a failed download without losing the list", async ({ page }) => {
  let fail = true
  await page.route("**/WritingsReader-*.js*", route => fail ? route.abort("failed") : route.continue())
  await page.goto("/")
  await openNotesList(page)
  await notesRow(page).click()
  await expect(page.locator(".preview-gallery-popup").getByText("Try opening notes again", { exact: true })).toBeVisible()
  await expect(page.locator(".writings-dialog")).toHaveCount(0)
  fail = false
  await notesRow(page).click()
  await expect(page.locator(".writings-dialog").getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
})

/* A chunk a reader needs but does not own. Retrying cannot recover it -- the
   module registry keeps the rejection -- so the reader offers a reload instead.

   The name is whatever Rollup emits for the imports two lazy modules have in
   common, not something this repo authors: the notes entry here is the article
   the reader shares with a note's own page, and the photos entry took the name
   of the dialog title both sheets pull in. So the route counts what it
   stopped, and the test fails on a pattern that has gone stale rather than
   quietly blocking nothing and reporting a missing error message. */
test("offers a reload when a cached WritingArticle dependency cannot be retried", async ({ page }) => {
  let fail = true
  let blocked = 0
  await page.route("**/WritingArticle-*.js*", route => {
    if (!fail) return route.continue()
    blocked++
    return route.abort("failed")
  })
  await page.goto("/")
  await openNotesList(page)
  const list = page.locator(".preview-gallery-popup")
  await notesRow(page).click()
  await expect(list.getByText("Try opening notes again", { exact: true })).toBeVisible()
  expect(blocked).toBeGreaterThan(0)
  fail = false
  await notesRow(page).click()
  await expect(list.getByText("Reload to try notes again", { exact: true })).toBeVisible()
  await Promise.all([
    page.waitForEvent("load"),
    notesRow(page).click(),
  ])
  // The reload lands on the list's own address, so the list is back on screen.
  await expect(page.locator(".preview-gallery-popup")).toBeVisible()
  await notesRow(page).click()
  await expect(page.locator(".writings-dialog").getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
})

test("offers a reload when a cached DialogTitle dependency cannot be retried", async ({ page }) => {
  let fail = true
  let blocked = 0
  await page.route("**/DialogTitle-*.js*", route => {
    if (!fail) return route.continue()
    blocked++
    return route.abort("failed")
  })
  await page.goto("/")
  await page.getByRole("button", { name: "Personal life", exact: true }).click()
  await expect(page.getByText("Try opening photos again", { exact: true })).toBeVisible()
  expect(blocked).toBeGreaterThan(0)
  fail = false
  await page.getByRole("button", { name: "Try opening photos again", exact: true }).click()
  await expect(page.getByText("Reload to try photos again", { exact: true })).toBeVisible()
  await Promise.all([
    page.waitForEvent("load"),
    page.getByRole("button", { name: "Reload to try photos again", exact: true }).click(),
  ])
  await page.getByRole("button", { name: "Personal life", exact: true }).click()
  await expect(page.getByRole("dialog", { name: "Personal photos", exact: true })).toBeVisible()
})

for (const { destination, address } of [
  { destination: "project", address: "/?writing=designing-matcha" },
  { destination: "photos", address: "/?writing=designing-matcha" },
  { destination: "project", address: "/notes/designing-matcha/" },
  { destination: "photos", address: "/notes/designing-matcha/" },
]) {
  test(`a pending directly linked note at ${address} yields to ${destination}`, async ({ page }) => {
    let release!: () => void
    const held = new Promise<void>(resolve => { release = resolve })
    await page.route("**/WritingsReader-*.js*", async route => { await held; await route.continue() })
    const galleryLoaded = page.waitForResponse(response => /PreviewGalleryDialog-.*\.js/.test(response.url()))
    await page.goto(address)
    await expect(page.locator('[aria-busy="true"]')).toBeVisible()
    await (await galleryLoaded).finished()
    await expect(page.locator(".preview-gallery-pending")).toHaveCount(0)
    // A faster gallery chunk must not trap focus over the still-pending reader.
    await expect(page.getByRole("dialog")).toHaveCount(0)
    if (destination === "project") {
      await page.locator(".mosaic-row-card").first().click()
      await expect(page.locator(".preview-gallery-popup")).toBeVisible()
    } else {
      await page.getByRole("button", { name: "Personal life", exact: true }).click()
      await expect(page.getByRole("dialog", { name: "Personal photos" })).toBeVisible()
    }
    release()
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
    await expect(page.locator('[role="dialog"]:visible')).toHaveCount(1)
    await expect(page.locator(".writings-dialog")).toHaveCount(0)
    await expect(page).not.toHaveURL(/writing=/)
    await expect(page).not.toHaveURL(/\/notes\//)
  })
}

for (const { chunk, triggerName } of [
  { chunk: "PersonalPhotosSheet", triggerName: "Personal life" },
]) {
  test(`${chunk} yields to a project opened through browser Forward`, async ({ page }) => {
    let release!: () => void
    const held = new Promise<void>(resolve => { release = resolve })
    await page.route(`**/${chunk}-*.js*`, async route => { await held; await route.continue() })
    await page.goto("/")
    await page.locator(".mosaic-row-card").first().click()
    await expect(page.locator(".preview-gallery-popup")).toBeVisible()
    await page.goBack()
    await expect(page.locator(".preview-gallery-popup")).toBeHidden()
    await page.getByRole("button", { name: triggerName, exact: true }).click()
    await expect(page.locator('[aria-busy="true"]')).toBeVisible()
    await page.goForward()
    await expect(page.locator(".preview-gallery-popup")).toBeVisible()
    release()
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
    await expect(page.locator('[role="dialog"]:visible')).toHaveCount(1)
    await expect(page.locator(".preview-gallery-popup")).toBeVisible()
  })
}

test("retrying a directly linked note preserves the selected article", async ({ page }) => {
  let fail = true
  await page.route("**/WritingsReader-*.js*", route => fail ? route.abort("failed") : route.continue())
  await page.goto("/?writing=designing-matcha")
  await expect(page.getByRole("dialog").getByRole("status")).toHaveText("Try opening notes again")
  fail = false
  // Retry belongs inside the active dialog and preserves the requested URL.
  await page.getByRole("button", { name: "Try again", exact: true }).click()
  await expect(page.locator(".writings-dialog").getByRole("heading", { name: "Designing Matcha", exact: true })).toBeVisible()
  await expect(page).toHaveURL(/writing=designing-matcha/)
})
