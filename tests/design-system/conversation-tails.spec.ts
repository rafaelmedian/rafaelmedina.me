import { expect, test } from '@playwright/test'

for (const surface of ['about', 'booking'] as const) {
  test(`${surface} gives only the final bubble in each run a tail`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 953 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.route('**/contact', route => route.fulfill({ json: { sent: true } }))
    await page.goto('/?tune=off')
    if (surface === 'about') {
      await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
      await page.locator('.about-intro-portrait-trigger').click()
    } else await page.locator('.mosaic-booking-pill').click()
    const chat = page.getByRole(surface === 'about' ? 'region' : 'dialog', {
      name: surface === 'about' ? 'Chat with Rafa' : 'Chat with Rafael Medina', exact: true,
    })
    const incoming = chat.locator(surface === 'about'
      ? '.about-intro-chat-received .about-intro-chat-bubble'
      : '.booking-history > .booking-bubble')
    await expect(incoming).toHaveCount(3)
    await expect.poll(() => incoming.evaluateAll(nodes => nodes.map(node => getComputedStyle(node, '::before').content)))
      .toEqual(['none', 'none', '""'])
    await chat.getByRole('textbox', { name: 'Your email', exact: true }).fill('hello@example.com')
    await chat.getByRole('button', { name: 'Continue with email' }).click()
    const send = chat.getByRole('button', { name: 'Send message', exact: true })
    for (const message of ['First message', 'Second message']) {
      await chat.getByRole('textbox', { name: /^Your message/ }).fill(message)
      await send.click()
      await expect(chat.getByText('Delivered', { exact: true }).last()).toBeVisible()
    }
    const outgoing = chat.locator(surface === 'about'
      ? '.about-intro-chat-sent-message .about-intro-chat-outgoing'
      : '.booking-delivery .booking-outgoing')
    await expect(outgoing).toHaveCount(2)
    expect(await outgoing.evaluateAll(nodes => nodes.map(node => getComputedStyle(node, '::before').content)))
      .toEqual(['none', '""'])
    // Enter a draft so the main conversation shows Send instead of its mic.
    await chat.getByRole('textbox', { name: /^Your message/ }).fill('Another thought')
    expect(await send.evaluate(node => {
      const style = getComputedStyle(node, '::before')
      return [style.width, style.height]
    })).toEqual(['40px', '28px'])
  })
}
