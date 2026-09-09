import { expect, test } from "@playwright/test"
import { maxNoteLikesPerVisitor } from "../../src/data/likeLimits"

test("every increment counts across visitors and clamps at the per-visitor cap", async ({ request }) => {
  const endpoint = "http://127.0.0.1:8787/notes/building-a-dark-theme/likes"
  const headersA = { Origin: "http://127.0.0.1:4174", "X-Visitor-ID": crypto.randomUUID() }
  const headersB = { ...headersA, "X-Visitor-ID": crypto.randomUUID() }
  const before = await request.get(endpoint, { headers: headersA })
  expect(before.ok()).toBe(true)
  const initial = (await before.json()).count
  const responses = await Promise.all([
    ...Array.from({ length: 5 }, () => request.put(endpoint, { headers: headersA, data: { increment: 1 } })),
    request.put(endpoint, { headers: headersB, data: { increment: 3 } }),
  ])
  for (const response of responses) expect(response.ok()).toBe(true)
  expect(await (await request.get(endpoint, { headers: headersA })).json()).toMatchObject({ count: initial + 8, visitorLikes: 5 })
  expect(await (await request.get(endpoint, { headers: headersB })).json()).toMatchObject({ count: initial + 8, visitorLikes: 3 })
  // Pushing A to the cap clamps the tally, and once there the total stops moving.
  const capped = await request.put(endpoint, { headers: headersA, data: { increment: maxNoteLikesPerVisitor } })
  expect(await capped.json()).toMatchObject({ count: initial + 3 + maxNoteLikesPerVisitor, visitorLikes: maxNoteLikesPerVisitor })
  const past = await request.put(endpoint, { headers: headersA, data: { increment: 1 } })
  expect(await past.json()).toMatchObject({ count: initial + 3 + maxNoteLikesPerVisitor, visitorLikes: maxNoteLikesPerVisitor })
})

test("likes API rejects unknown notes, invalid visitors, foreign origins and malformed writes", async ({ request }) => {
  const endpoint = "http://127.0.0.1:8787/notes/designing-matcha/likes"
  const headers = { Origin: "http://127.0.0.1:4174", "X-Visitor-ID": crypto.randomUUID() }
  expect((await request.get(endpoint.replace("designing-matcha", "not-a-note"), { headers })).status()).toBe(404)
  expect((await request.get(endpoint, { headers: { ...headers, "X-Visitor-ID": "invalid" } })).status()).toBe(400)
  expect((await request.put(endpoint, { headers: { ...headers, Origin: "https://example.com" }, data: { increment: 1 } })).status()).toBe(403)
  expect((await request.put(endpoint, { headers, data: { increment: "1" } })).status()).toBe(400)
  expect((await request.put(endpoint, { headers, data: { increment: 0 } })).status()).toBe(400)
  expect((await request.put(endpoint, { headers, data: { increment: maxNoteLikesPerVisitor + 1 } })).status()).toBe(400)
  expect((await request.put(endpoint, { headers, data: { liked: "true" } })).status()).toBe(400)
  expect((await request.put(endpoint, { headers, data: { increment: 1, padding: "x".repeat(300) } })).status()).toBe(413)
  const preflight = await request.fetch(endpoint, { method: "OPTIONS", headers })
  expect(preflight.status()).toBe(204)
  expect(preflight.headers()["access-control-allow-origin"]).toBe(headers.Origin)
})

test("legacy clients can read, retry likes, and unlike during rollout", async ({ request }) => {
  const endpoint = "http://127.0.0.1:8787/notes/a-song-we-all-know/likes"
  const headers = { Origin: "http://127.0.0.1:4174", "X-Visitor-ID": crypto.randomUUID() }
  const initial = await (await request.get(endpoint, { headers })).json()
  expect(initial.liked).toBe(false)
  for (let i = 0; i < 2; i++) {
    const response = await request.put(endpoint, { headers, data: { liked: true } })
    expect(response.ok()).toBe(true)
    expect(await response.json()).toMatchObject({ count: initial.count + 1, visitorLikes: 1, liked: true })
  }
  await request.put(endpoint, { headers, data: { increment: 3 } })
  const repeated = await request.put(endpoint, { headers, data: { liked: true } })
  expect(await repeated.json()).toMatchObject({ count: initial.count + 4, visitorLikes: 4, liked: true })
  for (let i = 0; i < 2; i++) {
    const response = await request.put(endpoint, { headers, data: { liked: false } })
    expect(await response.json()).toMatchObject({ count: initial.count, visitorLikes: 0, liked: false })
  }
})
