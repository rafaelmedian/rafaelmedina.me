import { expect, test } from '@playwright/test'

test('uses the tucked numeric badge beside the TOC throughout the compact breakpoint', async ({ page }) => {
  await page.clock.install()
  await page.setViewportSize({ width: 768, height: 700 })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))

  const intro = page.getByRole('region', { name: 'A quick hello from Rafael' })
  const notification = intro.locator('.about-intro-chat-notification')
  await page.clock.runFor(900)
  await expect(notification).toHaveText('1')
  await expect(notification).toHaveCSS('animation-name', 'intro-notification-enter')
  await page.clock.runFor(900)
  await expect(notification.locator('.about-intro-chat-notification-number')).toHaveText('2')
  await expect(notification.locator('.about-intro-chat-notification-number')).toHaveCSS('animation-name', 'intro-notification-number-enter')
  await expect(notification.locator('.about-intro-chat-notification-ghost')).toHaveText('1')
  await expect(notification.locator('.about-intro-chat-notification-ghost')).toHaveCSS('animation-name', 'intro-notification-number-exit')
  await page.clock.runFor(160)
  await expect(notification.locator('.about-intro-chat-notification-ghost')).toHaveCount(0)
  await page.clock.runFor(740)
  await expect(notification.locator('.about-intro-chat-notification-number')).toHaveText('3')
  await expect(intro.locator('.about-intro-portrait-trigger')).toHaveAccessibleName('Open 3 messages from Rafa')
  await expect(notification).toBeVisible()
  await expect(page.getByRole('dialog', { name: 'Chat with Rafa' })).toHaveCount(0)

  const faceBox = await intro.locator('.about-intro-surface').boundingBox()
  const badgeBox = await notification.boundingBox()
  const tocBox = await page.getByRole('navigation', { name: 'Table of contents' }).boundingBox()
  expect(faceBox!.x).toBe(12)
  expect(Math.abs(tocBox!.x + tocBox!.width / 2 - 384)).toBeLessThan(1)
  expect(badgeBox).toMatchObject({ width: 18, height: 18 })
  expect(Math.abs(badgeBox!.x - (faceBox!.x + faceBox!.width - badgeBox!.width + 2))).toBeLessThan(1)
  expect(Math.abs(badgeBox!.y - faceBox!.y + 2)).toBeLessThan(1)
  await expect(notification).toHaveCSS('border-radius', '50%')
  await expect(notification).toHaveCSS('box-shadow', /rgba\(0, 0, 0, 0\.15\).*rgb\(255, 255, 255\)/)
  expect(await notification.evaluate(node => {
    for (let parent = node.parentElement; parent; parent = parent.parentElement) {
      if (getComputedStyle(parent).overflow !== 'visible') return parent.className
      if (parent.classList.contains('about-intro-surface')) break
    }
    return null
  })).toBeNull()

  await intro.locator('.about-intro-portrait-trigger').click({ position: { x: 54, y: 10 } })
  await expect(intro).toHaveAttribute('data-chat-open', 'true')
  const chat = page.getByRole('dialog', { name: 'Chat with Rafa' })
  await expect(chat).toBeVisible()
  await expect(chat.getByText('Hey, I’m Rafa.')).toBeVisible()
  const email = chat.getByRole('textbox', { name: 'Your email' })
  await expect(email).toBeVisible()
  await page.clock.runFor(620)
  await chat.evaluate(node => node.getAnimations({ subtree: true }).forEach(animation => animation.finish()))
  await expect(page.locator('.mosaic-mobile-toc')).toBeHidden()
  await expect(intro.locator('.about-intro-surface')).toHaveCSS('width', '80px')
  const emailBox = await email.locator('..').boundingBox()
  const openFaceBox = await intro.locator('.about-intro-surface').boundingBox()
  expect(emailBox!.width).toBe(320)
  expect(Math.abs(emailBox!.x - 436)).toBeLessThan(1)
  expect(Math.abs(openFaceBox!.y - emailBox!.y - emailBox!.height - 12)).toBeLessThan(2)
  // The modal isolates its visual backdrop from the accessibility tree.
  const backdrop = page.locator('.about-intro-chat-backdrop')
  await expect(backdrop).toBeVisible()
  await expect(backdrop).toHaveCSS('background-color', 'rgba(18, 18, 18, 0.42)')

  await page.keyboard.press('Escape')
  await expect(chat).toHaveCount(0)
  await expect(backdrop).toBeHidden()
  await expect(page.locator('.mosaic-mobile-toc')).toBeVisible()
  await expect(intro.locator('.about-intro-surface')).toHaveCSS('width', '64px')
})

