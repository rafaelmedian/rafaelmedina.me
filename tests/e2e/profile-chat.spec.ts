import { expect, test } from "@playwright/test"

test("the avatar opens an email-gated conversation and remembers it", async ({ page }) => {
  let requestBody: unknown
  await page.route("**/chat", async (route) => {
    requestBody = route.request().postDataJSON()
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ answer: "Rafael designs and builds product experiences across fintech, web3, and consumer products." }),
    })
  })
  await page.goto("/")
  const avatar = page.getByRole("button", { name: "Ask about Rafael Medina" })
  await avatar.click()
  const chat = page.locator(".profile-chat")
  await expect(page.getByRole("dialog", { name: "A quicker way to get the context." })).toBeVisible()
  await expect(chat).toBeVisible()
  await chat.getByLabel("Your email").fill("not-an-email")
  await chat.getByRole("button", { name: "Start chatting" }).click()
  await expect(chat.getByText("Enter a valid email address.")).toBeVisible()

  await chat.getByLabel("Your email").fill("visitor@example.com")
  await chat.getByRole("button", { name: "Start chatting" }).click()
  await expect(chat.getByRole("heading", { name: "Rafael Medina" })).toBeVisible()
  await chat.getByRole("button", { name: "What kind of products does Rafael design?" }).click()
  await expect(chat.getByText("Rafael designs and builds product experiences across fintech, web3, and consumer products.")).toBeVisible()
  expect(requestBody).toMatchObject({
    email: "visitor@example.com",
    messages: expect.arrayContaining([
      { role: "user", content: "What kind of products does Rafael design?" },
    ]),
  })

  await chat.getByRole("button", { name: "Home" }).click()
  await expect(chat).toBeHidden()
  await expect(avatar).toBeFocused()
  await avatar.click()
  await expect(page.getByRole("dialog", { name: "Rafael Medina" }).getByText("Rafael designs and builds product experiences across fintech, web3, and consumer products.")).toBeVisible()
})
