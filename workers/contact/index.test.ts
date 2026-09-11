import { test } from "node:test"
import assert from "node:assert/strict"
import worker, { type ContactEnv } from "./index.ts"

const env: ContactEnv = {
  ALLOWED_ORIGINS: "https://rafaelmedina.me",
  CONTACT_TO: "hey@rafaelmedina.me",
  CONTACT_FROM: "Website <hello@rafaelmedina.me>",
  RESEND_API_KEY: "test-key-not-a-credential",
  CONTACT_LIMITER: { limit: async () => ({ success: true }) },
}
const payload = { email: "visitor@example.com", message: "Hello Rafa", requestId: "12345678-1234-4234-8234-123456789abc" }
function request(body: unknown = payload, origin = "https://rafaelmedina.me") {
  return new Request("https://contact.example/contact", {
    method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify(body),
  })
}

test("sends only to the configured inbox and uses reply-to with a stable retry key", async t => {
  const deliveries: { url: string; body: Record<string, unknown>; key: string | null }[] = []
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    deliveries.push({ url, body: JSON.parse(init.body as string), key: new Headers(init.headers).get("Idempotency-Key") })
    return Response.json({ id: "accepted-email" })
  })
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await worker.fetch(request({ ...payload, to: "untrusted@example.com" }), env)
    assert.equal(result.status, 202)
    assert.deepEqual(await result.json(), { sent: true })
    assert.equal(result.headers.get("Cache-Control"), "no-store")
  }
  assert.deepEqual(deliveries[0], deliveries[1])
  assert.deepEqual(deliveries[0].body.to, [env.CONTACT_TO])
  assert.equal(deliveries[0].body.reply_to, payload.email)
  assert.equal(deliveries[0].body.text, `Reply to: ${payload.email}\n\nHello Rafa`)
})

test("accepts an email-only hello when the optional message is empty", async t => {
  t.mock.method(globalThis, "fetch", async (_url: string, init: RequestInit) => {
    assert.match(JSON.parse(init.body as string).text, /I’d like to keep in touch/)
    return Response.json({ id: "accepted-email" })
  })
  assert.equal((await worker.fetch(request({ ...payload, message: "" }), env)).status, 202)
})

test("rejects invalid senders, long messages, oversized bodies and foreign origins before delivery", async t => {
  const outbound = t.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected delivery") })
  for (const invalid of [{ ...payload, email: "bad\r\nBcc:x@example.com" }, { ...payload, message: "x".repeat(2001) }, { ...payload, requestId: "bad" }]) {
    assert.equal((await worker.fetch(request(invalid), env)).status, 400)
  }
  assert.equal((await worker.fetch(request({ ...payload, message: "x".repeat(13000) }), env)).status, 413)
  assert.equal((await worker.fetch(request(payload, "https://elsewhere.example"), env)).status, 403)
  assert.equal(outbound.mock.callCount(), 0)
})

test("fails visibly when credentials are missing or the rate limit is reached", async t => {
  const outbound = t.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected delivery") })
  assert.equal((await worker.fetch(request(), { ...env, RESEND_API_KEY: undefined })).status, 503)
  assert.equal((await worker.fetch(request(), { ...env, CONTACT_LIMITER: { limit: async () => ({ success: false }) } })).status, 429)
  assert.equal(outbound.mock.callCount(), 0)
})

test("does not report sent when the provider rejects or the network fails", async t => {
  const outbound = t.mock.method(globalThis, "fetch", async () => Response.json({ error: "provider detail" }, { status: 403 }))
  let response = await worker.fetch(request(), env)
  assert.equal(response.status, 502)
  assert.doesNotMatch(await response.text(), /provider detail/)
  outbound.mock.mockImplementation(async () => { throw new Error("Network down") })
  response = await worker.fetch(request(), env)
  assert.equal(response.status, 502)
})

test("handles the website CORS preflight", async () => {
  const response = await worker.fetch(new Request("https://contact.example/contact", {
    method: "OPTIONS", headers: { Origin: "https://rafaelmedina.me" },
  }), env)
  assert.equal(response.status, 204)
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://rafaelmedina.me")
})