for (const width of [320, 1440]) {
  test(`B reveals a conversation and advances from email to an optional message at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/?tune=off')
    await expect(page.getByRole('region', { name: 'Chat with Rafa' })).toHaveCount(0)
    await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
    if (width === 320) {
      await page.getByRole('button', { name: /Open \d+ messages? from Rafa/ }).click()
    }
    const chat = page.getByRole(width === 320 ? 'dialog' : 'region', { name: 'Chat with Rafa' })
    await expect(chat.getByText('Hey, I’m Rafa.')).toHaveCSS('opacity', '1')
    await expect(chat.getByText('How are you doing?')).toBeVisible()
    const email = chat.getByRole('textbox', { name: 'Your email' })
    await expect(email).toBeVisible()
    await expect(email).not.toBeFocused()
    await expect(email.locator('..')).toHaveCSS('border-radius', '999px')
    if (width === 320) {
      // iOS zooms and pans the visual viewport when a focused input is below
      // 16px, clipping this fixed chat off the left edge.
      await expect(email).toHaveCSS('font-size', '16px')
    }
    // Not a login: password managers stay out, and browser autofill still offers the address.
    await expect(email).toHaveAttribute('autocomplete', 'email')
    for (const [name, value] of [['data-1p-ignore', 'true'], ['data-lpignore', 'true'], ['data-bwignore', 'true'], ['data-form-type', 'other']]) {
      await expect(email).toHaveAttribute(name, value)
    }
    await expect(chat.getByRole('button', { name: 'Continue with email' })).toBeVisible()
    await expect(chat.getByRole('button', { name: 'Continue with email' })).toBeDisabled()
    await email.fill('asda@asd.')
    await expect(chat.getByRole('button', { name: 'Continue with email' })).toBeDisabled()
    await email.fill('hello@example.com')
    await chat.getByRole('button', { name: 'Continue with email' }).click()
    const outgoing = chat.getByRole('button', { name: 'Change email address: hello@example.com' })
    await expect(outgoing).toHaveCSS('background-color', 'rgb(0, 113, 227)')
    expect(await outgoing.evaluate(node => [getComputedStyle(node, '::before').content, getComputedStyle(node, '::before').right])).toEqual(['""', '-8px'])
    // Rafa's tapback pops onto the sent address, shifting the conversation up, before he types.
    const sent = chat.locator('.about-intro-chat-sent')
    const tapback = chat.getByRole('img', { name: 'Loved by Rafa' })
    await expect(tapback).toHaveCount(0)
    await expect(chat.getByRole('status', { name: 'Rafa is typing' })).toHaveCount(0)
    await expect(sent).toHaveCSS('margin-top', '8px')
    await expect(tapback).toBeVisible()
    await expect(sent).toHaveCSS('margin-top', '28px')
    await expect(chat.getByRole('status', { name: 'Rafa is typing' })).toBeVisible()
    await expect(chat.getByText('Want to share anything else?')).toBeVisible()
    const message = chat.getByRole('textbox', { name: 'Your message (optional)' })
    await expect(message).toBeFocused()
    await expect(message.locator('..')).toHaveCSS('border-radius', '24px')
    await expect(chat.getByRole('status', { name: 'Rafa is typing' })).toHaveCount(0)
    await expect(chat.getByRole('button', { name: 'Send message' })).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await expect(chat.getByRole('button', { name: 'Send message' })).toHaveAttribute('data-muted', 'true')
    const history = chat.locator('.about-intro-chat-history')
    // The follow-up's 8px entrance rise overflows for ~100ms; only the resting history must not scroll.
    await expect.poll(() => history.evaluate(node => node.scrollHeight - node.clientHeight)).toBeLessThanOrEqual(1)
    // Neither the history nor the growing reply ever draws a scrollbar.
    await expect(history).toHaveCSS('scrollbar-width', 'none')
    await expect(message).toHaveCSS('scrollbar-width', 'none')
    // Measure the resting alignment, after the portrait's hover scale settles.
    await page.mouse.move(width / 2, 100)
    const chatAlignment = async () => {
      const face = await page.locator('.about-intro-surface').boundingBox()
      if (width === 320) {
        const chatBox = await chat.boundingBox()
        return Math.abs(face!.y - chatBox!.y - chatBox!.height - 12)
      }
      const hint = await chat.locator('.about-intro-chat-hint').boundingBox()
      return Math.abs(face!.y + face!.height - hint!.y - hint!.height)
    }
    await expect.poll(chatAlignment).toBeLessThan(2)
    // Focus deepens the overlay shadow instead of drawing an inset stroke.
    expect(await message.locator('..').evaluate(node => getComputedStyle(node).boxShadow)).toContain('0px 16px 36px')
    // The message grows with its text from 88px, caps at seven lines and then scrolls.
    const fieldHeight = () => message.evaluate(node => node.getBoundingClientRect().height)
    expect(await fieldHeight()).toBe(88)
    await message.fill('One\nTwo\nThree\nFour\nFive')
    expect(await fieldHeight()).toBe(140)
    expect(await message.evaluate(node => node.scrollHeight - node.clientHeight)).toBeLessThanOrEqual(1)
    await message.fill(Array.from({ length: 20 }, (_, line) => `Line ${line + 1}`).join('\n'))
    expect(await fieldHeight()).toBe(188)
    await expect.poll(chatAlignment).toBeLessThan(2)
    await message.fill('A little more context')
    expect(await fieldHeight()).toBe(88)
    await chat.getByRole('button', { name: 'Change email address: hello@example.com' }).click()
    await expect(email).toBeFocused()
    await email.fill('new@example.com')
    await email.press('Enter')
    await expect(message).toHaveValue('A little more context')
    await expect(chat.getByRole('button', { name: 'Send message' })).toBeEnabled()
    if (width !== 320) {
      await page.mouse.click(width / 2, 100)
      await expect(chat).toHaveCount(0)
      const intro = page.getByRole('region', { name: 'A quick hello from Rafael' })
      await expect(intro.locator('.about-intro-chat-notification')).toHaveText('3')
      await intro.locator('.about-intro-portrait-trigger').click()
      await expect(message).toBeVisible()
      await expect(message).toHaveValue('A little more context')
    }
    const box = await chat.boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(12)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width - 12)
    if (width === 320) {
      await page.setViewportSize({ width, height: 420 })
      await expect(chat.getByRole('button', { name: 'Send message' })).toBeInViewport()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}

test('starts the comparison chat when its card comes into view and respects reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/intro-options')
  const card = page.getByRole('region', { name: 'Chat bubble', exact: true })
  await expect(card.locator('.about-intro-chat')).toHaveAttribute('data-active', 'false')
  await card.scrollIntoViewIfNeeded()
  const chat = card.getByRole('region', { name: 'Chat with Rafa' })
  await expect(chat).toBeVisible()
  await expect(chat.getByText('Hey, I’m Rafa.')).toHaveCSS('transform', 'none')
  await expect(chat.getByRole('textbox', { name: 'Your email' })).not.toBeFocused()
})

test('offers a compact, horizontally scrollable Apple-style reaction row', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  await page.getByRole('button', { name: /Open \d+ messages? from Rafa/ }).click()
  const chat = page.getByRole('dialog', { name: 'Chat with Rafa' })
  const hint = chat.getByText('Tap a message to react — I’ll see what lands.')
  await expect(hint).toBeVisible()
  await expect(hint).toHaveCSS('background-color', 'rgb(236, 236, 238)')
  await expect(hint).toHaveCSS('border-radius', '999px')
  await expect(hint).toHaveCSS('padding', '4px 10px')

  const greeting = chat.getByRole('button', { name: 'React to “Hey, I’m Rafa.”' })
  await greeting.click()
  const picker = page.getByRole('menu', { name: 'React to “Hey, I’m Rafa.”' })
  await expect(picker).toBeVisible()
  await expect(picker.getByRole('menuitemcheckbox')).toHaveCount(10)
  for (const label of ['Love', 'Like', 'Dislike', 'Laugh', 'Emphasize', 'Question', 'Fire', 'Applause', 'Celebrate', 'Thinking']) {
    await expect(picker.getByRole('menuitemcheckbox', { name: label, exact: true })).toBeAttached()
  }
  await expect(picker).toHaveCSS('overflow-x', 'auto')
  expect(await picker.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true)
  const pickerBox = await picker.boundingBox()
  expect(pickerBox!.x).toBeGreaterThanOrEqual(12)
  expect(pickerBox!.x + pickerBox!.width).toBeLessThanOrEqual(308)
  expect(pickerBox!.height).toBeLessThanOrEqual(44)
  await picker.evaluate(node => { node.scrollLeft = node.scrollWidth })
  await expect(picker.getByRole('menuitemcheckbox', { name: 'Thinking' })).toBeVisible()
  await picker.evaluate(node => { node.scrollLeft = 0 })
  await picker.getByRole('menuitemcheckbox', { name: 'Love' }).click()

  await expect(page.getByRole('img', { name: 'You loved “Hey, I’m Rafa.”' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'You loved “Hey, I’m Rafa.”' }).locator('g[stroke]'))
    .toHaveAttribute('stroke-width', '2')
  // The shape is drawn twice so its white outer ring cannot cut either blue trail dot.
  await expect(chat.locator('.about-intro-chat-visitor-tapback .about-intro-chat-tapback-disc')).toHaveCount(2)
  await expect(chat.locator('.about-intro-chat-visitor-tapback .about-intro-chat-tapback-trail')).toHaveCount(4)
  await expect(chat.getByRole('status')).toHaveText('Got it — I’ll see your 🩷.')
  await expect(picker).toHaveCount(0)

  await greeting.click()
  const changedPicker = page.getByRole('menu', { name: 'React to “Hey, I’m Rafa.”' })
  await expect(changedPicker.getByRole('menuitemcheckbox', { name: 'Love' })).toHaveAttribute('aria-checked', 'true')
  await changedPicker.getByRole('menuitemcheckbox', { name: 'Laugh' }).click()
  await expect(page.getByRole('img', { name: 'You laughed at “Hey, I’m Rafa.”' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'You loved “Hey, I’m Rafa.”' })).toHaveCount(0)

  await greeting.click()
  const removalPicker = page.getByRole('menu', { name: 'React to “Hey, I’m Rafa.”' })
  await removalPicker.getByRole('menuitemcheckbox', { name: 'Laugh' }).click()
  await expect(page.getByRole('img', { name: 'You laughed at “Hey, I’m Rafa.”' })).toHaveCount(0)
  await expect(chat.getByRole('status')).toHaveText('Removed your 😂.')

  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  const followup = chat.getByRole('button', { name: 'React to “Want to share anything else?”' })
  await followup.click()
  await page.getByRole('menu', { name: 'React to “Want to share anything else?”' })
    .getByRole('menuitemcheckbox', { name: 'Emphasize' }).click()
  await expect(page.getByRole('img', { name: 'You emphasized “Want to share anything else?”' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
})

test('keeps desktop reactions compact and reveals the remaining choices by scroll or keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  await expect(chat.getByRole('textbox', { name: 'Your email' })).toBeVisible()
  await chat.getByRole('button', { name: 'React to “Hey, I’m Rafa.”' }).click()
  const picker = page.getByRole('menu', { name: 'React to “Hey, I’m Rafa.”' })
  const choices = picker.getByRole('menuitemcheckbox')
  const visibleChoices = await choices.evaluateAll(nodes => {
    const viewport = nodes[0].parentElement!.getBoundingClientRect()
    return nodes.map(node => {
      const box = node.getBoundingClientRect()
      return Math.max(0, Math.min(box.right, viewport.right) - Math.max(box.left, viewport.left)) / box.width
    })
  })
  expect(visibleChoices.filter(ratio => ratio >= 0.99)).toHaveLength(6)
  expect(visibleChoices[6]).toBeGreaterThan(0)
  expect(visibleChoices[6]).toBeLessThan(1)
  await expect(picker).toHaveCSS('scrollbar-width', 'none')
  await picker.hover()
  await page.mouse.wheel(240, 0)
  await expect.poll(() => picker.evaluate(node => node.scrollLeft)).toBeGreaterThan(0)
  await choices.first().focus()
  await page.keyboard.press('End')
  await expect(choices.last()).toBeFocused()
  const lastBox = await choices.last().boundingBox()
  const pickerBox = await picker.boundingBox()
  expect(lastBox!.x + lastBox!.width).toBeLessThanOrEqual(pickerBox!.x + pickerBox!.width)
  await page.keyboard.press('Enter')
  await expect(chat.getByRole('img', { name: 'You thought about “Hey, I’m Rafa.”' })).toBeVisible()
  await expect(picker).toHaveCount(0)
})

test('opens the Tapback picker from the right and holds a selection beat before closing', async ({ page }) => {
  await page.clock.install()
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  // Opening a Tapback while the scripted greeting is still adding messages
  // moves the portaled picker with its anchor. Wait for the final composer so
  // the hover assertion measures a stable user-visible hit box.
  await expect(chat.getByRole('textbox', { name: 'Your email' })).toBeVisible()
  const greeting = chat.getByRole('button', { name: 'React to “Hey, I’m Rafa.”' })
  await greeting.click()

  const picker = page.getByRole('menu', { name: 'React to “Hey, I’m Rafa.”' })
  await expect(picker).toHaveCSS('animation-name', 'intro-picker-open, intro-fade-in')
  await expect(picker).toHaveCSS('animation-duration', '0.36s, 0.16s')
  const choices = picker.getByRole('menuitemcheckbox')
  await expect(choices.first()).toHaveCSS('animation-duration', '0.36s')
  // Test the resting hit box: while the picker and first choice are both
  // translating in, a starved frame can move them out from under the pointer.
  await picker.evaluate(node => Promise.all(node.getAnimations({ subtree: true }).map(animation => animation.finished)))
  await choices.first().hover()
  await expect(choices.first()).toHaveCSS('translate', '0px -2px')
  await expect(choices.first()).toHaveCSS('scale', '1.08')
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100))
  await picker.getByRole('menuitemcheckbox', { name: 'Love' }).dispatchEvent('click')
  await expect(greeting).toHaveAttribute('aria-expanded', 'true')
  await page.clock.runFor(120)
  await expect(greeting).toHaveAttribute('aria-expanded', 'true')
  await page.clock.runFor(80)
  await expect(greeting).toHaveAttribute('aria-expanded', 'false')

  const tapback = page.getByRole('img', { name: 'You loved “Hey, I’m Rafa.”' })
  await expect(tapback.locator('.about-intro-chat-visitor-tapback-glyph')).toHaveCSS('animation-name', 'intro-grow')
})

test('shows three typing dots before each greeting and pauses the sequence in a hidden tab', async ({ page }) => {
  await page.clock.install()
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  const typing = chat.getByRole('status', { name: 'Rafa is typing' })
  await expect(typing).toBeVisible()
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100))
  await expect(typing.locator('span')).toHaveCount(3)
  await expect.poll(async () => {
    const bubble = await typing.boundingBox()
    const face = await page.locator('.about-intro-surface').boundingBox()
    return Math.abs(bubble!.y + bubble!.height - face!.y - face!.height)
  }).toBeLessThan(1)
  await expect(chat.getByText('Hey, I’m Rafa.')).toHaveCount(0)
  await expect(chat.getByRole('textbox', { name: 'Your email' })).toHaveCount(0)
  await page.clock.runFor(900)
  await expect(chat.getByText('Hey, I’m Rafa.')).toBeVisible()
  await expect(typing).toBeVisible()
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.clock.runFor(3000)
  await expect(page.locator('.about-intro-chat').getByText('How are you doing?', { exact: true })).toHaveCount(0)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.clock.runFor(900)
  await expect(chat.getByText('How are you doing?')).toBeVisible()
  await page.clock.runFor(900)
  await expect(typing).toHaveCount(0)
  await expect(chat.getByRole('textbox', { name: 'Your email' })).toBeVisible()
  await expect.poll(async () => {
    const question = await chat.getByText('Wanna share your email with me so I can reach out to you?').boundingBox()
    const field = await chat.locator('form').boundingBox()
    return Math.abs(field!.y - question!.y - question!.height - 8)
  }).toBeLessThan(1)
  // The field is a clean pill until the visitor sends it; only the resulting
  // blue address bubble gains the conversation tail on the right.
  expect(await chat.getByText('Wanna share your email with me so I can reach out to you?').evaluate(node => getComputedStyle(node, '::before').content)).toBe('none')
  const form = chat.locator('form')
  expect(await form.evaluate(node => [getComputedStyle(node, '::before').content, getComputedStyle(node, '::after').content])).toEqual(['none', 'none'])
  const chatBox = await chat.boundingBox()
  const formBox = await form.boundingBox()
  expect(Math.abs(chatBox!.x + chatBox!.width - formBox!.x - formBox!.width)).toBeLessThan(1)
})

test('changes the address with a puff before reopening the email field', async ({ page }) => {
  await page.clock.install()
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  await expect(chat.getByRole('status', { name: 'Rafa is typing' })).toBeVisible()
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100))
  // Each typing timer is scheduled after the previous message renders.
  for (const text of ['Hey, I’m Rafa.', 'How are you doing?', 'Wanna share your email with me so I can reach out to you?']) {
    await page.clock.runFor(900)
    await expect(chat.getByText(text)).toBeVisible()
  }
  const email = chat.getByRole('textbox', { name: 'Your email' })
  await email.fill('hello@example.com')
  await email.press('Enter')
  const sent = chat.getByRole('button', { name: 'Change email address: hello@example.com' })
  await expect(sent).toHaveAttribute('title', 'Change email')
  await sent.click()
  await expect(chat.locator('.about-intro-chat-puff i')).toHaveCount(24)
  await expect(chat.locator('.about-intro-chat-sent')).toHaveAttribute('data-puff', 'true')
  await expect(email).toHaveCount(0)
  await page.clock.runFor(480)
  await expect(email).toBeVisible()
  await expect(sent).toHaveCount(0)
  await expect(chat.locator('.about-intro-chat-puff')).toHaveCount(0)
  // Focus waits a frame for the field to mount.
  await page.clock.runFor(50)
  await expect(email).toBeFocused()
  await expect(email).toHaveValue('hello@example.com')
})


test('sends each message as a bubble, keeps failed ones and reuses the retry key', async ({ page }) => {
  const payloads: { email: string; message: string; requestId: string }[] = []
  await page.route('**/contact', async route => {
    payloads.push(route.request().postDataJSON())
    const success = payloads.length > 1
    await route.fulfill({ status: success ? 202 : 502, contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(success ? { sent: true } : { error: 'Couldn’t send. Please retry.' }) })
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  expect(payloads).toHaveLength(0)
  // Reduced motion shows the tapback at rest, without its ripple.
  await expect(chat.getByRole('img', { name: 'Loved by Rafa' })).toBeVisible()
  await expect(chat.locator('.about-intro-chat-tapback-ripple')).toBeHidden()
  const message = chat.getByRole('textbox', { name: 'Your message (optional)' })
  const send = chat.getByRole('button', { name: 'Send message' })
  await message.fill('Let’s build something')
  await send.click()
  // The message leaves the field for the conversation at once; a failure keeps it there to retry.
  await expect(message).toHaveValue('')
  await expect(message).toBeFocused()
  await expect(chat.getByText('Couldn’t send. Please retry.')).toBeVisible()
  await expect(chat.getByRole('button', { name: 'Start over with email address: visitor@example.com' })).toBeEnabled()
  await chat.getByRole('button', { name: 'Retry message: Let’s build something' }).click()
  await expect(chat.getByText('Delivered', { exact: true })).toBeVisible()
  await expect(chat.getByText('Sent messages stay delivered')).toBeVisible()
  await expect(chat.locator('.about-intro-chat-sent-message p', { hasText: 'Let’s build something' })).toBeVisible()
  // An empty field can't send again, but the visitor can keep writing.
  await expect(send).toBeDisabled()
  await message.fill('One more thing')
  await send.click()
  await expect(chat.locator('.about-intro-chat-sent-message')).toHaveCount(2)
  // Only the latest send carries the receipt.
  await expect(chat.locator('.about-intro-chat-receipt')).toHaveCount(1)
  await expect(chat.locator('.about-intro-chat-sent-message').last().getByText('Delivered')).toBeVisible()
  expect(payloads).toHaveLength(3)
  expect(payloads[0]).toEqual(payloads[1])
  expect(payloads[2].requestId).not.toBe(payloads[0].requestId)
  expect(payloads.map(payload => payload.message)).toEqual(['Let’s build something', 'Let’s build something', 'One more thing'])
  expect(payloads[0].email).toBe('visitor@example.com')
  expect(new URL(page.url()).pathname).toBe('/')
})

test('starts over after delivery and accepts another email address', async ({ page }) => {
  const payloads: { email: string; message: string }[] = []
  await page.route('**/contact', async route => {
    payloads.push(route.request().postDataJSON())
    await route.fulfill({ status: 202, contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ sent: true }) })
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  const email = chat.getByRole('textbox', { name: 'Your email' })
  await email.fill('first@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  await chat.getByRole('textbox', { name: 'Your message (optional)' }).fill('First hello')
  await chat.getByRole('button', { name: 'Send message' }).click()
  await expect(chat.getByText('Delivered', { exact: true })).toBeVisible()

  const startOver = chat.getByRole('button', { name: 'Start over; sent messages stay delivered', exact: true })
  await expect(chat.locator('.about-intro-chat-footer')).toHaveText('Sent messages stay delivered · Start over')
  await expect(startOver).toHaveCSS('color', 'rgb(107, 107, 107)')
  await expect(startOver).toHaveCSS('font-weight', '400')
  await startOver.click()
  await expect(email).toBeFocused()
  await expect(email).toHaveValue('first@example.com')
  await expect(chat.locator('.about-intro-chat-sent-message')).toHaveCount(0)

  await email.fill('second@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  await chat.getByRole('textbox', { name: 'Your message (optional)' }).fill('Second hello')
  await chat.getByRole('button', { name: 'Send message' }).click()
  await expect(chat.getByText('Delivered', { exact: true })).toBeVisible()
  expect(payloads.map(payload => payload.email)).toEqual(['first@example.com', 'second@example.com'])
})

test('pauses after three messages and stops after five', async ({ page }) => {
  const payloads: { message: string }[] = []
  await page.route('**/contact', async route => {
    payloads.push(route.request().postDataJSON())
    await route.fulfill({ status: 202, contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ sent: true }) })
  })
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  await page.getByRole('button', { name: /Open \d+ messages? from Rafa/ }).click()
  const chat = page.getByRole('dialog', { name: 'Chat with Rafa' })
  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  const message = chat.getByRole('textbox', { name: 'Your message (optional)' })
  const send = chat.getByRole('button', { name: 'Send message' })

  for (const [text, expectedCount] of [['One', 1], ['Two', 2], ['Three', 3]] as const) {
    await message.fill(text)
    await send.click()
    await expect.poll(() => payloads.length).toBe(expectedCount)
  }

  await expect(message.locator('..')).toHaveCSS('animation-name', 'intro-composer-shake')
  await expect(message).toBeDisabled()
  const footer = chat.locator('.about-intro-chat-footer')
  await expect(footer).toHaveText('Keep going? 2 left · Continue · Start over')
  expect(await footer.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true)
  await chat.getByRole('button', { name: 'Continue' }).click()
  await expect(message).toBeEnabled()
  await expect(message).toBeFocused()

  await message.fill('Four')
  await send.click()
  await expect(footer).toHaveText('1 left · Start over')
  await message.fill('Five')
  await send.click()
  await expect(message).toBeDisabled()
  await expect(footer).toHaveText('That’s enough · Start over')
  expect(payloads.map(payload => payload.message)).toEqual(['One', 'Two', 'Three', 'Four', 'Five'])
})

test('an empty first send delivers the address with a keep-in-touch bubble', async ({ page }) => {
  const payloads: { message: string }[] = []
  await page.route('**/contact', async route => {
    payloads.push(route.request().postDataJSON())
    await route.fulfill({ status: 202, contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ sent: true }) })
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).click()
  await chat.getByRole('button', { name: 'Send message' }).click()
  await expect(chat.locator('.about-intro-chat-sent-message p', { hasText: 'Hi Rafa, I’d like to keep in touch.' })).toBeVisible()
  await expect(chat.getByText('Delivered', { exact: true })).toBeVisible()
  expect(payloads.map(payload => payload.message)).toEqual(['Hi Rafa, I’d like to keep in touch.'])
})

test('rejects an incomplete email before confirmation and allows correction', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const email = page.getByRole('textbox', { name: 'Your email', exact: true })
  await email.fill('visitor@gmail')
  await expect(page.getByRole('button', { name: 'Continue with email' })).toBeDisabled()
  await email.press('Enter')
  await expect(email).toBeVisible()
  await email.fill('visitor@gmail.com')
  await page.getByRole('button', { name: 'Continue with email' }).click()
  await expect(page.getByRole('textbox', { name: 'Your message (optional)' })).toBeVisible()
})

test('contains mobile chat focus, preserves reactions and restores the portrait', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const portrait = page.getByRole('button', { name: /Open .*messages? from Rafa/ })
  await portrait.click()
  const chat = page.getByRole('dialog', { name: 'Chat with Rafa' })
  await chat.getByRole('textbox', { name: 'Your email' }).fill('visitor@example.com')
  await chat.getByRole('button', { name: 'Continue with email' }).focus()
  await page.keyboard.press('Tab')
  await expect.poll(() => chat.evaluate(node => node.contains(document.activeElement))).toBe(true)
  await expect(page.getByRole('button', { name: 'Read about Rafael Medina' })).toHaveCount(0)
  await chat.getByRole('button', { name: 'React to “Hey, I’m Rafa.”' }).focus()
  await page.keyboard.press('Shift+Tab')
  await expect.poll(() => chat.evaluate(node => node.contains(document.activeElement))).toBe(true)
  await chat.getByRole('button', { name: 'React to “Hey, I’m Rafa.”' }).click()
  await page.getByRole('menuitemcheckbox', { name: 'Love', exact: true }).click()
  await expect(chat.getByRole('img', { name: 'You loved “Hey, I’m Rafa.”' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(chat).toHaveCount(0)
  await expect(portrait).toBeFocused()
  await portrait.click()
  await expect(page.getByRole('textbox', { name: 'Your email', exact: true })).toHaveValue('visitor@example.com')
  // Screen-reader activation reaches the in-dialog close action.
  await chat.getByRole('button', { name: 'Close chat', exact: true }).dispatchEvent('click')
  await expect(chat).toHaveCount(0)
  await portrait.click()
  await page.mouse.click(10, 10)
  await expect(chat).toHaveCount(0)
})

test('sizes the initial desktop conversation to the available viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 400 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  await expect(chat.getByRole('textbox', { name: 'Your email' })).toBeVisible()
  const history = chat.locator('.about-intro-chat-history')
  // The greeting fits here; the fallback height unnecessarily forces scrolling.
  await expect.poll(() => history.evaluate(node => node.scrollHeight - node.clientHeight)).toBeLessThanOrEqual(1)
})

test('keeps a dismissed chat closed across the compact breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))

  await page.getByRole('button', { name: /Open .*messages? from Rafa/ }).click()
  await expect(page.getByRole('dialog', { name: 'Chat with Rafa' })).toBeVisible()

  await page.setViewportSize({ width: 1440, height: 844 })
  await expect(page.getByRole('region', { name: 'Chat with Rafa' })).toBeVisible()
  await page.mouse.click(10, 10)
  await expect(page.getByRole('region', { name: 'Chat with Rafa' })).toHaveCount(0)

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByRole('dialog', { name: 'Chat with Rafa' })).toHaveCount(0)
})

test('collapses the desktop chat outside and keeps its message count on the portrait', async ({ page }) => {
  await page.clock.install()
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.goto('/?tune=off')
  await page.locator('#about-panel').evaluate(node => node.scrollIntoView({ behavior: 'instant' }))

  const intro = page.getByRole('region', { name: 'A quick hello from Rafael' })
  const chat = page.getByRole('region', { name: 'Chat with Rafa' })
  await expect(chat).toBeVisible()
  await page.clock.runFor(2700)

  await page.mouse.click(10, 10)
  await expect(chat).toHaveCount(0)
  await expect(intro).toHaveAttribute('data-chat-open', 'false')
  await expect(intro.locator('.about-intro-chat-notification')).toHaveText('3')
  const portrait = intro.locator('.about-intro-portrait-trigger')
  await expect(portrait).toHaveAccessibleName('Open 3 messages from Rafa')

  await portrait.click()
  await expect(intro).toHaveAttribute('data-chat-open', 'true')
  await expect(page.getByRole('region', { name: 'Chat with Rafa' })).toBeVisible()
  await expect(intro.locator('.about-intro-chat-notification')).toHaveCount(0)

  await page.locator('a').first().focus()
  await expect(page.getByRole('region', { name: 'Chat with Rafa' })).toHaveCount(0)
  await expect(intro.locator('.about-intro-chat-notification')).toHaveText('3')
})
